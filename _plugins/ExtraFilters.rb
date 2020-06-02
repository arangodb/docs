module Jekyll
    module ExtraFilters

        OS_NAMES = {
            'linux' => 'Linux',
            'macos' => 'macOS',
            'windows' => 'Windows'
        }

        COMPONENT_NAMES = {
            'single' => 'Single Servers',
            'dbserver' => 'DB-Servers',
            'coordinator' => 'Coordinators',
            'agent' => 'Agents'
        }

        def upcase_first(input)
            return nil if !input.is_a? String
            input[0].upcase + input[1..-1]
        end

        # Substitute last occurrence of string (no regexp support)
        #def replace_last(input, string, replacement = '')
        #    input_s = input.to_s
        #    string_s = string.to_s
        #    return input_s if string_s.length == 0
        #    start = input_s.rindex(string_s)
        #    return input_s if start == nil
        #    input_s[0, start] + replacement.to_s + (input_s[start + string_s.length..-1])
        #end

        # Alternative implementation:
        #def replace_last(input, string, replacement = '')
        #    pieces = input.to_s.rpartition string.to_s
        #    ( pieces[(pieces.find_index string.to_s)] =  replacement.to_s ) rescue nil
        #    pieces.join
        #end

        # Figure out where we are at and compute navvar from folder path, e.g.
        # /3.4/ --> 34-manual
        # /3.4/aql/ --> 34-aql
        def navvar(page_dir)
            m = page_dir.to_s.match(/\/(\d)\.(\d)\/(\w+)?/)
            [m.captures[0] + m.captures[1], m.captures[2] || 'manual'].join('-')
        end

        def capitalize_os(arr)
            arr.map{ |name| OS_NAMES.fetch(name, name) }
        end

        def capitalize_components(arr)
            arr.map{ |name| COMPONENT_NAMES.fetch(name, name) }
        end

        def join_natural(arr)
            return nil if arr.size == 0
            return arr[0] if arr.size == 1
            *a, b = arr
            a.join(', ') + ' and ' + b
        end
    end
end

Liquid::Template.register_filter(Jekyll::ExtraFilters)
