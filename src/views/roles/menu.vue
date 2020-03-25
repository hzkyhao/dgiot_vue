<template>
  <div class="menu">
    <el-table
      :data="tableData3"
      tooltip-effect="dark"
      style="width:100%;text-align:center;margin-top:30px"
      highlight-current-row
      class="tb-edit"
      border
      stripe
      height="500"
      id="out-table"
    >
      <el-table-column prop :label="$t('concentrator.status')" align="center" width="100">
        <template slot-scope="scope">
          <div
            v-if="scope.row.is_online==true"
            style="width:10px;height:10px;border-radius:50%;display:inline-block;background:#00cc33;margin-right:10px"
          ></div>
          <span
            v-if="scope.row.is_online==true"
            style="color:#00cc33"
          >{{$t('concentrator.isonline')}}</span>
          <div
            v-if="scope.row.is_online==false"
            style="width:10px;height:10px;border-radius:50%;display:inline-block;background:#f00;margin-right:10px"
          ></div>
          <span
            v-if="scope.row.is_online==false"
            style="color:#f00"
          >{{$t('concentrator.notonline')}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('concentrator.concentrator')" prop="vcaddr" align="center"></el-table-column>
      <el-table-column prop="address" :label="$t('concentrator.courts')" align="center"></el-table-column>
      <el-table-column :label="$t('concentrator.onlinemeter')" sortable align="center">
        <template slot-scope="scope">
          <span>{{(scope.row.dev_total - scope.row.dev_offline)+"/"+scope.row.dev_total}}</span>
        </template>
      </el-table-column>
      <el-table-column prop :label="$t('concentrator.connection')" align="center" width="100">
        <template slot-scope="scope">
          <el-switch v-model="value6" active-color="#13ce66" v-if="scope.row.iscon==true" disabled></el-switch>
          <el-switch v-if="scope.row.iscon!=true" v-model="value7" active-color="#cccccc" disabled></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="vctime" :label="$t('concentrator.time')" align="center"></el-table-column>
      <el-table-column prop :label="$t('concentrator.operation')" align="center" width="300">
        <template slot-scope="scope">
          <el-button
            plain
            size="mini"
            @click="connect(scope.row.vcaddr)"
          >{{$t('concentrator.connect')}}</el-button>
          <el-button
            size="mini"
            @click="handleEdit(scope.$index,scope.row)"
          >{{$t('concentrator.edit')}}</el-button>
          <el-button
            size="mini"
            type="primary"
            @click="handledetail(scope.$index, scope.row)"
          >{{$t('concentrator.detail')}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <paging-query
      :pager="pager"
      @setPager="getinformation"
      @query="setup"
      @now_drive="setup2"
      @alldrive="getdeive"
    />
  </div>
</template>
<script>
import { Parse } from "parse";
import PagingQuery from "@/components/Pagination";
import { eventBus } from "@/api/eventBus";
import {
  timestampToTime,
  gettables,
  makesure,
  startcon,
  stopcon,
  unixtime,
  submittime,
  timetounix,
  startconnect,
  addcon
} from "@/api/login";
export default {
  components: { PagingQuery },
  data() {
    return {
      pager: {
        count: 0,
        page: 1,
        rows: 10,
        name:'111'
      },
      draw: 1,
      vcaddr: "",
      tableData3: [],
      obj: {
        is_online: "状态",
        vcaddr: "集中器",
        address: "台区名称",
        dev_online: "在线电表",
        iscon: "连接状态",
        vctime: "集中器时间"
      }
    };
  },
  mounted() {
    this.getinformation();
  },
  methods: {
    setup(item) {
      this.getinformation();
    },
    getinformation(item) {
      console.log(item);
      if (item) {
        this.pager.page = item.page;
        this.pager.rows = item.rows;
      }
      gettables(
        this.vcaddr,
        (this.pager.page - 1) * this.pager.rows,
        this.pager.rows,
        this.draw
      )
        .then(res => {
          res.data.map(item => {
            item.vctime = timestampToTime(item.vctime);
          });
          this.tableData3 = res.data;
          this.pager.count = res.recordsTotal;
        })
        .catch(error => {
          console.log(error);
        });
    },
    getdeive(data) {
      gettables(
        this.vcaddr,
        (data.start - 1) * this.pager.rows,
        this.pager.rows * (data.end - data.start),
        this.draw
      )
        .then(res => {
          res.data.map(item => {
            item.vctime = timestampToTime(item.vctime);
          });
          // console.log(res);
          // this.tableData3 = res.data;
          // this.pager.count = res.recordsTotal;
          // console.log(obj);
          eventBus.$emit("drive", { json: res.data, obj: this.obj });
        })
        .catch(error => {
          console.log(error);
        });
    },
    setup2(item) {
      // console.log(item)
      this.get_now(item);
    },
    // 当页请求
    get_now(item) {
      // console.log(this.vcaddr,this.pager.page,this.pager.rows,this.draw);
      gettables(
        this.vcaddr,
        item.page * this.pager.rows - 1,
        item.rows,
        this.draw
      )
        .then(res => {
          // console.log(res);
          res.data.map(item => {
            item.vctime = timestampToTime(item.vctime);
          });
          this.tableData3 = res.data;
          this.pager.count = res.recordsTotal;
          console.log(this.tableData3, this.pager.count);
          eventBus.$emit("drive", { json: this.tableData3, obj: this.obj });
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
};
</script>
<style scoped>
.menu {
  width: 100%;
  min-height: 875px;
  padding: 20px 20px 40px 20px;
  margin-top: 20px;
  box-sizing: border-box;
  background: #ffffff;
}
</style>
<style>
</style>
