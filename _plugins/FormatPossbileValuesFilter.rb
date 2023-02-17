module FormatPossibleValuesFilter
    def format_possible_values(input)
        return nil if input == nil
        input.sub(/: /, "\n`") + "`"
    end
end
  
Liquid::Template.register_filter(FormatPossibleValuesFilter)