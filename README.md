# Peers Touch Documentation

Welcome to the **Peers Touch** project documentation repository! This repository contains design specifications, technical documentation, and guides for the Peers Touch peer-to-peer communication platform.

## Project Overview

Peers Touch is a comprehensive peer-to-peer communication technology stack with implementations for mobile, web, backend, and desktop platforms. It enables secure, direct communication between devices without relying on central servers for message routing.

## Key Components

- **Design Documentation**: Specifications and design guidelines
- **Technical Reference**: Architecture, protocols, and APIs
- **Examples**: Code samples and integration guides
- **Product Features**: Capabilities and use cases

## Quick Start

To run this documentation site locally, please use Docker to avoid installing dependencies on your host machine.

### Prerequisites
- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Running the Site with Docker

#### Using Docker Compose (Recommended)

```bash
# From the repository root
cd peers-touch

docker compose up
```

The site will be available at [http://localhost:4000](http://localhost:4000).

#### Using Docker Directly

```bash
# Build the Docker image
cd peers-touch
docker build -t peers-touch-docs .

# Run the container
docker run -p 4000:4000 -v $(pwd):/app peers-touch-docs
```

## Important Workflow Rules

> **Note**: All Jekyll, Bundle, and other Ruby-based operations **MUST** be performed through Docker containers. Do not install these dependencies directly on your host machine.

For detailed instructions on how to run, build, and develop this site using Docker, please refer to the [Docker Workflow Guide](how_this_site_to_run_on_docker.md).

## Documentation Structure

- **[Getting Started](getting-started.md)**: Quick start guide for the documentation site
- **[Project Overview](docs/overview/)**: High-level information about Peers Touch
- **[Technical Documentation](docs/technical/)**: Detailed architecture and implementation details
- **[Product Features](docs/product/)**: Capabilities and use case scenarios
- **[Examples](docs/examples/)**: Code samples and integration guides

## Development Guidelines

### Working with the Documentation

To modify and contribute to the documentation:

1. Make changes to the source files
2. Docker will automatically detect changes and regenerate the site
3. View your changes at [http://localhost:4000](http://localhost:4000)

For more advanced development workflows, please refer to the [Docker Workflow Guide](how_this_site_to_run_on_docker.md).

## Multi-language Support

This documentation site supports multiple languages, currently including:
- English
- Chinese

You can switch languages using the language selector in the navigation bar.

## Contribution Guidelines

We welcome contributions to improve the documentation! Please follow these steps:

1. Fork the repository
2. Make your changes
3. Test your changes using Docker
4. Submit a pull request

## License

[Add license information here]

## Contact

For questions or support, please [contact us].

---

**Last Updated**: May 2024