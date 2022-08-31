import re

def set_page_description(page, buffer, frontMatter):
    descRegex = re.search(r"(?<=description: )(([>-]+\n(\s{2}[\s\w,-]+\n)+)|.*\n)", frontMatter)
    if descRegex:
        page.frontMatter.description = descRegex.group(0)

    paragraphDescRegex = re.search(r"(?<=\n\n)[\w\s\W]+(?={:class=\"lead\"})", buffer)
    if paragraphDescRegex:
        description = paragraphDescRegex.group(0)
        if not "page.description" in description:
            description = description.replace("\n", "\n  ")
            page.frontMatter.description = f">-\n  {description}"

def migrate_hints(paragraph):
    hintRegex = re.findall(r"{% hint .* %}[\n\w\s\*\.,\"\`!#\[\]\(\)-]*{% .* %}", paragraph)

    for hint in hintRegex:
        print(f"processing {hint}")
        hintSplit = hint.split("\n")
        hintType = re.search("'.*'", hintSplit[0]).group(0).strip("'")
        hintText = "\n".join(hintSplit[1:len(hintSplit)-2])

        newHint = f"{{{{% hints/{hintType} %}}}}\n{hintText}\n{{{{% /hints/{hintType} %}}}}"
        #print(f"oldhint\n{hint}\n\nnewHing\n{newHint}\n")
        paragraph = paragraph.replace(hint, newHint)

    return paragraph

def migrate_hrefs(paragraph):
    hrefRegex = re.findall(r"[^\s]*\[.*\]\(.*\)({:style.*})?", paragraph)
    for href in hrefRegex:
        if 'https://' in href or 'http://' in href:
            continue

        label = re.search(r"(?<=\[).*(?=\])", href).group(0)	# Bug with new style regex, to fix
        if "\"" in label:
            label = label.replace('"', '')

        attr = re.search(r"(?<=\]\().*(?=\))", href).group(0).strip('"').strip('()').replace('.html', '')

        if href.startswith("!"):
            ## Check for the inline images
            if ':style' in href:
                imgWidget = '{{{{< img src="{}" alt="{}" size="medium" inline="true" >}}}}'.format(attr, label)
                paragraph = paragraph.replace(href, imgWidget)
                continue

            imgWidget = '{{{{< img src="{}" alt="{}" size="medium" >}}}}'.format(attr, label)
            paragraph = paragraph.replace(href, imgWidget)
            continue

    return paragraph

def migrate_headers(paragraph):
    headersRegex = re.findall(r"(?<=\n)[\w\s_/]+\n-{4,}", paragraph)
    for header in headersRegex:
        if '|' in header:
            continue

        headerSplit = header.replace('-', '').split("\n")
        headerText = f"\n## {headerSplit[len(headerSplit)-2]}"
        paragraph = paragraph.replace(header, headerText)