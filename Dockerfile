FROM ubuntu:bionic

RUN apt-get update && \
    apt-get install -y ruby-full build-essential zlib1g-dev wget python2.7 libpython2.7

RUN mkdir /root/gems

ENV GEM_HOME=/root/gems
ENV PATH="/root/gems/bin:${PATH}"
# python md script needs that :S
ENV LC_ALL=C.UTF-8

RUN gem install bundler jekyll
RUN cd tmp && \
    wget https://github.com/wjdp/htmltest/releases/download/v0.10.1/htmltest_0.10.1_linux_amd64.tar.gz && \
    tar xvzf htmltest_0.10.1_linux_amd64.tar.gz && \
    mv htmltest /usr/local/bin