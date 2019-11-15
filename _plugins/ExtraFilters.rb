module Jekyll
    module ExtraFilters

        def upcase_first(input)
            return nil if !input.is_a? String
            input[0].upcase + input[1..-1]
        end

        # Substitute last occurrence of string (no regexp support)
        def replace_last(input, string, replacement = '')
            input_s = input.to_s
            string_s = string.to_s
            return input_s if string_s.length == 0
            start = input_s.rindex(string_s)
            return input_s if start == nil
            input_s[0, start] + replacement.to_s + (input_s[start + string_s.length..-1])
            # Alternative implementation:
            #pieces = input.to_s.rpartition string.to_s
            #( pieces[(pieces.find_index string.to_s)] =  replacement.to_s ) rescue nil
            #pieces.join
        end

        # Figure out where we are at and compute navvar from folder path, e.g.
        # /3.4/ --> 34-manual
        # /3.4/aql/ --> 34-aql
        def navvar(page_dir)
            s = page_dir.to_s.gsub(/^\/|\/$/, '').gsub('/', '-').gsub('.', '')
            return s + '-manual' if s.length == 2
            s
        end
    end
end

Liquid::Template.register_filter(Jekyll::ExtraFilters)
