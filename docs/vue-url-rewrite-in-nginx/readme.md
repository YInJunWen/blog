<!-- Date: 2017-05-08 08:32 -->

# vue 路由 history 模式时，如何在 nginx 上配置重定向

> 本博客使用 vue 改版的时候，使用了 H5 的 history API，存在这么一个问题:

打得首页 chinaliyun.cn 正常

点击查看一篇文章详情 正常

刷新页面 404

这是为什么呢？ 就是因为服务器把当前的访问地址`/home/article/id`当成文件路径，这时候就需要使用服务器配置重定向规则，我用的是 nginx 服务器，以下两种配置方案都可以实现

## 第一种

该方法告诉 nginx 服务器，当碰到`/`开头的请求时，按照 try_files 的内容，尝试查找对应的文件或目录，如果是一个文件，则返回文件，如果不是文件则直接返回最后的`index.html`

```
server {
    listen       80;
    server_name  localhost;

    #charset koi8-r;
    #access_log  /var/log/nginx/host.access.log  main;

    location / {
        root   /opt/www/blog-vue2;
        index  index.html;
        try_files $uri $uri/ /index.html;
    }
}
```

## 第二种

该方法告诉 nginx 服务，如果当前的 url 不是指向一个文件或目录资源的时候，把页面重定向到`index.html`文件中

```
server {
    listen       80;
    server_name  localhost;

    #charset koi8-r;
    #access_log  /var/log/nginx/host.access.log  main;

    location / {
        root   /opt/www/blog-vue2;
        index  index.html;
        if (!-e $request_filename){
           rewrite ^(.*)$ /index.html last;
           break;
        }
    }
}
```
