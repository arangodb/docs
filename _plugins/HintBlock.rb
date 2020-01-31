class HintTag < Liquid::Block
    def initialize(tag_name, input, tokens)
      @type = input.gsub(/['"]/, "").strip!
      super
    end

    def render(context)
      site = context.registers[:site]
      converter = site.find_converter_instance(::Jekyll::Converters::Markdown)
      
      # Remove indention based on first actual line (but only spaces)
      content = super.sub(/^[\r\n]+/, '')
      indent = content.index(/[^ ]/) || 0
      content = content.lines.map{ |line| line.slice([indent, line.index(/[^ ]/) || 0].min, line.length) }.join ''
      # Parse Markdown and strip trailing whitespace (especially line breaks).
      # Otherwise below <div>s will be wrapped in <p> for some reason!
      content = converter.convert(content).sub(/\s+$/, '')

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
      "<div>#{content}</div>" +
      "</div>"
    end
  end
  Liquid::Template.register_tag('hint', HintTag)
  