require_relative "ExampleBlock.rb"

class ArangoshExampleBlock < ExampleBlock
  # was is das fuer 1 unfug. template sprache und man muss selber matchen
  Syntax = /examplevar\s*=\s*"([^"]+)"\s+script\s*=\s*"([^"]+)"\s+result\s*=\s*"([^"]+)"/om
  attr_reader :examplevar, :script, :result
  
  def initialize(tag_name, markup, tokens)
    super
    if markup =~ Syntax
      @examplevar = $1
      @script = $2
      @result = $3
    else
      raise "Invalid example syntax " + markup
    end
  end
  
  def render(context)
    type, example_name = get_type_and_example_name(context)
    if type != "arangosh_output" && type != "arangosh_run"
      raise "Invalid type " + type + " for arangosh_run in " + context["page"]["path"]
    end

    script = ""
    result = ""
    get_example_content(context, example_name).each_line {|line|
      if line =~ /^\s*arangosh&gt;/ || line =~ /\.\.\.\.\.\.\.\.&gt;/
        script += line
      else
        result += line
      end
    }
    
    context.scopes.last[@examplevar] = "ex-" + example_name.gsub(/[^a-zA-Z0-9-]/, "-")
    context.scopes.last[@script] = script
    context.scopes.last[@result] = result.strip
    ""
  end
end
Liquid::Template.register_tag('arangoshexample', ArangoshExampleBlock)
    