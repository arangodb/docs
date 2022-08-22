---
layout: default
title: Images & Videos
menuTitle: Images & Videos

weight: 1
tags: ["widgets"]

fileID: "widgets-media"
---

## Images

The image shortcode can be accessed via the `img` shortcode.

The image can be resized as "small", "medium" or "large" or be rendered as an inline image.

### Args

    - src: path of the file
    - alt: alt attribute of the image
    - size: resizing of the image ("small", "medium", "large)
    - inline: {boolean} render the image as inline.

 Inline images cannot be resized at the moment.

 ### Examples

````go
{{</* img src="/images/arangodb-overview-diagram.png"
        alt="ArangoDB Overview Diagram" size="small" */>}}
````

{{< img src="/images/arangodb-overview-diagram.png" alt="ArangoDB Overview Diagram" size="small" >}}

````go
{{</* img src="/images/arangodb-overview-diagram.png"
        alt="ArangoDB Overview Diagram" size="large" */>}}
````
{{< img src="/images/arangodb-overview-diagram.png" alt="ArangoDB Overview Diagram" size="large" >}} 

{{< img src="/images/icon-fraud-detection.png" alt="ArangoDB Fraud Detection" inline="true" >}}
**< img src="/images/icon-fraud-detection.png"**

 **alt="ArangoDB Fraud Detection" inline="true" >** will produce:


## Videos

The video shortcode can be accessed via the `video` shortcode.

All videos will autoplay and loop muted only if the video box is visible on screen, if the video is not visible it will stop playing.

### Args

    - src: path of the video
    - size: size of the video

### Example

````go
{{</* video src="videos/videotest.mp4" size="medium" */>}}
````


{{< video src="videos/videotest.mp4" size="medium" >}}




