---
layout: page
title: Getting Started
permalink: /getting-started/
---

# Getting Started with Peers Touch

This guide will help you set up and start using Peers Touch in your project.

## Prerequisites

Before you begin, ensure you have:

- Node.js 14 or higher
- npm or yarn package manager
- Basic knowledge of JavaScript

## Installation

### Using npm

```bash
npm install peers-touch
```

### Using yarn

```bash
yarn add peers-touch
```

### CDN

```html
<script src="https://cdn.jsdelivr.net/npm/peers-touch@latest/dist/peers-touch.min.js"></script>
```

## Quick Setup

### 1. Basic Configuration

```javascript
import PeersTouch from 'peers-touch';

const peers = new PeersTouch({
  endpoint: 'https://api.yourdomain.com',
  apiKey: 'your-api-key-here',
  options: {
    reconnect: true,
    maxRetries: 3
  }
});
```

### 2. Connect to Service

```javascript
async function init() {
  try {
    await peers.connect();
    console.log('Successfully connected to Peers Touch!');
  } catch (error) {
    console.error('Connection failed:', error);
  }
}

init();
```

### 3. Join a Room

```javascript
peers.joinRoom('general-chat')
  .then(room => {
    console.log('Joined room:', room.id);
  })
  .catch(err => {
    console.error('Failed to join room:', err);
  });
```

## Basic Usage Examples

### Sending Messages

```javascript
peers.sendMessage({
  type: 'text',
  content: 'Hello, world!',
  roomId: 'general-chat'
});
```

### Receiving Messages

```javascript
peers.on('message', (message) => {
  console.log('New message:', message);
  // Display message in your UI
});
```

### Handling User Events

```javascript
peers.on('userJoined', (user) => {
  console.log(`${user.name} joined the room`);
});

peers.on('userLeft', (user) => {
  console.log(`${user.name} left the room`);
});
```

## Troubleshooting

### Common Issues

1. **Connection Failed**
   - Check your API key and endpoint
   - Verify network connectivity
   - Check browser console for errors

2. **Messages Not Sending**
   - Ensure you're connected to a room
   - Check message format
   - Verify room permissions

3. **Real-time Updates Not Working**
   - Check WebSocket support
   - Verify room subscription
   - Check for firewall issues

### Debug Mode

Enable debug mode for detailed logging:

```javascript
const peers = new PeersTouch({
  endpoint: 'https://api.yourdomain.com',
  apiKey: 'your-api-key',
  debug: true
});
```

## Next Steps

- Explore the [Demo Page](/demo/) for interactive examples
- Read the [API Documentation](/docs/api/) for complete reference
- Check out [Code Examples](/docs/examples/) for more use cases