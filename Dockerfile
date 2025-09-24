FROM ruby:3.1-alpine

# Install dependencies
RUN apk add --no-cache \
    build-base \
    git \
    nodejs \
    npm

# Set working directory
WORKDIR /site

# Copy Gemfile and install gems
COPY Gemfile* ./
RUN bundle install

# Expose port 4000 for Jekyll server
EXPOSE 4000

# Default command
CMD ["bundle", "exec", "jekyll", "serve", "--host", "0.0.0.0", "--port", "4000", "--livereload"]