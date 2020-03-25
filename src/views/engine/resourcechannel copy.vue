<template>
  <div class="resourcechannel">
    <h3>{{$t('resource.resource')}}</h3>
    <el-tabs v-model="activeName">
      <el-tab-pane :label="$t('resource.resource')+'('+total+')'" name="first">
        <div class="firsttable">
          <el-form :inline="true" :model="channelformsearch" class="demo-form-inline" size="small">
            <el-form-item>
              <el-input v-model="channelformsearch.name" :placeholder="$t('resource.name')"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="Get_Re_Channel(0)">{{$t('developer.search')}}</el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="addchanneltype">{{$t('developer.selectchannel')}}</el-button>
            </el-form-item>
          </el-form>
          <!----------------------------------------------------资源通道表格------------------>
          <el-table :data="tableData" style="width: 100%;" :row-class-name="getChannelEnable">
            <el-table-column :label="$t('developer.channelnumber')">
            <template slot-scope="scope">
              <span>{{scope.row.id}}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('developer.channelname')">
            <template slot-scope="scope">
              <span>{{scope.row.attributes.name}}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('developer.channeltype')">
            <template slot-scope="scope">
              <span v-if="scope.row.attributes.type==1">{{$t('developer.collectionchannel')}}</span>
              <span v-else>{{$t('developer.resourcechannel')}}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('developer.servicetype')">
            <template slot-scope="scope">
              <span>{{scope.row.attributes.cType}}</span>
            </template>
          </el-table-column>

          <el-table-column :label="$t('developer.channelstatus')">
            <template slot-scope="scope">
              <span v-if="scope.row.attributes.status=='ONLINE'" style="color:green">在线</span>
              <span v-else style="color:red">离线</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('developer.channeladdr')" width="200">
            <template slot-scope="scope">
              <span>{{'channel/'+scope.row.id}}</span>
            </template>
          </el-table-column>

          <el-table-column :label="$t('developer.describe')">
            <template slot-scope="scope">
              <span>{{scope.row.attributes.desc}}</span>
            </template>
          </el-table-column>
            <el-table-column :label="$t('developer.operation')" width="200">
              <template slot-scope="scope">
                <el-button
                  type="success"
                  v-if="scope.row.attributes.isEnable==false"
                  size="mini"
                  @click="qyChannel(scope.row,'enable')"
                >{{$t('developer.enable')}}</el-button>
                <el-button type="danger" v-else size="mini" @click="qyChannel(scope.row,'disable')">{{$t('developer.prohibit')}}</el-button>
                <el-button type="primary" size="mini" @click="updateChannel(scope.row)">{{$t('developer.edit')}}</el-button>
                <el-popover placement="top" width="300" :ref="`popover-${scope.$index}`">
                  <p>确定删除这个{{scope.row.attributes.name}}通道吗？</p>
                  <div style="text-align: right; margin: 0">
                    <el-button
                      size="mini"
                      @click="scope._self.$refs[`popover-${scope.$index}`].doClose()"
                    >{{$t('developer.cancel')}}</el-button>
                    <el-button type="primary" size="mini" @click="deleteChannel(scope)">{{$t('developer.determine')}}</el-button>
                  </div>
                  <el-button type="danger" size="mini" slot="reference">{{$t('developer.delete')}}</el-button>
                </el-popover>
              </template>
            </el-table-column>
          </el-table>
          <div class="elpagination" style="margin-top:20px;">
            <el-pagination
              @size-change="channelSizeChange"
              @current-change="channelCurrentChange"
              :page-sizes="[10, 20, 30, 50]"
              :page-size="length"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
            ></el-pagination>
          </div>
        </div>
      </el-tab-pane>
      <!--弹窗--->
      <el-dialog
        :title="channelupdated+$t('resource.resource')"
        :visible.sync="channelForm"
        width="40%"
        top="0"
        :close-on-click-modal="false"
        :before-close="handleClose"
      >
        <el-form :model="addchannel" label-width="100px" ref="addchannel" :rules="addrules">
          <el-form-item :label="$t('resource.Servicetype')" prop="region" class="lastchildren">
            <el-select
              v-model="addchannel.region"
              :placeholder="$t('resource.Servicetype')"
              :disabled="channelId!=''"
              @change="removeauto"
            >
              <el-option
                v-for="(item,index) in channelregion"
                :label="item.name+item.channeltype"
                :key="index"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
            <el-form-item :label="$t('developer.channelname')" prop="name" class="lastchildren">
              <el-input v-model="addchannel.name" autocomplete="off" :placeholder="$t('developer.channelname')"></el-input>
            </el-form-item>

          <!--KAFKA---------------------------------------------------------------------------------->
          <div class="notlastchildren notline" v-if="addchannel.region=='KAFKA'">
             <el-form-item
            label="KAFKA服务器"
            label-width="200px"
            prop="KAFKAhost"
            :rules='[
              {required:true,message:"kafa服务器不能为空",trigger: "blur"}
              ]'
          >
            <template>
              <span slot="label">
                <span>{{'KAFKA'+$t('resource.server')}}</span>
                <el-popover placement="top-start" width="200" trigger="hover" :content="'KAFKA'+$t('resource.server')">
                  <i class="el-icon-question" slot="reference" style="color:#71737d;"></i>
                </el-popover>
              </span>
            </template>
            <el-input type="text" :placeholder="'KAFKA'+$t('resource.server')" v-model="addchannel.KAFKAhost"></el-input>
          </el-form-item>
          </div>
         <div class="notlastchildren notline" v-if="addchannel.region=='KAFKA'">
            <el-form-item
            :label="'KAFKA'+$t('developer.port')"
            label-width="200px"
            prop="KAFKAport"
            :rules='[
              {required:true,message:"KAFKA端口不能为空",trigger: "blur"},
              { validator: validPort }
              ]'
          >
            <el-input type="text" :placeholder="'KAFKA'+$t('developer.port')" v-model="addchannel.KAFKAport"></el-input>
          </el-form-item>
         </div>
         <div v-if="addchannel.region=='KAFKA'"
            class="notlastchildren notline">
            <el-form-item
            :label="'KAFKA'+$t('resource.resource')"
            label-width="200px"
          >
            <el-input type="text" :placeholder="'KAFKA'+$t('resource.resource')" v-model="addchannel.KAFKAname"></el-input>
          </el-form-item>
         </div>
         <div  v-if="addchannel.region=='KAFKA'"
            class="notlastchildren notline">
          <el-form-item
            label="KAFKA"
            label-width="200px"
          >
            <template>
              <span slot="label">
                <span>{{'Metadata'+$t('resource.updateinterval')}}</span>
                <el-popover
                  placement="top-start"
                  width="200"
                  trigger="hover"
                  :content="'Metadata'+$t('resource.updateinterval')"
                >
                  <i class="el-icon-question" slot="reference" style="color:#71737d;"></i>
                </el-popover>
              </span>
            </template>
            <el-input
              type="text"
              :placeholder="'Metadata'+$t('resource.updateinterval')"
              v-model.number="addchannel.KAFKAmetadata"
            ></el-input>
          </el-form-item>
         </div>
          <div  v-if="addchannel.region=='KAFKA'"
            class="notlastchildren notline">
              <el-form-item
            label="KAFKA"
           
            label-width="200px"
          >
            <template>
              <span slot="label">
                <span>{{$t('resource.Synchronizationcallinterval')}}</span>
                <el-popover placement="top-start" width="200" trigger="hover" :content="$t('resource.Synchronizationcallinterval')">
                  <i class="el-icon-question" slot="reference" style="color:#71737d;"></i>
                </el-popover>
              </span>
            </template>

            <el-input type="text" :placeholder="$t('resource.Synchronizationcallinterval')" v-model.number="addchannel.KAFKAduring"></el-input>
          </el-form-item>
          </div>
          <div v-if="addchannel.region=='KAFKA'"
            class="notlastchildren notline">
            <el-form-item
            label="KAFKA"
            label-width="200px"
          >
            <template>
              <span slot="label">
                <span>{{$t('resource.Maximumbatchbytes')}}</span>
                <el-popover placement="top-start" width="200" trigger="hover" :content="$t('resource.Maximumbatchbytes')">
                  <i class="el-icon-question" slot="reference" style="color:#71737d;"></i>
                </el-popover>
              </span>
            </template>
            <el-input type="text" :placeholder="$t('resource.Maximumbatchbytes')" v-model.number="addchannel.KAFKAbatch"></el-input>
          </el-form-item>
          </div>
          <div  v-if="addchannel.region=='KAFKA'"
            class="notlastchildren notline">
              <el-form-item
            label="acks"
            label-width="200px"
          >
            <el-select v-model="addchannel.KAFKAacks">
              <el-option label="all" value="all"></el-option>
              <el-option label="0" value="0"></el-option>
              <el-option label="1" value="1"></el-option>
            </el-select>
          </el-form-item>
          </div>
          <div v-if="addchannel.region=='KAFKA'"
            class="notlastchildren notline">
               <el-form-item
            label="KAFKA"
            label-width="200px"
          >
            <template>
              <span slot="label">
                <span>{{$t('resource.compress')}}</span>
                <el-popover placement="top-start" width="200" trigger="hover" :content="$t('resource.compress')">
                  <i class="el-icon-question" slot="reference" style="color:#71737d;"></i>
                </el-popover>
              </span>
            </template>
            <el-input type="text" :placeholder="$t('resource.compress')" v-model="addchannel.KAFKAys"></el-input>
          </el-form-item>
          </div>
         <div  v-if="addchannel.region=='KAFKA'"
            class="notlastchildren notline">
             <el-form-item
            label="KAFKA"
            label-width="200px"
          >
            <template slot="label">
              <span>
                <span>{{$t('resource.Buffersizeforsendingmessages')}}</span>
                <el-popover placement="top-start" width="200" trigger="hover" :content="$t('resource.Buffersizeforsendingmessages')">
                  <i class="el-icon-question" slot="reference" style="color:#71737d;"></i>
                </el-popover>
              </span>
            </template>
            <el-input type="text" :placeholder="$t('resource.Buffersizeforsendingmessages')" v-model.number="addchannel.KAFKAbuffer"></el-input>
          </el-form-item>
         </div>
         <!--MQTTCLI配置------------------------------------------------>
            <el-form-item
              :label="$t('developer.hostaddress')"
              v-if="addchannel.region=='MQTTCLI'"
              prop="address"
              class="notlastchildren"
              :rules='[
              { required: true, message: "输入主机地址", trigger: "blur" },
              { validator: validUrl, trigger: "blur" }
              ]'
            >
              <el-input v-model="addchannel.address" autocomplete="off" :placeholder="$t('developer.hostaddress')"></el-input>
            </el-form-item>
            <el-form-item
              :label="$t('developer.port')"
              v-if="addchannel.region=='MQTTCLI'"
              prop="port"
              :rules='[{ required: true, trigger: "blur" }, { validator: validPort }]'
              class="notlastchildren"
            >
              <el-input v-model.number="addchannel.port" autocomplete="off" :placeholder="$t('developer.port')"></el-input>
            </el-form-item>
            <el-form-item
              :label="$t('developer.username')"
              v-if="addchannel.region=='MQTTCLI'"
              prop="username"
              :rules='[
                { required: true, message: "请输入用户名", trigger: "blur" }
              ]'
              class="notlastchildren"
            >
              <el-input
                v-model="addchannel.username"
                autocomplete="off"
                :placeholder="$t('developer.username')"
                class="notauto"
                type="text"
                
              ></el-input>
            </el-form-item>
            <el-form-item
              :label="$t('developer.password')"
              v-if="addchannel.region=='MQTTCLI'"
              prop="password"
              :rules='[{ required: true, message: "请输入密码", trigger: "blur" }]'
              class="notlastchildren"
            >
              <el-input
                v-model="addchannel.password"
                autocomplete="off"
                :placeholder="$t('developer.password')"
                :type="pwdType"
                class="notauto"
                
              >
                <template slot="append">
                  <span class="show-pwd" @click="showPwd" style="cursor:pointer">
                    <svg-icon :icon-class="pwdType=='password' ? 'eye':'zheneys'" />
                  </span>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item
              :label="$t('developer.heartbeat')"
              v-if="addchannel.region=='MQTTCLI'"
              prop="keepalive"
              :rules='[
                { required: true, message: "请输入心跳", trigger: "blur" },
                { type: "number", message: "心跳间隔必须为数字值" }
              ]'
              class="notlastchildren"
            >
              <el-input
                v-model.number="addchannel.keepalive"
                autocomplete="off"
                :placeholder="$t('developer.heartbeat')"
                :min="1"
              ></el-input>
            </el-form-item>
            <el-form-item label=" " v-if="addchannel.region=='MQTTCLI'">
              <el-checkbox v-model="addchannel.clean_start">{{$t('developer.clearsession')}}</el-checkbox>
              <el-checkbox v-model="addchannel.ssl">SSL</el-checkbox>
            </el-form-item>
          <!--PG配置-资源通道选择参数配置   MongoDB,MySQL,PG-------------------------------------------------------------------------------------------------->
          <div v-if="addchannel.region=='postgresql'||addchannel.region=='mongodb'||addchannel.region=='mysql'||addchannel.region=='influxdb'" class="notlastchildren notline">
            <div>
               <el-form-item
            :label="addchannel.region+$t('resource.server')"
            label-width="200px"
            prop="postgresqlhost"
            :rules='[{required:true,message:"服务器不能为空",trigger: "blur"}]'
          >
            <el-input type="text" :placeholder="'addchannel.region'+$t('resource.server')" v-model="addchannel.postgresqlhost"></el-input>
          </el-form-item>
            </div>
            
          </div>
         <div v-if="addchannel.region=='postgresql'||addchannel.region=='mongodb'||addchannel.region=='mysql'||addchannel.region=='influxdb'"
            class="notlastchildren notline">
            <div>
               <el-form-item
                :label="$t('developer.port')"
                label-width="200px"
                prop="postgresqlport"
                :rules='[{required:true,message:"服务器端口不能为空",trigger: "blur"},{ validator: validPort }]'
              >
                <el-input type="text" :placeholder="$t('developer.port')" v-model.number="addchannel.postgresqlport"></el-input>
              </el-form-item>
            </div>
           
         </div>
         <div v-if="addchannel.region=='postgresql'||addchannel.region=='mongodb'||addchannel.region=='mysql'||addchannel.region=='influxdb'"
            class="notlastchildren notline">
            <div>
                <el-form-item
                  :label="addchannel.region+$t('developer.username')"
                  label-width="200px"
                  prop="postgresqlusername"
                  :rules='[
                    {required:true,message:"用户名不能为空",trigger: "blur"}
                    ]'
                >
                <el-input
                  type="text"
                  :placeholder="$t('developer.username')"
                  v-model="addchannel.postgresqlusername"
                  class="notauto"
                  readonly
                ></el-input>
             </el-form-item>
            </div>
             
         </div>
         <div v-if="addchannel.region=='postgresql'||addchannel.region=='mongodb'||addchannel.region=='mysql'||addchannel.region=='influxdb'"
            class="notlastchildren notline">
            <div>
              <el-form-item
            :label="addchannel.region+$t('developer.password')"
            label-width="200px"
            prop="postgresqlpassword"
            :rules='[
              {required:true,message:"密码不能为空",trigger: "blur"}
              ]'
          >
            <el-input
              :type="pwdType"
              :placeholder="$t('developer.passowrd')"
              v-model="addchannel.postgresqlpassword"
              class="notauto readonly"
              readonly
            >
              <template slot="append">
                <span class="show-pwd" @click="showPwd">
                  <svg-icon :icon-class="isopen" />
                </span>
              </template>
            </el-input>
          </el-form-item>
            </div>
             
         </div>
         <div v-if="addchannel.region=='postgresql'||addchannel.region=='mongodb'||addchannel.region=='mysql'||addchannel.region=='influxdb'"
            class="notlastchildren notline">
            <div>
               <el-form-item
            label="database"
            label-width="200px"
            prop="postgresqldatabase"
            :rules='[
              {required:true, message:"database不能为空",trigger: "blur"}
              ]'
          >
            <el-input
              type="text"
              placeholder="database"
              v-model="addchannel.postgresqldatabase"
              class="notauto"
              readonly
            ></el-input>
          </el-form-item>
            </div>
            
         </div>
         <div  v-if="addchannel.region=='postgresql'||addchannel.region=='mongodb'||addchannel.region=='mysql'||addchannel.region=='influxdb'"
            class="notlastchildren notline">
            <div>
               <el-form-item
            :label="$t('resource.Bulkwritesize')"
           
            label-width="200px"
          >
            <el-input
              type="text"
              :placeholder="$t('resource.Bulkwritesize')"
              v-model.number="addchannel.postgresqllength"
              class="notauto"
              readonly
              autocomplete="off"
            ></el-input>
          </el-form-item>
            </div>  
         </div>
         
         <div v-if="addchannel.region=='postgresql'||addchannel.region=='mongodb'||addchannel.region=='mysql'||addchannel.region=='influxdb'"
            class="notlastchildren notline" >
            <div>
                <el-form-item
            :label="addchannel.region+$t('resource.resource')"
             label-width="200px"
          >
            <el-input type="text" :placeholder="$t('resource.resource')" v-model="addchannel.postgresqlname"></el-input>
          </el-form-item>
            </div>
             
         </div>
         <div  v-if="addchannel.region=='postgresql'||addchannel.region=='mongodb'||addchannel.region=='mysql'||addchannel.region=='influxdb'"
            class="notlastchildren notline">
            <div>
              <el-form-item
            :label="addchannel.region+$t('resource.Connectionnumber')"
            label-width="200px"
          >
            <el-input
              :placeholder="$t('resource.Connectionnumber')"
              v-model.number="addchannel.postgresqlconnect"
              class="notauto"
              readonly
              autocomplete="off"
              type="number"
            ></el-input>
          </el-form-item>
            </div>
              
         </div>
          <div v-if="addchannel.region=='postgresql'||addchannel.region=='mongodb'||addchannel.region=='mysql'||addchannel.region=='influxdb'"
            class="notlastchildren notline">
            <div>
               <el-form-item
                label="OpenSSL"
                label-width="200px"
              >
                <el-select v-model="addchannel.postgresqlssl">
                  <el-option label="disable" value="disable"></el-option>
                  <el-option label="require" value="require"></el-option>
                  <el-option label="verify-ca" value="verify-ca"></el-option>
                  <el-option label="verify-full" value="verify-full"></el-option>
                </el-select>
              </el-form-item>
            </div>
          </div>
            <div v-if="addchannel.region=='HTTP'||addchannel.region=='TCPCLI'||addchannel.region=='TCPMRTUC'" class="notlastchildren">
             <el-form-item
              :label="$t('developer.path')"
              
              prop="path"
              :rules='[
           { required: true, message: "需要输入正确的url", trigger: "blur" }]' 
            >
              <el-input v-model="addchannel.path" autocomplete="off" :placeholder="$t('developer.path')"></el-input>
            </el-form-item>
           </div>
           <div  v-if="addchannel.region=='TD'" class="notlastchildren">
            <el-form-item
              label="IP"
              prop="ip"
              :rules='[
              { required: true, message:"地址不能为空"},
              { validator: validUrl, trigger: "blur" }
              ]'
            >
              <el-input v-model="addchannel.ip" autocomplete="off"></el-input>
            </el-form-item>
         </div>   
          <div  v-if="addchannel.region=='HTTP'||addchannel.region=='TD'||addchannel.region=='TCPCLI'||addchannel.region=='TCPMRTUC'"  class="notlastchildren">
             <el-form-item
              :label="$t('developer.port')"
              
              prop="port"
              :rules='[{ required: true, message:"端口不能为空",trigger: "blur" }, { validator: validPort }]'
              
            >
              <el-input v-model.number="addchannel.port" autocomplete="off" :placeholder="$t('developer.port')"></el-input>
            </el-form-item>
          </div>
        
           <!-- <div   v-if="addchannel.region=='TCP'">
              <el-form-item
              :label="$t('developer.cacheconstraint')"
             
              prop="buff_size"
              :rules='[
          { required: true, message: "最大存储不能为空", trigger: "blur" },
          { type: "number", message: "最大存储必须为数字值" }
        ]'
              class="notlastchildren"
            >
              <el-input v-model.number="addchannel.buff_size" autocomplete="off" :min="1">
                <template slot="append">KB</template>
              </el-input>
            </el-form-item>
           </div> -->
         
            <div v-if="addchannel.region=='TCPCLI'||addchannel.region=='TCPMRTUC'" class="notlastchildren">
            <el-form-item
              :label="$t('developer.cacheconstraint')"
              prop="buff_size"
              :rules='[
                { required: true, message: "最大存储不能为空", trigger: "blur" },
                { type: "number", message: "最大存储必须为数字值" }
              ]'
              class="notlastchildren"
            >
              <el-input v-model.number="addchannel.buff_size" autocomplete="off" :min="1">
                <template slot="append">KB</template>
              </el-input>
            </el-form-item>
           </div>
            
          <!--dynamodb----------------->
          <div  v-if="addchannel.region=='dynamodb'"
            class="notlastchildren notline">
            <div>
               <el-form-item
            :label="addchannel.region+'区域'"
           
            label-width="200px"
            prop="dynamodbhost"
            :rules='[
              {required:true,message:"服务器不能为空",trigger: "blur"}
              ]'
          >
            <el-input type="text" placeholder="服务器" v-model="addchannel.dynamodbhost"></el-input>
          </el-form-item>
            </div>
           
          </div>
          <div v-if="addchannel.region=='dynamodb'"
            class="notlastchildren notline">
            <div>
               <el-form-item
            :label="addchannel.region+'服务器'"
            
            label-width="200px"
            prop="dynamodbhost"
            :rules='[
              {required:true,message:"服务器不能为空",trigger: "blur"}
              ]'
          >
            <el-input type="text" placeholder="服务器" v-model="addchannel.dynamodbhost"></el-input>
          </el-form-item>
            </div>
            
          </div>
         <div v-if="addchannel.region=='dynamodb'"
            class="notlastchildren notline">
            <div>
               <el-form-item
            label="连接池大小"
            
            label-width="200px"
            prop="dynamodbhost"
            :rules='[
              {required:true,message:"连接池大小不能为空",trigger: "blur"}
              ]'
          >
            <el-input type="text" placeholder="连接池大小" v-model="addchannel.dynamodbhost"></el-input>
          </el-form-item>
            </div>
             
         </div>
          <div  v-if="addchannel.region=='dynamodb'"
            class="notlastchildren notline">
            <div>
              <el-form-item
            label="连接访问ID"
           
            label-width="200px"
            prop="dynamodbhost"
            :rules='[
              {required:true,message:"连接访问ID不能为空",trigger: "blur"}
              ]'
          >
            <el-input type="text" placeholder="连接访问ID" v-model="addchannel.dynamodbhost"></el-input>
          </el-form-item>
            </div>
              
          </div>
          <div  v-if="addchannel.region=='dynamodb'"
            class="notlastchildren notline">
            <div>
              <el-form-item
            label="连接访问密钥"
           
            label-width="200px"
            prop="dynamodbhost"
            :rules='[
              {required:true,message:"连接访问密钥不能为空",trigger: "blur"}
              ]'
          >
            <el-input type="text" placeholder="连接访问密钥" v-model="addchannel.dynamodbhost"></el-input>
          </el-form-item>
            </div>
            
          </div>
          <div  v-if="addchannel.region=='dynamodb'"
            class="notlastchildren notline">
            <div>
              <el-form-item
            label="自动重连间隔"
           
            label-width="200px"
          >
            <el-input type="text" placeholder="自动重连间隔" v-model="addchannel.dynamodbhost"></el-input>
          </el-form-item>
            </div>
              
          </div>
          <!--Parse 配置-->
          <div class="notlastchildren notline" v-if="addchannel.region=='PARSE'">
             <el-form-item
            label="parse服务器"
            label-width="200px"
            prop="parsehost"
            :rules='[
              {required:true,message:"Parse服务器不能为空",trigger: "blur"}
              ]'
          >
            <el-input type="text" :placeholder="'parse'+$t('resource.server')" v-model="addchannel.parsehost"></el-input>
          </el-form-item>
          </div>
         <div class="notlastchildren notline" v-if="addchannel.region=='PARSE'">
            <el-form-item
            :label="'parse'+$t('developer.port')"
            label-width="200px"
            prop="parseport"
            :rules='[
              {required:true,message:"端口不能为空",trigger: "blur"},
              { validator: validPort }
              ]'
          >
            <el-input type="text" :placeholder="'PARSE'+$t('developer.port')" v-model="addchannel.parseport"></el-input>
          </el-form-item>
         </div>
          <div v-if="addchannel.region=='PARSE'"
              class="notlastchildren notline">
              <el-form-item
              :label="'parse'+$t('resource.resource')"
              label-width="200px"
            >
              <el-input type="text" :placeholder="'parse'+$t('resource.resource')" v-model="addchannel.parseresource"></el-input>
            </el-form-item>
          </div>
          <div class="notlastchildren notline" v-if="addchannel.region=='PARSE'">
            <el-form-item
            label="appid"
            label-width="200px"
            prop="parseappid"
            :rules='[
              {required:true,message:"appid不能为空",trigger: "blur"}
              ]'
          >
            <el-input type="text"  v-model="addchannel.parseappid"></el-input>
          </el-form-item>
         </div>
         <div class="notlastchildren notline" v-if="addchannel.region=='PARSE'">
            <el-form-item
            label="js_key"
            label-width="200px"
            prop="parsejs_key"
            :rules='[
              {required:true,message:"js_key不能为空",trigger: "blur"}
              ]'
          >
            <el-input type="text"  v-model="addchannel.parsejs_key"></el-input>
          </el-form-item>
         </div>
         <div class="notlastchildren notline" v-if="addchannel.region=='PARSE'">
            <el-form-item
            label="master_key"
            label-width="200px"
            prop="parsemaster_key"
            :rules='[
              {required:true,message:"master_key不能为空",trigger: "blur"}
              ]'
          >
            <el-input type="text"  v-model="addchannel.parsemaster_key"></el-input>
          </el-form-item>
         </div>
         <div class="notlastchildren notline" v-if="addchannel.region=='PARSE'">
            <el-form-item
            label="rest_key"
            label-width="200px"
            prop="parserest_key"
            :rules='[
              {required:true,message:"rest_key不能为空",trigger: "blur"},
              ]'
          >
            <el-input type="text"  v-model="addchannel.parserest_key"></el-input>
          </el-form-item>
         </div>
          <!--------------------------------RabbitMq----------------------------------------------------------------------------------->
          <div v-if="addchannel.region=='rabbitmq'"
            class="notlastchildren notline">
            <div>
              <el-form-item
            label="RabbitMq服务器"
            
            label-width="200px"
            prop="rabbitmqhost"
            :rules='[
              {required:true,message:"RabbitMq服务器不能为空",trigger: "blur"}
              ]'
          >
            <el-input type="text" placeholder="RabbitMq服务器" v-model="addchannel.rabbitmqhost"></el-input>
          </el-form-item>
            </div>
             
          </div>
          <div v-if="addchannel.region=='rabbitmq'"
            class="notlastchildren notline">
            <div>
               <el-form-item
            label="连接池大小"
            
            label-width="200px"
            prop="rabbitmqconnect"
            :rules='[
              {required:true,message:"连接池大小",trigger: "blur"}
              ]'
          >
            <el-input type="text" placeholder="连接池大小" v-model="addchannel.rabbitmqconnect"></el-input>
          </el-form-item>
            </div>
             
          </div>
          <div  v-if="addchannel.region=='rabbitmq'"
            class="notlastchildren notline">
            <div>
              <el-form-item
            label="用户名"
           
            label-width="200px"
          >
            <el-input
              type="text"
              placeholder="用户名"
              v-model="addchannel.rabbitmqusername"
              class="notauto"
              readonly
            ></el-input>
          </el-form-item>
            </div>
            
          </div>
          <div v-if="addchannel.region=='rabbitmq'"
            class="notlastchildren notline">
            <div>
               <el-form-item
            label="密码"
            
            label-width="200px"
          >
            <el-input 
              type="text"
              placeholder="密码"
              v-model="addchannel.rabbitmqpassword"
              class="notauto"
              readonly
            ></el-input>
          </el-form-item>
            </div>
           
          </div>
          <div v-if="addchannel.region=='rabbitmq'"
            class="notlastchildren notline">
            <div>
               <el-form-item
            label="连接超时时间"
            
            label-width="200px"
          >
            <el-input
              type="text"
              placeholder="连接超时时间"
              v-model="addchannel.rabbitmqtimeout"
              class="notauto"
              readonly
            >
              <template slot="append">s</template>
            </el-input>
          </el-form-item>
            </div>
              
          </div>
         <div   v-if="addchannel.region=='rabbitmq'"
            class="notlastchildren notline">
            <div>
              <el-form-item
            label="虚拟主机"
          
            label-width="200px"
          >
            <el-input
              type="text"
              placeholder="虚拟主机"
              v-model="addchannel.rabbitmqinvented"
              class="notauto"
              readonly
            ></el-input>
          </el-form-item>
            </div>
            
         </div>
          <div  v-if="addchannel.region=='rabbitmq'"
            class="notlastchildren notline">
            <div>
               <el-form-item
            label="心跳间隔"
           
            label-width="200px"
          >
            <el-input
              type="text"
              placeholder="心跳间隔"
              v-model="addchannel.rabbitmqtimeout"
              class="notauto"
              readonly
            >
              <template slot="append">s</template>
            </el-input>
          </el-form-item>
            </div>
            
          </div>
         <div  v-if="addchannel.region=='rabbitmq'"
            class="notlastchildren notline">
            <div>
               <el-form-item
            label="自动重连间隔"
           
            label-width="200px"
          >
            <el-input
              type="text"
              placeholder="自动重连间隔"
              v-model="addchannel.rabbitmqautoconnect"
              class="notauto"
              readonly
            >
              <template slot="append">s</template>
            </el-input>
          </el-form-item>
            </div>
            
         </div>
          <!--TD配置-->
          <div   class="notlastchildren" v-if="addchannel.region=='TD'">
               <el-form-item
              :label="$t('developer.servicelink')"
              prop="server"
              :rules='[
              { required: true, message: "需要输入路径", trigger: "blur" },
              
            ]'
            >
              <el-input v-model="addchannel.server" autocomplete="off" :placeholder="$t('developer.servicelink')">
                <!-- <template slot="prepend">http://</template> -->
              </el-input>
            </el-form-item>
          </div>
          <div class="notlastchildren" v-if="addchannel.region=='TD'">
            <el-form-item
              :label="$t('developer.libraryname')"
              prop="username"
              :rules='[
                { required: true, message: "请输入用户名", trigger: "blur" }
              ]'
            >
              <el-input
                v-model="addchannel.username"
                autocomplete="off"
                :placeholder="$t('developer.libraryname')"
                type="text"
                class="notauto"
                
              ></el-input>
            </el-form-item>
          </div>
            <div  class="notlastchildren" v-if="addchannel.region=='TD'">
                <el-form-item
              :label="$t('developer.librarypassword')"
              prop="password"
              :rules='[{ required: true, message: "请输入密码", trigger: "blur" }]'
            >
              <el-input
                v-model="addchannel.password"
                autocomplete="off"
                :placeholder="$t('developer.librarypassword')"
                :type="pwdType"
                class="notauto"
                readonly
              >
                <template slot="append">
                  <span class="show-pwd" @click="showPwd" style="cursor:pointer">
                    <svg-icon :icon-class="pwdType=='password' ? 'eye':'zheneys'" />
                  </span>
                </template>
              </el-input>
            </el-form-item>
            </div>
            
            <!--同步间隔提示---------------------------------------------------------------------------------->
            <div class="notlastchildren" v-if="addchannel.region=='TD'">
                <el-form-item
              :label="$t('developer.synchronousinterval')"
              prop="auto_save"
              :rules='[
              { required: true, message: "同步间隔不能为空", trigger: "blur" },
              { type: "number", message: "同步间隔必须为数字值" }
            ]'
            >
              <el-input
                v-model.number="addchannel.auto_save"
                autocomplete="off"
                :min="1"
                :placeholder="$t('developer.synchronousinterval')"
              >
                <template slot="append">秒</template>
              </el-input>
            </el-form-item>
            </div>
            <div class="notlastchildren"  v-if="addchannel.region=='TD'">
              <el-form-item
              :label="$t('developer.amountdata')"
             
              prop="max_size"
              :rules='[
              { required: true, message: "最大条数不能为空", trigger: "blur" },
              { type: "number", message: "最大条数必须为数字值" }
            ]'
              
            >
              <el-input
                v-model.number="addchannel.max_size"
                autocomplete="off"
                :min="1"
                :placeholder="$t('developer.amountdata')"
              >
                <template slot="append">条</template>
              </el-input>
            </el-form-item>
            </div>
            <div class="notlastchildren" v-if="addchannel.region=='TD'">
                 <el-form-item
                  :label="$t('developer.cacheconstraint')"
                  
                  prop="max_memory"
                  :rules='[
              { required: true, message: "最大存储不能为空", trigger: "blur" },
              { type: "number", message: "最大存储必须为数字值" }]'
                  
                >
                  <el-input v-model.number="addchannel.max_memory" autocomplete="off" :min="1">
                    <template slot="append">KB</template>
                  </el-input>
                </el-form-item>
            </div>
        
          
          <!---------------------统一的配置描述---------------------------->
          <el-form-item :label="$t('developer.describe')" class="lastchildren">
            <el-input
              v-model="addchannel.desc"
              autocomplete="off"
              type="textarea"
              :rows="3"
              :placeholder="$t('developer.describe')"
            ></el-input>
          </el-form-item>
          <!-- <el-form-item class="lastchildren">
            <el-button type="success" size="medium" @click="testConnect('addchannel')">{{$t('resource.Testconnection')}}</el-button>
          </el-form-item> -->
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="handleClose">{{$t('developer.cancel')}}</el-button>
          <el-button type="primary" @click="addchannelForm('addchannel')">{{$t('developer.determine')}}</el-button>
        </div>
      </el-dialog>
    </el-tabs>
  </div>
</template>
<script>
import Parse from "parse";
import { setInterval } from 'timers';
import {
  channelConnect,
  updateConnect,
  deleteConnect
} from "@/api/testchannel";
import { subupadte } from "@/api/systemmanage/system";

export default {
  data() {
    return {
      isopen: "suo",
      pwdType: "password",
      tableData: [],
      channelForm: false,
      channelupdated: "新增",
      activeName: "first",
      channelId: "",
      channelformsearch: {
        name: ""
      },
      channelregion: [
         {
          name: "HTTP",
          value: "HTTP",
          channeltype: "资源通道",
        },
        {
          name: "TCP",
          value: "TCPCLI",
          channeltype: "资源通道",
        },
        {
          name: "modbusTCP",
          value: "TCPMRTUC",
          channeltype: "资源通道",
          channelvalue: "2"
        },
        {
          name: "Kafka",
          value: "KAFKA",
          channeltype: "资源通道",
          channelvalue: "2"
        },
         {
          name: "MQTTCLI",
          value: "MQTTCLI",
          channeltype: "资源通道",
          channelvalue: "2"
        },
        {
          name: "MySQL",
          value: "mysql",
          channeltype: "资源通道"
        },
        {
          name: "MongoDB",
          value: "mongodb",
          channeltype: "资源通道"
        },
        {
          name: "Postgresql",
          value: "postgresql",
          channeltype: "资源通道"
        },
        {
          name: "RabbitMq",
          value: "rabbitmq",
          channeltype: "资源通道"
        },
        {
          name: "Influxdb",
          value: "influxdb",
          channeltype: "资源通道"
        },
        {
          name: "DynamoDB",
          value: "dynamodb",
          channeltype: "资源通道"
        },
        {
          name: "Parse",
          value: "PARSE",
          channeltype: "资源通道",
          channelvalue: "2"
        },
        {
          name: "TD",
          value: "TD",
          channeltype: "资源通道",
          channelvalue: "2"
        },
      ],
      addchannel: {
        region: "PARSE",
        port: "",
        path: "0.0.0.0",
        desc: "",
        name:'',
        username:'',
        password:'',
        ip:'',
        buff_size:1024000,
        //td配置
        auto_save: 30,
        max_size: 10000,
        max_memory: 1024000,
        server: "",
        //KAFKA配置
        KAFKAhost: "127.0.0.1",
        KAFKAport: 9092,
        KAFKAname: "",
        KAFKAmetadata: "3s",
        KAFKAduring: "3s",
        KAFKAbuffer: 33554433,
        KAFKAacks: "all",
        KAFKAys: "",
        KAFKAbatch: 16384,
        //其他数据库配置，已pg名称命名
        postgresqlconnect: "",
        postgresqlhost: "",
        postgresqlusername: "",
        postgresqlpassword: "",
        postgresqlport: 5432,
        postgresqldatabase: "postgres",
        postgresqlssl: "disable",
        postgresqllength: "",
        postgresqlname: "",
        isEnable: false,
        //dynamedb
        dynamodbhost: "",
        //rabbitmq
        rabbitmqhost: "",
        rabbitmqusername: "",
        rabbitmqname: "",
        rabbitmqconnect: "",
        rabbitmqpassword: "",
        rabbitmqtimeout: "",
        rabbitmqinvented: "", //虚拟主机
        rabbitmqautoconnect: "", //自动重连间隔
        //parse配置
        parsehost: "127.0.0.1",
        parseport: 9092,
        parseresource:'',
        parseappid:'',
        parsejs_key:'',
        parsemaster_key:'',
        parserest_key:'',
        datamodel:'',
        address: '',
        port: '',  
        username: '',
        password: '',
        clean_start: false,
        ssl: false,
        keepalive: ''
      },
      addrules: {
        name: [{ required: true, message: "请输入通道名称", trigger: "blur" }],
        region: [
          { required: true, message: "请选择服务类型", trigger: "change" }
        ],
        channeltype: [
          { required: true, message: "请选择通道类型", trigger: "change" }
        ],
      },
      length: 10,
      start: 0,
      total: 0,
      resourceid: ""
    };
  },
  mounted() {
    this.Get_Re_Channel(0);
  },
  methods: {
    showPwd() {
      var readonly = document.getElementsByClassName("readonly")[0];
      if (this.isopen == "suo") {
        this.isopen = "opensuo";
        this.pwdType = "text";
      } else {
        this.isopen = "suo";
        this.pwdType = "password";
      }
    },
    //验证
    validUrl(rule, value, callback) {
      let reg = /^[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/;
      if (!reg.test(value)) {
        callback(new Error("需要输入正确的url"));
      } else {
        callback();
      }
    },
    validPort(rule, value, callback) {
      let reg = /^([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/;
      if (!reg.test(value)) {
        callback(new Error("需要输入正确的端口号"));
      } else {
        callback();
      }
    },
    //初始化数据
    Get_Re_Channel(start) {
      if (start == 0) {
        this.start = 0;
      }
      var Channel = Parse.Object.extend("Channel");
      var channel = new Parse.Query(Channel);
      channel.skip(this.start);
      channel.limit(this.length);
      channel.ascending("-updatedAt");
      channel.equalTo('type','2')
      if (this.channelformsearch.name != "") {
        channel.contains("name", this.channelformsearch.name);
      }
      channel.count().then(count => {
        this.total = count;
        channel.find().then(
          resultes => {
            if (resultes) {
              this.tableData = resultes;
            }
          },
          error => {
            if (error.code == "209") {
              this.$message({
                type: "warning",
                message: "登陆权限过期，请重新登录"
              });
              this.$router.push({
                path: "/login"
              });
            } else if (error.code == 119) {
              this.$message({
                type: "error",
                message: "没有操作权限"
              });
            }
          }
        );
      });
    },
    //更新状态
    qyChannel(row,action) {
       subupadte(row.id, action)
        .then(resultes => {
          if (resultes) {
            this.$message({
              type:'success',
              message:`${action=='enable' ? '启用成功':'禁用成功'}`
            });

          }
          this.Get_Re_Channel(0)
        })
        .catch(error => {
          this.$message.error(error.error);
        });
    },
    //编辑设备
    updateChannel(row) {
      this.channelForm = true;
      this.channelupdated = "编辑";
      this.resourceid = row.id
     if(row.attributes.config.datamodel){
       this.addchannel.datamodel = row.attributes.config.datamodel
     }
      this.addchannel.name = row.attributes.name
      this.addchannel.region =row.attributes.cType 
      this.addchannel.desc = row.attributes.desc
      this.addchannel.isEnable = row.attributes.isEnable
      if(row.attributes.cType=='postgresql'||row.attributes.cType=='mongodb'||row.attributes.cType=='mysql'||row.attributes.cType=='influxdb'){
        this.addchannel.postgresqlhost=row.attributes.config.host
        this.addchannel.postgresqlport= row.attriburtes.config.port
        this.addchannel.postgresqlusername = row.attributes.config.username
        this.addchannel.postgresqlpassword= row.attributes.config.password
        this.addchannel.postgresqldatabase = row.attributes.config.database
        this.addchannel.postgresqlname = row.attributes.config.name
        this.addchannel.postgresqllength = row.attributes.config.sql_length
        this.addchannel.postgresqlconnect = row.attributes.config.connect
        this.addchannel.postgresqlssl = row.attributes.config.ssl
      }else if(row.attributes.cType=='TD'){
        this.addchannel.auto_save = row.attributes.config.auto_save
        this.addchannel.max_size = row.attributes.config.max_size
        this.addchannel.max_memory=row.attributes.config.max_memory
        this.addchannel.ip = row.attributes.config.ip
        this.addchannel.port = row.attributes.config.port
        this.addchannel.server = row.attributes.config.path
        this.addchannel.username = row.attributes.config.username
        this.addchannel.password = row.attributes.config.password
      }else if(row.attributes.cType=='HTTP'){
         this.addchannel.path= row.attributes.config.path
         this.addchannel.port = row.attributes.config.port
      }else if(row.attributes.cType=='TCPCLI'||row.attributes.cType=='TCPMRTUC'){
        this.addchannel.path= row.attributes.config.ip
        this.addchannel.port =row.attributes.config.port
        this.addchannel.buff_size=row.attributes.config.buff_size
      }else if(row.attributes.cType=='KAFKA'){
        this.addchannel.KAFKAhost = row.attributes.config.host
        this.addchannel.KAFKAport =row.attributes.config.port
        this.addchannel.KAFKAname = row.attributes.config.name
        this.addchannel.KAFKAduring = row.attributes.config.during
        this.addchannel.KAFKAbuffer= row.attributes.config.buffer
        this.addchannel.KAFKAacks = row.attributes.config.acks
        this.addchannel.KAFKAmetadata =row.attributes.config.metadata
        this.addchannel.KAFKAbatch = row.attributes.config.batch
      }else if(row.attributes.cType=='PARSE'){
        this.addchannel.parsehost= row.attributes.config.host
        this.addchannel.parseport =row.attributes.config.port
        this.addchannel.parseresource=row.attributes.config.path
        this.addchannel.parseappid= row.attributes.config.appid
        this.addchannel.parsemaster_key = row.attributes.config.master_key
        this.addchannel.parserest_key =row.attributes.config.rest_key
        this.addchannel.parsejs_key = row.attributes.config.js_key
      }else if(row.attributes.cType=='rabbitmq'){
        this.addchannel.rabbitmqhost=row.attributes.config.host
        this.addchannel.rabbitmqusername =row.attributes.config.username
        this.addchannel.rabbitmqname= row.attributes.confing.name
        this.addchannel.rabbitmqconnect=row.attributes.config.connect
        this.addchannel.rabbitmqpassword =row.attributes.config.password
        this.addchannel.rabbitmqtimeout=row.attributes.config.timeout
        this.addchannel.rabbitmqinvented= row.attributes.config.invented
        this.addchannel.rabbitmqautoconnect=row.attributes.config.autoconnect
      }else if(row.attributes.cType=='MQTTCLI'){
        this.addchannel.address = row.attributes.config.address,
        this.addchannel.port = row.attributes.config.port,
        this.addchannel.username= row.attributes.config.username
        this.addchannel.password = row.attributes.config.password
        this.addchannel.clean_start = row.attributes.config.clean_start
        this.addchannel.ssl = row.attributes.config.ssl
        this.addchannel.keepalive = row.attributes.config.keepalive
      }
    },
    addchannelForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var Channel = Parse.Object.extend('Channel')
          var channel = new Channel()
           var userid = Parse.User.current().id
            var acl =new Parse.ACL()
            acl.setReadAccess(userid,true)
            acl.setWriteAccess(userid,true)
          if (this.resourceid != "") {
            channel.id = this.resourceid
           }
            if(this.addchannel.region=='postgresql'||this.addchannel.region=='mongodb'||this.addchannel.region=='mysql'||this.addchannel.region=='influxdb'){
              channel.set('config',{
                "host":   this.addchannel.postgresqlhost,
                "port": this.addchannel.postgresqlport,
                "username": this.addchannel.postgresqlusername,
                "password":  this.addchannel.postgresqlpassword,
                "database": this.addchannel.postgresqldatabase,
                "name": this.addchannel.postgresqlname,
                "sql_length": this.addchannel.postgresqllength,
                "connect": this.addchannel.postgresqlconnect,
                "ssl": this.addchannel.postgresqlssl,
                'datamodel':this.addchannel.datamodel!='' ? this.addchannel.datamodel:''
              })   
            }else if (this.addchannel.region == "TD") {
              channel.set("config", {
                auto_save: this.addchannel.auto_save,
                max_size: this.addchannel.max_size,
                max_memory: this.addchannel.max_memory, 
                ip:this.addchannel.ip,
                port:this.addchannel.port,
                path:this.addchannel.server,
                username: this.addchannel.username,
                password: this.addchannel.password,
                datamodel:this.addchannel.datamodel!='' ? this.addchannel.datamodel:''
              });
            } else if (this.addchannel.region == "HTTP") {
              channel.set("config", {
                path: this.addchannel.path,
                port: this.addchannel.port,
                datamodel:this.addchannel.datamodel!='' ? this.addchannel.datamodel:''
              });
            }else if(this.addchannel.region=='KAFKA'){
                channel.set("config", {
                host: this.addchannel.KAFKAhost,
                port: this.addchannel.KAFKAport,
                name:this.addchannel.KAFKAname,
                during:this.addchannel.KAFKAduring,
                buffer:this.addchannel.KAFKAbuffer,
                acks:this.addchannel.KAFKAacks,
                metadata:this.addchannel.KAFKAmetadata,
                batch:this.addchannel.KAFKAbatch,
                datamodel:this.addchannel.datamodel!='' ? this.addchannel.datamodel:''
              });
            }else if(this.addchannel.region=='rabbitmq'){
                channel.set('config',{
                  host:this.addchannel.rabbitmqhost,
                  username:this.addchannel.rabbitmqusername,
                  name:this.addchannel.rabbitmqname,
                  connect:this.addchannel.rabbitmqconnect,
                  password:this.addchannel.rabbitmqpassword,
                  timeout:this.addchannel.rabbitmqtimeout,
                  invented:this.addchannel.rabbitmqinvented,//虚拟主机
                  autoconnect:this.addchannel.rabbitmqautoconnect, //重连机制
                  datamodel:this.addchannel.datamodel!='' ? this.addchannel.datamodel:''
                })
            }
            else if(this.addchannel.region=='PARSE'){
                channel.set('config',{
                 host:this.addchannel.parsehost,
                 port:this.addchannel.parseport,
                 path:this.addchannel.parseresource,
                 appid:this.addchannel.parseappid,
                 master_key:this.addchannel.parsemaster_key,
                 rest_key:this.addchannel.parserest_key,
                 js_key:this.addchannel.parsejs_key,
                 datamodel:this.addchannel.datamodel!='' ? this.addchannel.datamodel:''
                })
            }else if (this.addchannel.region == "TCPCLI"||this.addchannel.region=='TCPMRTUC') {
              channel.set("config", {
                ip: this.addchannel.path,
                port: this.addchannel.port,
                buff_size: this.addchannel.buff_size,
                datamodel:this.addchannel.datamodel!='' ? this.addchannel.datamodel:''
              });
            }else if (this.addchannel.region == "MQTTCLI") {
              channel.set("config", {
                address: this.addchannel.address,
                port: this.addchannel.port,  
                username: this.addchannel.username,
                password: this.addchannel.password,
                clean_start: this.addchannel.clean_start,
                ssl: this.addchannel.ssl,
                keepalive: this.addchannel.keepalive
              });
            }
              channel.set('ACL',acl)
              channel.set('type','2')
              channel.set('name',this.addchannel.name)
              channel.set('cType',this.addchannel.region)
              channel.set('desc',this.addchannel.desc)
              channel.set('isEnable',this.addchannel.isEnable)
              channel.save().then(resultes=>{
                if(resultes){
                  this.$message({
                    type:'success',
                    message:this.channelupdated=='编辑'? '编辑成功':'创建成功'
                  })
                    this.$refs['addchannel'].resetFields();
                    this.channelForm=false
                    this.Get_Re_Channel(0)
                }
              })
           }
      });
    },
    //删除通道
     deleteChannel(scope) {
      var Channel = Parse.Object.extend("Channel");
      var channel = new Channel();
      channel.id = scope.row.id;
      channel.destroy().then(
        resultes => {
          this.$message({
            type: "success",
            message: "删除成功"
          });
          scope._self.$refs[`popover-${scope.$index}`].doClose();
          this.Get_Re_Channel(0);
        },
        error => {
          this.$message({
            type: "error",
            message: error.message
          });
        }
      );
    },
    addchanneltype() {
      this.channelForm = true;
      this.channelupdated = "新增";
    },
    // testConnect(formName) {
    //   this.$refs[formName].validate(valid => {
    //     if (valid) {
    //       console.log(this.$refs[formName])
    //       if (
    //         this.addchannel.region == "mongodb" ||
    //         this.addchannel.region == "mysql" ||
    //         this.addchannel.region == "postgresql" ||
    //         this.addchanneltype.region == "influxdb"
    //       ) {
    //         channelConnect(
    //           this.addchannel.region.toLowerCase(),
    //           this.addchannel.postgresqlhost,
    //           this.addchannel.postgresqlport,
    //           this.addchannel.postgresqlusername,
    //           this.addchannel.postgresqlpassword,
    //           this.addchannel.postgresqldatabase,
    //           this.addchannel.postgresqlname,
    //           this.addchannel.postgresqllength,
    //           this.addchannel.postgresqlconnect,
    //           this.addchannel.postgresqlssl
    //         )
    //           .then(resultes => {
    //             if (resultes) {
    //               this.$notify({
    //                 title: "成功",
    //                 message: "连接可用,通道已创建",
    //                 type: "success",
    //                 duration: 2000
    //               });
    //             }
    //           })
    //           .catch(error => {
    //             this.$notify({
    //               title: "连接不可用",
    //               message: error.reason,
    //               type: "error",
    //               duration: 2000
    //             });
    //           });
    //       }
    //     } else {
    //       this.$message.error("有必填项未填写");
    //       return false;
    //     }
    //   });
    // },
    //关闭弹窗
    handleClose() {
      this.addchannel = {
        region: "PARSE",
        port: "",
        path: "0.0.0.0",
        desc: "",
        name:'',
        username:'',
        password:'',
        ip:'',
        //td配置
        auto_save: 30,
        max_size: 10000,
        max_memory: 1024000,
        server: "",
        //KAFKA配置
        KAFKAhost: "127.0.0.1",
        KAFKAport: 9092,
        KAFKAname: "",
        KAFKAmetadata: "3s",
        KAFKAduring: "3s",
        KAFKAbuffer: 33554433,
        KAFKAacks: "all",
        KAFKAys: "",
        KAFKAbatch: 16384,
        //其他数据库配置，已pg名称命名
        postgresqlconnect: "",
        postgresqlhost: "",
        postgresqlusername: "",
        postgresqlpassword: "",
        postgresqlport: 5432,
        postgresqldatabase: "postgres",
        postgresqlssl: "disable",
        postgresqllength: "",
        postgresqlname: "",
        isEnable: false,
        //dynamedb
        dynamodbhost: "",
        //rabbitmq
        rabbitmqhost: "",
        rabbitmqusername: "",
        rabbitmqname: "",
        rabbitmqconnect: "",
        rabbitmqpassword: "",
        rabbitmqtimeout: "",
        rabbitmqinvented: "", //虚拟主机
        rabbitmqautoconnect: "", //自动重连间隔
        //parse配置
        parsehost: "127.0.0.1",
        parseport: 9092,
        parseresource:'',
        parseappid:'',
        parsejs_key:'',
        parsemaster_key:'',
        parserest_key:''
      };
      this.channelForm = false;
      // this.$refs["addchannel"].resetFields();
      this.resourceid = "";
    },
    getChannelEnable(row, rowIndex) {
      if (row.row.attributes.isEnable == true) {
        return "green_active";
      } else {
        return "red_active";
      }
    },
    //分页
    channelSizeChange(val) {
      this.length = val;
    },
    channelCurrentChange(val) {
      this.start = (val - 1) * this.length;
    },
    removeauto(val) {
      //去掉自动补全
        this.$refs['addchannel'].resetFields();
        this.addchannel.region=val
      setTimeout(() => {
        var notautolength = document.getElementsByClassName("notauto");
        for (var i = 0; i < notautolength.length; i++) {
          notautolength[i].children[0].removeAttribute("readonly");
        }
      }, 100);
    },
    //删除设备
    // deleteChannel(scope) {
    //   deleteConnect(scope.row.id)
    //     .then(resultes => {
    //       if (resultes) {
    //         this.$message.error("删除成功");
    //         scope._self.$refs[`popover-${scope.$index}`].doClose();
    //         this.Get_Re_Channel(0);
    //       }
    //     })
    //     .catch(error => {
    //       this.$message.error(error);
    //     });
    // }
  }
};
</script>
<style lang="scss" scoped>
.resourcechannel {
  width: 100%;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
  /deep/ .green_active {
    color: green;
  }
  /deep/ .red_active {
    color: red;
  }
  /deep/ .el-button + .el-button {
    margin-left: 0;
  }
  /deep/ .el-tabs__item {
    font-size: 16px;
    margin-top: 20px;
    margin: 0;
    height: 50px;
    line-height: 50px;
    font-family: auto;
  }
  .firsttable {
    /deep/ .el-form-item:last-child {
      float: right;
    }
  }
  /deep/ .el-dialog__header {
    border-bottom: 1px solid #cccccc;
  }
  /deep/ .el-dialog__body {
    .el-form {
      display: flex;
      flex-wrap: wrap;
      .notlastchildren{
        width:50%;
      }
      .el-form-item {
        width: 100%;
        .el-select {
          width: 100%;
        }
      }
      .lastchildren {
        width: 100%;
        // .el-form-item__label{
        //   position: relative;
        //   left:20px;
        //   text-align:left;
        // }
      }
      .notlastchildren {
        @media screen and (max-width: 1350px) {
          width: 100%;
        }
      }
      /deep/ .notline {
        .el-form-item__label {
          text-align: left;
          position: relative;
          left: 100px;
          z-index: 100;
        }
        .el-form-item__content {
          margin-left: 100px !important;
        }
        @media screen and (max-width: 1350px) {
          .el-form-item__label {
            text-align: left;
            position: relative;
            left: 30px;
            z-index: 100;
          }
          .el-form-item__content {
            margin-left: 30px !important;
          }
          .el-form-item{
            width:100%;
          }
        }
      }
    }
  }
  /deep/ .el-button--mini {
    margin: 2px 0;
  }
  /deep/ .row-bg {
    .el-form-item__content {
      width: 100%;
    }
  }
  /deep/ .el-dialog__wrapper {
    margin-bottom: 20px;
  }
}
</style>
<style scoped>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none !important;
  margin: 0;
}
</style>