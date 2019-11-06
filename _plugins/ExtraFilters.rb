module Jekyll
    module ExtraFilters

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
