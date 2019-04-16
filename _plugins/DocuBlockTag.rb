require "rubypython"

class DocuBlockBlock < Liquid::Tag
    @@paths = {}

    def initialize(tag_name, input, tokens)
        super
        @blockname = input.strip!
    end

    def get_source(block)
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
                        result += "   * **#{key}**: #{value["description"]}\n"
                        if value["subdescription"]
                            value["subdescription"].each do |name, subdescription|
                                result += "      * **#{name}**: "
                                subdescription["description"].each_line do |line|
                                    result += "      #{line}"
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
                    local = {"name"=> $2, "returnCodes"=> [], "body": nil, "header" => "", "description"=> "", "examples": nil}
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
                        p "Missing @startDocuBlock #{line}. Ignoring"
                    end
                when /^@RESTHEADER\s*{([^,]+),\s*([^\}]+)}/
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
                    local["fullbody"] = {
                        "type" => $2,
                        "description" => ""
                    }
                    currentObject = local["fullbody"]
                    currentKey = "description"
                when /^@RESTBODYPARAM{([a-zA-Z0-9_-]+),([a-zA-Z0-9_-]+),([a-zA-Z0-9_-]+),?(\s*(([a-zA-Z0-9_-]+)))?}/
                    if !local["body"]
                        local["body"] = {
                        }
                    end
                    local["body"][$1] = {
                        "type" => $2,
                        "description" => "",
                        "subdescription" => {},
                    }
                    currentObject = local["body"][$1]
                    currentKey = "description"
                when /^@RESTSTRUCT{([\]\[\. \*a-zA-Z0-9_-]+),([a-zA-Z0-9_-]+),([a-zA-Z0-9_-]+),([a-zA-Z0-9_-]+),([a-zA-Z0-9_-]+)?}/
                    # hacki hack: so next struct property is assigned to the parent
                    if currentObject["subdescription"] || currentObject["parent"]
                        if currentObject["parent"]
                            currentObject = currentObject["parent"]
                        end
                        currentObject["subdescription"][$1] = {
                            "parent" => currentObject,
                            "description" => "",
                        }
                        currentObject = currentObject["subdescription"][$1]
                        currentKey = "description"
                    else
                        p "Ignoring RESTSTRUCT. No subdescription"
                    end
                when /^@RESTURLPARAMETERS/
                    currentObject = local
                when /^@RESTURLPARAM{([a-zA-Z_-]+),(\w+),(\w+)}/
                    if !local["urlParams"]
                        local["urlParams"] = {}
                    end
                    local["urlParams"][$1] = {
                        "type" => $3,
                        "description" => ""
                    }
                    currentObject = local["urlParams"][$1]
                    currentKey = "description"
                when /^@RESTQUERYPARAMETERS/
                    currentObject = local
                when /^@RESTQUERYPARAM{([a-zA-Z_-]+),(\w+),(\w+)}/
                    if !local["queryParams"]
                        local["queryParams"] = {}
                    end
                    local["queryParams"][$1] = {
                        "type" => $3,
                        "description" => ""
                    }
                    currentObject = local["queryParams"][$1]
                    currentKey = "description"
                when /^@RESTHEADERPARAMETERS/
                    currentObject = local
                when /^@RESTHEADERPARAM{([a-zA-Z_-]+),(\w+),(\w+)}/
                    if !local["headerParams"]
                        local["headerParams"] = {}
                    end
                    local["headerParams"][$1] = {
                        "type" => $3,
                        "description" => ""
                    }
                    currentObject = local["headerParams"][$1]
                    currentKey = "description"
                when /^@HINTS/
                when /^@RESTRETURNCODE{(\d+)}/
                    currentReturnCode = {
                        "code"=> $1,
                        "description"=> ""
                    }
                    currentObject = currentReturnCode
                    currentKey = "description"
                    local["returnCodes"].push(currentReturnCode)
                when /^@RESTREPLYBODY{([a-zA-Z0-9_-]*),([a-zA-Z0-9_-]+),([a-zA-Z0-9_-]+),([a-zA-Z0-9_-]+)?}/
                    if local["returnCodes"].length == 0
                        p "No returncode found for #{line}"
                    else
                        returnCode = local["returnCodes"][local["returnCodes"].length - 1]
                        if !returnCode["body"]
                            returnCode["body"] = {}
                        end
                        returnCode["body"][$1] = {
                            "description" => "",
                            "subdescription" => {},
                        }
                        currentObject = returnCode["body"][$1]
                        currentKey = "description"
                    end
                else
                    if line[0] == "@"
                        print "Unhandled @: #{line}"
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
        content = get_docu_block(Dir.pwd + context["page"]["dir"] + "/../", @blockname)
        if !content
            return "Blockname #{@blockname} undefined"
        end
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