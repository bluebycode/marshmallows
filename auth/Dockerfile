FROM ruby:2.6

WORKDIR /app

COPY Gemfile* ./
RUN gem install bundler
RUN bundle install

ENV RAILS_ENV production
COPY . ./
