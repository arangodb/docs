class DocuBlockBlock < Liquid::Tag
    @@paths = {}

    def initialize(tag_name, input, tokens)
        super
        @blockname = input.strip!
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
                content += "   * **#{error[1]}** - **#{error[0]}**\n\n"
                content += "     #{error[3].gsub("\"", "")}\n"
            end
        end
        content
    end

    def get_source(block)
        if block["name"] == "errorCodes"
            return get_error_codes(block["header"])
        end
        result = "#{block["header"]}\n"
        if block["urlParams"]
            result += "**Path Parameters**\n\n"
            block["urlParams"].each do |key, value|
                result += "   * _#{key}_ (#{value["type"]}): #{value["description"]}"
            end
        end
        if block["queryParams"]
            result += "**Query Parameters**\n\n"
            block["queryParams"].each do |key, value|
                result += "   * _#{key}_ (#{value["type"]}): #{value["description"]}"
            end
        end
        if block["headerParams"]
            result += "**Header Parameters**\n\n"
            block["headerParams"].each do |key, value|
                result += "   * _#{key}_ (#{value["type"]}): #{value["description"]}"
            end
        end
        if block["fullbody"]
            result += "**Request Body (#{block["fullbody"]["type"]})**\n\n#{block["fullbody"]["description"]}\n\n"
        end
        if block["body"]
            result += "**A JSON object with these properties is required:**\n\n"
            block["body"].each do |key, value|
                result += "   * **#{key}**: #{value["description"]}\n"
                if value["subdescription"]
                    value["subdescription"].each do |name, subdescription|
                        result += "      * **#{name}**: "
                        subdescription["description"].each_line do |line|
                            result += "      #{line}"
                        end
                        if subdescription["subdescription"]
                            subdescription["subdescription"].each do |name, subsubdescription|
                                result += "         * **#{name}**: "
                                subsubdescription["description"].each_line do |line|
                                    result += "         #{line}"
                                end
                            end
                        end
                    end
                end
            end
        end
        if block["description"]
            result += block["description"]
        end
        if block["returnCodes"].length > 0
            has_bodies = block["returnCodes"].any? { |returnCode| returnCode["body"] }
            if !has_bodies
                result += "**Return codes**\n\n"
            end
            block["returnCodes"].each do |returnCode|
                code = returnCode['code']
                description = returnCode['description']
                if returnCode["body"]
                    result += "**HTTP #{code}** #{description}\n\n"
                    returnCode["body"].each do |key, value|
                        if key == "figures"
                            puts value
                        end
                        result += "   * **#{key}**: #{value["description"]}\n"
                        if value["subdescription"]
                            value["subdescription"].each do |name, subdescription|
                                result += "      * **#{name}**: "
                                subdescription["description"].each_line do |line|
                                    result += "      #{line}"
                                end
                                if subdescription["subdescription"]
                                    subdescription["subdescription"].each do |name, subsubdescription|
                                        result += "      * **#{name}**: "
                                        subsubdescription["description"].each_line do |line|
                                            result += "      #{line}"
                                        end
                                    end
                                end
                            end
                        end
                    end
                else
                    result += "   * #{code}: #{description}\n"
                end
            end
        end
        if block["examples"]
            result += block["examples"]
        end
        result
    end

    def get_docu_block(path, blockname)
        exists = @@paths.has_key?(path)
        if !exists
            allComments = path + "/allComments.txt"
            if !File.file?(allComments)
                print("Couldn't read " + allComments + "\n")
                return nil
            end
            text = File.read(allComments, :encoding => 'UTF-8')
            blocks = {}
            currentObject = nil
            currentKey = nil
            local = nil
            text.each_line do |line|
                case line
                when /^@startDocuBlock(Inline)?\s+(.*)/
                    local = {"name"=> $2.strip, "returnCodes"=> [], "body": nil, "header" => "", "description"=> "", "examples": nil}
                    currentKey = "header"
                    currentObject = local
                when /^@endDocuBlock/
                    if local
                        blocks[local["name"]] = get_source(local)
                    end
                    local = nil
                    currentKey = nil
                    currentObject = nil
                when /^@brief\s*(.*)/
                    if local
                        local["header"] += $1
                    else
                        Jekyll.logger.debug "Missing @startDocuBlock #{line}. Ignoring"
                    end
                when /^@RESTHEADER\s*{([^,]+),\s*([^,\}]+)/
                    # route ($1), description ($2), operation ID ($3)
                    local["header"] = "### #{$2}\n#{local['header']}\n`#{$1}`\n"
                when /^@RESTDESCRIPTION/
                    currentObject = local
                    currentKey = "description"
                when /^@RESTRETURNCODES/
                    currentObject = local
                when /^@EXAMPLES/
                    if local
                        local['examples'] = "**Examples**\n"
                        currentObject = local
                        currentKey = "examples"
                    end
                when /^@RESTALLBODYPARAM{([a-z-]+),(\w+),(\w+)}/
                    # name ($1), data type ($2), required/optional ($3)
                    local["fullbody"] = {
                        "type" => $2,
                        "required" => $3,
                        "description" => ""
                    }
                    currentObject = local["fullbody"]
                    currentKey = "description"
                when /^@RESTBODYPARAM{([a-zA-Z0-9_-]+),([a-zA-Z0-9_-]+),([a-zA-Z0-9_-]+),?(\s*(([a-zA-Z0-9_-]+)))?}/
                    # name ($1), data type ($2), required/optional ($3), subtype ($4)
                    if !local["body"]
                        local["body"] = {}
                    end
                    local["body"][$1] = {
                        "type" => $2,
                        "required" => $3,
                        "subtype" => $4,
                        "description" => ""
                    }
                    currentObject = local["body"][$1]
                    currentKey = "description"
                when /^@RESTSTRUCT{([\]\[\. \*a-zA-Z0-9_-]+),([a-zA-Z0-9_-]+),([a-zA-Z0-9_-]+),([a-zA-Z0-9_-]+),([a-zA-Z0-9_-]+)?}/
                    # name ($1), parent subtype ($2), data type ($3), required/optional ($4), subtype ($5)

                    # TODO: It still does not find the parent subtype properly

                    # only if the previous @REST... is the parent
                    if currentObject["subtype"] == $2
                        Jekyll.logger.error "#{$1} - Matching subtype (currentObject): #{$2} (type #{$3})"
                        if !currentObject["body"]
                            currentObject["body"] = {}
                        end
                        currentObject["body"][$1] = {
                            "parent" => currentObject,
                            "type" => $3,
                            "required" => $4,
                            "subtype" => $5, # only set type is object?
                            "description" => ""
                        }
                        currentObject["body"][$1]

                    # check parent of previous @REST...
                    elsif currentObject["parent"] and currentObject["parent"]["subtype"] == $2
                        Jekyll.logger.error "#{$1} - Matching subtype (parent of currentObject): #{$2} (type #{$3})"
                        if !currentObject["parent"]["body"]
                            currentObject["parent"]["body"] = {}
                        end
                        currentObject["parent"]["body"][$1] = {
                            "parent" => currentObject["parent"], # TODO is this correct?
                            "type" => $3,
                            "required" => $4,
                            "subtype" => $5,
                            "description" => ""
                        }
                        currentObject = currentObject["parent"]["body"][$1]

                    # check previous siblings and the parent siblings (?)
                    else
                        Jekyll.logger.error "#{$1} No subtype found yet: #{$2} (type #{$3})\n  currentObject: #{currentObject}\n  Parent: #{currentObject["parent"]}\n"
                        
                        found = false
                        if currentObject["body"]
                            currentObject["body"].each { | key, value |
                                if value["subtype"] == $2
                                    Jekyll.logger.error "  Potential parent: #{key}"
                                    if !value["body"]
                                        value["body"] = {}
                                    end
                                    value["body"][$1] = {
                                        "parent" => value, # TODO is this correct?
                                        "type" => $3,
                                        "required" => $4,
                                        "subtype" => $5,
                                        "description" => ""
                                    }
                                    currentObject = value["body"][$1]
                                    found = true
                                    #break # there can be multiple parents!!!
                                end
                            }
                        end
                        if !found and currentObject["parent"] and currentObject["parent"]["body"]
                            currentObject["parent"]["body"].each { | key, value |
                                if value["subtype"] == $2
                                    raise 'never reached'
                                    Jekyll.logger.error "  Match in parent's body: #{key}"
                                    if !value["body"]
                                        value["body"] = {}
                                    end
                                    value["body"][$1] = {
                                        "parent" => value, # TODO is this correct?
                                        "type" => $3,
                                        "required" => $4,
                                        "subtype" => $5,
                                        "description" => ""
                                    }
                                    currentObject = value["body"][$1]
                                    found = true
                                    #break # there can be multiple parents!!!
                                end
                            }
                        end
                        if !found
                            raise "GAVE UP ON #{$1} (parent subtype: #{$2})\n  currentObject: #{currentObject}\n  Parent: #{currentObject["parent"]}"
                        end
                    end
                    # Find out whether this RESTSTRUCT is a sibling of a previous one
                    # or if it belongs to the parent. currentObject is the parent block!
                    #while !(
                    #    (currentObject["subdescription"] and
                    #    currentObject["subdescription"].values.any? { |v| v["subtype"] == $2 }) or
                    #    currentObject["subtype"] == $2
                    #)
                    #    if currentObject["parent"]
                    #        currentObject = currentObject["parent"]
                    #    else 
                    #        Jekyll.logger.error "Trouble finding RESTSTRUCT parent of #{$1}\nSiblings: #{currentObject["subdescription"].values}\nCurrent: #{currentObject["subtype"]}\nParent Subtype: #{$2}\nOwn Subtype: #{$5}"
                    #        break
                    #    end
                    #end

                    #currentObject["subdescription"][$1] = {

                    #}

                    currentKey = "description"
                when /^@RESTURLPARAMETERS/
                    currentObject = local
                when /^@RESTURLPARAM{([a-zA-Z_-]+),(\w+),(\w+)}/
                    # name ($1), data type ($2), required/optional ($3)
                    if !local["urlParams"]
                        local["urlParams"] = {}
                    end
                    local["urlParams"][$1] = {
                        "type" => $2,
                        "required" => $3,
                        "description" => ""
                    }
                    currentObject = local["urlParams"][$1]
                    currentKey = "description"
                when /^@RESTQUERYPARAMETERS/
                    currentObject = local
                when /^@RESTQUERYPARAM{([a-zA-Z_-]+),(\w+),(\w+)}/
                    # name ($1), data type ($2), required/optional ($3)
                    if !local["queryParams"]
                        local["queryParams"] = {}
                    end
                    local["queryParams"][$1] = {
                        "type" => $2,
                        "required" => $3,
                        "description" => ""
                    }
                    currentObject = local["queryParams"][$1]
                    currentKey = "description"
                when /^@RESTHEADERPARAMETERS/
                    currentObject = local
                when /^@RESTHEADERPARAM{([a-zA-Z_-]+),(\w+),(\w+)}/
                    # name ($1), data type ($2), required/optional ($3)
                    if !local["headerParams"]
                        local["headerParams"] = {}
                    end
                    local["headerParams"][$1] = {
                        "type" => $2,
                        "required" => $3,
                        "description" => ""
                    }
                    currentObject = local["headerParams"][$1]
                    currentKey = "description"
                when /^@HINTS/
                when /^@RESTRETURNCODE{(\d+)}/
                    # code ($1)
                    currentReturnCode = {
                        "code"=> $1,
                        "description"=> ""
                    }
                    currentObject = currentReturnCode
                    currentKey = "description"
                    local["returnCodes"].push(currentReturnCode)
                when /^@RESTREPLYBODY{([a-zA-Z0-9_-]*),([a-zA-Z0-9_-]+),([a-zA-Z0-9_-]+),([a-zA-Z0-9_-]+)?}/
                    # name ($1), data type ($2), required/optional ($3), subtype ($4)
                    if local["returnCodes"].length == 0
                        Jekyll.logger.debug "No returncode found for #{line}"
                    else
                        returnCode = local["returnCodes"][local["returnCodes"].length - 1]
                        if !returnCode["body"]
                            returnCode["body"] = {}
                        end
                        returnCode["body"][$1] = {
                            "type" => $2,
                            "required" => $3,
                            "subtype" => $4,
                            "description" => ""
                        }
                        currentObject = returnCode["body"][$1]
                        currentKey = "description"
                    end
                else
                    if line[0] == "@" && !path.start_with?("/docs/2.8")
                        Jekyll.logger.debug "Unhandled @: #{line}"
                    end
                    if currentObject && currentObject[currentKey]
                        currentObject[currentKey] += line
                    end
                end
            end
            @@paths[path] = blocks
        end
        @@paths[path][blockname]
    end

    def render(context)
        if context["page"]["dir"] =~ /\d\.\d\/?$/
            dir = context["page"]["dir"] + "/"
        else
            dir = context["page"]["dir"] + "/../"
        end
        fullpath = Dir.pwd + dir + "generated/"
        content = get_docu_block(fullpath, @blockname)
        if !content
            Jekyll.logger.error "DocuBlock \"#{@blockname}\" in \"#{File.expand_path(fullpath)}\" undefined. Content will be empty."
            return ""
        end
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
        #{$2}
    </div>
</div>"}
        content
    end
end
Liquid::Template.register_tag('docublock', DocuBlockBlock)