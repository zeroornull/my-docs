---
title: 'Docker'
---


## docker 安装（**centos**）


* 1、安装必要的一些系统工具： ```sudo yum install -y yum-utils device-mapper-persistent-data lvm2```
* 2、添加软件源信息： ```sudo yum-config-manager --add-repo https://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo```
* 3、更新并安装 Docker-CE： ```sudo yum makecache fast```  以及  ```sudo yum -y install docker-ce```
* 4、开启Docker服务： ```sudo systemctl enable docker && sudo systemctl start docker```


# 常用命令：
**（如果没权限，加sudo执行）** **OPTIONS是可选参数**    


## 1、列出Docker容器
列出当前正在运行的Docker容器: ```docker ps [OPTIONS]  ``` 
> -a：列出所有的容器，包括已经停止的容器;   
> -f：根据条件过滤容器。比如，docker ps -f status=exited可以列出所有已经停止的容器;   
> -n：显示最近创建的n个容器   
> -q：仅显示容器的ID   
 

## 2、拉取镜像
从Docker Registry或Docker Hub中拉取镜像：```docker pull [OPTIONS] [IMAGES]```
> --all-tags：拉取镜像的所有标签   
> --quiet, -q：只输出镜像ID   
> --disable-content-trust：禁用内容信任验证   
```
拉取官方nginx镜像：docker pull nginx 
拉取官方nginx指定版本的镜像：docker pull nginx:1.19.2  
```

## 3、列出镜像列表
列出本地主机上的Docker镜像列表: ```docker images [OPTIONS] [REPOSITORY[:TAG]]```   
> -a：列出所有镜像，包括中间层镜像   
> -q：只显示镜像ID   
> --no-trunc：显示完整的镜像ID   
> --digests：显示镜像的摘要信息   
> --format：指定输出的格式   
> --filter：根据条件过滤镜像   
```
列出本地主机上的所有镜像：docker images  
列出指定仓库的镜像：docker images ubuntu     
列出指定标签的镜像：docker images ubuntu:18.04  
列出所有镜像的ID：docker images -q   
列出所有镜像的完整ID：docker images -q --no-trunc   
列出所有镜像的摘要信息：docker images --digests   
根据条件过滤镜像：docker images --filter "dangling=true"   
```

## 4、运行程序或服务
运行一个新的应用程序或服务: ```docker run [OPTIONS] IMAGE [COMMAND] [ARG...]```   
> -d：在后台运行容器   
> -p：将容器内部端口映射到主机端口   
> -v：将主机目录或文件挂载到容器内部  
> --name：为容器指定一个名称   
> --rm：容器停止后自动删除   
> --env：设置容器内部的环境变量    
> --network：指定容器所在的网络   
> --restart：容器停止后自动重启   
> --e：设置容器环境变量    
```
运行一个名为“myapp”的容器，将容器内部的端口80映射到主机的端口8080，并将主机的目录“/app”挂载到容器内部的“/usr/src/myapp”目录:    
docker run -d -p 8080:80 -v /app:/usr/src/myapp --name myapp nginx   
```

## 5、启动容器
启动已经停止的容器: ```docker start [OPTIONS] CONTAINER [CONTAINER...]```   
> -a, --attach：附加到容器的标准输入、输出和错误输出   
> -i, --interactive：启用容器的标准输入，通常与 -a 一起使用   
> -d, --detach：在后台运行容器   
> -p, --publish：将容器内部端口映射到主机端口   
> -P, --publish-all：将所有容器内部暴露的端口映射到主机端口   
```
启动名为 mycontainer 的容器并附加到标准输入输出：docker start -ai mycontainer
```

## 6、重启容器
用于重新启动一个或多个已经停止的容器: docker restart [OPTIONS] CONTAINER [CONTAINER...]   
> -t, --time：等待超时时间，单位为秒   
```
重新启动名为container1的容器：docker restart container1  
```

## 7、显示守护程序的系统信息
docker info命令用于显示有关Docker守护程序的系统信息，包括Docker版本、操作系统类型和版本、CPU和内存使用情况、镜像和容器数量等   
```docker info```


## 8、查看日志   
docker logs命令用于查看Docker容器的日志。它可以显示容器的标准输出和标准错误输出。docker logs命令的语法如下   
```docker logs [OPTIONS] CONTAINER```
> -f：实时跟踪容器日志输出   
> --since：仅显示指定时间之后的日志   
> --tail：仅显示最后几行日志，默认为所有日志   
```
要查看名为“mycontainer”的容器的日志: docker logs mycontainer   
要实时跟踪容器的日志输出: docker logs -f mycontainer
要仅显示最后10行日志: docker logs --tail 10 mycontainer   
要仅显示从指定时间之后的日志:docker logs --since 2021-01-01 mycontainer   
```
**需要注意的是，docker logs命令只能查看正在运行的容器的日志。如果要查看已停止的容器的日志，可以使用docker container logs命令**


## 9、删除容器 
删除容器: ```docker rm [OPTIONS] CONTAINER [CONTAINER...]```  
> -f：强制删除正在运行的容器   
> -v：删除容器关联的数据卷   
```
删除名为 my-container 的容器：docker rm my-container  
删除所有已停止的容器：docker rm $(docker ps -a -q)  
强制删除正在运行的容器：docker rm -f my-container
```


## 10、删除镜像
删除本地的一个或多个镜像:```docker rmi [OPTIONS] IMAGE [IMAGE...]```   
> -f, --force：强制删除镜像，即使有容器正在使用它   
> -no-prune：不删除镜像的中间层（即镜像的每一层），这些中间层可能被其他镜像所共享   
```
要删除名为 **myimage** 的镜像: docker rmi myimage   
要删除多个镜像: docker rmi myimage1 myimage2 myimage3
强制删除正在运行中的容器所使用的镜像: docker rmi -f myimage 
```

## 11、在Docker容器中执行命令
在正在运行的Docker容器中执行命令: ```docker exec [OPTIONS] CONTAINER COMMAND [ARG...]```   
**OPTIONS为可选项，CONTAINER为容器名称或ID，COMMAND为要执行的命令，ARG为命令的参数。**

> -i：以交互模式运行命令   
> -t：为命令分配一个伪终端   
> -d：在后台运行命令   
> --user：指定要执行命令的用户   
> --workdir：指定执行命令时的工作目录   
```
要在名为mycontainer的容器中运行一个bash shell: docker exec -it mycontainer bash   
```


## 12、查看实时资源使用情况
查看Docker容器的实时资源使用情况，包括CPU、内存、网络和磁盘等方面的数据，可以帮助用户监控和优化容器的性能:   
```docker stats [OPTIONS] [CONTAINER...]```   
> --all或-a：显示所有容器的统计信息，包括停止的容器   
> --format：指定输出格式，支持Go模板语法   
> --no-stream或-n：只显示一次容器的统计信息，不进行实时监控   
> --no-trunc：不截断输出的容器名称   
```
查看所有容器的实时资源使用情况：docker stats --all
查看指定容器的实时资源使用情况：docker stats container1 container2
指定输出格式为JSON：docker stats --format '{{json .}}' container1
只显示一次容器的统计信息：docker stats --no-stream container1 
```

## 13、保存镜像
将Docker镜像保存成tar包文件: ```docker save [OPTIONS] IMAGE [IMAGE...]```    
> -o, --output：指定输出文件名   
> --quiet, -q：只输出镜像ID   
```
将名为myimage的镜像保存为myimage.tar文件：docker save -o myimage.tar myimage
```

## 14、加载镜像到Docker引擎中
将本地文件系统中的Docker镜像加载到Docker引擎中。这些镜像可以是通过docker save命令保存的.tar文件，也可以是通过其他方式获得的Docker镜像文件   
```docker load [OPTIONS] < FILE```   
> -i：从标准输入中读取镜像文件，可以省略不写   
> -q：省略镜像加载过程中的详细输出   
> --input/-i：从指定文件中读取镜像文件   
> --quiet/-q：仅输出加载的镜像ID   
```
从myimage.tar文件中加载镜像到Docker引擎中: docker load -i myimage.tar  
```

## 15、导出到本地文件
将Docker容器的文件系统导出到本地文件系统中的tar归档文件中: ```docker export [OPTIONS] CONTAINER```   

> -o, --output：将导出的内容写入指定的文件中   
> -h, --help：显示帮助信息   
```
将名为my_container的容器的文件系统导出到当前目录下的my_container.tar文件中: docker export my_container > my_container.tar
将名为my_container的容器的文件系统导出到指定目录下的my_container.tar文件中: docker export -o /path/to/my_container.tar my_container 
```

## 16、打包镜像
将本地文件或者目录打包成镜像，可以用于创建一个新的镜像或者将现有的镜像导入到Docker Registry：```docker import [OPTIONS] file|URL|- [REPOSITORY[:TAG]]```   
> --change=[]：可以指定在导入过程中对镜像进行修改的命令，例如添加新的标签、设置镜像的元数据等   
> --message=""：指定镜像的描述信息   
> --platform=""：指定镜像的平台，例如linux/amd64   
> --quiet：不输出导入过程中的详细信息   
```
将本地文件打包成镜像：docker import /path/to/local/file myimage:tag   
将远程URL打包成镜像：docker import https://example.com/myimage.tar.gz myimage:tag   
将标准输入数据打包成镜像：cat /path/to/local/file | docker import - myimage:tag   
```

## 17、查看Docker详细信息
查看Docker对象的详细信息，包括容器、镜像、网络、卷和服务等。使用该命令可以获取对象的各种属性和配置信息，例如IP地址、端口映射、环境变量、挂载点等。该命令的语法如下：   
```docker inspect [OPTIONS] CONTAINER|IMAGE|NETWORK|VOLUME|SERVICE```   

> -f：指定输出格式   
> -s：显示对象的大小信息   
> --type：指定要查看的对象类型   
> --format：指定输出格式   
```
查看名为my_container的容器的详细信息，可以使用以下命令：```docker inspect my_container```   
将输出包含my_container容器详细信息的JSON格式数据。如果要查看指定对象的某些属性，可以使用-f选项指定输出格式:  
docker inspect -f '{{.NetworkSettings.IPAddress}}' my_container
```


## 18、复制文件到主机或容器内
将容器内的文件或目录复制到主机上：```docker cp [OPTIONS] CONTAINER:SRC_PATH DEST_PATH|-```   
将主机上的文件或目录复制到容器内：```docker cp [OPTIONS] SRC_PATH|- CONTAINER:DEST_PATH```   

> -a：将复制的文件或目录的权限、时间戳等信息一并复制过去   
> --follow-link：如果复制的是符号链接，会复制链接指向的文件而不是链接本身   
> --no-preserve=mode：不保留文件的权限   
> --no-preserve=timestamps：不保留文件的时间戳   
```
将容器内的文件复制到主机上：docker cp mycontainer:/app/logs/access.log /tmp   
将主机上的文件复制到容器内：docker cp /tmp/access.log mycontainer:/app/logs/
```

## 19、管理Docker容器的数据卷
管理Docker容器的数据卷。它可以用来创建、列出、删除和查看数据卷:
创建一个数据卷：```docker volume create <volume-name>```   
列出所有数据卷：```docker volume ls```   
查看数据卷的详细信息：```docker volume inspect <volume-name>```   
删除一个数据卷：```docker volume rm <volume-name>```   
删除所有未被使用的数据卷：```docker volume prune```   
将数据卷挂载到容器中：   
```docker run -v <volume-name>:<container-path> <image-name>```  **如：**  ```docker run -v mydata:/data myimage```   
**其中，\<volume-name>是数据卷的名称，\<container-path>是容器中挂载数据卷的路径，\<image-name>是镜像名称**

将数据卷从容器中移除：```docker container rm -v \<container-name>```   


## 20、多种网络模式
docker提供了多种网络模式，其中包括桥接网络、主机网络、覆盖网络等。docker网络命令可用于管理这些网络   
```
列出所有Docker网络: docker network ls   
创建一个新的Docker网络: docker network create my-network   
将容器连接到指定的Docker网络:docker network connect my-network my-container   
将容器从指定的Docker网络中断开连接: docker network disconnect my-network my-container   
查看指定的Docker网络的详细信息: docker network inspect my-network   
删除指定的Docker网络:docker network rm my-network   
```

## 21、构建镜像
构建Docker镜像: ```docker build [OPTIONS] PATH | URL | -```   
> -t：指定构建出的镜像的名称及标签   
> --no-cache：不使用缓存来构建镜像   
> --build-arg：设置Dockerfile中的ARG变量的值   
> --network：指定构建过程中使用的网络   
> --progress：指定构建过程中的输出格式   
```
从本地Dockerfile构建镜像：docker build -t myimage:1.0 . 
从远程Dockerfile构建镜像：docker build -t myimage:1.0 https://github.com/myuser/myrepo.git####  
使用–build-arg设置Dockerfile中的ARG变量的值: docker build --build-arg MYVAR=myvalue -t myimage:1.0 .  
```

## 22、在运行的容器中执行命令
在运行中的Docker容器中执行命令:```docker exec [OPTIONS] CONTAINER COMMAND [ARG…]```   

> -i：以交互模式运行容器   
> -t：为容器分配一个伪终端   
> -d：在后台运行容器   
> -u：指定执行命令的用户   
> -e：设置环境变量   
```
在容器中执行命令：docker exec -it mycontainer bash  
在容器中执行命令并指定用户：docker exec -u user mycontainer name
```


## 23、Dockerfile 配置文件构建
```
# 使用官方的Nginx基础镜像
FROM nginx:latest

# 将dist文件夹下的内容复制到Nginx的默认静态文件目录
COPY dist/ /usr/share/nginx/html/

# 可选：如果需要自定义Nginx配置，将自定义配置复制到Nginx配置目录
# COPY nginx-custom.conf /etc/nginx/conf.d/default.conf

# 暴露Nginx的默认端口（80）
EXPOSE 80

# 启动Nginx服务
CMD ["nginx", "-g", "daemon off;"]
```
执行构建构建：```docker build -t my-nginx-image .```   
执行启动： ```docker run -d -p 8080:80 -v /path/to/local:/usr/src/app --name my-nginx-container my-nginx-image```  
> -d 容器后台（detached）静默启动   
> -v 本地文件和容器文件路径映射共享：**/本地路径:/容器路径**   
> -p 定义本地服务器端口8080，映射容器内部默认端口80   

