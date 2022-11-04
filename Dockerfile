FROM ruby:2.6.10-buster

RUN cd /tmp && \
    wget --no-verbose https://github.com/wjdp/htmltest/releases/download/v0.16.0/htmltest_0.16.0_linux_amd64.tar.gz && \
    tar xvzf htmltest_0.16.0_linux_amd64.tar.gz && \
    mv htmltest /usr/local/bin

RUN mkdir /root/gems

ENV GEM_HOME=/root/gems
ENV PATH="/root/gems/bin:${PATH}"
# python md script needs that :S
ENV LC_ALL=C.UTF-8

RUN gem install bundler:2.3.25

VOLUME /docs
WORKDIR /docs
COPY Gemfile /docs
COPY Gemfile.lock /docs

RUN bundler install

EXPOSE 4000

CMD ["bundler", "exec", "jekyll", "serve", "-H", "0.0.0.0", "--incremental", "--trace"]
