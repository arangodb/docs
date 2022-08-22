---
layout: default 
title: Annotations
menuTitle: Annotations

fileID: "widgets-annotations"
---

## Markers

A `marker` shortcode can be placed where we want the annotation button to appear.

### Markers Example

````go
Using {{</* marker id="test" */>}} here we will have a button which hides the < annotation id="test" > content which we can define anywhere in the file.

We can write the annotation with id "test" here but it will be shown where the "test" marker has been placed

{{%/* annotation id="test" */%}}
This annotation has been written at the end of the paragraph
but is shown here!
{{%/* /annotation */%}}

````

Using  {{< marker id="test" >}} here we will have a button which hides the < annotation id="test" > content which we can define anywhere in the file.

We can write the annotation with id "test" here but it will be shown where the "test" marker has been placed

{{% annotation id="test" %}}
This annotation has been written at the end of the paragraph
but is shown here!
{{% /annotation %}}

## Code annotations

When using code blocks, whenever a **//:annotation:** is found in the code block, the comment will be substituted with an annotation button
as if it is a marker

```aql
FOR book IN Books
  FILTER book.title == "ArangoDB"
  FOR person IN 2..2 INBOUND book Sales, OUTBOUND People  //This is a comment
    RETURN person.name    //:annotation: This line returns people's name
```
