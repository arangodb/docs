require 'json'

class NavTitleTag < Liquid::Tag
    def initialize(tag_name, input, tokens)
        @variable_name_expr = Liquid::Expression.parse(input.strip!)
        super
    end

    def findTitle(context, root, stack)
        # root url (3.4/Manual et al)...doesn't have a nav item
        if context["page"]["url"].end_with?("/")
            return stack.join " | "
        end
        if !root
            return nil
        end
        if root.length == 0
            return nil
        end

        root.each.with_index { |element, index |
            if element["href"]
                if context.environments.first["page"]["url"] == context.environments.first["page"]["dir"] + element["href"]
                    return (stack + [element["text"]]).join(" | ")
                end
                if element["children"]
                    result = findTitle(context, element["children"], stack + [element["text"]])
                    if result
                        return result
                    end
                end
            end
        }
        nil
    end

    def render(context)
        var = context.evaluate(@variable_name_expr)
        parsed = context["site"]["data"][var]

        stack = ["ArangoDB Documentation", var.gsub(/\d{2}-(.*)/, '\1').capitalize]

        title = findTitle(context, parsed, stack)
        if !title
            raise "No title found for #{context.environments.first["page"]["url"]}. Maybe you forgot to link it to the navigation?"
        end
        title
    end
end
Liquid::Template.register_tag('navtitle', NavTitleTag)