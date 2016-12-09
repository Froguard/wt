# watch12306

- 自动监视12306，当有的时候在桌面进行通知
- 可同时监视多个目标，一个json文件对应一个目标
- 配置文件为**中文**，简单易懂
- 配置文件被更改的时候**自动刷新**
- 仅仅是 ```监视```+```通知```的功能，不能使用它订票


## 使用

### 0. 下载

```bash
$ git clone git@github.com:Froguard/wt.git
```

### 1. 安装

```bash
$ npm install
```

```bash
$ npm link
```

### 2. 创建配置文件 

如 ```./targets/target1.json``` （可以创建多个*.json文件，名字随意，字段固定如下）

```json
{
  "出发时间": "2016-12-19",
  "出发站": "大连",
  "到达站": "本溪",
  "成人票": true,
  "显示票价": true,
  "仅显示高铁": false,
  "监控频率(分钟)": 1,
  "包含票种": [
    "//商务座",
    "//特等座",
    "一等座",
    "//二等座",
    "//高铁软卧",
    "//软卧",
    "//硬卧",
    "//软座",
    "//硬座",
    "//无座",
    "//其他"
  ]
}
```

> 不需要的票种，请删掉，或者注释掉即可，比如上例中，只会在 ```一等座``` 有票的时候进行通知


### 3. 开启

```bash
$ watch12306
```
or
```bash
$ watch12306 %another_directory_path_u_ve_created%
```

- 开启后放一边即可，当有票的时候，可以在桌面上通知
- **当json文件被修改的时候，watcher会自动刷新，并立即执行一次查询，不用重启本程序**

### 4. 效果

> 控制台

![cmd](https://raw.githubusercontent.com/Froguard/wt/master/img/demo.png)

> 桌面

![cmd](https://raw.githubusercontent.com/Froguard/wt/master/img/tip.png)


### 注意事项

- node版本>4.0.0
- 气泡弹窗，如果想要好看一点，建议windows用户请安装Growl程序，当然，不安装也是可以的