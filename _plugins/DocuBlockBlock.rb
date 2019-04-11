require "rubypython"

ENV["PYTHONPATH"] = File.dirname(__FILE__)
ENV["PYTHONIOENCODING"]="utf-8"
ENV["LC_ALL"] = "C.UTF-8"
ENV["LANG"] = "C.UTF-8"

RubyPython.start(:python_exe => "/usr/bin/python2.7")
$generateMdFiles = RubyPython.import("pythondocs")
$generateMdFiles.init(".", ".", "api-docs.json")

class DocuBlockBlock < Liquid::Block
    def initialize(tag_name, input, tokens)
        super
    end

    def render(context)
        content = super
        if content =~ /@startDocuBlock\s+(\w+)/
            result = $generateMdFiles.replaceText(content, context["page"]["path"], $1).to_s
            # hmm...force encoding...something seems messed up in the bridge
            result.force_encoding("utf-8")
        else
            return "Couldn't find @startDocuBlock"
        end
    end
end
Liquid::Template.register_tag('docublock', DocuBlockBlock)