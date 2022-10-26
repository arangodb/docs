import re

## TODO: These functions are horrible, refactor with cleaner code

def set_page_description(page, buffer, frontMatter):
    paragraphDescRegex = re.search(r"(?<=\n\n)[\w\s\W]+(?={:class=\"lead\"})", buffer)
    if paragraphDescRegex:
        description = paragraphDescRegex.group(0)
        if not "page.description" in description:
            description = description.replace("\n", "\n  ")
            page.frontMatter.description = f">-\n  {description}"
        else:
            page.frontMatter.description = re.search(r"(?<=description: )(.*?)((?=\n\w)|(?=---))", buffer, re.MULTILINE | re.DOTALL).group(0)

def migrate_hints(paragraph):
    #Hints TODO: Replace this horrible regex with the lazy capture
    hintRegex = re.findall(r"{% hint .* %}[\w\n\s\?\'\\\&\$\,\{\}\_\<\>\"\.\[\]\-\/\(\)\#\:\!\=\*\`\…]*{% endhint %}", paragraph)
    for hint in hintRegex:
        hintSplit = hint.split("\n")
        hintType = re.search(r"'.*[']* %}", hintSplit[0]).group(0).replace("'", '').strip(" %}")
        hintText = "\n".join(hintSplit[1:len(hintSplit)-2])
        if hintType == 'note':
            hintType = 'tip'

        newHint = f"{{{{% hints/{hintType} %}}}}\n{hintText}\n{{{{% /hints/{hintType} %}}}}"
        paragraph = paragraph.replace(hint, newHint)

    # Enterprise feature hints
    enterpriseFeatureRegex = re.findall(r"{% include hint-ee-oasis\.md .* %}|{% include hint-ee\.md .* %}", paragraph)
    for tag in enterpriseFeatureRegex:
        feature = re.search(r"(?<=feature=).*\"", tag).group(0)
        oasis = "false"
        if 'oasis' in tag:
            oasis = "true"

        paragraph = paragraph.replace(tag, '{{{{% enterprise-tag feature={} oasis="{}" %}}}}'.format(feature, oasis))

    detailsRegex = re.search(r"{% details .* %}[\w\n\s\W]*{% enddetails %}", paragraph)
    if detailsRegex:
        detailsTitle = re.search(r"(?<={% details ).*(?= %})", detailsRegex.group(0)).group(0)
        paragraph = paragraph.replace(f"{{% details {detailsTitle} %}}", '{{{{% expand title="{}" %}}}}'.format(detailsTitle))
        paragraph = paragraph.replace(f"{{% enddetails %}}", "{{{{% /expand %}}}}")

    # Comments
    paragraph = paragraph.replace("{% comment %}", "{{/*")
    paragraph = paragraph.replace("{% endcomment %}", "*/}}")

    paragraph = paragraph.replace("{%- comment %}", "{{/*")

    return paragraph

def migrate_hrefs(paragraph, infos):
    hrefRegex = re.findall(r"[^\s]*\[.*\]\(.*\).*", paragraph)
    for href in hrefRegex:
        if 'https://' in href or 'http://' in href:
            continue

        linkContent = re.search(r"(?<=\]\()(.*?)\)", href).group(0).replace(")", "")
        #print(linkContent)

        if href.startswith("!"):
            newImgName = "images/"+ linkContent.split("/")[len(linkContent.split("/"))-1]
            if ':style' in href:
                styleRegex = re.search(r"(?<={:style=\").*(?=\"})", href)
                if styleRegex:
                    newImgName = newImgName + "?"
                    styles = styleRegex.group(0).split(";")

                    for style in styles:
                        style = style.replace(": ", "=").replace(" ", "&")
                        newImgName = newImgName + style
                    newHref = href.replace(linkContent, newImgName)
                    newHref = re.sub(r"{.*}", '', newHref, 0)
                    paragraph = paragraph.replace(href, newHref)
            else:
                label = re.search(r"(?<=\[).*(?=\])", href).group(0)	# Bug with new style regex, to fix
                if "\"" in label:
                    label = label.replace('"', '')

                attr = re.search(r"(?<=\]\().*(?=\))", href).group(0).strip('"').strip('()').replace('.html', '')
                imgWidget = '{{{{< img src="{}" alt="{}" >}}}}'.format(attr, label)
                paragraph = paragraph.replace(href, imgWidget)

            continue

        linksContent = re.findall(r"(?<=\]\()(.*?)\)", href)
        for linkContent in linksContent:
            linkContent = linkContent.replace(")", "")
            anchor = linkContent.split("#")[0].replace(".html", "")
            filename = anchor.split("/")[len(anchor.split("/"))-1]
           # print(f"\nHREF {href}")
           # print(f"LINK CONTENT {linkContent}")
           # print(f"FILENAME {filename}")
            
            for k in infos.keys():
                if not "fileID" in infos[k]:
                    continue

                if infos[k]["fileID"] == filename:
                    newAnchor = re.search(r"(?<=site\/content).*", k).group(0).replace(".md", "")
                
                    if newAnchor.endswith("_index"):
                        newAnchor = "/".join(newAnchor.split("/")[0:len(newAnchor.split("/"))-2])

                    if "#" in linkContent:
                        fragment = linkContent.split("#")[1]
                        newAnchor = f"{newAnchor}#{fragment}"
                    #print(f"NEW ANCHOR {newAnchor}")
                    newHref = href.replace(linkContent, newAnchor).replace(".html", "")
                    paragraph = paragraph.replace(href, newHref)

                    #print(f"TROVATO {newHref}\n")


    #Youtube links
    youtubeRegex = re.search(r"{% include youtube\.html .* %}", paragraph)
    if youtubeRegex:
        oldYoutube = youtubeRegex.group(0)
        oldYoutube = oldYoutube.replace('{% include', '{{< ').replace('%}', '>}}').replace(".html", "")
        paragraph = paragraph.replace(youtubeRegex.group(0), oldYoutube)

    return paragraph

def migrate_headers(paragraph):
    headersRegex = re.findall(r"(?<=\n)[\w\s_/]+\n-{4,}", paragraph)
    for header in headersRegex:
        if '|' in header:
            continue

        headerSplit = header.replace('-', '').split("\n")
        headerText = f"\n## {headerSplit[len(headerSplit)-2]}"
        paragraph = paragraph.replace(header, headerText)

    return paragraph