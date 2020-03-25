<template>
  <div class="rulesengine">
    <div class="engintable">
      <div class="engineheader">
        <h3>{{$t('rule.rule')}}</h3>
        <el-button
          type="primary"
          icon="el-icon-plus"
          style="float:right;margin:19px 0"
          size="small"
          @click="addEngine"
        >{{$t('developer.add')}}</el-button>
      </div>
      <el-table :data="engineData" style="width: 100%;text-align:center" :cell-class-name="getRowindex">
        <el-table-column  label="ID" align="center" width="180">
            <template slot-scope="scope">
               <span @click="detailRules(scope.row.id)">{{scope.row.id}}</span>
            </template>
        </el-table-column>
        <el-table-column label="主题" align="center">
            <template slot-scope="scope">
                <span>{{scope.row.for.join(',')}}</span>
            </template>
        </el-table-column>
        <el-table-column prop="rawsql" align="center" label="SQL"></el-table-column>
        <el-table-column  align="center" :label="$t('rule.ResponseAction')">
            <template slot-scope="scope">
                <p v-for="(item,index) in (scope.row.actions)" :key="index">{{item.name}}</p>
            </template>
        </el-table-column>
         <el-table-column  align="center" label="已命中">
            <template slot-scope="scope">
               <span>{{matched(scope.row.metrics)}}</span>
            </template>
        </el-table-column>
        <el-table-column  align="center" :label="$t('developer.operation')">
            <template slot-scope="scope">
                <el-button type="info" @click="detailRules(scope.row.id)" size="mini" plain>查看</el-button>
                <el-button type="info" @click="deleteRule(scope.row.id)" size="mini" plain>删除</el-button>
            </template>
        </el-table-column>
      </el-table>
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[10, 20, 30, 50]"
          :page-size="pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import { getRule, ruleDelete } from "@/api/rules";
export default {
  data() {
    return {
      engineData: [],
      pagesize: 10,
      start: 0,
      total: 0
    };
  },
  mounted() {
    this.orginRule();
   
  },
  methods: {
    //初始化数据
    orginRule() {
      getRule()
        .then(response => {
          if (response) {
            this.engineData = response
          }
        })
        .catch(error => {
          this.$message.error(error.error);
        });
    },
    //分页
    handleSizeChange(val) {},
    handleCurrentChange(val) {},
    addEngine() {
      this.$router.push({
        path: "/rules_engine/addengine",
        query: {
          title: "新增"
        }
      });
    },
    matched(metrics){
      var matched=0
      for(var i=0;i<metrics.length;i++){
      
        matched+=metrics[i].matched
      }
      return matched
    },
    actions(row){
        // var string = []
        row.map(items=>{
            // string.push(items.name)
            return items.name
        })
        return string.join(',')
    },
    //表格单个单元格class添加
    getRowindex(row,rowIndex,columnIndex){
        if(row.columnIndex==0){
            return 'firstcolumn'
        }
    },
    detailRules(id){
       this.$router.push({
           path:'/rules_engine/checkengine',
           query:{id:id}
       })
    },
     deleteRule(id) {
      ruleDelete(id)
        .then(resultes => {
          if (resultes) {
            this.$message.success("删除成功");
            this.orginRule();
          }
        })
        .catch(error => {
          this.$message.error(error.error);
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.rulesengine {
  height: 100%;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  .engintable {
    width: 100%;
    height: auto;
    .engineheader {
      h3 {
        float: left;
      }
    }
    .block {
      margin-top: 20px;
    }
  }
  /deep/ .firstcolumn{
      color:#34c388;
      cursor: pointer;
  }
}
</style>
