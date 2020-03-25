<template>
  <div class="platform">
    <div class="header" style="padding-top:20px;">
      <h2 style="margin-top:0px;">物联网开发平台</h2>
      <p>--平台总览</p>
    </div>
    <!--中间统计部分-->
    <div class="statistics">
      <div class="sta1">
        <el-card shadow="always">
          <ul>
            <li>
              <div>
                <span class="svg-container">
                  <svg-icon icon-class="platformlist" />
                </span>
              </div>
              <div>
                <p>应用合计</p>
                <span>111</span>
              </div>
            </li>
            <li>
              <div>
                <span class="svg-container">
                  <svg-icon icon-class="productlist" />
                </span>
              </div>
              <div>
                <p>产品合计</p>
                <span>222</span>
              </div>
            </li>
            <li>
              <div>
                <span class="svg-container">
                  <svg-icon icon-class="successed" />
                </span>
              </div>
              <div>
                <p>已完成(产品)</p>
                <span>333</span>
              </div>
            </li>
          </ul>
        </el-card>
      </div>
      <div class="sta1">
        <el-card shadow="always">
          <ul>
            <li>
              <div>
                <span class="svg-container">
                  <svg-icon icon-class="devicelist" />
                </span>
              </div>
              <div>
                <p>设备数量</p>
                <span>111</span>
              </div>
            </li>
            <li>
              <div>
                <span class="svg-container">
                  <svg-icon icon-class="shuliang" />
                </span>
              </div>
              <div>
                <p>注册数量</p>
                <span>222</span>
              </div>
            </li>
            <li>
              <div>
                <span class="svg-container">
                  <svg-icon icon-class="onlinelist" />
                </span>
              </div>
              <div>
                <p>在线数量</p>
                <span>333</span>
              </div>
            </li>
          </ul>
        </el-card>
      </div>
    </div>
    <div class="search">
      <el-form :inline="true" :model="formInline" class="demo-form-inline" size="samll">
        <el-form-item label="创建日期:">
          <el-date-picker v-model="formInline.starttime" type="datetime" placeholder="选择创建开始时间"></el-date-picker>
        </el-form-item>
        <el-form-item label="项目关键字:">
          <el-input v-model="formInline.project" placeholder="项目关键字"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="bottom">
      <ul class="projectlist">
        <li>
          <div class="lilist"></div>
          <div class="licontent">
            <div>
              <p>产品数量</p>
              <span>222</span>
            </div>
            <div>
              <p>设备规模</p>
              <span>222</span>
            </div>
            <div>
              <p>在线设备</p>
              <span>222</span>
            </div>
          </div>
          <div class="listbottom">
            <div class="list_bottom_left"></div>
            <div class="list_bottom_right"></div>
          </div>
        </li>
        <li>2</li>
        <li>3</li>
        <li>4</li>
        <li>5</li>
        <li>6</li>
        <li>7</li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      formInline: {
        starttime: "",
        project: ""
      }
    };
  },
  mounted() {
    this.choujiang()
  },
  methods: {
    choujiang(){
      var projectlist = document.getElementsByClassName('projectlist')[0]
      var children = projectlist.children
      console.log(children)
      setInterval(() => {
          var time = Math.floor(Math.random()*7)
          children[time].className = 'cover'
      }, 1000);
    }
  }
};
</script>
<style lang="scss" scoped>
.platform {
  width: 100%;
  height: 100%;
  padding: 0 20px;
  box-sizing: border-box;
  // background:url("../../imgages/platform.jpg") no-repeat;
  background-size: 100%;
  .header {
    text-align: center;
    margin: 0 auto;
  }
  .statistics {
    width: 100%;
    height: auto;
    display: flex;
    background: #cccccc;
    .sta1 {
      width: 50%;
      height: 100%;
      padding: 20px;
      box-sizing: border-box;
      color: #d9d7c1;
      /deep/ .el-card.is-always-shadow:hover {
        border: 1px solid blue;
      }
      ul {
        display: flex;
        justify-content: space-around;
        margin: 0;
        li {
          list-style: none;
          text-align: center;
          background: #ffffff;
          width: 30%;
          display: flex;
          &:hover {
            // background:red;
            box-shadow: 5px 5px 5px #dddddd;
            background:#F2F6FC;
          }
          div {
            width: 50%;
            &:first-child{
               padding: 10px 0;
               box-sizing: border-box;
            }
            &:nth-child(2){
               line-height:35px;
            }
          }
        }
      }
    }
    /deep/ .svg-icon {
      height: 6rem;
      width: 4rem;
    }
  }
  .search {
    padding-top: 20px;
    background:#cccc;
  }
  .bottom {
    ul {
      width: 100%;
      height: auto;
      display: flex;
      flex-wrap: wrap;
      justify-content: baseline;
      background: #cccc;
      margin-top:0;
      li {
        list-style: none;
        width: 420px;
        height: 250px;
        border: 1px solid #ffffff;
        margin: 0 30px 20px 0;
        &:hover{
          background:#ffffff;
          box-shadow: 5px 5px 5px #ffffff;
          p{
            color:black;
          }
        }
        .cover{
          background:#ffffff;
          box-shadow: 5px 5px 5px #ffffff;
        }
        .lilist {
          height: 50px;
          width: 100%;
          border-bottom: 1px solid #ffffff;
        }
        & .licontent {
          height: 150px;
          width: 100%;
          border-bottom: 1px solid #ffffff;
          display: flex;
          div {
            width: 33%;
            text-align: center;
            p {
              font-size: 14px;
              color: gray;
              line-height: 50px;
            }
          }
        }
        .listbottom {
          height: 50px;
          width: 100%;
          .list_bottom_left {
            width: 50%;
            height: 100%;
            background: red;
            float: left;
          }
          .list_bottom_right {
            width: 50%;
            height: 100%;
            background: blue;
            float: right;
          }
        }
      }
    }
  }
}
</style>
