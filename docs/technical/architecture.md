---
layout: page
title: 系统架构
title: 系统架构
parent: 技术文档
nav_order: 1
---

# 系统架构设计

## 整体架构

Peers Touch 采用微服务架构设计，包含以下核心组件：

### 核心服务

#### 1. 网关服务 (Gateway Service)
- **作用**: 统一入口，路由分发
- **技术**: Nginx + Node.js
- **功能**: 
  - 负载均衡
  - 请求路由
  - 限流控制
  - SSL终端

#### 2. 实时通信服务 (Real-time Service)
- **作用**: WebSocket连接管理
- **技术**: Socket.IO + Redis
- **功能**:
  - 连接池管理
  - 消息广播
  - 房间管理
  - 心跳检测

#### 3. 消息服务 (Message Service)
- **作用**: 消息存储与分发
- **技术**: PostgreSQL + RabbitMQ
- **功能**:
  - 消息持久化
  - 消息队列
  - 离线消息
  - 消息重试

### 数据流架构

```
Client → Gateway → Real-time Service → Message Service → Storage
   ↑         ↓            ↓                ↓              ↓
   ←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←←
```

### 技术栈

| 层级 | 技术 | 用途 |
|------|------|------|
| 前端 | React + TypeScript | 用户界面 |
| 后端 | Node.js + Express | API服务 |
| 实时 | Socket.IO | WebSocket通信 |
| 缓存 | Redis | 会话存储 |
| 数据库 | PostgreSQL | 数据持久化 |
| 消息队列 | RabbitMQ | 异步处理 |
| 容器 | Docker | 服务部署 |

### 扩展性设计

#### 水平扩展
- 无状态服务设计
- 负载均衡支持
- 数据库分片
- Redis集群

#### 高可用
- 服务冗余部署
- 数据库主从复制
- 自动故障转移
- 健康检查

### 安全架构

#### 认证授权
- JWT Token认证
- OAuth 2.0集成
- 角色权限控制
- API限流

#### 数据安全
- 传输加密 (HTTPS/TLS)
- 数据脱敏
- 审计日志
- 备份策略