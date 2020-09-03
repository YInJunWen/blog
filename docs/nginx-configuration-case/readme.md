<!-- Date: 2016-07-04 18:31 -->

# nginx 本博客下的 nginx 配置

> 这里记录一下本博客使用 vue 改版后的 nginx 服务器配置

## 针对`chinaliyun.cn www.chinaliyun.cn`的重定向

```
server {
    listen  80;
    server_name chinaliyun.cn www.chinaliyun.cn;
    rewrite ^(.*)$  http://vue2.chinaliyun.cn;
}
```

## 针对 vue 版本使用 history 模式路由的重定向

```
server {
    listen 80;
    server_name vue2.chinaliyun.cn;

    location / {
        root /opt/www/blog-vue2/dist;
        try_files $uri $uri/ /index.html;
    }
}
```

## 针对 angularJS 博客用的是传统的 Hash 模式路由，不需要做重定向

```
server {
    listen 80;
    server_name ng1.chinaliyun.cn;

    location / {
        root /opt/www/blog-ng1/dist;
        index index.html;
    }
}
```

## 接口文档的设置

```
server {
    listen      80;
    server_name www.codequan.com;
    root /opt/www/blog-api-ci;
    charset utf-8;

    location / {
        index  index.php;
        if (!-e $request_filename) {
            rewrite  ^(.*)$  /index.php$1 last;
            break;
        }
    }

    location ~ \.php {
        root           /opt/www/blog-api-ci;
        include        /usr/local/nginx/fastcgi.conf;
        fastcgi_pass   127.0.0.1:9200;
        fastcgi_index  index.php;
        fastcgi_param  SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include        fastcgi_params;
    }

}
```
