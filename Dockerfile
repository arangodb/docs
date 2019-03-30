FROM ubuntu:bionic

RUN apt-get update && \
    apt-get install -y ruby-full build-essential zlib1g-dev wget

RUN mkdir /root/gems

ENV GEM_HOME=/root/gems
ENV PATH="/root/gems/bin:${PATH}"

RUN gem install bundler jekyll
RUN cd tmp && \
    wget https://github.com/wjdp/htmltest/releases/download/v0.10.1/htmltest_0.10.1_linux_amd64.tar.gz && \
    tar xvzf htmltest_0.10.1_linux_amd64.tar.gz && \
    mv htmltest /usr/local/bin