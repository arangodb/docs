require_relative "ExampleBlock.rb"

class ArangoshExampleBlock < ExampleBlock
  # was is das fuer 1 unfug. template sprache und man muss selber matchen
  Syntax = /examplevar\s*=\s*"([^"]+)"\s+short\s*=\s*"([^"]+)"\s+long\s*=\s*"([^"]+)"/om
  attr_reader :examplevar, :short, :long
  
  def initialize(tag_name, markup, tokens)
    super
    if markup =~ Syntax
      @examplevar = $2
      @short = $3
      @long = $4
    else
      raise "Invalid example syntax " + markup
    end
  end
  
  def render(context)
    type, example_name = get_type_and_example_name(context)
    if type != "arangosh_output" && type != "arangosh_run"
      raise "Invalid type " + type + " for arangosh_run in " + context["page"]["path"]
    end

    short = ""
    long = ""
    get_example_content(context, example_name).each_line {|line|
      long += line + "\n"
      if line =~ /^\s*arangosh&gt;/ || line =~ /\.\.\.\.\.\.\.\.&gt;/
        short += line
      end
    }
    
    context.scopes.last[@examplevar] = example_name
    if long.lines.length - short.lines.length < 5
      context.scopes.last[@short] = nil
    else
      context.scopes.last[@short] = short
    end
    context.scopes.last[@long] = long
    ""
  end
end
Liquid::Template.register_tag('arangoshexample', ArangoshExampleBlock)
    