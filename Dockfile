
# 使用官方 Node.js 运行时作为基础镜像
FROM node:14

# 设置工作目录
WORKDIR /usr/src/app

# 复制 package.json 和 package-lock.json 到工作目录
COPY package*.json ./

# 安装依赖
RUN npm install

# 复制所有应用代码到工作目录
COPY . .

# 暴露应用端口
EXPOSE 3000

# 启动应用
CMD ["npm", "start"]
