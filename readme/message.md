# axios 请求篇

## 说明

- 已封装部分方法至[shuwa_message](../src/utils/shuwa_message.js)
- 以下方法可在 vue 中直接调用

### 数蛙全局通用消息提示 message

- [参考文档 message](https://element.eleme.cn/#/zh-CN/component/message)

- 使用方式

  1. 使用方式 1

  ```javascript
  const msg = { message: 'Switch Language Success', // 消息提示文字 type:
  'success', // 主题 默认warn duration: 1000, // 显示时间, 毫秒。设为 0
  则不会自动关闭 默认800 showClose:true, // 是否显示关闭按钮 默认为true }
  this.$message(msg)
  ```

  2. 使用方式 2

  ```javascript
  this.$message("you message");
  ```

### 数蛙全局加载层 baseLoading

- [参考文档 loading](https://element.eleme.cn/#/zh-CN/component/loading)
- 使用方式

```javascript
this.$baseLoading(0, "正在切换账号请稍后...");
```

### 数蛙全局多彩加载层 baseColorfullLoading

- [参考文档 loading](https://element.eleme.cn/#/zh-CN/component/loading)
- 使用方式

```javascript
this.$baseLoading(0, "正在切换账号请稍后...");
```

### 数蛙全局通用消息提示 baseMessage

### 数蛙全局确定弹窗 baseAlert

### 数蛙全局二次确定弹窗 baseConfirm

### 数蛙全局通知 baseNotify

### 数蛙全局事件总线 baseEventBus
