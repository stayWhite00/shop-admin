<p align="center">
    <img alt="logo" src="public/faviconBaiZe.ico">
</p>
<h1 align="center" style="margin: 30px 0 30px; font-weight: bold;">BaiZe-ui (RuoYi) v3.8.8</h1>
<h4 align="center">基于SpringBoot + Vue2 前后端分离的Java快速开发框架 前端页面</h4>
<p align="center">
	<a href="https://gitee.com/chaoscat/BaiZe-ui/stargazers"><img src="https://gitee.com/y_project/RuoYi-Vue/badge/star.svg?theme=dark"></a>
	<a href="https://gitee.com/chaoscat/BaiZe-ui"><img src="https://img.shields.io/badge/RuoYi-v3.8.8-brightgreen.svg"></a>
	<a href="https://gitee.com/chaoscat/BaiZe-ui/blob/master/LICENSE"><img src="https://img.shields.io/github/license/mashape/apistatus.svg"></a>
</p>

## BaiZe-ui
> **有用的话请鼓励❤️下作者，右上角☝️watch、star、fork三连点🙏🙏🙏一波**

## 平台简介

* 本仓库为前端技术栈 [Vue2](https://v2.cn.vuejs.org) + [Element Plus](https://element.eleme.io/zh-CN) + [Vue CLI](https://cli.vuejs.org/zh) 版本。
* 配套后端代码仓库地址 [BaiZe-Vue-fast](https://gitee.com/chaoscat/BaiZe-Vue-fast)  版本。


## 前端插件集成

* [文档便利店](https://gitee.com/Ning310975876/ruo-yi-vue-docHub.git)
* aj-captcha实现滑块验证码
* watermark实现页面添加水印


## 前端运行

```bash
# 克隆项目
git clone https://gitee.com/chaoscat/BaiZe-ui.git

# 进入项目目录
cd BaiZe-ui

# 安装依赖
# 建议不要直接使用 cnpm 安装依赖，会有各种诡异的 bug。可以通过如下操作解决 npm 下载速度慢的问题
npm install --registry=https://registry.npmmirror.com

# 启动服务
npm run dev

浏览器访问 http://localhost:80

## 发布 

# 构建测试环境
npm run build:stage

# 构建生产环境
npm run build:prod
```

## 内置功能

1.  用户管理：用户是系统操作者，该功能主要完成系统用户配置。
2.  部门管理：配置系统组织机构（公司、部门、小组），树结构展现支持数据权限。
3.  岗位管理：配置系统用户所属担任职务。
4.  菜单管理：配置系统菜单，操作权限，按钮权限标识等。
5.  角色管理：角色菜单权限分配、设置角色按机构进行数据范围权限划分。
6.  字典管理：对系统中经常使用的一些较为固定的数据进行维护。
7.  参数管理：对系统动态配置常用参数。
8.  通知公告：系统通知公告信息发布维护。
9.  操作日志：系统正常操作日志记录和查询；系统异常信息日志记录和查询。
10. 登录日志：系统登录日志记录查询包含登录异常。
11. 在线用户：当前系统中活跃用户状态监控。
12. 定时任务：在线（添加、修改、删除)任务调度包含执行结果日志。
13. 代码生成：前后端代码的生成（java、html、xml、sql）支持CRUD下载 。
14. 系统接口：根据业务代码自动生成相关的api接口文档。
15. 服务监控：监视当前系统CPU、内存、磁盘、堆栈等相关信息。
16. 缓存监控：对系统的缓存信息查询，命令统计等。
17. 在线构建器：拖动表单元素生成相应的HTML代码。
18. 连接池监视：监视当前系统数据库连接池状态，可进行分析SQL找出系统性能瓶颈。
19. 文档便利店：支持world、excel、markdown、画图、思维导图、流程图等多种文档类型，支持基于 Markdown 的幻灯片制作、在线代码编写。

## 在线体验

- admin/admin123   

![](src/assets/images/pay.jpg)

## 演示图

<table>
    <tr> 
        <td><img src="public/sysImg/login.jpg"/></td>
        <td><img src="public/sysImg/login-captcha.png"/></td>
    </tr>
    <tr> 
    <td><img src="public/sysImg/desktop.jpg"/></td>
    <td><img src="public/sysImg/monitoring.png"/></td>
    </tr>
    <tr> 
    <td><img src="public/sysImg/knife4j.png"/></td>
    <td><img src="public/sysImg/magicapi.png"/></td>
    </tr>
    <tr>
        <td><img src="public/sysImg/txt.jpg"/></td>
        <td><img src="public/sysImg/markdown.jpg"/></td>
    </tr>
    <tr>
        <td><img src="public/sysImg/world.jpg"/></td>
        <td><img src="public/sysImg/excel.jpg"/></td>
    </tr>
    <tr>
        <td><img src="public/sysImg/ppt.jpg"/></td>
        <td><img src="public/sysImg/img.jpg"/></td>
    </tr>
    <tr>
        <td><img src="public/sysImg/xmaind.jpg"/></td>
        <td><img src="public/sysImg/bpmn.jpg"/></td>
    </tr>
    <tr>
        <td><img src="public/sysImg/code.jpg"/></td>
        <td><img src="public/sysImg/map.jpg"/></td>
    </tr>
    <tr>
        <td><img src="public/sysImg/openai.jpg"/></td>
        <td><img src="public/sysImg/toolbox.jpg"/></td>
    </tr>
    <tr>
        <td><img src="public/sysImg/svg-edit.jpg"/></td>
        <td><img src="public/sysImg/drawio.jpg"/></td>
    </tr>
    <tr>
        <td><img src="public/sysImg/notice.png"/></td>
        <td><img src="public/sysImg/echarts.png"/></td>
    </tr>
    <tr>
        <td><img src="https://oscimg.oschina.net/oscnet/up-8074972883b5ba0622e13246738ebba237a.png"/></td>
        <td><img src="https://oscimg.oschina.net/oscnet/up-9f88719cdfca9af2e58b352a20e23d43b12.png"/></td>
    </tr>
    <tr>
        <td><img src="https://oscimg.oschina.net/oscnet/up-39bf2584ec3a529b0d5a3b70d15c9b37646.png"/></td>
        <td><img src="https://oscimg.oschina.net/oscnet/up-936ec82d1f4872e1bc980927654b6007307.png"/></td>
    </tr>
	<tr>
        <td><img src="https://oscimg.oschina.net/oscnet/up-b2d62ceb95d2dd9b3fbe157bb70d26001e9.png"/></td>
        <td><img src="https://oscimg.oschina.net/oscnet/up-d67451d308b7a79ad6819723396f7c3d77a.png"/></td>
    </tr>	 
    <tr>
        <td><img src="public/sysImg/profile.png"/></td>
        <td><img src="public/sysImg/avatar.png"/></td>
    </tr>
	<tr>
        <td><img src="https://oscimg.oschina.net/oscnet/up-8370a0d02977eebf6dbf854c8450293c937.png"/></td>
        <td><img src="https://oscimg.oschina.net/oscnet/up-49003ed83f60f633e7153609a53a2b644f7.png"/></td>
    </tr>
	<tr>
        <td><img src="https://oscimg.oschina.net/oscnet/up-d4fe726319ece268d4746602c39cffc0621.png"/></td>
        <td><img src="https://oscimg.oschina.net/oscnet/up-c195234bbcd30be6927f037a6755e6ab69c.png"/></td>
    </tr>
    <tr>
        <td><img src="https://oscimg.oschina.net/oscnet/b6115bc8c31de52951982e509930b20684a.jpg"/></td>
        <td><img src="https://oscimg.oschina.net/oscnet/up-5e4daac0bb59612c5038448acbcef235e3a.png"/></td>
    </tr>
</table>


## 若依前后端分离交流群

QQ群： [![加入QQ群](https://img.shields.io/badge/已满-937441-blue.svg)](https://jq.qq.com/?_wv=1027&k=5bVB1og) [![加入QQ群](https://img.shields.io/badge/已满-887144332-blue.svg)](https://jq.qq.com/?_wv=1027&k=5eiA4DH) [![加入QQ群](https://img.shields.io/badge/已满-180251782-blue.svg)](https://jq.qq.com/?_wv=1027&k=5AxMKlC) [![加入QQ群](https://img.shields.io/badge/已满-104180207-blue.svg)](https://jq.qq.com/?_wv=1027&k=51G72yr) [![加入QQ群](https://img.shields.io/badge/已满-186866453-blue.svg)](https://jq.qq.com/?_wv=1027&k=VvjN2nvu) [![加入QQ群](https://img.shields.io/badge/已满-201396349-blue.svg)](https://jq.qq.com/?_wv=1027&k=5vYAqA05) [![加入QQ群](https://img.shields.io/badge/已满-101456076-blue.svg)](https://jq.qq.com/?_wv=1027&k=kOIINEb5) [![加入QQ群](https://img.shields.io/badge/已满-101539465-blue.svg)](https://jq.qq.com/?_wv=1027&k=UKtX5jhs) [![加入QQ群](https://img.shields.io/badge/已满-264312783-blue.svg)](https://jq.qq.com/?_wv=1027&k=EI9an8lJ) [![加入QQ群](https://img.shields.io/badge/已满-167385320-blue.svg)](https://jq.qq.com/?_wv=1027&k=SWCtLnMz) [![加入QQ群](https://img.shields.io/badge/已满-104748341-blue.svg)](https://jq.qq.com/?_wv=1027&k=96Dkdq0k) [![加入QQ群](https://img.shields.io/badge/已满-160110482-blue.svg)](https://jq.qq.com/?_wv=1027&k=0fsNiYZt) [![加入QQ群](https://img.shields.io/badge/已满-170801498-blue.svg)](https://jq.qq.com/?_wv=1027&k=7xw4xUG1) [![加入QQ群](https://img.shields.io/badge/已满-108482800-blue.svg)](https://jq.qq.com/?_wv=1027&k=eCx8eyoJ) [![加入QQ群](https://img.shields.io/badge/已满-101046199-blue.svg)](https://jq.qq.com/?_wv=1027&k=SpyH2875) [![加入QQ群](https://img.shields.io/badge/已满-136919097-blue.svg)](https://jq.qq.com/?_wv=1027&k=tKEt51dz) [![加入QQ群](https://img.shields.io/badge/已满-143961921-blue.svg)](http://qm.qq.com/cgi-bin/qm/qr?_wv=1027&k=0vBbSb0ztbBgVtn3kJS-Q4HUNYwip89G&authKey=8irq5PhutrZmWIvsUsklBxhj57l%2F1nOZqjzigkXZVoZE451GG4JHPOqW7AW6cf0T&noverify=0&group_code=143961921) [![加入QQ群](https://img.shields.io/badge/已满-174951577-blue.svg)](http://qm.qq.com/cgi-bin/qm/qr?_wv=1027&k=ZFAPAbp09S2ltvwrJzp7wGlbopsc0rwi&authKey=HB2cxpxP2yspk%2Bo3WKTBfktRCccVkU26cgi5B16u0KcAYrVu7sBaE7XSEqmMdFQp&noverify=0&group_code=174951577) [![加入QQ群](https://img.shields.io/badge/已满-161281055-blue.svg)](http://qm.qq.com/cgi-bin/qm/qr?_wv=1027&k=Fn2aF5IHpwsy8j6VlalNJK6qbwFLFHat&authKey=uyIT%2B97x2AXj3odyXpsSpVaPMC%2Bidw0LxG5MAtEqlrcBcWJUA%2FeS43rsF1Tg7IRJ&noverify=0&group_code=161281055) [![加入QQ群](https://img.shields.io/badge/已满-138988063-blue.svg)](http://qm.qq.com/cgi-bin/qm/qr?_wv=1027&k=XIzkm_mV2xTsUtFxo63bmicYoDBA6Ifm&authKey=dDW%2F4qsmw3x9govoZY9w%2FoWAoC4wbHqGal%2BbqLzoS6VBarU8EBptIgPKN%2FviyC8j&noverify=0&group_code=138988063) [![加入QQ群](https://img.shields.io/badge/151450850-blue.svg)](http://qm.qq.com/cgi-bin/qm/qr?_wv=1027&k=DkugnCg68PevlycJSKSwjhFqfIgrWWwR&authKey=pR1Pa5lPIeGF%2FFtIk6d%2FGB5qFi0EdvyErtpQXULzo03zbhopBHLWcuqdpwY241R%2F&noverify=0&group_code=151450850) 点击按钮入群。