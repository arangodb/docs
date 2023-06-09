class DocuBlockBlock < Liquid::Tag
    @@paths = { }
    @@swaggerTypes = ["null","boolean","integer","number","string","array","object"]
    Syntax = /^([^, ]+)(?:, h([1-6]))?$/

    def initialize(tag_name, input, tokens)
        super
        if input.strip! =~ Syntax
            @blockname = $1
            @headlineLevel = $2.nil? ? 3 : $2.to_i
        else
            raise "Invalid syntax in docublock tag: " + input
        end
    end

    def get_error_codes(code)
        content = ""
        code.each_line do |line|
            if line.start_with?("## ")
                next if line.start_with?("## For")
                next if line.start_with?("## These")

                content += line
            elsif line.start_with?("ERROR_")
                error = line.split(",")
                content += "<h4 id=\"#{error[1]}\">#{error[1]} - #{error[0]}</h4>\n"
                content += "#{error[3].gsub("\"", "")}\n"
            end
        end
        content
    end

    def get_struct(struct, blocks, rootBlockName, level, parentKey, omitNecessity=false)
        result = ""
        if blocks[struct]
            blocks[struct].each do |name, description|
                necessity = omitNecessity ? "" : ", *#{description["necessity"]}*"
                type = description["items"] ? "#{description["type"]} of #{description["items"]}s" : description["type"]
                if name == "<object>" and parentKey == "<object>"
                    level = level - 1 # hoist referenced struct
                elsif name == "<array>" or (name == "<object>" and parentKey == "<array>")
                    result += "  " * level + "- (#{type}#{necessity}):\n"
                    description["description"].each_line do |line|
                        result += "  " * level + "  " + line
                    end
                else
                    result += "  " * level + "- **#{name}** (#{type}#{necessity}):\n"
                    description["description"].each_line do |line|
                        result += "  " * level + "  " + line
                    end
                end
                if description["struct"]
                    result += get_struct(description["struct"], blocks, rootBlockName, level + 1, name, omitNecessity)
                end
            end
        else
            unless blocks[:isVersionDeprecated]
                Jekyll.logger.error "Missing struct '#{struct}', referenced by '#{parentKey}' in DocuBlock '#{rootBlockName}', version #{blocks[:version]}"
            end
        end
        result
    end

    def get_source(block, blocks, level)
        if block["name"] == "errorCodes"
            return get_error_codes(block["header"])
        end
        result = "#{block["header"]}\n"
        if block["urlParams"]
            result += "**Path Parameters**\n\n"
            block["urlParams"].each do |key, value|
                result += "  - **#{key}** (#{value["type"]}, *#{value["necessity"]}*):\n"
                value["description"].each_line do |line|
                    result += "    " + line
                end
            end
        end
        if block["queryParams"]
            result += "**Query Parameters**\n\n"
            block["queryParams"].each do |key, value|
                result += "  - **#{key}** (#{value["type"]}, *#{value["necessity"]}*):\n"
                value["description"].each_line do |line|
                    result += "    " + line
                end
            end
        end
        if block["headerParams"]
            result += "**Header Parameters**\n\n"
            block["headerParams"].each do |key, value|
                result += "  - **#{key}** (#{value["type"]}, *#{value["necessity"]}*):\n"
                value["description"].each_line do |line|
                    result += "    " + line
                end
            end
        end
        if block["fullbody"]
            result += "**Request Body**\n\n (#{block["fullbody"]["type"]}, *#{block["fullbody"]["necessity"]}*)\n\n#{block["fullbody"]["description"]}\n\n"
        end
        if block["body"]
            result += "**Request Body**\n\n"
            block["body"].each do |key, value|
                type = value["items"] ? "#{value["type"]} of #{value["items"]}s" : value["type"]
                if key == "<object>"
                    level = level - 1 # hoist referenced struct
                elsif key == "<array>"
                    result += "  " * level + "- (#{type}, *#{value["necessity"]}*):\n"
                    value["description"].each_line do |line|
                        result += "  " * level + " " + line
                    end
                else
                    result += "  " * level + "- **#{key}** (#{type}, *#{value["necessity"]}*):\n"
                    value["description"].each_line do |line|
                        result += "    " + line
                    end
                end
                if value["struct"]
                    result += get_struct(value["struct"], blocks, block["name"], level + 1, key)
                end
            end
        end
        if block["description"]
            result += block["description"]
        end
        if block["returnCodes"].length > 0
            result += "**Responses**\n\n"
            block["returnCodes"].each do |returnCode|
                code = returnCode['code']
                description = returnCode['description']
                result += "**HTTP #{code}**: #{description}\n\n"
                if returnCode["body"]
                    returnCode["body"].each do |key, value|
                        type = value["items"] ? "#{value["type"]} of #{value["items"]}s" : value["type"]
                        if key == "<object>"
                            level = level - 1 # hoist referenced struct
                        elsif key == "<array>"
                            result += "  " * level + "- (#{type}):\n"
                            value["description"].each_line do |line|
                                result += "  " * level + "  " + line
                            end
                        else
                            result += "  " * level + "- **#{key}** (#{type}):\n"
                            value["description"].each_line do |line|
                                result += "  " * level + "  " + line
                            end
                        end
                        if value["struct"]
                            result += get_struct(value["struct"], blocks, block["name"], level + 1, key, true)
                        end
                    end
                end
            end
        end
        if block["examples"]
            result += block["examples"]
        end
        result
    end

    def get_docu_block(path, blockname, version, isVersionDeprecated)
        exists = @@paths.has_key?(path)
        unless exists
            allComments = path + "/allComments.txt"
            unless File.file?(allComments)
                print("Couldn't read " + allComments + "\n")
                return nil
            end
            text = File.read(allComments, :encoding => 'UTF-8')
            blocks = {
                :version => version,
                :isVersionDeprecated => isVersionDeprecated,
            }
            currentObject = nil
            currentKey = nil
            currentStruct = nil
            currentStructKey = nil
            hasBrief = false
            local = nil
            text.each_line do |line|
                case line
                when /^@startDocuBlock(Inline)?\s+(.*)/
                    local = {"name"=> $2.strip, "returnCodes"=> [], "body": nil, "header" => "", "description"=> "", "examples": nil}
                    currentKey = "header"
                    currentObject = local
                    currentStruct = nil
                when /^@endDocuBlock/
                    if local
                        blocks[local["name"]] = get_source(local, blocks, 1)
                    end
                    local = nil
                    currentKey = nil
                    currentObject = nil
                    currentStruct = nil
                    hasBrief = false
                when /^@brief\s*(.*)/
                    if local
                        hasBrief = true
                        local["header"] += $1
                    else
                        Jekyll.logger.debug "Missing @startDocuBlock #{line}. Ignoring"
                    end
                    currentStruct = nil
                when /^@RESTHEADER\s*{([^,]+),\s*([^,\}]+)/
                    # Headline markup is added later because we don't know it yet when this is processed
                    local["header"] = " #{$2}\n#{local['header']}\n`#{$1.sub(/#.*/, '')}`\n"
                    currentStruct = nil
                when /^@RESTDESCRIPTION/
                    currentObject = local
                    currentStruct = nil
                    if hasBrief
                        currentKey = "description"
                    else
                        currentKey = "header"
                    end
                when /^@RESTRETURNCODES/
                    currentObject = local
                    currentStruct = nil
                when /^@EXAMPLES/
                    if local
                        local['examples'] = "\n**Examples**\n"
                        currentObject = local
                        currentKey = "examples"
                    end
                    currentStruct = nil
                when /^@RESTALLBODYPARAM{([a-z-]+),(\w+),(\w+)}/
                    local["fullbody"] = {
                        "type" => $2,
                        "necessity" => $3,
                        "description" => ""
                    }
                    currentObject = local["fullbody"]
                    currentKey = "description"
                    currentStruct = nil
                when /^@RESTBODYPARAM{([a-zA-Z0-9_-]*),([a-zA-Z0-9_-]+),([a-zA-Z0-9_-]+),?(\s*(([a-zA-Z0-9_-]+)))?}/
                    unless local["body"]
                        local["body"] = { }
                    end
                    key = $1
                    if key.empty?
                        case $2
                        when "array"
                            key = "<array>"
                        when "object"
                            key = "<object>"
                        else
                            Jekyll.logger.warn "Body param without name but type '#{$2}'"
                        end
                        if local["body"][key]
                            Jekyll.logger.warn "Body param with duplicate pseudo-key '#{key}'"
                        end
                    end
                    local["body"][key] = {
                        "type" => $2,
                        "necessity" => $3,
                        "description" => "",
                    }
                    if $2 == "array" and @@swaggerTypes.include?($4)
                        local["body"][key]["items"] = $4
                    end
                    if ["array", "object"].include?($2) and $4 != "" and !@@swaggerTypes.include?($4)
                        Jekyll.logger.debug "[DocuBlock] Body param '#{key}' with struct '#{$4}'"
                        local["body"][key]["struct"] = $4
                    end
                    currentObject = local["body"][key]
                    currentKey = "description"
                    currentStruct = nil
                when /^@RESTSTRUCT{([\]\[\. \*a-zA-Z0-9_-]*),([a-zA-Z0-9_-]+),([a-zA-Z0-9_-]+),([a-zA-Z0-9_-]+),([a-zA-Z0-9_-]+)?}/
                    unless blocks[$2]
                        blocks[$2] = { }
                    end
                    key = $1
                    if key.empty?
                        case $3
                        when "array"
                            key = "<array>"
                        when "object"
                            key = "<object>"
                        else
                            Jekyll.logger.warn "Struct without name but type '#{$3}'"
                        end
                        if blocks[$2][key]
                            Jekyll.logger.warn "Struct with duplicate pseudo-key '#{key}'"
                        end
                    end
                    blocks[$2][key] = {
                        "type" => $3,
                        "necessity" => $4,
                        "description" => "",
                    }
                    if $3 == "array" and @@swaggerTypes.include?($5)
                        blocks[$2][key]["items"] = $5
                    end
                    if ["array", "object"].include?($3) and $5 != "" and !@@swaggerTypes.include?($5)
                        Jekyll.logger.debug "[DocuBlock] Struct '#{$2}' with sub-struct '#{$5}'"
                        blocks[$2][key]["struct"] = $5
                    end
                    currentStruct = $2
                    currentStructKey = key
                when /^@RESTURLPARAMETERS/
                    currentObject = local
                    currentStruct = nil
                when /^@RESTURLPARAM{([a-zA-Z_-]+),(\w+),(\w+)}/
                    unless local["urlParams"]
                        local["urlParams"] = { }
                    end
                    local["urlParams"][$1] = {
                        "type" => $2,
                        "necessity" => $3,
                        "description" => "",
                    }
                    currentObject = local["urlParams"][$1]
                    currentKey = "description"
                    currentStruct = nil
                when /^@RESTQUERYPARAMETERS/
                    currentObject = local
                    currentStruct = nil
                when /^@RESTQUERYPARAM{([a-zA-Z_-]+),(\w+),(\w+)}/
                    unless local["queryParams"]
                        local["queryParams"] = { }
                    end
                    local["queryParams"][$1] = {
                        "type" => $2,
                        "necessity" => $3,
                        "description" => "",
                    }
                    currentObject = local["queryParams"][$1]
                    currentKey = "description"
                    currentStruct = nil
                when /^@RESTHEADERPARAMETERS/
                    currentObject = local
                    currentStruct = nil
                when /^@RESTHEADERPARAM{([a-zA-Z_-]+),(\w+),(\w+)}/
                    unless local["headerParams"]
                        local["headerParams"] = { }
                    end
                    local["headerParams"][$1] = {
                        "type" => $2,
                        "necessity" => $3,
                        "description" => "",
                    }
                    currentObject = local["headerParams"][$1]
                    currentKey = "description"
                    currentStruct = nil
                when /^@HINTS/
                    currentStruct = nil
                when /^@RESTRETURNCODE{(\d+)}/
                    currentReturnCode = {
                        "code" => $1,
                        "description" => "",
                    }
                    currentObject = currentReturnCode
                    currentKey = "description"
                    local["returnCodes"].push(currentReturnCode)
                    currentStruct = nil
                when /^@RESTREPLYBODY{([a-zA-Z0-9_-]*),([a-zA-Z0-9_-]+),([a-zA-Z0-9_-]+),([a-zA-Z0-9_-]+)?}/
                    if local["returnCodes"].length == 0
                        Jekyll.logger.debug "No returncode found for #{line}"
                    else
                        returnCode = local["returnCodes"][local["returnCodes"].length - 1]
                        unless returnCode["body"]
                            returnCode["body"] = { }
                        end
                        key = $1
                        if key.empty?
                            case $2
                            when "array"
                                key = "<array>"
                            when "object"
                                key = "<object>"
                            else
                                Jekyll.logger.warn "Reply body without name but type '#{$2}'"
                            end
                            if returnCode["body"][key]
                                Jekyll.logger.warn "Reply body with duplicate pseudo-key '#{key}'"
                            end
                        end
                        returnCode["body"][key] = {
                            "type" => $2,
                            "necessity" => $3,
                            "description" => "",
                        }
                        if $2 == "array" and @@swaggerTypes.include?($4)
                            returnCode["body"][key]["items"] = $4
                        end
                        if ["array", "object"].include?($2) and $4 != "" and !@@swaggerTypes.include?($4)
                            Jekyll.logger.debug "[DocuBlock] Reply body '#{key}' with struct '#{$4}'"
                            returnCode["body"][key]["struct"] = $4
                        end
                        currentObject = returnCode["body"][key]
                        currentKey = "description"
                    end
                    currentStruct = nil
                else
                    if line[0] == "@" && !path.start_with?("/docs/2.8")
                        Jekyll.logger.debug "Unhandled @: #{line}"
                    end
                    if currentStruct && currentStructKey
                        blocks[currentStruct][currentStructKey]["description"] += line
                    elsif currentObject && currentObject[currentKey]
                        currentObject[currentKey] += line
                    end
                end
            end
            @@paths[path] = blocks
        end
        @@paths[path][blockname]
    end

    def convertHintBox(context, content)
        site = context.registers[:site]
        converter = site.find_converter_instance(::Jekyll::Converters::Markdown)

        # Remove indention based on first actual line (but only spaces)
        content = content.sub(/^[\r\n]+/, '')
        indent = content.index(/[^ ]/) || 0
        content = content.lines.map{ |line| line.slice([indent, line.index(/[^ ]/) || 0].min, line.length) }.join ''
        # Parse Markdown and strip trailing whitespace (especially line breaks).
        # Otherwise below <div>s will be wrapped in <p> for some reason!
        content = converter.convert(content).sub(/\s+$/, '')
        content
    end

    def render(context)
        version = context["page"]["version"].version()
        isVersionDeprecated = context["site"]["data"]["deprecations"].include?(version)
        if context["page"]["dir"] =~ /\d\.\d{1,2}\/?$/
            dir = context["page"]["dir"]
        else
            dir = context["page"]["dir"] + "../"
        end
        fullpath = File.expand_path(Dir.pwd + dir + "generated/")
        content = get_docu_block(fullpath, @blockname, version, isVersionDeprecated)
        unless content
            Jekyll.logger.error "DocuBlock \"#{@blockname}\" in \"#{fullpath}\" undefined. Content will be empty."
            return ""
        end
        content = "#" * @headlineLevel + content
        # should match migrate.js more or less :S
        content = content.gsub(/\]\((?!https?:)(.*?\.(html|md))(#[^\)]+)?\)/) {|s|
            link = $1.gsub(/(?<![A-Z\/])([A-Z])/) {|_|
                "-" + $1
            }
            link = link[1..-1] if link.start_with?("-")
            link = link.downcase
            anchor = $3 || "";
            newlink = link.gsub(/\/(readme\.md|index\.html)$/, '').gsub(/\.(md|html)/, '').gsub(/[^a-z0-9]+/, '-') + '.md';

            if link == "readme.md"
                newlink = "index.md"
            end

            if newlink.start_with?("-")
                if link.start_with?("../..")
                    newlink = newlink.gsub(/^-([^-]+)-([^\.]+)\.(md|html)/, '../\1/\2.html');
                    newlink = newlink.gsub(/\.\.\/manual\//, "../")
                else
                    newlink = newlink[1..-1]
                end
            end
            # p "#{link} #{newlink}"

            if newlink == "-aqlquerycursor.md"
                newlink = "../aqlquerycursor.html"
            end
            "](#{newlink.sub(".md", ".html")}#{anchor})"
        }
        # oeff....no idea how to parse nested liquid :S
        # apparently the parser needs the complete document to discover liquid.
        # inserting liquid on the fly does not work...so include the hints in a super dirty regex way
        content = content.gsub(/\{%\s*hint\s+'([^']+)'\s*%\}(.*?)\{%\s*endhint\s*%\}/om) {
            "<div class=\"alert alert-#{$1}\" style=\"display: flex\">
    <i class=\"fa fa-info-circle\" style=\"margin-right: 10px; margin-top: 4px;\"></i>
    <div>
        #{convertHintBox(context, $2)}
    </div>
</div>"}
        content
    end
end
Liquid::Template.register_tag('docublock', DocuBlockBlock)
