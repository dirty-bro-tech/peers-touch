# How to Run This Site on Docker

This document provides comprehensive instructions for running the Peers Touch Jekyll documentation site using Docker. We provide two methods: Docker Compose (recommended) and standalone Docker.

> **Note**: This documentation uses Docker Compose V2 syntax (`docker compose`) which is the modern standard. If you're using an older version of Docker, you may need to use the legacy `docker-compose` command instead.

## Prerequisites

- Docker Desktop installed and running
- Git (for cloning the repository)
- Basic familiarity with command line/terminal

## Method 1: Docker Compose (Recommended)

### Quick Start

1. **Clone the repository** (if not already done):
   ```bash
   git clone <repository-url>
   cd peers-touch
   ```

2. **Start the Jekyll site**:
   ```bash
   docker compose up
   ```

3. **Access the site**:
   Open your browser and navigate to: `http://localhost:4000`

### Docker Compose Configuration

The `docker-compose.yml` file is configured with:

```yaml
services:
  jekyll:
    image: jekyll/jekyll:latest
    ports:
      - "4000:4000"
    volumes:
      - .:/srv/jekyll
    command: sh -c "bundle install && jekyll serve --watch --drafts --force_polling --host 0.0.0.0 --port 4000"
```

**Key features:**
- **Auto-reload**: Changes to files are automatically detected and the site rebuilds
- **Draft support**: Draft posts are included in the build
- **Volume mounting**: Your local files are mounted into the container
- **Port mapping**: Container port 4000 is mapped to host port 4000

### Common Docker Compose Commands

```bash
# Start the site (detached mode)
docker compose up -d

# View logs
docker compose logs -f

# Stop the site
docker compose down

# Rebuild and start (useful after Gemfile changes)
docker compose up --build

# Access the container shell
docker compose exec jekyll sh
```

## Method 2: Standalone Docker

### Building the Image

1. **Build the Docker image**:
   ```bash
   docker build -t peers-touch-jekyll .
   ```

2. **Run the container**:
   ```bash
   docker run -p 4000:4000 -v $(pwd):/site peers-touch-jekyll
   ```

### Dockerfile Configuration

The `Dockerfile` uses:
- **Base image**: `ruby:3.1-alpine` (lightweight Alpine Linux with Ruby)
- **Dependencies**: Build tools, Git, Node.js, and npm
- **Port**: Exposes port 4000
- **Features**: Includes live reload functionality

## Development Workflow

### Making Changes

1. **Edit files** in your local directory
2. **Save changes** - the site will automatically rebuild (watch mode)
3. **Refresh browser** to see changes
4. **Check logs** if there are build errors:
   ```bash
   docker compose logs -f jekyll
   ```

### Adding New Dependencies

If you need to add new gems to `Gemfile`:

1. **Edit the Gemfile** locally
2. **Rebuild the container**:
   ```bash
   docker compose down
   docker compose up --build
   ```

### Working with Drafts

Draft posts in the `_drafts` folder are automatically included. To exclude drafts:

1. **Modify docker-compose.yml** and remove `--drafts` flag
2. **Restart the container**:
   ```bash
   docker compose restart
   ```

## Troubleshooting

### Common Issues

**Port already in use:**
```bash
# Check what's using port 4000
netstat -tulpn | grep 4000

# Use a different port
docker compose run -p 4001:4000 jekyll
```

**Permission issues (Linux/macOS):**
```bash
# Fix file permissions
sudo chown -R $USER:$USER .
```

**Bundle install fails:**
```bash
# Clear bundle cache and rebuild
docker compose down
docker compose up --build --force-recreate
```

**Site not updating:**
```bash
# Force rebuild
docker compose exec jekyll bundle exec jekyll clean
docker compose restart
```

### Viewing Logs

```bash
# View all logs
docker compose logs

# Follow logs in real-time
docker compose logs -f

# View specific service logs
docker compose logs jekyll
```

### Container Management

```bash
# List running containers
docker ps

# Stop all containers
docker compose down

# Remove containers and volumes
docker compose down -v

# Rebuild from scratch
docker compose build --no-cache
```

## Performance Optimization

### For Windows Users

The configuration includes `--force_polling` for better file watching on Windows. If you experience slow performance:

1. **Enable WSL 2** for Docker Desktop
2. **Move project to WSL filesystem** for better performance
3. **Adjust polling interval** in `_config.yml`:
   ```yaml
   # _config.yml
   livereload_port: 35729
   ```

### For Large Sites

If the site is large and builds slowly:

1. **Exclude unnecessary files** in `_config.yml`:
   ```yaml
   exclude:
     - node_modules/
     - vendor/
     - .git/
   ```

2. **Use incremental builds**:
   ```yaml
   incremental: true
   ```

## Production Deployment

For production deployment, create a separate `docker-compose.prod.yml`:

```yaml
services:
  jekyll:
    build: .
    ports:
      - "80:4000"
    environment:
      - JEKYLL_ENV=production
    command: bundle exec jekyll serve --host 0.0.0.0 --port 4000
```

Run with:
```bash
docker compose -f docker-compose.prod.yml up -d
```

## Environment Variables

You can customize the Jekyll environment:

```bash
# Set environment variables
export JEKYLL_ENV=development
docker compose up
```

Or in `docker-compose.yml`:
```yaml
services:
  jekyll:
    environment:
      - JEKYLL_ENV=production
      - BUNDLE_PATH=/usr/local/bundle
```

## Security Considerations

- **Don't expose port 4000** in production without proper security
- **Use specific image tags** instead of `latest` for production
- **Regularly update base images** for security patches
- **Scan images for vulnerabilities**:
  ```bash
  docker scan peers-touch-jekyll
  ```

## Additional Resources

- [Jekyll Documentation](https://jekyllrb.com/docs/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Jekyll Docker Image](https://hub.docker.com/r/jekyll/jekyll/)

## Support

If you encounter issues:

1. **Check the logs** first: `docker compose logs -f`
2. **Verify Docker is running**: `docker --version`
3. **Check port availability**: `netstat -tulpn | grep 4000`
4. **Try rebuilding**: `docker compose up --build`

For project-specific issues, refer to the main project documentation or create an issue in the repository.