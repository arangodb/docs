class ExampleBlock < Liquid::Block
    def initialize(tag_name, input, tokens)
      super
    end

    def blank?
      true
    end
  
    def render(context)
      # TODO
      return ""
    end
  end
  Liquid::Template.register_tag('example', ExampleBlock)
  