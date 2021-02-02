const Vue = require("vue");
/**
 * @param loadingText loading文字
 * @param messageDuration 消息框消失时间
 */
const [loadingText, messageDuration] = ["正在加载中...", 3000];
const ElementUI = require("element-ui");
import { Loading, Message, MessageBox, Notification } from "element-ui";
var msgparam = {};
/**
 * 数蛙全局通用message消息提示
 * @param {*} msg
 */
Vue.prototype.$message = msg => {
  if (!msg) {
    return;
  }
  if (typeof msg === "object") {
    if (!msg.message) {
      var jsonString = JSON.stringify(msg);
    }
    msgparam = {
      type: msg.type ? msg.type : "warn",
      message: msg.message ? msg.message : jsonString,
      duration: msg.duration ? msg.duration : 800,
      showClose: msg.showClose ? msg.showClose : true
    };
  } else {
    msgparam = {
      message: msg,
      duration: 800,
      showClose: true
    };
  }
  ElementUI.Message(msgparam);
};

/* 全局加载层 */
Vue.prototype.$baseLoading = (index, text) => {
  let loading;
  if (!index) {
    loading = Loading.service({
      lock: true,
      text: text || loadingText,
      background: "hsla(0,0%,100%,.8)"
    });
  } else {
    loading = Loading.service({
      lock: true,
      text: text || loadingText,
      spinner: "shuwa-loading-type" + index,
      background: "hsla(0,0%,100%,.8)"
    });
  }
  return loading;
};

/* 全局多彩加载层 */
Vue.prototype.$baseColorfullLoading = (index, text) => {
  let loading;
  if (!index) {
    loading = Loading.service({
      lock: true,
      text: text || loadingText,
      spinner: "dots-loader",
      background: "hsla(0,0%,100%,.8)"
    });
  } else {
    switch (index) {
      case 1:
        index = "dots";
        break;
      case 2:
        index = "gauge";
        break;
      case 3:
        index = "inner-circles";
        break;
      case 4:
        index = "plus";
        break;
    }
    loading = Loading.service({
      lock: true,
      text: text || loadingText,
      spinner: index + "-loader",
      background: "hsla(0,0%,100%,.8)"
    });
  }
  return loading;
};

/* 全局Message */
Vue.prototype.$baseMessage = (message, type, dangerouslyUseHTMLString, duration) => {
  Message({
    showClose: true,
    message: message,
    type: type,
    dangerouslyUseHTMLString,
    duration: duration || messageDuration
  });
};

/* 全局Alert */
Vue.prototype.$baseAlert = (content, title, callback) => {
  MessageBox.alert(content, title || "温馨提示", {
    confirmButtonText: "确定",
    dangerouslyUseHTMLString: true,
    callback: () => {
      if (callback) {
        callback();
      }
    }
  }).then(() => { });
};

/* 全局Confirm */
Vue.prototype.$baseConfirm = (content, title, callback1, callback2) => {
  MessageBox.confirm(content, title || "温馨提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    closeOnClickModal: false,
    type: "warning"
  })
    .then(() => {
      if (callback1) {
        callback1();
      }
    })
    .catch(() => {
      if (callback2) {
        callback2();
      }
    });
};

/* 全局Notification */
Vue.prototype.$baseNotify = (message, title, type, position, duration, dangerouslyUseHTMLString) => {
  Notification({
    title: title,
    message: message,
    position: position || "top-right",
    type: type || "success",
    duration: duration || messageDuration,
    dangerouslyUseHTMLString: dangerouslyUseHTMLString || false
  });
};

/* 全局事件总线 */
Vue.prototype.$baseEventBus = new Vue();
