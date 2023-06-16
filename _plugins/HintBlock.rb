class HintTag < Liquid::Block
    def initialize(tag_name, input, tokens)
      @type = input.gsub(/['"]/, "").strip!
      super
    end

    def render(context)
      site = context.registers[:site]
      converter = site.find_converter_instance(::Jekyll::Converters::Markdown)
      
      # Remove indention based on first actual line (but only spaces)
      content = super.sub(/^\R+/, '')
      #content.rstrip!
      indent = content.index(/[^ ]/) || 0
      content = content.lines.map{ |line| line.slice([indent, line.index(/[^ ]/) || 0].min, line.length) }.join ''
      # Parse Markdown and collapse line breaks to spaces outside of <pre> blocks.
      # Line breaks can cause pre-mature closing of elements it seems,
      # observed when placing a hint block in a Markdown list,
      # leading to unwanted literal "</div>" (HTML-encoded) in the output.
      content = converter.convert(content).split(/(?=<\/?pre)/).map{
        |s| s.start_with?('<pre') ? s : s.gsub(/\R+/, ' ')
      }.join ''

      case @type
      when "tip"
        icon = "check"
        className = "success"
      when "security"
        icon = "shield"
        className = "warning"
      when "warning"
        icon = "exclamation-triangle"
        className = "warning"
      when "danger"
        icon = "times-circle"
        className = "danger"
      when "info"
        icon = "info-circle"
        className = "info"
      end

      return "<div class=\"alert alert-#{className}\" style=\"display: flex\">" +
        "<i class=\"fa fa-#{icon}\" style=\"margin-right: 10px; margin-top: 4px;\"></i>" +
        "<div style=\"min-width: 0\">#{content}</div>" +
        "</div>"
    end
  end
  Liquid::Template.register_tag('hint', HintTag)
  