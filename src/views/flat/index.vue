<template>
  <div class="flat">
    <el-button type="primary" @click="Startserver">启动服务端</el-button>
    <el-button type="primary" @click="Startclient">启动客服端</el-button>
    <el-button type="primary" @click="Startlive">启动视频直播</el-button>
  </div>
</template>
<script>
import {
  Websocket,
  sendInfo,
  TOPIC_EMPTY,
  MSG_EMPTY,
  DISCONNECT_MSG
} from "@/utils/wxscoket.js";
export default {
  data() {
    return {};
  },
  mounted() {
    this.GetFlat();
  },
  methods: {
    GetFlat() {
      Websocket.cInfo.host='132.232.121.164'
      Websocket.newClient();
      Websocket.connect();
    },
    Startserver() {
      window.location.href =
        "shuwa://aidlserver/pump?id=123&rtsp=rtsp://admin:shuwa-fly-2019@192.168.2.138:554/cam/realmonitor?channel=1&subtype=0&username=test&password=test123";
    },
    Startclient() {
      window.location.href =
        "shuwa://aidlclient/pump?id=123&mqtturl=tcp://132.232.121.164:1883&username=test&password=test123";
    },
    Startlive() {
      window.location.href =
        "shuwa://rtspliving/pump?&rtspurl=rtsp://admin:shuwa-fly-2019@192.168.2.138:554/cam/realmonitor?channel=1&subtype=0&action=start&username=test&password=test123 ";
    },
    dingyue() {
      var info = {
        topic: "ni/rx/" + 1,
        qos: 0
      };
      var info2 = {
        topic: "ni/tx/" + 2,
        qos: 0
      };
      Websocket.subscribe(info, function(res) {
        if (res.result) {
          Websocket.subscribe(info2, function(res) {
            if (res.result) {
              alert("订阅成功");
            }
          });
        }
      });
    }
  }
};
</script>
<style scoped>
.flat {
  width: 100%;
  min-height: 875px;
  padding: 20px;
  margin-top: 20px;
  box-sizing: border-box;
  background: #ffffff;
}
</style>
