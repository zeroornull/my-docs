---
title: 'Nginx'
---

1、先去 [官网](http://nginx.org/en/download.html) 下载 **nginx.xxxx.pgp** 随意版本的.tar.gz软件 ;

<img class="zoom" :src="$withBase('/assets/linux_img/nginx-download.png')" alt="foo">

2、上传到linux指定位置 **/usr/local/web**  （**自己指定位置**）;

3、使用指令解压 **tar -zxvf nginx-xxxx.tar.gz** 到当前文件夹下;

4、进入解压后的nginx文件夹下：执行 ```./configure``` 初始化nginx;

5、如果执行 ```./configure``` 时报错：

* 执行命令 ```yum -y install pcre-devel ```
* 执行命令 ```yum -y install openssl openssl-devel```
* 执行命令 ```yum install gcc```
  
再次执行 ```./configure``` 在执行成功后；

6、执行 ```make``` 命令

7、执行 ```make install``` 命令

8、查看 nginx 是否安装成功 ```whereis nginx```

9、执行 ```./nginx``` 启动 nginx

10、如果启动 nginx 成功后，不能访问：将 **80** nginx默认端口添加进防火墙 ```sudo firewall-cmd --permanent --add-port=80/tcp``` ，并重启防火墙 ```sudo firewall-cmd --reload``` ；或者直接关闭 linux 防火墙，linux系统版本不同，命令不同：
* 使用firewalld（CentOS 7及以上版本）: ```sudo systemctl stop firewalld``` 或 ```sudo systemctl disable firewalld``` 
* 使用iptables（CentOS 6及以下版本）: ```sudo service iptables stop``` 或 ```sudo chkconfig iptables off```
* 使用ufw（适用于一些Ubuntu和Debian系统）: ```sudo systemctl stop ufw``` 或 ```sudo systemctl disable ufw```

11、配置nginx 全局软链接：
* 执行 ```which nginx``` 找到 nginx 可执行文件完整路径，如：```/usr/local/nginx/sbin/nginx```
* 使用 ln -s 命令创建软连接： ```sudo ln -s /.../.../sbin/nginx```  ```/usr/local/bin/nginx```
* 在非nginx文件夹下，执行 ```nginx -v```  验证软链接；