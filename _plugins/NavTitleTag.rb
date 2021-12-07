require 'json'

class NavTitleTag < Liquid::Tag
    def initialize(tag_name, input, tokens)
        @variable_name_expr = Liquid::Expression.parse(input.strip!)
        super
    end

    def findTitle(context, root, stack)
        # Root URLs like /3.4/index.md don't have a nav title, set a default
        if context["page"]["url"].end_with?("/")
            return stack.push "Introduction"
        end
        if !root
            return nil
        end
        if root.length == 0
            return nil
        end

        root.each.with_index { | element, index |
            if element["href"]
                if context.environments.first["page"]["url"] == context.environments.first["page"]["dir"] + element["href"]
                    return ([element["text"]] + stack)
                end
                if element["children"]
                    result = findTitle(context, element["children"], [element["text"]] + stack)
                    if result
                        return result
                    end
                end
            end
        }
        nil
    end

    def render(context)

        # navvar could also be computed here, but it is also needed in topnav.html
        #var = context["page"]["dir"].gsub(/^\/|\.|\/$/, "").gsub("/", "-")
        #var << "-manual" if var.length == 2

        var = context.evaluate(@variable_name_expr)
        parsed = context["site"]["data"][var]

        stack = findTitle(context, parsed, [])

        if !stack || stack.length == 0
            raise "No title found for #{context.environments.first["page"]["url"]}. Maybe you forgot to link it to the navigation?"
        end

        book = var.gsub(/\d{2,3}-(.*)/, '\1').capitalize().sub("Aql", "AQL").sub("Http", "HTTP")
        stack.push book if book
        stack.join " | "
    end
end
Liquid::Template.register_tag('navtitle', NavTitleTag)
