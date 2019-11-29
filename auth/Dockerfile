FROM ruby:2.6

WORKDIR /app

COPY Gemfile* ./
RUN gem install bundler
RUN bundle install

COPY . ./

EXPOSE 3000
CMD ["rails", "server", "-b", "0.0.0.0"]