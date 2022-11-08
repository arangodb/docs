#Arangoproxy
FROM golang:1.19-alpine AS arangoproxy

WORKDIR /home/arangoproxy/cmd
CMD ["go", "run", "main.go", "-no-cache"]

# HUGO
FROM alpine:3.16 AS hugo-clone

RUN apk update && \
    apk add --no-cache ca-certificates git

RUN git clone https://github.com/gohugoio/hugo.git

#---------- Install and serve hugo

FROM golang:1.19-alpine AS hugo

COPY --from=hugo-clone /hugo ./hugo
WORKDIR hugo
RUN go install
WORKDIR /site
CMD [ "hugo", "server", "--buildDrafts", "--watch", "--bind=0.0.0.0"]

# END HUGO
