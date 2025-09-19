#!/bin/bash

echo "🔧 Zustand State Monitor - 开发环境启动"
echo "=================================="

# 检查是否已安装依赖
if [ ! -d "dev/node_modules" ]; then
    echo "📦 安装开发环境依赖..."
    npm run setup:dev
fi

echo "🚀 启动开发服务器..."
echo "🌐 访问地址: http://localhost:3000"
echo "💡 修改 src/ 目录下的文件即可实时预览效果"
echo "🔍 StateMonitorDevTools 将始终显示在页面中"
echo ""

# 启动开发服务器
npm run dev:playground