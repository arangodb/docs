#ArangoStub
FROM openjdk:16-slim-buster AS arangostub

RUN apt-get update; apt-get install -y curl \
    && curl -sL https://deb.nodesource.com/setup_16.x | bash - \
    && apt-get install -y nodejs \
    && curl -L https://www.npmjs.com/install.sh | sh 

RUN
WORKDIR /home/openapi

RUN npx @openapitools/openapi-generator-cli generate -i api-docs.json -g nodejs-express-server -o arangostub

#Arangoproxy
FROM golang:latest AS arangoproxy

RUN wget https://download.arangodb.com/arangodb310/Community/Linux/arangodb3-client_3.10.1-1_amd64.deb
RUN apt-get update
RUN apt-get install -y ./arangodb3*.deb

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
CMD [ "hugo", "serve", "--buildDrafts", "--watch", "--bind=0.0.0.0"]

# END HUGO



# ARANGO MAINTAINER MODE
FROM ubuntu:latest AS arango_maintainer


RUN apt-get update
RUN apt-get install -y aptitude
RUN aptitude -y update

RUN aptitude -y install git-core build-essential libssl-dev libjemalloc-dev cmake python3

RUN git clone $ARANGO_BRANCH --single-branch --depth 1 https://github.com/arangodb/arangodb.git

WORKDIR arangodb
RUN mkdir build
WORKDIR build
RUN cmake ..
RUN make
