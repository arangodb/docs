---
layout: default
title: Boxes
menuTitle: Boxes

weight: 1
tags: ["widgets"]

fileID: "widgets-box"
---

## Enterprise feature box

Hardwired box to warn the feature is an enterprise only feature.

````go
{{%/* enterprise-tag feature="SmartGraphs" */%}}
````

{{% enterprise-tag feature="SmartGraphs" %}}

## Warning box

````go
{{%/* hints/warning */%}}
This is a warning box
{{%/* hints/warning */%}}
````

{{% hints/warning %}}
This is a warning box
{{% /hints/warning %}}

## Info box

````go
{{%/* hints/info */%}}
This is a info box
{{%/* hints/info */%}}
````

{{% hints/info %}}
This is a info box
{{% /hints/info %}}


## Danger box

````go
{{%/* hints/danger */%}}
This is a danger box
{{%/* hints/danger */%}}
````

{{% hints/danger %}}
This is a danger box
{{% /hints/danger %}}


