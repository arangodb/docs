class HintTag < Liquid::Block
    def initialize(tag_name, input, tokens)
      @class = input.gsub(/['"]/, "").strip!
      super
    end

    def render(context)
      site = context.registers[:site]
      converter = site.find_converter_instance(::Jekyll::Converters::Markdown)
      
      content = converter.convert(super)

      return "<div class=\"alert alert-#{@class}\" style=\"display: flex\">
  <i class=\"fa fa-info-circle\" style=\"margin-right: 10px; margin-top: 4px;\"></i>
  <div>
    #{content}
  </div>
</div>"
    end
  end
  Liquid::Template.register_tag('hint', HintTag)
  