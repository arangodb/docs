class DetailsTag < Liquid::Block
    def initialize(tag_name, summary, tokens)
        @summary = summary.gsub(/['"]/, "").strip!
        super
    end

    def render(context)
      site = context.registers[:site]
      converter = site.find_converter_instance(::Jekyll::Converters::Markdown)
      content = converter.convert(super)
      return "<details><summary>#{@summary}</summary>#{content}</details>"
    end
  end
  Liquid::Template.register_tag('details', DetailsTag)
