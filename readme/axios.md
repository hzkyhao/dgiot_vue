# axios 请求篇

## 说明

已封装部分接口至[shuwa_parse](../src/api/shuwa_parse/index.js)

### query_object

- 全局通用查询接口,传入查询表名（tabclass）和查询参数（params）

### get_object

- 全局通用查询单挑接口,传入查询表名（tabclass）和对应 Id（ObjectId）

### del_object

- 全局通用删除接口,传入查询表名（tabclass）和对应 Id（ObjectId）

### update_object

- 全局通用更新数据接口,传入查询表名（tabclass）对应 id（ObjectId）和对应更新参数（data）

### create_object

- 全局通用创建数据接口,传入查询表名（tabclass）和对应参数（data）

### 使用

已经这些方法全局挂载在vue原型上，提供两种调用方式

#### 异步方式调用

```javascript
<script>
mounted(){
  this.searchProduct();
},
mehtods(){
   async searchProduct() {
      const parsms = {
        order: "-updatedAt",
        limit: 10,
        where: {}
      };
      const { results } = await this.$query_object("Product", parsms); // 为es6 解构赋值 
      // 等同于 const res = await this.$query_object("Product", parsms); 
      // const results = res.results
   }
}
</script>
```

#### 普通方式调用

```javascript
<script>
mounted(){
  this.searchProduct();
},
mehtods(){
  searchProduct() {
      const parsms = {
        order: "-updatedAt",
        limit: 10,
        where: {}
      };
       this.$query_object("Product", parsms)
        .then(res=>{
          // Callback success
           const { results }  = res // 为es6结构赋值 等同于
          //  const results = res.results
       })
        .catch(error => {
          // error
        })
   }
}
</script>
```

## 拓展

### 自定义请求头header

可以将header在请求时传参过去

#### 定义方法

```javascript

export async function query_object_header(tabclass, params,headers) {
  if (tabclass && params) {
    return request({
      url: `iotapi/classes/${tabclass}`,
      method: "get",
      headers,
      params
    });
  } else {
    return Message({
      message: "tabclass 和 params 字段为必传",
      type: "error",
      duration: 1 * 1000
    });
  }
}
```

#### 全局挂载

在``src\utils\utilwen.js``文件夹引入这个方法，并挂载到原型上

```javascript
import { query_object_header } from "@/api/shuwa_parse"
```

```javascript
export default {
  install(Vue, options) {
    Vue.prototype.$query_object_header = query_object_header
  }
};
```

### 二次封装

#### 二次封装示例 ``src\api\Dict\index.js``

``` javascript
import { query_object, create_object } from '@/api/shuwa_parse'

export async function queryDict(params) {
  return query_object('Dict', params)
}

export async function getBatchNumer() {
  const params = {
    order: "-createdAt",
    where: {
      type: "batch_number"
    }
  };
  return query_object('Dict', params)
}

export async function createBatchNumer(params) {
  return create_object('Dict', params)
}
```

#### 二次封装全局挂载

``src\utils\utilwen.js``

```javascript
import { getBatchNumer, createBatchNumer } from "@/api/Dict"
export default {
  install(Vue, options) {
    Vue.prototype.$getBatchNumer = getBatchNumer
    Vue.prototype.$createBatchNumer = createBatchNumer
  }
};
```
