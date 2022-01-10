module PageNavFilter
    @@flat_nav = {}
    def find_siblings(nav, page)
        index = nav.find_index {|item| item["href"] == page}

        return nil if index == nil

        return nav[index-1], nav[index+1]
    end

    def create_flat_nav(nav)
        work = []
        nav.each {|item|
            if item["href"] and not external_url?(item["href"])
                work.push(item)
                if item["children"] && item["children"].size > 0
                    work = work.concat(create_flat_nav(item["children"]))
                end
            end
        }
        work
    end

    def get_nav(page)
        parts = page["dir"].split("/")
        version = parts[1].sub(".", "")
        book = parts[2]
        book = "manual" if book == nil

        key = "#{version}-#{book}"

        if !@@flat_nav.has_key?(key)
            @@flat_nav[key] = create_flat_nav(Jekyll.sites.first.data[key])
        end
        @@flat_nav[key]
    end

    def previous_page(input)
        return nil if input == nil

        nav = get_nav(input)
        relative = input["url"].split("/").last

        (prev_page, next_page) = find_siblings(nav, relative)
        prev_page
    end

    def next_page(input)
        return nil if input == nil

        nav = get_nav(input)
        if input["url"].end_with?("/")
            relative = "index.html"
        else
            relative = input["url"].split("/").last
        end

        (prev_page, next_page) = find_siblings(nav, relative)
        next_page
    end

    def external_url?(url)
        url.start_with?("http://", "https://")
    end
end

Liquid::Template.register_filter(PageNavFilter)