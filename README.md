# watch12306

## usage

### 0. download

```bash
$ git clone git@github.com:Froguard/wt.git
```

### 1. install

```bash
$ npm link
```

### 2. create config file 

create ```./targets/target1.json``` (or u can create more than one json file)

```json
{
  "出发时间": "2016-12-19",
  "出发站": "大连",
  "到达站": "本溪",
  "成人票": true,
  "显示票价": true,
  "仅显示高铁": false,
  "监控频率(分钟)": 3
}
```

### 3. start

```bash
$ watch12306
```
or
```bash
$ watch12306 %another_directory_path_u_ve_created%
```

### 4. result

> in command line

![cmd](https://raw.githubusercontent.com/Froguard/wt/master/img/demo.png)

> in desktop

![cmd](https://raw.githubusercontent.com/Froguard/wt/master/img/tip.png)