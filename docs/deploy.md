# 部署文档

## 1. 本地开发

1. 环境依赖

   - Node.js
     推荐版本至少为 v12。建议使用 NVM 安装、管理 Node.js 版本

   - Vite
     `npm i -g vite@latest`

2. 安装项目依赖

   ```sh
   # 1. clone 到本地
   git@github.com:zyuandong/lottery-web.git

   # 2. cd 进入项目目录
   cd lottery-web

   # 3. 安装依赖
   npm i
   ```

3. 启动项目

   `npm run dev`

## 2. 部署上线

推荐使用 Docker 镜像的方式部署。

Dockerfile:

```docker
FROM nginx
COPY /root/lottery-web/dist/ /usr/share/nginx/html/
COPY /root/lottery-web/nginx/default.conf /etc/nginx/conf.d/default.conf
```

Nginx default.conf 内容如下: 

```nginx
server {
  listen       80;
  server_name  localhost;

  #charset koi8-r;
  access_log  /var/log/nginx/host.access.log  main;
  error_log  /var/log/nginx/error.log  error;

  location / {
    root   /usr/share/nginx/html;
    add_header Access-Control-Allow-Origin *;
    add_header 'Access-Control-Allow-Credentials' 'true';
    add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS';
    add_header 'Access-Control-Allow-Headers' '*';
    add_header 'Access-Control-Expose-Headers' 'Content-Length,Content-Range';
    index  index.html index.htm;
    try_files $uri $uri/ @router;
  }

  location /lottery_service_api/ {
    # rewrite  /api/(.*)  /$1  break;
    proxy_pass http://47.96.178.84:3000/;
  }

  location /socket.io {
    # rewrite  /api/(.*)  /$1  break;
    proxy_pass http://47.96.178.84:3000;
  }

  location @router {
    rewrite ^(.+)$ /index.html last;
  }

  #error_page  404              /404.html;

  # redirect server error pages to the static page /50x.html
  #
  error_page   500 502 503 504  /50x.html;
  location = /50x.html {
    root   /usr/share/nginx/html;
  }
}
```

proxy_pass 为对应后端服务地址

生成镜像：

`docker build -t lottery-web .`

创建并运行容器：

```sh
docker run -d \
--name lottery-web:v1 \
-p 3001:80 \
-v /root/lottery-web/nginx:/etc/nginx/conf.d \
-v /root/lottery-web/dist:/usr/share/nginx/html \
lottery-web
```

使用命令 `docker ps` 查看正在运行中的容器：

输出的列表中出现 lottery-web:v1，即代表服务部署成功，端口为 3001
