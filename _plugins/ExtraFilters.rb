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
        # /3.9/ --> 39-manual
        # /3.9/aql/ --> 39-aql
        def navvar(page_dir)
            m = page_dir.to_s.match(/\/(\d)\.(\d{1,2})\/(\w+)?/)
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
            return a.join(', ') + ' and ' + b if arr.size == 2
            a.join(', ') + ', and ' + b
        end

        def resolve_symlink(path)
            site = @context.registers[:site]
            source = site.source # base path
            Pathname.new(File.realpath(path)).relative_path_from(Pathname.new(source)).to_s
        end

        def is_set(var, source)
            if var.nil? || var.empty?
                raise "'#{source}' is nil or empty"
            end
        end

        def has_key(obj, key, source)
            if !obj.has_key?(key)
                keys = obj.keys.map{ |k| "'#{k}'" }.join(", ")
                raise "Missing key '#{key}' in #{source}, available: #{keys}"
            end
        end

        def version(ver, cond)
            ver = ver.split('.').map{ |s| s.to_i }
            page_ver = @context.registers[:page]['version'].version.split('.').map{ |s| s.to_i }
            comp = page_ver <=> ver # page_ver greater: 1, smaller: -1, equal: 0
            case cond
            when '>' then comp == 1
            when '>=' then comp >= 0
            when '<' then comp == -1
            when '<=' then comp <= 0
            when '==' then comp == 0
            when '!=' then comp != 0
            else
                raise "Invalid version condition '#{cond}', must be one of '>', '>=', '<', '<=', '==', '!='"
            end
        end
    end
end

Liquid::Template.register_filter(Jekyll::ExtraFilters)
