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
        if block["fullbody"]
            result += "**Request Body (#{block["fullbody"]["type"]})**\n\n#{block["fullbody"]["description"]}\n\n"
        end
        if block["body"]
            result += "**A JSON object with these properties is required:**\n\n"
            block["body"].each do |key, value|
                result += "   * **#{key}**: #{value["description"]}\n"
                if value["subdescription"]
                    value["subdescription"].each do |name, subdescription|
                        p subdescription
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
            result += "**Return codes**\n\n"
            block["returnCodes"].each do |returnCode|
                code = returnCode['code']
                description = returnCode['description']
                result += "   * #{code}: #{description}\n"
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
                    local["header"] += $1
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
                when /^@RESTBODYPARAM{(\w+),(\w+),(\w+)(,\s*(\w*))?}/
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
                when /^@RESTSTRUCT{([a-zA-Z_-]+),([a-zA-Z_-]+),(\w+),(\w+),(\w+)?}/
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
                when /^@RESTREPLYBODY{(\w+),(\w+),(\w+)}/
                when /^@HINTS/
                when /^@RESTRETURNCODE{(\d+)}/
                    currentReturnCode = {
                        "code"=> $1,
                        "description"=> ""
                    }
                    currentObject = currentReturnCode
                    currentKey = "description"
                    local["returnCodes"].push(currentReturnCode)
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
        get_docu_block(Dir.pwd + context["page"]["dir"] + "/../", @blockname) || "Blockname #{@blockname} undefined"
    end
end
Liquid::Template.register_tag('docublock', DocuBlockBlock)