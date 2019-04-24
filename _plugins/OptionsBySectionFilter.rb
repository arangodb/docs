module OptionsBySectionFilter
    def options_by_section(input)
        return nil if input == nil
        # grrr ruby....there is for sure a better conversion strategy..
        by_section = Hash.new
        input.each {|k, v|
            section = v["section"]
            by_section[section] = Hash.new if !by_section[section]
            by_section[section][k] = v
        }
        by_section.sort.map {|k, v| [k == "" ? "global" : k, v] }.to_h
    end
end
  
Liquid::Template.register_filter(OptionsBySectionFilter)