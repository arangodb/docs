class ExampleBlock < Liquid::Block
  alias_method :parent_render, :render

  def get_example_content(context, name)
    if context["page"]["dir"] =~ /\d\.\d{1,2}\/?$/
      dir = context["page"]["dir"] + "/"
    else
      dir = context["page"]["dir"] + "/../"
    end
    examplePath = Dir.pwd + dir + "generated/Examples/" + name + ".generated"
    if !File.file?(examplePath)
      print("Couldn't read example at " + examplePath + ", required by " + context["page"]["path"] + "\n")
      return "Couldn't read example at " + examplePath + ", required by " + context["page"]["path"] + "\n"
    end
    File.read(examplePath, :encoding => 'UTF-8')
  end

  def get_type_and_example_name(context)
    exampleSource = parent_render(context)
    exampleTag = /@(example_([^\s{]+)\s*{([^}]+)})/iom
    if exampleSource =~ exampleTag
      type = $2.downcase
      name = $3
    else
      raise "Didn't find a proper example tag in " + context["page"]["path"]
    end
    return type, name
  end
end
