# Qiankun Vue Admin

## 项目介绍

Qiankun Vue Admin 是一个基于 Vue 和 Qiankun 微前端框架的管理系统。它旨在提供一个模块化、可扩展的前端解决方案，适用于中大型项目的开发。

## 功能特性

- **模块化设计**: 使用 Qiankun 实现微前端架构，支持多个子应用独立开发和部署。
- **高效开发**: 基于 Vue 框架，提供丰富的组件和工具，提升开发效率。
- **灵活配置**: 支持多种配置方式，满足不同项目需求。
- **用户管理**: 提供完善的用户权限管理功能。

## 安装与使用

### 环境要求

- Node.js >= 20.x
- pnpm

### 安装依赖

```bash
# 使用 pnpm
pnpm install

# 或者
pnpm bootstrap
```

### 启动项目

```bash
# 启动主应用框架爱
pnpm run dev

# 启动子所有子应用
pnpm run start:all

# 启动单个子应用
pnpm run start:sp
```

### 构建项目

```bash
# 构建应用
sh build_test.sh
```

## 目录结构

```plaintext
qiankun-vue-admin/
├── public/                 # 静态资源
├── packages/               # 项目分包
│   ├── api/                # 请求API
│   ├── components/         # 组件库
│   ├── core/               # 核心
│   ├── hooks/              # Hooks
│   ├── store/              # Store
│   ├── system/             # 系统应用
│   ├── types/              # 类型定义
├── projects/               # 子应用示例
├── src/                    # 主框架入口
├── package.json            # 项目信息
└── README.md               # 项目说明
```

## 贡献指南

欢迎任何形式的贡献！请确保在提交 PR 之前阅读我们的 [贡献指南](CONTRIBUTING.md)。

## 许可证

本项目基于 MIT 许可证开源，详情请参阅 [LICENSE](LICENSE) 文件。
