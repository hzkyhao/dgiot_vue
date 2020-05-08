<template>
  <div class="test">
      <div class="test1">
          <canvas id="canvas1"></canvas>
      </div>
  </div>
</template>

<script>
export default {
  name: '',
  data() {
    return {
        canvasdata:jsondata,
        contentdata:{
            "Type": "Text",
            "Level": 4,
            "Index": 10,
            "Rect": {
                "Left": 1120,
                "Top": 621,
                "Right": 1209,
                "Bottom": 641
            },
            "PName": "锟斤拷锟脚匡拷锟斤拷",
            "PHandle": "332586",
            "Name": "锟斤拷锟斤拷水锟斤拷",
            "Value": "锟斤拷锟斤拷水锟斤拷"
        }
    };
  },
  mounted(){
      console.log(this.canvasdata)
      this.getCanvas(this.contentdata)
  },
  methods: {
      getCanvas(cont){
          var cans = document.getElementById('canvas1')
          var ctx = cans.getContext('2d')
            cans.width = 1920
            cans.height = 1080
            ctx.font = "18px bold 黑体";
            // 设置颜色
            ctx.fillStyle = "#000000";
            // 设置水平对齐方式
            ctx.textAlign = "center";
            // 设置垂直对齐方式
            ctx.textBaseline = "middle";
            // 绘制文字（参数：要写的字，x坐标，y坐标）
            ctx.fillText("要写的文字", cont.Rect.Left, cont.Rect.Top);
            // ctx.beginPath();
            // ctx.font = 14+'px';
            // ctx.fillText(cont.Name, cont.Rect.Left, cont.Rect.Top,cont.Rect.Right,cont.Rect.Bottom);
            // ctx.fill();
            // ctx.closePath();
              ctx.rect(cont.Rect.Left, cont.Rect.Top,cont.Rect.Right,cont.Rect.Bottom);
            ctx.stroke();
        

      }
  },
};
</script>

<style lang='scss' scoped>

</style>
