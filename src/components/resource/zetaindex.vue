<template>
    <div class="resource">
        <div>
            <el-input v-model="search" style="width:150px"></el-input>
            <el-button type="primary" @click="searchuser" size="mini">搜索</el-button>
            <el-button type="primary" @click="resetuser" size="mini">重置</el-button>
            <el-tree
            
              :props="defaultProps"
              lazy
              :load="getOrgList"
              :expand-on-click-node="false"
              :highlight-current="true"
              style="margin-top:20px;"
              @node-click="handleNodeClick"
            >
             <span slot-scope="{ node}">
              <span style="padding-left: 4px;">{{node.label}}</span>
            </span>
            </el-tree>
            
        </div>
    </div>
</template>
<script>
import Parse from 'parse'
export default {
   name:'ResourceZeta',
   data() {
      return {
        search:'',
         defaultProps: {
            children: "children",
            label: "name",
            isLeaf: 'leaf',
        },
        data:[]
      }
   },
   computed: {
    // treeData() { 
    //   // let cloneData = JSON.parse(JSON.stringify(this.data)); // 对源数据深度克隆
    //   // return cloneData.filter(father => {
    //   //   let branchArr = cloneData.filter(
    //   //     child => child.name.indexOf(father.name) !=-1
    //   //   ); //返回每一项的子级数组
    //   //   branchArr.length > 0 ? (father.children = branchArr) : ""; //如果存在子级，则给父级添加一个children属性，并赋值
    //   //   return father.ParentId == 0; //返回第一层
    //   // });
      
    // },
  },
   mounted() {
    //  this.getZetaData()
    //  console.log(this.data)
   },
   methods: {
      handleNodeClick(row) {
        this.$emit('lookdata',row);
      },
     searchuser(){
       this.$emit('username',this.search)
     },
     resetuser(){
       this.search=''
       this.$emit('resetusername',this.search)
     },
      getOrgList(node,resolve) {
               if (node.level === 0) {
                 this.data=[]
                var ZetagPrefix = Parse.Object.extend('ZetagPrefix')
                var zetagprefix = new Parse.Query(ZetagPrefix)
                zetagprefix.limit(10000)
                zetagprefix.find().then(resultes=>{
                  resultes.map(items=>{
                      var obj = {};
                    items.createtime = new Date(
                      items.attributes.createdAt
                    ).toLocaleDateString();
                    obj.objectId = items.id;
                    obj.createtime = items.createtime;
                    obj.name = items.attributes.prefix;
                    obj.leaf = true;
                    obj.ParentId = 0
                    this.data.push(obj);
                  })
                  return resolve(this.data)
                })

               }
              //  else{
              //    this.data=[]
              // var Zetag = Parse.Object.extend('Zetag')
              // var zetag = new Parse.Query(Zetag)
              // zetag.limit(10000)
              // zetag.contains('tagID',node.data.name)
              // zetag.find().then(response=>{
              //   var obj = {};
              //   response.map(item=>{
              //       item.createtime = new Date(
              //       item.attributes.createdAt
              //     ).toLocaleDateString();
              //     obj.objectId = item.id;
              //     obj.createtime = item.createtime;
              //     obj.name = item.attributes.tagID;
              //     obj.leaf = true;
              //     this.data.push(obj);
              //   })
              //   return resolve(this.data)
              // })
              //  }
            },
     getZetaData(){
       this.data=[]
       var ZetagPrefix = Parse.Object.extend('ZetagPrefix')
       var zetagprefix = new Parse.Query(ZetagPrefix)
       zetagprefix.limit(10000)
       zetagprefix.find().then(resultes=>{
         resultes.map(items=>{
            var obj = {};
           items.createtime = new Date(
            items.attributes.createdAt
          ).toLocaleDateString();
          obj.objectId = items.id;
          obj.createtime = items.createtime;
          obj.name = items.attributes.prefix;
          obj.leaf = false;
          obj.ParentId = 0
          this.data.push(obj);
         })
          var Zetag = Parse.Object.extend('Zetag')
          var zetag = new Parse.Query(Zetag)
          zetag.limit(10000)
          zetag.find().then(response=>{
            var obj = {};
            response.map(item=>{
                item.createtime = new Date(
                item.attributes.createdAt
              ).toLocaleDateString();
              obj.objectId = item.id;
              obj.createtime = item.createtime;
              obj.name = item.attributes.tagID;
              obj.leaf = true;
              this.data.push(obj);
            })
        })
       })
        
       console.log(this.data)
     }
   }
}
</script>
<style>
.resource .el-input__inner{
  height: 26px;
  border-radius: 0;
  line-height: 26px;
  width: 150px;
}
</style>

