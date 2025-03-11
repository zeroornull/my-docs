# 构建阶段
FROM node:lts-slim AS build
WORKDIR /app

# 安装 pnpm 并验证
RUN npm install -g pnpm@latest --no-cache && \
    pnpm --version

# 复制依赖文件
COPY package.json pnpm-lock.yaml* ./

# 安装依赖，允许缺少 pnpm-lock.yaml
RUN pnpm install

# 复制源代码并构建
COPY . .
RUN pnpm docs:build

# 运行时阶段
FROM nginx:alpine-slim AS runtime
#修改目标路径
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf 
COPY --from=build --chown=nginx:nginx /app/src/.vuepress/dist /usr/share/nginx/html
EXPOSE 80