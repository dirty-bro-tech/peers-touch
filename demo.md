---
layout: page
title: Demo
permalink: /demo/
---

# Interactive Demo

Welcome to the Peers Touch interactive demo! This page showcases the key features and capabilities.

## Live Examples

### Example 1: Basic Usage

```javascript
// Basic Peers Touch integration
const peers = new PeersTouch({
  endpoint: 'https://api.example.com',
  apiKey: 'your-api-key'
});

peers.connect()
  .then(() => console.log('Connected!'))
  .catch(err => console.error('Connection failed:', err));
```

### Example 2: Real-time Updates

```javascript
// Subscribe to real-time updates
peers.subscribe('room-123', {
  onMessage: (message) => {
    console.log('New message:', message);
  },
  onUserJoin: (user) => {
    console.log('User joined:', user.name);
  }
});
```

## Interactive Features

### Feature Showcase

- **Real-time Communication**: Instant messaging and updates
- **Multi-user Support**: Handle multiple users in a room
- **WebSocket Integration**: Persistent connection management
- **Error Handling**: Robust error handling and recovery

### Try It Out

1. Open your browser's developer console
2. Copy and paste the examples above
3. Modify the parameters to see how it works

## API Reference

| Method | Description | Parameters |
|--------|-------------|------------|
| `connect()` | Establish connection | `config: object` |
| `subscribe()` | Subscribe to updates | `roomId: string, callbacks: object` |
| `send()` | Send message | `message: object` |
| `disconnect()` | Close connection | - |

## Next Steps

- Check out the [Getting Started Guide](/getting-started/)
- Explore the [API Documentation](/docs/api/)
- View [Code Examples](/docs/examples/)