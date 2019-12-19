require_relative "ExampleBlock.rb"

class AqlExampleBlock < ExampleBlock
  # was is das fuer 1 unfug. template sprache und man muss selber matchen
  Syntax = /examplevar\s*=\s*"([^"]+)"\s+type\s*=\s*"([^"]+)"\s+query\s*=\s*"([^"]+)"\s+bind\s*=\s*"([^"]+)"\s+result\s*=\s*"([^"]+)"/om
  attr_reader :examplevar, :type, :query, :bind, :result
  
  def initialize(tag_name, markup, tokens)
    super
    if markup =~ Syntax
      @examplevar = $1
      @type = $2
      @query = $3
      @bind = $4
      @result = $5
    else
      raise "Invalid example syntax " + markup
    end
  end
  
  def render(context)
    type, example_name = get_type_and_example_name(context)
    if type != "aql"
      raise "Invalid type " + type + " for aql in " + context["page"]["path"]
    end

    parts = {
      "query"=> "",
      "bind"=> "",
      "result"=> "",
    }
    type = "query"

    if parent_render(context) =~ /@EXPLAIN/iom
      type = "explain"
    end

    current = "none"
    get_example_content(context, example_name).each_line {|line|
      case line
      when /^\s*@([A-Z])/
        case $1
        when "Q"
          current = "query"
        when "B"
          current = "bind"
        when "R"
          current = "result"
        else
          print("Unexpected type " + $1)
        end
      else
        if current == "none"
          print("Ignoring " + line + " in aql example at " + context["page"]["path"] + "\n")
        else
          parts[current] += line
        end
      end
    }

    context.scopes.last[@examplevar] = "aql-" + example_name.gsub(/[^a-zA-Z0-9-]/, "-")
    context.scopes.last[@type] = type
    context.scopes.last[@query] = parts["query"]
    context.scopes.last[@bind] = parts["bind"]
    context.scopes.last[@result] = parts["result"]
    ""
  end
end
Liquid::Template.register_tag('aqlexample', AqlExampleBlock)
