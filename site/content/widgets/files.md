---
layout: default
title: Link to Files
menuTitle: Links & Files

weight: 1
tags: ["widgets"]

fileID: "widgets-files"
---

## Reference

A `reference` shortcode can be used to link to another page by using the fileID and not its path.

The page' front matter "fileID" variable is used to match the page and get the link to the page, so the file can be moved anywhere it will always
be found as long as the fileID is well referenced.

### Args

    - fileID: The fileID to reference
    - label: label which will render the href

### Example
We want a link to the Images & Videos page, so we just need the fileID variable written in the page front matter which is "widgets-media".

**< reference fileID="widgets-media" label="link to media widget" >** will give us the {{< reference fileID="widgets-media" label="link to media widget" >}}. 

