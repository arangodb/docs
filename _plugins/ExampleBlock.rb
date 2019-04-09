class ExampleBlock < Liquid::Block
  # was is das fuer 1 unfug. template sprache und man muss selber matchen
  Syntax = /example\s*=\s*"([^"]+)"\s+examplevar\s*=\s*"([^"]+)"\s+short\s*=\s*"([^"]+)"\s+long\s*=\s*"([^"]+)"/om
  attr_reader :example, :short, :long

  def initialize(tag_name, markup, tokens)
    super
    if markup =~ Syntax
      @example = $1
      @examplevar = $2
      @short = $3
      @long = $4
    else
      raise "Invalid example syntax " + markup
    end
  end

  def render(context)
    examplePath = Dir.pwd + context["page"]["dir"] + "/../Examples/" + @example + ".generated"
    if !File.file?(examplePath)
      print("Couldn't read example at " + examplePath + ", required by " + context["page"]["path"] + "\n")
      return "Couldn't read example at " + examplePath + ", required by " + context["page"]["path"] + "\n"
    end
    short = ""
    long = ""
    
    content = File.readlines(examplePath).each do |line|
      long += line + "\n"
      if line =~ /^\s*arangosh&gt;/ || line =~ /\.\.\.\.\.\.\.\.&gt;/
        short += line
      end
    end
    context.scopes.last[@examplevar] = @example
    if long.lines.length - short.lines.length < 5
      context.scopes.last[@short] = nil
    else
      context.scopes.last[@short] = short
    end
    context.scopes.last[@long] = content
    ""
  end
end
Liquid::Template.register_tag('example', ExampleBlock)
  