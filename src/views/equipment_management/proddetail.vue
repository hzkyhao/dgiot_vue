<template>
  <div class="editproduct">
    <div class="editheader">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/roles/product' }">{{$t('route.产品管理')}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{$t('route.产品详情')}}</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="product">
        <ul>
          <li>
            <span>产品名称:</span>
            <span>{{productName}}</span>
          </li>
          <li>
            <span>ProductSecret:</span>
            <span v-if="isshow==false">
              ********************
              <el-link
                :underline="false"
                type="primary"
                style="margin-left:5px;cursor:pointer"
                @click="isshow=true"
              >{{$t('product.display')}}</el-link>
            </span>
            <span v-else>
              {{ProductSecret}}
              <el-link
                :underline="false"
                type="primary"
                style="margin-left:5px;cursor:pointer"
                @click="isshow=false"
              >{{$t('product.hidden')}}</el-link>
            </span>
          </li>
          <li>
            <span>{{$t('product.numberofequipment')}}:</span>
            <span>
              {{form.ProductAll}}
              <el-link
                :underline="false"
                type="primary"
                style="margin-left:10px;font-size:16px"
                @click="goToDevices"
              >{{$t('product.gotoequipment')}}</el-link>
            </span>
          </li>
          <li>
            <div class="block">
              <el-image
                v-if="productimg"
                :src="productimg"
                style="max-width:200px;height:auto;position:relative;top:-40px;"
              >
                <div slot="error" class="image-slot">
                  <i class="el-icon-picture-outline"></i>
                </div>
              </el-image>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <!--产品信息-->
        <el-tab-pane :label="$t('product.productinformation')" name="first">
          <div style="background:#ffffff;padding:10px;box-sizing:border-box;">
            <!-- 导出 -->
            <div class="addtopic" style="text-align:right;margin-bottom:10px;">
              <el-button
                type="primary"
                size="small"
                @click="exportProduct"
              >{{$t('product.exportpro')}}</el-button>
            </div>

            <div>
              <table
                class="mailtable"
                style="width:100%;"
                border="0"
                cellspacing="0"
                cellpadding="0"
              >
                <tr>
                  <td class="cloumn notbottom">{{$t('product.productname')}}</td>
                  <td class="notbottom">{{productdetail.name}}</td>
                  <td class="cloumn notbottom">{{$t('product.nodetype')}}</td>
                  <td v-if="productdetail.nodeType==1" class="notbottom">{{$t('product.gateway')}}</td>
                  <td v-else class="notbottom">{{$t('product.equipment')}}</td>
                  <td class="cloumn notbottom">{{$t('product.addingtime')}}</td>
                  <td>{{productdetail.createdAt}}</td>
                </tr>
                <tr>
                  <td class="cloumn notbottom">{{$t('product.classification')}}</td>
                  <td class="notbottom">{{productdetail.category}}</td>
                  <td class="cloumn notbottom">
                    {{$t('product.dynamicregistration')}}
                    <el-tooltip
                      :content="$t('product.text1')"
                      placement="top"
                      style="margin-left:5px;color:#cccccc"
                      effect="light"
                    >
                      <i class="el-icon-question"></i>
                    </el-tooltip>
                  </td>
                  <td class="notbottom">
                    <span v-if="dynamicReg==false" style="color:#cccccc">{{$t('product.close')}}</span>
                    <span v-else>{{$t('product.open')}}</span>
                    <el-switch
                      v-model="dynamicReg"
                      active-color="#5eb058"
                      inactive-color="#cccccc"
                      :active-value="true"
                      :inactive-value="false"
                      @change="handelUpdate($event,dynamicReg)"
                    ></el-switch>
                  </td>
                  <td class="cloumn notbottom">{{$t('product.networking')}}</td>
                  <td class="notbottom" v-if="productdetail.netType=='CELLULAR'">蜂窝(2G/3G/4G)</td>
                  <td class="notbottom" v-else-if="productdetail.netType=='WIFI'">WiFi</td>
                  <td class="notbottom" v-else-if="productdetail.netType=='ETHERNET'">以太网</td>
                  <td class="notbottom" v-else-if="productdetail.netType=='LORA'">LoRaWAN</td>
                  <td class="notbottom" v-else>{{productdetail.netType}}</td>
                </tr>
                <tr>
                  <td class="cloumn">{{$t('developer.describe')}}</td>
                  <td colspan="6">{{productdetail.desc}}</td>
                </tr>
              </table>
            </div>
          </div>
        </el-tab-pane>
        <!--topic列表-->
        <el-tab-pane :label="'Topic'+$t('product.list')" name="second">
          <div style="background:#ffffff;padding:10px;box-sizing:border-box;">
            <div class="addtopic" style="text-align:right;margin-bottom:10px;">
              <el-button
                type="primary"
                size="small"
                @click="topicdialogVisible=true"
              >{{$t('product.customtopicclass')}}</el-button>
            </div>
            <el-table
              :data="topicData.slice((topicstart-1)*topiclength,topicstart*topiclength)"
              style="width: 100%;text-align:center;"
            >
              <el-table-column label="Topic" align="left">
                <template slot-scope="scope">
                  <span>{{scope.row.topic.replace('\$\{ProductId\}', productId)}}</span>
                </template>
              </el-table-column>
              <el-table-column :label="$t('product.operationauthority')" align="center">
                <template slot-scope="scope">
                  <span v-if="scope.row.type=='pub'">{{$t('product.pub')}}</span>
                  <span v-if="scope.row.type=='sub'">{{$t('product.sub')}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="desc" align="center" :label="$t('developer.describe')"></el-table-column>
              <el-table-column :label="$t('developer.operation')" align="center">
                <template slot-scope="scope">
                  <el-button
                    type="primary"
                    size="mini"
                    v-if="!scope.row.isdef"
                    @click="updatetopic(scope.row,scope.$index)"
                  >{{$t('developer.edit')}}</el-button>
                  <el-popover placement="top" width="300" :ref="`popover-${scope.$index}`">
                    <p>确定删除这个{{scope.row.topic}}Topic类吗？</p>
                    <div style="text-align: right; margin: 0">
                      <el-button
                        size="mini"
                        @click="scope._self.$refs[`popover-${scope.$index}`].doClose()"
                      >{{$t('product.cancel')}}</el-button>
                      <el-button
                        type="primary"
                        size="mini"
                        @click="deletetopic(scope,scope.$index)"
                      >{{$t('developer.determine')}}</el-button>
                    </div>
                    <el-button
                      type="danger"
                      size="mini"
                      v-if="!scope.row.isdef"
                      slot="reference"
                    >{{$t('developer.delete')}}</el-button>
                  </el-popover>
                </template>
              </el-table-column>
            </el-table>
            <div class="elpagination" style="margin-top:20px;">
              <el-pagination
                @size-change="topicSizeChange"
                @current-change="topicCurrentChange"
                :page-sizes="[10, 20, 30, 50]"
                :page-size="topiclength"
                layout="total, sizes, prev, pager, next, jumper"
                :total="topicData.length"
              ></el-pagination>
            </div>
          </div>
          <!--topic弹窗-->
          <el-dialog
            :title="$t('product.definetopicclass')"
            :visible.sync="topicdialogVisible"
            width="40%"
            :close-on-click-modal="false"
          >
            <div class="topiccontent">
              <div style="padding:10px;box-sizing:border-box;background:#e6f9fc;font-size:16px;">
                <i class="el-icon-warning"></i>
                {{$t('product.text2')}}
              </div>
              <div class="topicform">
                <el-form ref="topicform" :model="topicform" :rules="topicrule">
                  <el-form-item label="Topic类：" prop="topic">
                    <el-input v-model="topicform.topic">
                      <template slot="prepend">{{'thing/'+productId+'/${DevAddr}/'}}</template>
                    </el-input>
                  </el-form-item>
                  <el-form-item :label="$t('product.operationauthority')" prop="type">
                    <el-select
                      v-model="topicform.type"
                      :placeholder="$t('product.selectdeviceoperationpermission')"
                    >
                      <el-option :label="$t('product.sub')" value="sub"></el-option>
                      <el-option :label="$t('product.pub')" value="pub"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item :label="$t('developer.describe')">
                    <el-input type="textarea" v-model="topicform.desc"></el-input>
                  </el-form-item>
                </el-form>
              </div>
            </div>
            <span slot="footer" class="dialog-footer">
              <el-button @click="topicdialogVisible = false">{{$t('developer.cancel')}}</el-button>
              <el-button
                type="primary"
                @click="subTopic('topicform',topicform.isupdated)"
              >{{$t('developer.determine')}}</el-button>
            </span>
          </el-dialog>
        </el-tab-pane>
        <!--功能定义-->
        <el-tab-pane :label="$t('product.physicalmodel')" name="third">
          <div style="text-align:right">
            <el-button
              type="primary"
              @click="checkschema"
              size="small"
            >{{$t('product.viewobjectmodel')}}</el-button>
            <el-button
              type="primary"
              @click="wmxdialogVisible = true"
              size="small"
            >{{$t('product.newcustomattribute')}}</el-button>
            <el-button
              type="primary"
              @click="addcategory"
              size="small"
            >{{$t('product.newstandardattribute')}}</el-button>
          </div>
          <div>
            <el-table
              :data="wmxData.slice((wmxstart-1)*wmxlength,wmxstart*wmxlength)"
              border
              row-key="identifier"
              style="width: 100%;margin-top:10px;"
              :default-expand-all="false"
              :row-class-name="getRowClass"
            >
              <el-table-column type="expand">
                <template
                  slot-scope="scope"
                  v-if="scope.row.dataType.type=='struct'"
                  class="opentable"
                >
                  <el-table
                    :data="scope.row.dataType.specs"
                    style="width:60%;text-align:center;box-sizing:border-box;"
                  >
                    <el-table-column :label="$t('product.identifier')" align="center">
                      <template slot-scope="scope">
                        <span>{{scope.row.identifier}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column :label="$t('product.functionaltypes')" align="center">
                      <template slot-scope="scope">
                        <span>{{$t('product.attribute')}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column prop="name" :label="$t('product.functionname')" align="center"></el-table-column>
                    <el-table-column :label="$t('product.datadefinition')" align="center">
                      <template slot-scope="scope">
                        <span>{{scope.row.dataType.type}}</span>
                      </template>
                    </el-table-column>
                  </el-table>
                </template>
              </el-table-column>
              <el-table-column prop="identifier" :label="$t('product.identifier')"></el-table-column>
              <el-table-column :label="$t('product.functionaltypes')">
                <template slot-scope="scope">
                  <span>{{$t('product.attribute')}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="name" :label="$t('product.functionname')"></el-table-column>
              <el-table-column :label="$t('product.datatype')">
                <template slot-scope="scope">
                  <span>{{scope.row.dataType.type}}</span>
                </template>
              </el-table-column>
              <el-table-column :label="$t('product.datadefinition')">
                <template slot-scope="scope">
                  <span
                    v-if="scope.row.dataType.specs&&(scope.row.dataType.type=='double'||scope.row.dataType.type=='float'||scope.row.dataType.type=='int')"
                  >{{$t('product.rangeofvalues')+scope.row.dataType.specs.min+'~'+scope.row.dataType.specs.max}}</span>
                  <span
                    v-else-if="scope.row.dataType.type=='string'"
                  >{{$t('product.datalength')+':'+scope.row.dataType.size+$t('product.byte')}}</span>
                  <span v-else-if="scope.row.dataType.type=='date'"></span>
                  <span v-else-if="scope.row.dataType.type!='struct'">{{scope.row.dataType.specs}}</span>
                  <span v-else></span>
                </template>
              </el-table-column>
              <el-table-column :label="$t('developer.operation')">
                <template slot-scope="scope">
                  <el-button
                    type="danger"
                    size="mini"
                    @click="deletewmx(scope.$index)"
                  >{{$t('developer.delete')}}</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!--功能定义分页-->
            <el-pagination
              style="margin-top:10px;"
              @size-change="wmxSizeChange"
              @current-change="wmxCurrentChange"
              :page-sizes="[10, 20, 30, 50]"
              :page-size="wmxlength"
              layout="total, sizes, prev, pager, next, jumper"
              :total="wmxData.length"
            ></el-pagination>
          </div>
          <!--取物模型模板-->
          <el-dialog
            :title="$t('product.addfunction')"
            :visible.sync="originwmx"
            width="50%"
            :close-on-click-modal="false"
          >
            <div>
              <div style="margin:20px 0">
                <label for>{{$t('product.classification')}}</label>
                <el-cascader v-model="category" :options="treeData" @change="handleChange"></el-cascader>
                <el-button
                  type="primary"
                  @click="getPropData(0)"
                  size="mini"
                >{{$t('developer.search')}}</el-button>
              </div>
              <div style="text-align: center;margin-top:10px;">
                <el-table :data="PropData" style="width:100%;text-align:center">
                  <el-table-column label="ID" align="center">
                    <template slot-scope="scope">
                      <span>{{scope.row.attributes.data.SuperId}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column :label="$t('product.identifier')" align="center">
                    <template slot-scope="scope">
                      <span>{{scope.row.attributes.type}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column :label="$t('product.applicabletype')" align="center">
                    <template slot-scope="scope">
                      <span>{{scope.row.attributes.data.CategoryName}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column :label="$t('developer.operation')" align="center">
                    <template slot-scope="scope">
                      <el-button
                        type="primary"
                        size="mini"
                        @click="addProCategory(scope.row)"
                      >{{$t('product.add')}}</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>

              <div>
                <el-pagination
                  style="margin-top:10px;"
                  @size-change="productSizeChange"
                  @current-change="productCurrentChange"
                  :page-sizes="[10, 20, 30, 50]"
                  :page-size="productlength"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="producttotal"
                  small
                ></el-pagination>
              </div>
            </div>
            <span slot="footer" class="dialog-footer">
              <el-button @click="originwmx = false" size="mini">{{$t('developer.cancel')}}</el-button>
              <el-button
                type="primary"
                @click="originwmx = false"
                size="mini"
              >{{$t('developer.determine')}}</el-button>
            </span>
          </el-dialog>
          <!--添加物模型弹窗-->
          <el-dialog
            :title="$t('product.newcustomattribute')"
            :visible.sync="wmxdialogVisible"
            width="40%"
            top="5vh"
            :before-close="wmxhandleClose"
            :close-on-click-modal="false"
          >
            <div class="wmxheader">
              <el-form ref="sizeForm" :model="sizeForm" size="small" :rules="sizerule">
                <!-- update 2020 05-27 hughWang -->
                <!-- 功能名称  -->
                <el-row :gutter="30">
                  <el-col :span="10">
                    <el-form-item :label="$t('product.functionname')" prop="name">
                      <el-input v-model="sizeForm.name"></el-input>
                    </el-form-item>
                  </el-col>

                  <el-col :span="10">
                    <el-form-item :label="$t('product.identifier')" prop="identifier">
                      <el-input v-model="sizeForm.identifier"></el-input>
                    </el-form-item>
                    <!--type-->
                  </el-col>
                </el-row>

                <!--INT,FLOAT,DOUBLE数据类型添加模式-->
                <div v-if="sizeForm.type=='INT'||sizeForm.type=='FLOAT'||sizeForm.type=='DOUBLE'">
                  <el-form-item required label="取值范围(数值)">
                    <el-col :span="9">
                      <el-form-item prop="startnumber">
                        <el-input
                          v-model.number="sizeForm.startnumber"
                          type="number"
                          :placeholder="$t('product.minimumvalue')"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="2">-</el-col>
                    <el-col :span="9">
                      <el-form-item prop="endnumber">
                        <el-input
                          @input="changeValue('sizeForm')"
                          v-model.number="sizeForm.endnumber"
                          type="number"
                          :placeholder="$t('product.maximumvalue')"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                  </el-form-item>

                  <el-row :gutter="30">
                    <el-col :span="10">
                      <el-form-item label="步长" prop="step">
                        <el-input-number
                          v-model="sizeForm.step"
                          controls-position="right"
                          :precision="2"
                          :min="0"
                          :step="0.01"
                        ></el-input-number>
                      </el-form-item>
                    </el-col>

                    <el-col :span="10">
                      <el-form-item :label="$t('product.readandwritetype')" prop="isread">
                        <el-radio-group v-model="sizeForm.isread" size="medium">
                          <el-radio label="rw">{{$t('product.readandwrite')}}</el-radio>
                          <el-radio label="r">{{$t('product.onlyread')}}</el-radio>
                        </el-radio-group>
                      </el-form-item>
                    </el-col>
                  </el-row>

                  <el-row :gutter="30">
                    <el-col :span="10">
                      <!-- 数据类型 -->
                      <el-form-item :label="$t('product.datatype')" prop="type">
                        <!--少个@change=selectStruct-->
                        <el-select v-model="sizeForm.type">
                          <el-option :label="$t('product.struct')" value="STRUCT"></el-option>
                          <el-option :label="$t('product.init')" value="INT"></el-option>
                          <el-option :label="$t('product.float')" value="FLOAT"></el-option>
                          <el-option :label="$t('product.double')" value="DOUBLE"></el-option>
                          <el-option :label="$t('product.bool')" value="BOOL"></el-option>
                          <el-option :label="$t('product.enum')" value="ENUM"></el-option>
                          <el-option :label="$t('product.string')" value="STRING"></el-option>
                          <el-option :label="$t('product.date')" value="DATE"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="2"></el-col>
                    <el-col :span="10">
                      <!-- 单位 -->
                      <el-form-item :label="$t('product.unit')">
                        <el-select
                          v-model="sizeForm.unit"
                          :placeholder="$t('product.unit')"
                          filterable
                        >
                          <el-option
                            v-for="(item,index) in allunit"
                            :label="item.attributes.data.Name+'/'+item.attributes.data.Symbol"
                            :key="index"
                            :value="item.attributes.data.Symbol"
                          ></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>

                  <h3 style="font-size:normal;">数据源配置</h3>

                  <el-divider></el-divider>

                  <div name="dataIdentification">
                    <el-form-item label="数据标识" required>
                      <el-col :span="9">
                        <el-form-item prop="dis">
                          <el-input v-model="sizeForm.dis" placeholder="数据标识"></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="2">-</el-col>
                      <el-col :span="9">
                        <el-form-item>
                          <el-input v-model.number="sizeForm.dinumber" placeholder="数据个数"></el-input>
                        </el-form-item>
                      </el-col>
                    </el-form-item>
                  </div>

                  <el-row :gutter="30">
                    <el-col :span="10">
                      <el-form-item
                        label="修正系数"
                        prop="rate"
                        :rules="[{ type: 'number', message: '请输入数字'}]"
                      >
                        <el-input v-model.number="sizeForm.rate" auto-complete="off"></el-input>
                      </el-form-item>
                    </el-col>

                    <el-col :span="10">
                      <el-form-item
                        label="修正偏移"
                        prop="offset"
                        :rules="[{ type: 'number', message: '请输入数字'}]"
                      >
                        <el-input v-model.number="sizeForm.offset" auto-complete="off"></el-input>
                      </el-form-item>
                    </el-col>

                    <el-col :span="10">
                      <el-form-item label="字节序" prop="byteorder">
                        <el-select v-model="sizeForm.byteorder" placeholder="请选择">
                          <el-option
                            v-for="item in [{value: 'big',label: '大端'},{value:'little',label:'小端'}]"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                          ></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>

                    <el-col :span="10">
                      <el-form-item label="协议类型">
                        <el-select
                          @change="protocolChange"
                          v-model="sizeForm.protocol"
                          placeholder="请选择"
                        >
                          <el-option
                            v-for="(item,index) in ['normal','modbus']"
                            :key="index"
                            :label="item"
                            :value="item"
                          ></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>

                  <el-row  :gutter="30" v-show="showNewItem">

                      <el-col :span="10">
                          <el-form-item label="寄存器状态" prop="byteorder">
                            <el-select v-model="sizeForm.operatetype" placeholder="请选择">
                              <el-option
                                v-for="item in [{value: 'coilStatus',label: '线圈状态'},{value:'输入状态',label:'输入状态'},{value:'holdingRegister',label:'保持寄存器'},{value:'inputRegister',label:'输入寄存器'}]"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                              ></el-option>
                            </el-select>
                          </el-form-item>
                        </el-col>

                        <el-col :span="10">
                          <el-form-item label="数据类型">
                            <el-select
                              v-model="sizeForm.originaltype"
                              placeholder="请选择"
                            >
                              <el-option
                                v-for="(item,index) in ['int16','uint16','int32','uint32','int64','uint64','float','double','string','customizedData']"
                                :key="index"
                                :label="item"
                                :value="item"
                              ></el-option>
                            </el-select>
                          </el-form-item>
                        </el-col>
                    
                  </el-row>
                </div>

                <!--BOOL数据类型添加格式-->
                <div v-if="sizeForm.type=='BOOL'">
                  <el-form-item :label="$t('product.attribute')" required>
                    <div style="height:40px;">
                      <el-col :span="11">
                        <el-form-item>
                          <el-input
                            v-model="sizeForm.truevalue"
                            class="inputnumber"
                            type="number"
                            :placeholder="$t('product.attribute')"
                            readonly
                          ></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="2">-</el-col>
                      <el-col :span="11">
                        <el-form-item prop="true">
                          <el-input
                            v-model="sizeForm.true"
                            class="inputnumber"
                            :placeholder="$t('product.egopen')"
                          ></el-input>
                        </el-form-item>
                      </el-col>
                    </div>
                    <div style="margin-top:20px;">
                      <el-col :span="11">
                        <el-form-item>
                          <el-input
                            v-model="sizeForm.falsevalue"
                            class="inputnumber"
                            type="number"
                            :placeholder="$t('product.attribute')"
                            readonly
                          ></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="2">-</el-col>
                      <el-col :span="11">
                        <el-form-item prop="true">
                          <el-input
                            v-model="sizeForm.false"
                            class="inputnumber"
                            :placeholder="$t('egclose')"
                          ></el-input>
                        </el-form-item>
                      </el-col>
                    </div>
                  </el-form-item>
                </div>
                <!--枚举型添加格式-->
                <div v-if="sizeForm.type=='ENUM'">
                  <el-form-item v-for="(item, index) in sizeForm.specs" :key="index" required>
                    <el-col :span="9">
                      <el-form-item
                        :label="$t('product.attribute')+index"
                        :prop="'specs.'+index+'.attribute'"
                        :rules="[{required: true, message: '输入属性'}]"
                      >
                        <el-input v-model="item.attribute" :placeholder="$t('product.egnumber0')"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col class="line" :span="2">-</el-col>
                    <el-col :span="9">
                      <el-form-item
                        :label="$t('product.attributevalue')+index"
                        :prop="'specs.'+index+'.attributevalue'"
                        :rules="[{required: true, message: '输入属性值'}]"
                      >
                        <el-input
                          v-model="item.attributevalue"
                          :placeholder="$t('developer.describe')"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col class="line" :span="2"></el-col>
                    <el-col class="line" :span="4">
                      <el-link
                        type="primary"
                        @click.prevent="removeDomain(item)"
                        :underline="false"
                        icon="el-icon-minus"
                        style="margin-left:5px;margin-top:30px"
                      >{{$t('developer.delete')}}</el-link>
                    </el-col>
                  </el-form-item>
                  <el-link
                    @click="addDomain"
                    icon="el-icon-plus"
                    type="primary"
                    :underline="false"
                  >{{$t('product.add')}}</el-link>
                </div>
                <!--结构体类型添加格式-->
                <div v-if="sizeForm.type=='STRUCT'">
                  <el-form-item label="JSON对象" required>
                    <ul style="margin:0;padding-left:20px;">
                      <li
                        v-for="(item,index) in sizeForm.struct"
                        :key="index"
                        value="item"
                        style="list-style:none;display:flex;"
                      >
                        <div>
                          <span>{{$t('product.parametername')+':'}}}</span>
                          <span>{{item.name}}</span>
                        </div>
                        <div>
                          <el-link
                            :underline="false"
                            type="primary"
                            style="margin-left:20px"
                            @click="editStruct(item,index)"
                          >{{$t('developer.edit')}}</el-link>
                          <el-link
                            :underline="false"
                            type="primary"
                            @click="deleteStruct(index)"
                          >{{$t('developer.delete')}}</el-link>
                        </div>
                      </li>
                    </ul>
                    <el-link
                      @click="addStruct('structform')"
                      icon="el-icon-plus"
                      type="primary"
                      :underline="false"
                    >{{$t('product.addparameter')}}</el-link>
                  </el-form-item>
                </div>
                <!--字符串添加格式-->
                <div v-if="sizeForm.type=='STRING'">
                  <el-form-item :label="$t('product.datalength')" prop="string">
                    <el-input v-model.number="sizeForm.string" type="number">
                      <template slot="append">{{$t('product.byte')}}</template>
                    </el-input>
                  </el-form-item>
                </div>
                <!--date类型添加格式-->
                <div v-if="sizeForm.type=='DATE'">
                  <el-form-item :label="$t('product.timeformat')">
                    <el-input v-model="sizeForm.date" readonly></el-input>
                  </el-form-item>
                </div>
              </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
              <el-button @click="wmxdialogVisible = false">{{$t('developer.cancel')}}</el-button>
              <!-- 物模型提交 -->
              <el-button
                type="primary"
                @click="submitForm('sizeForm')"
              >{{$t('developer.determine')}}</el-button>
            </span>
          </el-dialog>
          <!--物模型结构体-->
          <el-dialog
            :title="$t('product.addparameter')"
            :visible.sync="structdialog"
            width="40%"
            top="15vh"
            :close-on-click-modal="false"
          >
            <div class="structheader">
              <el-form ref="structform" :model="structform" size="small" :rules="structrule">
                <el-row :gutter="30">
                  <el-col :span="10">
                    <el-form-item :label="$t('product.functionname')" prop="name">
                      <el-input v-model="structform.name"></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('product.identifier')" prop="identifier">
                      <el-input v-model="structform.identifier"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="10">
                    <el-form-item :label="$t('product.datatype')" prop="type">
                      <el-select v-model="structform.type">
                        <el-option :label="$t('product.init')" value="INT"></el-option>
                        <el-option :label="$t('product.float')" value="FLOAT"></el-option>
                        <el-option :label="$t('product.double')" value="DOUBLE"></el-option>
                        <el-option :label="$t('product.bool')" value="BOOL"></el-option>
                        <el-option :label="$t('product.enum')" value="ENUM"></el-option>
                        <el-option :label="$t('product.string')" value="STRING"></el-option>
                        <el-option :label="$t('product.date')" value="DATE"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>

                <div>
                  <el-form-item label="数据标识" required>
                    <el-col :span="11">
                      <el-form-item prop="dis">
                        <el-input v-model="structform.dis" placeholder="数据标识"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="2">-</el-col>
                    <el-col :span="11">
                      <el-form-item>
                        <el-input v-model.number="structform.dinumber" placeholder="数据长度(字节)"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-form-item>
                </div>

                <div
                  v-if="structform.type=='INT'||structform.type=='FLOAT'||structform.type=='DOUBLE'"
                >
                  <el-form-item required label="取值范围(数值)">
                    <el-col :span="9">
                      <el-form-item prop="startnumber">
                        <el-input
                          @input="changeStructValue('structform')"
                          v-model.number="structform.startnumber"
                          type="number"
                          :placeholder="$t('product.minimumvalue')"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="2">-</el-col>
                    <el-col :span="9">
                      <el-form-item prop="endnumber">
                        <el-input
                          v-model.number="structform.endnumber"
                          type="number"
                          :placeholder="$t('product.maximumvalue')"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                  </el-form-item>

                  <el-form-item label="步长" prop="step">
                    <el-input
                      v-model="structform.step"
                      controls-position="right"
                      :precision="2"
                      :step="0.01"
                      :min="0"
                    ></el-input>
                  </el-form-item>

                  <el-form-item :label="$t('product.unit')">
                    <el-select
                      v-model="structform.unit"
                      :placeholder="$t('product.unit')"
                      filterable
                    >
                      <el-option
                        v-for="(item,index) in allunit"
                        :label="item.attributes.data.Name+'/'+item.attributes.data.Symbol"
                        :key="index"
                        :value="item.attributes.data.Symbol"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </div>
                <div v-if="structform.type=='BOOL'">
                  <el-form-item :label="$t('product.attribute')" required>
                    <div style="height:40px;">
                      <el-col :span="11">
                        <el-form-item>
                          <el-input
                            v-model="structform.truevalue"
                            class="inputnumber"
                            type="number"
                            :placeholder="$t('product.attributevalue')"
                            readonly
                          ></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="2">-</el-col>
                      <el-col :span="11">
                        <el-form-item prop="true">
                          <el-input
                            v-model="structform.true"
                            class="inputnumber"
                            :placeholder="$t('product.egopen')"
                          ></el-input>
                        </el-form-item>
                      </el-col>
                    </div>
                    <div style="margin-top:20px;">
                      <el-col :span="11">
                        <el-form-item>
                          <el-input
                            v-model="structform.falsevalue"
                            class="inputnumber"
                            type="number"
                            :placeholder="$t('product.attributevalue')"
                            readonly
                          ></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="2">-</el-col>
                      <el-col :span="11">
                        <el-form-item prop="true">
                          <el-input
                            v-model="structform.false"
                            class="inputnumber"
                            :placeholder="$t('product.egclost')"
                          ></el-input>
                        </el-form-item>
                      </el-col>
                    </div>
                  </el-form-item>
                </div>
                <div v-if="structform.type=='ENUM'">
                  <el-form-item v-for="(item, index) in structform.specs" :key="index" required>
                    <el-col :span="9">
                      <el-form-item
                        :label="$t('product.attribute')+index"
                        :prop="'specs.'+index+'.attribute'"
                        :rules="[{required: true, message: '输入属性'}]"
                      >
                        <el-input v-model="item.attribute" :placeholder="$t('product.egnumber0')"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col class="line" :span="2">-</el-col>
                    <el-col :span="9">
                      <el-form-item
                        :label="$t('product.attribute')+index"
                        :prop="'specs.'+index+'.attributevalue'"
                        :rules="[{required: true, message: '输入属性值'}]"
                      >
                        <el-input
                          v-model="item.attributevalue"
                          :placeholder="$t('developer.describe')"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col class="line" :span="2"></el-col>
                    <el-col class="line" :span="4">
                      <el-link
                        type="primary"
                        @click.prevent="removeDomain1(item)"
                        :underline="false"
                        icon="el-icon-minus"
                        style="margin-left:5px;margin-top:30px"
                      >{{$t('developer.delete')}}</el-link>
                    </el-col>
                  </el-form-item>
                  <el-link
                    @click="addDomain1"
                    icon="el-icon-plus"
                    type="primary"
                    :underline="false"
                  >{{$t('product.add')}}</el-link>
                </div>
                <div v-if="structform.type=='STRING'">
                  <el-form-item :label="$t('product.datalength')" prop="string">
                    <el-input v-model.number="structform.string" type="number">
                      <template slot="append">{{$t('product.byte')}}</template>
                    </el-input>
                  </el-form-item>
                </div>
                <!--date类型添加格式-->
                <div v-if="structform.type=='DATE'">
                  <el-form-item :label="$t('product.timeformat')">
                    <el-input v-model="structform.date" readonly></el-input>
                  </el-form-item>
                </div>
                <el-form-item :label="$t('product.readandwritetype')" prop="isread">
                  <el-radio-group v-model="structform.isread" size="medium">
                    <el-radio label="rw">{{$t('product.readandwrite')}}</el-radio>
                    <el-radio label="r">{{$t('product.onlyread')}}</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
              <el-button @click="structdialog = false">{{$t('developer.cancel')}}</el-button>
              <el-button
                type="primary"
                @click="submitStruct('structform')"
              >{{$t('developer.determine')}}</el-button>
            </span>
          </el-dialog>
        </el-tab-pane>
        <!--协议解析-->
        <div style="diaplay:none;">
          <el-tab-pane label="物解析22" name="fourth">
            <div class="protolheader">
              <el-form
                :inline="true"
                :model="formInline"
                class="demo-form-inline"
                :rules="addRules"
                ref="formInline"
              >
                <el-form-item :label="$t('product.protocolname')" prop="name">
                  <el-input v-model="formInline.name" :placeholder="$t('product.protocolname')"></el-input>
                </el-form-item>
                <el-form-item :label="$t('plugins.version')">
                  <el-input v-model="formInline.version" :placeholder="$t('plugins.version')"></el-input>
                </el-form-item>
                <el-form-item :label="$t('developer.describe')">
                  <el-input v-model="formInline.desc" :placeholder="$t('developer.describe')"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button
                    type="primary"
                    @click="subAce('formInline',true)"
                    size="small"
                  >{{$t('product.preservation')}}</el-button>
                  <el-button type="primary" @click="subAce1('formInline')" size="small">设为公共</el-button>
                  <el-button
                    type="primary"
                    @click="chaxun"
                    size="small"
                  >{{$t('product.publicagreementlibrary')}}</el-button>
                </el-form-item>
                <el-form-item style="display:block">
                  <el-button type="primary" @click="protol" size="small">{{$t('product.compile')}}</el-button>
                  <el-button type="success" @click="updatesubdialog" size="small">热加载</el-button>
                </el-form-item>
              </el-form>
            </div>
            <!--通道热加载-->
            <el-dialog
              title="通道热加载"
              :visible.sync="protoldialog"
              width="50%"
              :close-on-click-modal="false"
            >
              <el-table
                :data="protolchannel"
                style="width: 100%;"
                :row-class-name="getChannelEnable"
                ref="multipleTable"
                @selection-change="handleSelectionChange"
              >
                <el-table-column type="selection" width="55"></el-table-column>
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
                <el-table-column :label="$t('developer.channeladdr')">
                  <template slot-scope="scope">
                    <span>{{'channel/'+scope.row.id}}</span>
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
              </el-table>
              <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="updateAllChannel">确定</el-button>
              </div>
            </el-dialog>
            <!--公共协议库弹窗-->
            <el-dialog
              :title="$t('product.publicagreementlibrary')"
              :visible.sync="dialogTableVisible"
              width="50%"
              :close-on-click-modal="false"
            >
              <el-table :data="gridData" style="width:100%;text-align:center;margin-top:20px;">
                <el-table-column :label="$t('product.protocolname')" align="center">
                  <template slot-scope="scope">
                    <span>{{scope.row.attributes.data.name}}</span>
                  </template>
                </el-table-column>
                <el-table-column :label="$t('plugins.version')" align="center">
                  <template slot-scope="scope">
                    <span>{{scope.row.attributes.data.version}}</span>
                  </template>
                </el-table-column>
                <el-table-column :label="$t('developer.describe')" align="center">
                  <template slot-scope="scope">
                    <span>{{scope.row.attributes.data.desc}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="创建时间" align="center">
                  <template slot-scope="scope">
                    <span>{{utc2beijing(scope.row.attributes.createdAt)}}</span>
                  </template>
                </el-table-column>
                <el-table-column :label="$t('developer.operation')" align="center" width="200">
                  <template slot-scope="scope">
                    <el-button
                      type="primary"
                      size="mini"
                      @click="editordata(scope.row)"
                    >{{$t('product.clone')}}</el-button>
                    <el-button
                      type="danger"
                      size="mini"
                      @click="deletedata(scope.row.id)"
                    >{{$t('developer.delete')}}</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <div class="elpagination" style="padding:20px 0">
                <el-pagination
                  @size-change="decoderSizeChange"
                  @current-change="devicerCurrentChange"
                  :page-sizes="[10, 20, 30, 50]"
                  :page-size="decoderlength"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="decodertotal"
                ></el-pagination>
              </div>
            </el-dialog>
            <div>
              <div style="background:#ffffff">
                <label id="plug-name"></label>
              </div>
              <pre id="editor" class="ace_editor" style="min-height:600px;margin-bottom:0;"><textarea class="ace_text-input"></textarea></pre>
              <div style="background:#ffffff">
                <label id="plug-name"></label>
              </div>
              <div
                style="color:#c2be9e;background:#272822;border-top:1px solid #dddddd;padding:5px"
              >
                <span>{{$t('product.controloutput')}}</span>
              </div>
              <pre
                id="editor2"
                class="ace_editor"
                style="min-height:300px;margin-bottom:0;margin-top:0"
              ><textarea class="ace_text-input"></textarea></pre>
            </div>
          </el-tab-pane>
        </div>
        <!-----------------服务通道------------------------------------------>
        <el-tab-pane :label="$t('product.physicalaccess')" name="fiveth">
          <div class="productchannel" style="text-align:right;padding:10px;">
            <el-button
              type="primary"
              size="small"
              @click="showAllChannel"
            >{{$t('developer.createchannel')}}</el-button>
          </div>
          <div>
            <el-table :data="channelData" style="width: 100%;" :row-class-name="getChannelEnable">
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
              <el-table-column :label="$t('developer.channeladdr')">
                <template slot-scope="scope">
                  <span>{{'channel/'+scope.row.id}}</span>
                </template>
              </el-table-column>
              <el-table-column :label="$t('developer.channeltype')">
                <template slot-scope="scope">
                  <span v-if="scope.row.attributes.type==1">{{$t('developer.collectionchannel')}}</span>
                  <span v-else-if="scope.row.attributes.type==3">任务通道</span>
                </template>
              </el-table-column>
              <el-table-column :label="$t('developer.servicetype')">
                <template slot-scope="scope">
                  <span>{{scope.row.attributes.cType}}</span>
                </template>
              </el-table-column>
              <el-table-column :label="$t('developer.operation')" width="350">
                <template slot-scope="scope">
                  <el-button
                    type="danger"
                    size="mini"
                    @click="deleteRelation(scope.row)"
                  >{{$t('developer.remove')}}</el-button>
                  <el-button type="primary" size="mini" @click="subProTopic(scope.row)">订阅日志</el-button>
                  <el-button type="primary" size="mini" @click="updatesub(scope.row)">重载配置</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="elpagination" style="margin-top:20px;">
              <el-pagination
                @size-change="channelSizeChange"
                @current-change="channelCurrentChange"
                :page-sizes="[10, 20, 30, 50]"
                :page-size="channellength"
                layout="total, sizes, prev, pager, next, jumper"
                :total="channeltotal"
              ></el-pagination>
            </div>

            <!--添加通道-->
          </div>
        </el-tab-pane>
        <!-- <el-tab-pane label="物采集" name="eighth">
          <TaskCollection1 :productId="productId" :isreload="isreload" />
        </el-tab-pane>-->
        <el-tab-pane label="物存储" name="seven">
          <div class="productchannel" style="text-align:right;padding:10px;">
            <el-popover
              title="自定义数据模型提示"
              placement="right"
              width="600"
              @show="questionModel"
              trigger="hover"
            >
              <pre id="editorinsert" class="ace_editor" style="min-height:400px"><el-input class="ace_text-input" type="textarea"></el-input></pre>
              <el-button
                type="primary"
                size="mini"
                slot="reference"
                icon="el-icon-question"
              >自定义数据模型帮助</el-button>
            </el-popover>
            <el-button
              type="primary"
              size="small"
              @click="resourceShowAllChannel"
            >{{$t('developer.createchannel')}}</el-button>
          </div>
          <div>
            <el-table
              :data="resourcechannelData"
              style="width: 100%;"
              :row-class-name="getChannelEnable"
            >
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
              <el-table-column :label="$t('developer.channeladdr')">
                <template slot-scope="scope">
                  <span>{{'channel/'+scope.row.id}}</span>
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
              <el-table-column :label="$t('developer.operation')" width="350">
                <template slot-scope="scope">
                  <el-button
                    type="danger"
                    size="mini"
                    @click="deleteRelation(scope.row)"
                  >{{$t('developer.remove')}}</el-button>
                  <el-button type="primary" size="mini" @click="subProTopic(scope.row)">订阅日志</el-button>

                  <el-button type="primary" size="mini" @click="customize(scope.row)">自定义模型</el-button>

                  <!-- <el-button type="primary" size="mini" @click="customize(scope.row)">自定义模型</el-button> -->
                </template>
              </el-table-column>
            </el-table>
            <div class="elpagination" style="margin-top:20px;">
              <el-pagination
                @size-change="resourcechannelSizeChange"
                @current-change="resourcechannelCurrentChange"
                :page-sizes="[10, 20, 30, 50]"
                :page-size="resourcelength"
                layout="total, sizes, prev, pager, next, jumper"
                :total="resourcetotal"
              ></el-pagination>
            </div>
          </div>
        </el-tab-pane>
        <!-- <el-tab-pane label="物规则" name="sixeth">
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
            <el-table
              :data="engineData"
              style="width: 100%;text-align:center"
              :cell-class-name="getRowindex"
            >
              <el-table-column label="ID" align="center" width="180">
                <template slot-scope="scope">
                  <span @click="detailRules(scope.row.id)">{{scope.row.id}}</span>
                </template>
              </el-table-column>
              <el-table-column :label="$t('rule.TriggerEvent')" align="center">
                <template slot-scope="scope">
                  <span>{{scope.row.for.join(',')}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="rawsql" align="center" label="SQL"></el-table-column>
              <el-table-column align="center" :label="$t('rule.ResponseAction')">
                <template slot-scope="scope">
                  <span>{{actions(scope.row.actions)}}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" :label="$t('developer.operation')">
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
                :page-size="rulepagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="ruletotal"
              ></el-pagination>
            </div>
          </div>

          <div style="width:40%">
            <div>
              <el-tag>{{$t('product.modeltemplate')}}</el-tag>
            </div>
            <pre id="editor6" class="ace_editor" style="min-height:300px;width:100%">
               <textarea class="ace_text-input" style="overflow:scroll"></textarea>
              </pre>
            <el-divider direction="vertical"></el-divider>
          </div>

          <div style="width:30%">
            <div>
              <el-tag>{{$t('product.modelstorage')}}</el-tag>
            </div>
            <pre id="editor4" class="ace_editor" style="min-height:300px;width:100%">
              <textarea class="ace_text-input"></textarea>
            </pre>
            <el-divider direction="vertical"></el-divider>
          </div>

          <div style="width:30%">
            <div>
              <el-tag>{{$t('product.modeldataoutput')}}</el-tag>
              <el-button type="primary" size="small" @click="testgraphql">测试</el-button>
            </div>
            <pre id="editor5" class="ace_editor" style="min-height:300px;width:100%">
              <textarea class="ace_text-input"></textarea>
            </pre>
        </div>-->
        <!-- </el-tab-pane> -->
      </el-tabs>
    </div>
    <!--物模型-->
    <el-dialog
      :title="$t('product.viewobjectmodel')"
      :visible.sync="schemadialogVisible"
      :close-on-click-modal="false"
    >
      <div>
        <div style="background:#ffffff">
          <label id="plug-name"></label>
        </div>
        <pre id="editor1" class="ace_editor" style="min-height:400px"><textarea class="ace_text-input" style="overflow:scroll"></textarea></pre>
      </div>
      <span slot="footer" class="dialog-footer" style="height:30px;">
        <el-button type="primary" @click="preserve">{{$t('developer.determine')}}</el-button>
      </span>
    </el-dialog>
    <!--通道弹窗-->
    <el-dialog
      title="添加通道"
      :visible.sync="innerVisible"
      append-to-body
      :close-on-click-modal="false"
    >
      <div class="addchannel">
        <el-table :data="allchannelData" height="400" style="width: 100%">
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
          <el-table-column :label="$t('developer.channeladdr')">
            <template slot-scope="scope">
              <span>{{'channel/'+scope.row.id}}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('developer.channeltype')">
            <template slot-scope="scope">
              <span v-if="scope.row.attributes.type==1">{{$t('developer.collectionchannel')}}</span>
              <span v-else-if="scope.row.attributes.type==2">{{$t('developer.resourcechannel')}}</span>
              <span v-else>任务通道</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('developer.servicetype')">
            <template slot-scope="scope">
              <span>{{scope.row.attributes.cType}}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('developer.operation')">
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="addProductChannel(scope.row.id)"
                type="primary"
              >{{$t('developer.add')}}</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="elpagination" style="margin-top:20px;">
          <el-pagination
            @size-change="allChannelSizeChange"
            @current-change="allChannelCurrentChange"
            :page-sizes="[10, 20, 30, 50]"
            :page-size="allChannellength"
            layout="total, sizes, prev, pager, next, jumper"
            :total="allChanneltotal"
          ></el-pagination>
        </div>
      </div>
    </el-dialog>
    <!---日志订阅弹窗-->
    <el-dialog
      :title="channelname+'日志'"
      :visible.sync="subdialog"
      :before-close="handleCloseSubdialog"
      width="85%"
      :close-on-click-modal="false"
    >
      <div style="margin-top:20px;">
        <pre id="subdialog" class="ace_editor" style="min-height:300px;width:100%">
                      <textarea class="ace_text-input" style="overflow:scroll"></textarea>
                      </pre>
      </div>

      <!-- </div> -->
      <span slot="footer" class="dialog-footer" style="height:30px;">
        <el-switch
          style="display: inline-block;margin-right:10px;"
          v-model="value4"
          active-color="#13ce66"
          inactive-color="#ff4949"
          inactive-text="自动刷新"
          @change="stopsub"
        ></el-switch>
        <!-- <el-button type="success" size="mini" @click="stopsub('start')" v-if="subaction=='start'">启动</el-button>
        <el-button type="warning" size="mini" @click="stopsub('stop')" v-else>停止</el-button>-->
      </span>
    </el-dialog>
    <!--资源通道关联模型-->
    <el-dialog
      :visible.sync="resourcedialogFormVisible"
      width="90%"
      top="1vh"
      :close-on-click-modal="false"
      :show-close="false"
      :before-close="closeWuDialog"
    >
      <el-form :model="resourceform" ref="resourceform">
        <div class="wumoxing">
          <el-row>
            <el-col :span="8">
              <div class="grid-content bg-purple">
                <el-form-item label="物模型">
                  <pre id="editormodel" class="ace_editor" style="min-height:600px"><el-input class="ace_text-input" type="textarea"></el-input></pre>
                </el-form-item>
              </div>
            </el-col>
            <el-col :span="16">
              <div class="grid-content bg-purple-light">
                <el-form-item label="自定义数据模型">
                  <pre id="editorcreate" class="ace_editor" style="min-height:600px"><el-input class="ace_text-input" type="textarea"></el-input></pre>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeWuDialog">退 出</el-button>
        <el-button type="primary" @click="addData">保 存</el-button>
      </div>
    </el-dialog>

    <el-dialog title="导出" :visible.sync="exportDialogShow" width="25%">
      <!-- <p class="export-p">  <a :href="exportUrl" :download="exportNameDownload">文件下载 </a></p>       -->

      <div slot="footer" class="dialog-footer">
        <el-button size="small" class="btn-right" @click="exportDialogShow = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Parse from "parse";
import { getRule, ruleDelete } from "@/api/rules";
import Cookies from "js-cookie";
var editor;
var editor1;
var editor2;
var editorgraphql;
var editor5;
var editor6;
var subdialog;
var editormodel;
var editorcreate;
var editorinsert;
var editorsubtable;
var channelrow = {};
let Base64 = require("js-base64").Base64;
var setdata = "";
var isallchannel = false;
var isupdatetrue = "";
import { Compile, subupadte } from "@/api/systemmanage/system";
import { getIndustry } from "@/api/applicationManagement";
import { setTimeout } from "timers";
import gql from "graphql-tag";
import { postFile } from "@/api/appcontrol";
import {
  Websocket,
  sendInfo,
  TOPIC_EMPTY,
  MSG_EMPTY,
  DISCONNECT_MSG
} from "@/utils/wxscoket.js";
// import TaskCollection1 from "./task_collection1";
import { returnLogin } from "@/utils/return";
import { error } from "util";
import $ from "jquery";
export default {
  // components: {
  //   TaskCollection1
  // },
  data() {
    var validCode = (rule, value, callback) => {
      let reg = /[0-9a-zA-Z]/;
      if (!reg.test(value)) {
        callback(new Error("协议名称由数字和字母组合"));
      } else {
        callback();
      }
    };
    var validminnumber = (rule, value, callback) => {
      console.log(value);
      if (value === "") {
        callback(new Error("最小值不能为空"));
      } else {
        //   if(value<0){
        //   callback(new Error('最小值不能小于0'))
        // }else{
        if (this.sizeForm.endnumber !== "") {
          if (value >= this.sizeForm.endnumber) {
            callback(new Error("最小值小于最大值"));
          } else {
            callback();
          }
        }
        // }
      }
    };
    var validmaxnumber = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("最大值不能为空"));
      } else {
        if (this.sizeForm.startnumber !== "") {
          if (value <= this.sizeForm.startnumber) {
            callback(new Error("最大值必须大于最小值"));
          } else {
            callback();
          }
        }
        // }
      }
    };
    var vailspecs = (rule, value, callback) => {
      if (value < 0) {
        callback(new Error("步长大于0"));
      } else if (value >= this.sizeForm.endnumber - this.sizeForm.startnumber) {
        callback(new Error("步长必须小于最大值和最小值的差值"));
      } else {
        callback();
      }
    };
    var validstructminnumber = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("最小值不能为空"));
      } else {
        //   if(value<0){
        //   callback(new Error('最小值不能小于0'))
        // }else{
        if (this.structform.endnumber !== "") {
          if (value >= this.structform.endnumber) {
            callback(new Error("最小值小于最大值"));
          } else {
            callback();
          }
          // }
        }
      }
    };
    var validstructmaxnumber = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("最大值不能为空"));
      } else {
        // if(value<0){
        //   callback(new Error('最大值不能小于0'))
        // }else{
        if (this.structform.startnumber !== "") {
          if (value <= this.structform.startnumber) {
            callback(new Error("最大值必须大于最小值"));
          } else {
            callback();
          }
        }
        // }
      }
    };
    var vailstructspecs = (rule, value, callback) => {
      if (value < 0) {
        callback(new Error("步长大于0"));
      } else if (
        value >=
        this.structform.endnumber - this.structform.startnumber
      ) {
        callback(new Error("步长必须小于最大值和最小值的差值"));
      } else {
        callback();
      }
    };
    return {
      //topic数据
      multipleSelection: [],
      protolchannel: [],
      protoldialog: false,
      productimg: "",
      topicdialogVisible: false,
      topicform: {
        topic: "",
        type: "",
        desc: "",
        isupdated: -1
      },
      exportDialogShow: false,
      exportUrl: "",
      exportName: "",
      decodertotal: 0,
      decoderstart: 0,
      decoderlength: 10,
      topicrule: {
        topic: [{ required: true, message: "请输入Topic类", trigger: "blur" }],
        type: [
          { required: true, message: "请选择Topic权限", trigger: "change" }
        ]
      },
      topicstart: 1,
      topiclength: 10,
      topictotal: 0,
      //服务通道数据
      channelData: [],
      allchannelData: [],
      innerVisible: false,
      allChannelstart: 0,
      allChannellength: 10,
      allChanneltotal: 0,
      //物模型数据
      category: [],
      current: 0,
      schemadialogVisible: false,
      PropData: [],
      originwmx: false,
      wmxdialogVisible: false,
      //自定义物模型
      allunit: [],
      sizeForm: {
        resource: 1,
        identifier: "",
        dis: "",
        dinumber: "",
        type: "INT",
        startnumber: "",
        endnumber: "",
        step: "",
        true: "",
        truevalue: 1,
        false: "",
        falsevalue: 0,
        isread: "r",
        unit: "",
        string: "",
        date: "String类型的UTC时间戳 (毫秒)",
        specs: [
          {
            attribute: "",
            attributevalue: ""
          }
        ],
        struct: [],
        rate: 1,
        offset: 0,
        byteorder: "big",
        protocol: "normal",
        operatetype:'inputRegister',
        originaltype:'int16'


      },
      sizerule: {
        step: [{ required: true, trigger: "blur", validator: vailspecs }],
        string: [
          { required: true, trigger: "blur", message: "请输入数据长度" },
          { type: "number", message: "数据长度必须为数字" }
        ],
        startnumber: [
          { validator: validminnumber, required: true, trigger: "blur" }
        ],
        endnumber: [
          { validator: validmaxnumber, required: true, trigger: "blur" }
        ],
        resource: [
          { required: true, message: "请选择功能类型", trigger: "change" }
        ],
        true: [{ required: true, message: "请输入属性值", trigger: "blur" }],
        false: [{ required: true, message: "请输入属性值", trigger: "blur" }],
        name: [{ required: true, message: "请输入属性名称", trigger: "blur" }],
        identifier: [
          { required: true, message: "请输入标识符", trigger: "blur" }
        ],
        dis: [{ required: true, message: "请输入数据标识", trigger: "blur" }],
        type: [
          { required: true, message: "请选择数据类型", trigger: "change" }
        ],
        attribute: [{ required: true, message: "请输入属性", trigger: "blur" }],
        attributevalue: [
          { required: true, message: "请输入属性值", trigger: "blur" }
        ],
        isread: [
          { required: true, message: "请选择读写类型", trigger: "change" }
        ]
      },
      //结构体判断规则
      structrule: {
        string: [
          { required: true, trigger: "blur", message: "请输入数据长度" },
          { type: "number", message: "数据长度必须为数字" }
        ],
        step: [{ required: true, trigger: "blur", validator: vailstructspecs }],
        startnumber: [
          { validator: validstructminnumber, required: true, trigger: "blur" }
        ],
        endnumber: [
          { validator: validstructmaxnumber, required: true, trigger: "blur" }
        ],
        resource: [
          { required: true, message: "请选择功能类型", trigger: "change" }
        ],
        true: [{ required: true, message: "请输入属性值", trigger: "blur" }],
        false: [{ required: true, message: "请输入属性值", trigger: "blur" }],
        name: [{ required: true, message: "请输入属性名称", trigger: "blur" }],
        identifier: [
          { required: true, message: "请输入标识符", trigger: "blur" }
        ],
        dis: [{ required: true, message: "请输入数据标识", trigger: "blur" }],
        type: [
          { required: true, message: "请选择数据类型", trigger: "change" }
        ],
        attribute: [{ required: true, message: "请输入属性", trigger: "blur" }],
        attributevalue: [
          { required: true, message: "请输入属性值", trigger: "blur" }
        ],
        isread: [
          { required: true, message: "请选择读写类型", trigger: "change" }
        ]
      },
      structdialog: false,
      structform: {
        resource: 1,
        identifier: "",
        type: "INT",
        startnumber: "",
        endnumber: "",
        step: "",
        true: "",
        truevalue: 1,
        false: "",
        falsevalue: 0,
        isread: "r",
        unit: "",
        date: "String类型的UTC时间戳 (毫秒)",
        string: "",
        specs: [],
        dis: "",
        dinumber: ""
      },
      tableData: [],
      activeName: "first",
      form: {
        Productname: "",
        ProductKey: "",
        ProductAll: 0
      },
      ProductSecret: "",
      dynamicReg: false,
      productId: "",
      productName: "",
      productdetail: {},
      topicData: [],
      topic: [
        {
          topic: "thing/${ProductId}/${DevAddr}/post",
          type: "pub",
          desc: "设备上报",
          isdef: true
        },
        {
          topic: "thing/${ProductId}/${DevAddr}",
          type: "sub",
          desc: "消息下发",
          isdef: true
        }
      ],
      isshow: false,
      addRules: {
        name: [
          { required: true, message: "请输入协议名称", trigger: "blur" },
          { validator: validCode, trigger: "blur" }
        ]
      },
      dialogTableVisible: false,
      gridData: [],
      formInline: {
        name: "",
        version: "",
        desc: "",
        resource: false
      },
      objectId: "",
      option: [],
      CategoryKey: "",
      productstart: 0,
      productlength: 10,
      producttotal: 0,
      wmxstart: 1,
      wmxlength: 10,
      wmxtotal: 20,
      wmxData: [],
      warningeditror: [],
      channellength: 10,
      channelstart: 0,
      channeltotal: 0,
      isupdatedstruct: -1,
      issub: false,
      subtimer: null,
      subdialog: false,
      textarea: "",
      subdialogtimer: null,
      subdialogid: "",
      subaction: "stop",
      channelname: "",
      value4: true,
      //规则配置
      rulepagesize: 10,
      rulestart: 0,
      ruletotal: 0,
      engineData: [],
      //物存储型式
      channeltype: 0,
      resourcechannelData: [],
      resourcestart: 0,
      resourcelength: 10,
      resourcetotal: 0,
      //自定义模型模板
      resourcedialogFormVisible: false,
      resourceform: {},
      resourcechannelid: "",
      isreload: 1,
      showNewItem:false
    };
  },
  watch: {
    issub: {
      deep: true,
      handler(val) {
        this.subtimer = window.setInterval(() => {
          this.subAce("formInline", false);
        }, 5000);
      }
    }
  },
  computed: {
    treeData() {
      let cloneData = JSON.parse(JSON.stringify(this.option)); // 对源数据深度克隆
      return cloneData.filter(father => {
        let branchArr = cloneData.filter(child => father.id == child.parentid); //返回每一项的子级数组
        branchArr.length > 0 ? (father.children = branchArr) : ""; //如果存在子级，则给父级添加一个children属性，并赋值
        return father.parentid == 0; //返回第一层
      });
    }
  },
  mounted() {
    //editor编辑器使用
    editor2 = ace.edit("editor2");
    editor2.session.setMode("ace/mode/text"); // 设置语言
    editor2.setTheme("ace/theme/monokai"); // 设置主题
    editor2.setReadOnly(true);
    editor2.setOptions({
      enableBasicAutocompletion: true,
      enableSnippets: true,
      enableLiveAutocompletion: true // 设置自动提示
    });
    this.Industry();
    this.getAllunit();
    if (this.$route.query.activeName) {
      this.activeName = this.$route.query.activeName;
    }
  },
  methods: {
    protocolChange(val) {
      if (val == "modbus") {
        this.showNewItem = true;
      } else {
         this.showNewItem = false;
      }
    },
    changeValue(formName) {
      this.$refs[formName].validateField("startnumber", errMsg => {
        if (errMsg) {
          return false;
        } else {
        }
      });
    },
    changeStructValue(formName) {
      this.$refs[formName].validateField("startnumber", errMsg => {
        if (errMsg) {
          return false;
        } else {
        }
      });
    },
    //判断是否为结构体，可展开
    getRowClass(row, rowIndex) {
      if (row.row.dataType.type != "struct") {
        //判断当前行是否有子数据
        return "row-expand-cover";
      }
    },
    getChannelEnable(row, rowIndex) {
      if (row.row.attributes.isEnable == true) {
        return "green_active";
      } else {
        return "red_active";
      }
    },
    handleClick(val) {
      if (val.name == "fiveth") {
        this.getProductChannel();
      } else if (val.name == "second") {
        this.getTopic();
      } else if (val.name == "seven") {
        this.getResourceChannel();
      } else if (val.name == "sixeth") {
        this.orginRule();
      } else if (val.name == "eighth") {
        this.isreload++;
      } else if (val.name != "fourth") {
        window.clearInterval(this.subtimer);
        this.subtimer = null;
      }
    },
    getAllunit() {
      this.allunit = [];
      var Dict = Parse.Object.extend("Dict");
      var datas = new Parse.Query(Dict);
      var arr = [{}];
      datas.equalTo("type", "unit");
      datas.limit(1000);
      datas.find().then(
        response => {
          this.allunit = response.concat([]);
          this.allunit.unshift({
            attributes: {
              data: {
                Name: "无",
                Symbol: ""
              }
            }
          });
        },
        error => {
          returnLogin(error);
        }
      );
    },
    getTopic() {
      var Product = Parse.Object.extend("Product");
      var product = new Parse.Query(Product);
      product.get(this.productId).then(
        resultes => {
          if (resultes) {
            this.topicData = resultes.attributes.topics.concat(this.topic);
          }
        },
        error => {
          returnLogin(error);
        }
      );
    },
    exportProduct() {
      var _this = this;
      /*
      postFile (_this.productName).then(response=>{
        if(response){
           window.location.origin = "/iotapi/product?name="+_this.productName
              
        }
      })
      .catch(function (error) {       
       _this.$message({message: error,type: "error"});
      }); 
      */

      // let url = Cookies.get('apiserver') + '/product?name=' + _this.productName;

      let url = "/product?name=" + _this.productName;
      _this.$axios
        .get(url)
        .then(function(response) {
          /*      let content = response;               
                _this.exportNameDownload = _this.productName + '.json'; 
                var blob = new Blob([content]);
                _this.exportUrl = URL.createObjectURL(blob);
                _this.exportDialogShow = true;  
                */

          if (response) {
            window.open(
              window.location.origin +
                "/iotapi/product?name=" +
                _this.productName,
              "_blank"
            );
          }

          // window.location.origin = "/iotapi/product?name="+_this.productName;
        })
        .catch(function(error) {
          _this.$message({ message: error, type: "error" });
        });

      // $.ajax({
      //   type: 'GET',
      //   contentType:'application/json',
      //   dataType:'json',
      //   headers:{
      //     "sessionToken":Cookies.get('access_token')
      //   },
      //   data:{},
      //   url: Cookies.get('apiserver') + '/product?name=' + _this.productName,
      //   success:(response)=>{
      //     if(response){

      //    this.exportDialogShow = true;
      //   _this.exportUrl = ''
      //   _this.exportName = ''
      //     }
      //   }
      // })
    },
    //热加载弹窗
    updatesubdialog() {
      this.protoldialog = true;
      var Channel = Parse.Object.extend("Channel");
      var query = new Parse.Query(Channel);
      var Product = Parse.Object.extend("Product");
      var product = new Product();
      product.id = this.productId;
      query.equalTo("product", product);
      query.equalTo("type", "1");
      query.ascending("-updatedAt");
      query.find().then(
        res => {
          this.protolchannel = res;
          this.$refs.multipleTable.toggleAllSelection();
        },
        error => {
          returnLogin(error);
        }
      );
    },
    //通道全选
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    updateAllChannel() {
      if (this.multipleSelection.length == 0) {
        this.protoldialog = false;
      } else {
        var arr = [];
        this.multipleSelection.map(item => {
          arr.push(
            new Promise((reslove, reject) => {
              return subupadte(item.id, "update")
                .then(resultes => {
                  if (resultes) {
                    reslove(resultes);
                  }
                })
                .catch(error => {
                  reject(error);
                });
            })
          );
        });
        Promise.all(arr)
          .then(data => {
            this.$message({
              message: "热加载成功",
              type: "success"
            });
            if (data.length == this.multipleSelection.length) {
              this.protoldialog = false;
            }
          })
          .catch(error => {
            this.$message({
              message: error,
              type: "error"
            });
          });
      }
    },
    getProductChannel() {
      var Channel = Parse.Object.extend("Channel");
      var query = new Parse.Query(Channel);
      var Product = Parse.Object.extend("Product");
      var product = new Product();
      product.id = this.productId;
      query.equalTo("product", product);
      query.containedIn("type", ["1", "3"]);
      query.skip(this.channelstart);
      query.limit(this.channellength);
      query.ascending("-updatedAt");
      query.count().then(
        count => {
          this.channeltotal = count;
          query.find().then(res => {
            this.channelData = res;
            if (res.length == 0) {
              isallchannel = true;
            } else {
              isallchannel = false;
            }
          });
        },
        error => {
          returnLogin(error);
        }
      );
    },
    getResourceChannel() {
      var Channel = Parse.Object.extend("Channel");
      var query = new Parse.Query(Channel);
      var Product = Parse.Object.extend("Product");
      var product = new Product();
      product.id = this.productId;
      query.equalTo("product", product);
      query.equalTo("type", "2");
      query.skip(this.channelstart);
      query.limit(this.channellength);
      query.ascending("-updatedAt");
      query.count().then(
        count => {
          this.resourcetotal = count;
          query.find().then(res => {
            this.resourcechannelData = res;
            if (res.length == 0) {
              isallchannel = true;
            } else {
              isallchannel = false;
            }
          });
        },
        error => {
          returnLogin(error);
        }
      );
    },
    //添加关联
    addProductChannel(id) {
      var Channel = Parse.Object.extend("Channel");
      var channel = new Channel();
      channel.id = id;
      var relation = channel.relation("product");
      var Product = Parse.Object.extend("Product");
      var product = new Product();
      product.set("objectId", this.productId);
      relation.add(product);
      channel.save().then(
        res => {
          if (res) {
            this.$message({
              type: "success",
              message: "添加成功"
            });
            if (this.channeltype == 1) {
              this.showAllChannel();
              this.getProductChannel();
            } else {
              this.resourceShowAllChannel();
              this.getResourceChannel();
            }
          }
        },
        error => {
          returnLogin(error);
        }
      );
    },
    //解除关联
    deleteRelation(row) {
      var Channel = Parse.Object.extend("Channel");
      var channel = new Channel();
      channel.id = row.id;
      var relation = channel.relation("product");
      var Product = Parse.Object.extend("Product");
      var product = new Product();
      product.set("objectId", this.productId);
      relation.remove(product);
      channel.save().then(
        res => {
          if (res) {
            this.$message({
              type: "success",
              message: "删除成功"
            });
            if (this.channeltype == 1) {
              this.getProductChannel();
            } else {
              this.getResourceChannel();
            }
          }
        },
        error => {
          returnLogin(error);
        }
      );
    },
    //关联服务通道分页
    channelSizeChange(val) {
      this.channellength = val;
      this.getProductChannel();
    },
    channelCurrentChange(val) {
      this.channelstart = (val - 1) * this.channellength;
      this.getProductChannel();
    },
    //资源通道关联
    resourcechannelSizeChange(val) {
      this.resourcelength = val;
      this.getResourceChannel();
    },
    resourcechannelCurrentChange(val) {
      this.resourcestart = (val - 1) * this.resourcelength;
      this.getResourceChannel();
    },
    //展示全部服务通道
    showAllChannel() {
      this.channeltype = 1;
      this.innerVisible = true;
      var Channel = Parse.Object.extend("Channel");
      var query = new Parse.Query(Channel);
      var Product = Parse.Object.extend("Product");
      var product = new Product();
      product.id = this.productId;
      query.skip(this.allChannelstart);
      query.limit(this.allChannellength);
      query.containedIn("type", ["1", "3"]);
      query.ascending("-updatedAt");
      if (!isallchannel) {
        query.notEqualTo("product", product);
      }
      query.count().then(
        count => {
          this.allChanneltotal = count;
          query.find().then(resultes => {
            this.allchannelData = resultes;
          });
        },
        error => {
          returnLogin(error);
        }
      );
    },
    allChannelSizeChange(val) {
      this.allChannellength = val;
      this.showAllChannel();
    },
    allChannelCurrentChange(val) {
      this.allChannelstart = (val - 1) * this.allChannellength;
      this.showAllChannel();
    },
    //得到全部未关联资源通道
    resourceShowAllChannel() {
      this.channeltype = 2;
      this.innerVisible = true;
      var Channel = Parse.Object.extend("Channel");
      var query = new Parse.Query(Channel);
      var Product = Parse.Object.extend("Product");
      var product = new Product();
      product.id = this.productId;
      query.skip(this.resourcestart);
      query.limit(this.resourcelength);
      query.equalTo("type", "2");
      query.ascending("-updatedAt");
      if (!isallchannel) {
        query.notEqualTo("product", product);
      }
      query.count().then(
        count => {
          this.allChanneltotal = count;
          query.find().then(resultes => {
            this.allchannelData = resultes;
          });
        },
        error => {
          returnLogin(error);
        }
      );
    },
    //自定义模型弹窗
    customize(row) {
      this.resourcedialogFormVisible = true;
      this.resourcechannelid = row.id;
      // for (var key in row.attributes.config) {
      //   channelrow[key] = row.attributes.config[key];
      // }
      channelrow = JSON.parse(JSON.stringify(row.attributes.config));
      // console.log(row,channelrow)
      setTimeout(() => {
        editormodel = ace.edit("editormodel");
        editormodel.session.setMode("ace/mode/json"); // 设置语言
        editormodel.setTheme("ace/theme/twilight"); // 设置主题
        editormodel.setOptions({
          enableBasicAutocompletion: true,
          enableSnippets: true,
          enableLiveAutocompletion: true // 设置自动提示
        });
        editormodel.setReadOnly(true);
        editormodel.setValue(JSON.stringify(this.productdetail.thing, null, 4));
        //物建表
        editorcreate = ace.edit("editorcreate");
        editorcreate.session.setMode("ace/mode/mysql"); // 设置语言
        editorcreate.setTheme("ace/theme/twilight"); // 设置主题
        editorcreate.setOptions({
          enableBasicAutocompletion: true,
          enableSnippets: true,
          enableLiveAutocompletion: true // 设置自动提示
        });
        if (
          row.attributes.config.datamodel &&
          row.attributes.config.datamodel != ""
        ) {
          editorcreate.setValue(row.attributes.config.datamodel);
        } else {
          editorcreate.setValue(`{
            "vars":{
              "database":"aosong",
              "stable":"meter",
              "value":[
                {
                  "timestamp":"TIMESTAMP",
                  "bytes":8
                },
                {
                  "temperature":"FLOAT",
                  "bytes":4
                },
                {
                  "humidity":"FLOAT",
                  "bytes":4
                }
              ],
              "tags":[
                {
                  "devaddr":"BINARY",
                  "bytes":12
                }
              ],
              "table":"devaddr",
              "keep":3650
            },
            "sql":{
              "create_database":"CREATE DATABASE IF NOT EXISTS \${database} KEEP \${keep}",
              "drop_database":"DROP DATABASE IF EXISTS \${database}",
              "creat_stable":"CREATE TABLE IF NOT EXISTS \${database}.\${stable} (\${timestamp} TIMESTAMP, temperature FLOAT, humidity FLOAT) TAGS(devaddr BINARY[12]);",
              "drop_stable":"DROP TABLE \${database}.\${stable}",
              "insert_stable":"INSERT INTO \${database}.\${table} USING \${database}.\${stable} TAGS (\${devaddr}) VALUES (\${temperature}, \${humidity})",
              "insert_table":"INSERT INTO \${database}.\${table} VALUES (\${temperature}, \${humidity})",
              "create_table":"CREATE TABLE \${databas}.\${table} USING \${database}.\${stable} TAGS (\${devaddr});"
            }
          }`);
        }
        //物存储

        //子表
        //   editorsubtable = ace.edit("editorsubtable");
        //   editorsubtable.session.setMode("ace/mode/mysql"); // 设置语言
        //   editorsubtable.setTheme("ace/theme/gob"); // 设置主题
        //   editorsubtable.setOptions({
        //     enableBasicAutocompletion: true,
        //     enableSnippets: true,
        //     enableLiveAutocompletion: true // 设置自动提示
        //   });
        //   if(row.attributes.config.subtable){
        //     editorsubtable.setValue(row.attributes.config.subtable)
        //   }else{
        //     editorsubtable.setValue('')
        //   }
      });
    },
    questionModel() {
      setTimeout(() => {
        editorinsert = ace.edit("editorinsert");
        editorinsert.session.setMode("ace/mode/mysql"); // 设置语言
        editorinsert.setTheme("ace/theme/gob"); // 设置主题
        editorinsert.setOptions({
          enableBasicAutocompletion: true,
          enableSnippets: true,
          enableLiveAutocompletion: true // 设置自动提示
        });
        editorinsert.setValue(`{
          "vars":{
            "database":"database",
            "table":"stable",
            "value":[
              {
                "timestamp":"TIMESTAMP",
                "bytes":8
              },
              {
                "int":"INT",
                "bytes":4
              },
              {
                "bigint":"BIGINT",
                "bytes":8
              },
              {
                "float":"FLOAT",
                "bytes":4
              },
              {
                "double":"DOUBLE",
                "bytes":8
              },
              {
                "binary":"BINARY",
                "bytes":"自定义"
              },
              {
                "smallint":"SMALLINT",
                "bytes":2
              },
              {
                "tinyint":"TINYINT",
                "bytes":1
              },
              {
                "bool":"BOOL",
                "bytes":1
              },
              {
                "nchar":"NCHAR",
                "bytes":"自定义"
              }
            ],
            "tags":[
              {
                "int":"INT",
                "bytes":4
              },
              {
                "bigint":"BIGINT",
                "bytes":8
              },
              {
                "float":"FLOAT",
                "bytes":4
              },
              {
                "double":"DOUBLE",
                "bytes":8
              },
              {
                "binary":"BINARY",
                "bytes":"自定义"
              },
              {
                "smallint":"SMALLINT",
                "bytes":2
              },
              {
                "tinyint":"TINYINT",
                "bytes":1
              },
              {
                "bool":"BOOL",
                "bytes":1
              },
              {
                "nchar":"NCHAR",
                "bytes":"自定义"
              }
            ]
          },
          "sql":{
            "create_database":"CREATE DATABASE IF NOT EXISTS {{database}} KEEP {{keep}}",
            "drop_database":"DROP DATABASE IF EXISTS {{database}}",
            "creat_stable":"CREATE TABLE IF NOT EXISTS {{database}}.{{stable}} ({{timestamp}} TIMESTAMP, temperature FLOAT, humidity FLOAT) TAGS(devaddr BINARY[12]);",
            "drop_stable":"DROP TABLE {{database}}.{{stable}}",
            "insert_stable":"INSERT INTO {{database}}.{{table}} USING {{database}}.{{stable}} TAGS ({{devaddr}}) VALUES ({{temperature}}, {{humidity}})",
            "insert_table":"INSERT INTO {{database}}.{{table}} VALUES ({{temperature}}, {{humidity}})",
            "create_table":"CREATE TABLE {{database}}.{{table}} USING {{database}}.{{stable}} TAGS ({{devaddr}});"
          }
        }`);
      });
    },
    //添加自定义模型
    addData() {
      // console.log(channelrow)
      var Channel = Parse.Object.extend("Channel");
      var channel = new Channel();
      channel.id = this.resourcechannelid;
      channelrow.datamodel = editorcreate.getValue();
      channel.set("config", channelrow);
      channel.save().then(
        response => {
          if (response) {
            this.$message("添加成功");
          }
        },
        error => {
          returnLogin(error);
        }
      );
    },
    closeWuDialog() {
      this.resourcedialogFormVisible = false;
      this.resourcechannelid = "";
    },
    //删除枚举型
    removeDomain(item) {
      var index = this.sizeForm.specs.indexOf(item);
      if (index !== -1) {
        this.sizeForm.specs.splice(index, 1);
      }
    },
    addDomain() {
      this.sizeForm.specs.push({
        value: "",
        name: ""
      });
    },
    removeDomain1(item) {
      var index = this.structform.specs.indexOf(item);
      if (index !== -1) {
        this.structform.specs.splice(index, 1);
      }
    },
    addDomain1() {
      this.structform.specs.push({
        value: "",
        name: ""
      });
    },
    //物模型提交
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var obj = {};
          var Product = Parse.Object.extend("Product");
          var product = new Parse.Query(Product);
          product.get(this.productId).then(response => {
            //提交之前需要先判断类型
            if (
              this.sizeForm.type == "FLOAT" ||
              this.sizeForm.type == "DOUBLE" ||
              this.sizeForm.type == "INT"
            ) {
              obj = {
                name: this.sizeForm.name,
                dataType: {
                  type: this.sizeForm.type.toLowerCase(),
                  specs: {
                    max: this.sizeForm.endnumber,
                    min: this.sizeForm.startnumber,
                    step: this.sizeForm.step,
                    unit: this.sizeForm.unit == "" ? "" : this.sizeForm.unit
                  }
                },
                dataForm: {
                  address: this.sizeForm.dis,
                  quantity: this.sizeForm.dinumber,
                  rate: this.sizeForm.rate,
                  offset: this.sizeForm.offset,
                  byteorder: this.sizeForm.byteorder,
                  protocol: this.sizeForm.protocol,
                  operatetype: this.sizeForm.operatetype,
                  originaltype: this.sizeForm.originaltype
                },
                required: true,
                accessMode: this.sizeForm.isread,
                identifier: this.sizeForm.identifier
              };
              // 去除多余的属性
              if(!this.showNewItem){
                  delete obj.dataForm.operatetype
                  delete obj.dataForm.originaltype
              }
            } else if (this.sizeForm.type == "BOOL") {
              obj = {
                name: this.sizeForm.name,
                dataType: {
                  type: this.sizeForm.type.toLowerCase(),
                  specs: {
                    "0": this.sizeForm.false,
                    "1": this.sizeForm.true
                  }
                },
                dataForm: {
                  address: this.sizeForm.dis,
                  quantity: this.sizeForm.dinumber
                },
                required: false,
                accessMode: this.sizeForm.isread,
                identifier: this.sizeForm.identifier
              };
            } else if (this.sizeForm.type == "ENUM") {
              var specs = {};
              this.sizeForm.specs.map(items => {
                var newkey = items["attribute"];
                specs[newkey] = items["attributevalue"];
              });
              obj = {
                name: this.sizeForm.name,
                dataType: {
                  type: this.sizeForm.type.toLowerCase(),
                  specs: specs
                },
                dataForm: {
                  address: this.sizeForm.dis,
                  quantity: this.sizeForm.dinumber
                },
                required: true,
                accessMode: this.sizeForm.isread,
                identifier: this.sizeForm.identifier
              };
            } else if (this.sizeForm.type == "STRUCT") {
              obj = {
                name: this.sizeForm.name,
                dataType: {
                  type: this.sizeForm.type.toLowerCase(),
                  specs: this.sizeForm.struct
                },
                dataForm: {
                  address: this.sizeForm.dis,
                  quantity: this.sizeForm.dinumber
                },
                required: true,
                accessMode: this.sizeForm.isread,
                identifier: this.sizeForm.identifier
              };
            } else if (this.sizeForm.type == "STRING") {
              obj = {
                name: this.sizeForm.name,
                dataType: {
                  type: this.sizeForm.type.toLowerCase(),
                  size: this.sizeForm.string
                },
                dataForm: {
                  address: this.sizeForm.dis,
                  quantity: this.sizeForm.dinumber
                },
                required: true,
                accessMode: this.sizeForm.isread,
                identifier: this.sizeForm.identifier
              };
            } else if (this.sizeForm.type == "DATE") {
              obj = {
                name: this.sizeForm.name,
                dataType: {
                  type: this.sizeForm.type.toLowerCase()
                },
                dataForm: {
                  address: this.sizeForm.dis,
                  quantity: this.sizeForm.dinumber
                },
                required: true,
                accessMode: this.sizeForm.isread,
                identifier: this.sizeForm.identifier
              };
            }
            this.productdetail.thing.properties.unshift(obj);
            response.set("thing", this.productdetail.thing);
            response.save().then(
              resultes => {
                if (resultes) {
                  this.$message({
                    type: "success",
                    message: "添加成功"
                  });
                  this.getProDetail();
                  this.$refs[formName].resetFields();

                  this.wmxdialogVisible = false;
                }
              },
              error => {
                returnLogin(error);
              }
            );
          });
        } else {
          console.log(valid);
          console.log("error submit!!");
          return false;
        }
      });
    },
    //物模型结构体
    submitStruct(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var obj = {};
          if (
            this.structform.type == "FLOAT" ||
            this.structform.type == "DOUBLE" ||
            this.structform.type == "INT"
          ) {
            obj = {
              name: this.structform.name,
              dataType: {
                type: this.structform.type.toLowerCase(),
                specs: {
                  max: this.structform.endnumber,
                  min: this.structform.startnumber,
                  step: this.structform.step,
                  unit: this.structform.unit == "" ? "" : this.structform.unit
                }
              },
              dataForm: {
                address: this.structform.dis,
                quantity: this.structform.dinumber
              },
              required: true,
              accessMode: this.structform.isread,
              identifier: this.structform.identifier
            };
          } else if (this.structform.type == "BOOL") {
            obj = {
              name: this.structform.name,
              dataType: {
                type: this.structform.type.toLowerCase(),
                specs: {
                  "0": this.structform.false,
                  "1": this.structform.true
                }
              },
              dataForm: {
                address: this.structform.dis,
                quantity: this.structform.dinumber
              },
              required: false,
              accessMode: this.structform.isread,
              identifier: this.structform.identifier
            };
          } else if (this.structform.type == "ENUM") {
            var specs = {};
            this.structform.specs.map(items => {
              var newkey = items["attribute"];
              specs[newkey] = items["attributevalue"];
            });
            obj = {
              name: this.structform.name,
              dataType: {
                type: this.structform.type.toLowerCase(),
                specs: specs
              },
              dataForm: {
                address: this.structform.dis,
                quantity: this.structform.dinumber
              },
              required: true,
              accessMode: this.structform.isread,
              identifier: this.structform.identifier
            };
          } else if (this.structform.type == "STRING") {
            obj = {
              name: this.structform.name,
              dataType: {
                type: this.structform.type.toLowerCase(),
                size: this.structform.string
              },
              dataForm: {
                address: this.structform.dis,
                quantity: this.structform.dinumber
              },
              required: true,
              accessMode: this.structform.isread,
              identifier: this.structform.identifier
            };
          } else if (this.structform.type == "DATE") {
            obj = {
              name: this.structform.name,
              dataType: {
                type: this.structform.type.toLowerCase()
              },
              dataForm: {
                address: this.structform.dis,
                quantity: this.structform.dinumber
              },
              required: true,
              accessMode: this.structform.isread,
              identifier: this.structform.identifier
            };
          }
          if (this.isupdatedstruct == -1) {
            this.sizeForm.struct.push(obj);
          } else {
            this.sizeForm.struct.splice(this.isupdatedstruct, 1, obj);
            this.isupdatedstruct = -1;
          }
          this.$refs[formName].resetFields();
          this.structdialog = false;
        } else {
        }
      });
    },
    //选择结构体
    //  selectStruct(val){
    //   if(val=='STRUCT'){
    //     this.structdialog = true
    //   }else{
    //     this.structdialog = false
    //   }

    // },
    //新增结构体
    addStruct(formName) {
      this.structdialog = true;
      this.structform = {
        resource: 1,
        identifier: "",
        type: "INT",
        startnumber: "",
        endnumber: "",
        step: "",
        true: "",
        truevalue: 1,
        false: "",
        falsevalue: 0,
        isread: "r",
        unit: "",
        specs: [],
        date: "String类型的UTC时间戳 (毫秒)",
        string: ""
      };
    },
    editStruct(item, index) {
      console.log(item, index);
      this.isupdatedstruct = index;
      this.structdialog = true;
      this.structform.type = item.dataType.type.toUpperCase();
      this.structform.name = item.name;
      this.structform.identifier = item.identifier;
      this.structform.isread = item.accessMode;
      if (
        item.dataType.type == "float" ||
        item.dataType.type == "double" ||
        item.dataType.type == "int"
      ) {
        this.structform.startnumber = item.dataType.specs.min;
        this.structform.endnumber = item.dataType.specs.max;
        this.structform.step = item.dataType.specs.step;
        this.structform.unit = item.dataType.specs.unit;
      } else if (item.dataType.type == "bool") {
        this.structform.true = item.dataType.specs["1"];
        this.structform.false = item.dataType.specs["0"];
      } else if (item.dataType.type == "enum") {
        this.structform.specs = [];
        var obj = {};
        Object.keys(item.dataType.specs).forEach((value, index) => {
          obj.attribute = value;
          obj.attributevalue = item.dataType.specs[value];
          this.structform.specs.push(obj);
        });
      } else if (item.dataType.type == "string") {
        this.structform.string = item.dataType.size;
      }
    },
    //删除结构体
    deleteStruct(index) {
      this.sizeForm.struct.splice(index, 1);
    },
    preserve() {
      var Product = Parse.Object.extend("Product");
      var product = new Parse.Query(Product);
      product.get(this.productId).then(response => {
        response.set("thing", JSON.parse(editor1.getValue()));
        response.save().then(
          resultes => {
            if (resultes) {
              this.$message({
                type: "success",
                message: "保存成功"
              });
              this.schemadialogVisible = false;
            }
          },
          error => {
            this.$message({
              type: "error",
              message: error.message
            });
          }
        );
      });
    },
    Industry() {
      this.option = [];
      var Dict = Parse.Object.extend("Dict");
      var datas = new Parse.Query(Dict);
      datas.equalTo("data.key", "category");
      datas.limit(1000);
      datas.find().then(
        response => {
          if (response) {
            response.map(items => {
              var obj = {};
              obj.value = items.attributes.type;
              obj.label = items.attributes.data.CategoryName;
              obj.id = items.attributes.data.Id;
              obj.parentid = items.attributes.data.SuperId;
              this.option.push(obj);
            });
            this.getProDetail();
          }
        },
        error => {
          this.$message(error.message);
        }
      );
    },
    utc2beijing(utc_datetime) {
      // 转为正常的时间格式 年-月-日 时:分:秒
      var date = new Date(+new Date(utc_datetime) + 8 * 3600 * 1000)
        .toISOString()
        .replace(/T/g, " ")
        .replace(/\.[\d]{3}Z/, "");
      return date; // 2017-03-31 16:02:06
    },
    getPropData(start) {
      if (start == 0) {
        this.productstart = 0;
      }
      this.CategoryKey = this.$route.query.CategoryKey;
      var Dict = Parse.Object.extend("Dict");
      var datas = new Parse.Query(Dict);
      datas.limit(this.productlength);
      datas.skip(this.productstart);
      if (this.category.length != 0) {
        datas.equalTo("type", this.category[this.category.length - 1]);
      }
      datas.equalTo("data.key", "category"),
        datas.count().then(count => {
          this.producttotal = count;
          datas.find().then(
            res => {
              this.PropData = res;
            },
            error => {
              returnLogin(error);
            }
          );
        });
    },
    productSizeChange(val) {
      this.productlength = val;
      this.getPropData();
    },
    productCurrentChange(val) {
      this.productstart = (val - 1) * this.productlength;
      this.getPropData();
    },
    //查看物模型模板
    checkschema() {
      this.schemadialogVisible = true;
      setTimeout(() => {
        editor1 = ace.edit("editor1");
        editor1.session.setMode("ace/mode/json"); // 设置语言
        editor1.setTheme("ace/theme/eclipse"); // 设置主题
        editor1.setOptions({
          enableBasicAutocompletion: true,
          enableSnippets: true,
          enableLiveAutocompletion: true // 设置自动提示
        });
        editor1.setValue(JSON.stringify(this.productdetail.thing, null, 4));
      }, 1);
    },
    //得到产品详情
    getProDetail() {
      editor = ace.edit("editor");
      editor.session.setMode("ace/mode/erlang"); // 设置语言
      editor.setTheme("ace/theme/monokai"); // 设置主题
      editor.setOptions({
        enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: true // 设置自动提示
      });

      // editor6 = ace.edit("editor6");
      // editor6.session.setMode("ace/mode/json"); // 设置语言
      // editor6.setTheme("ace/theme/twilight"); // 设置主题
      // editor6.setOptions({
      //   enableBasicAutocompletion: true,
      //   enableSnippets: true,
      //   enableLiveAutocompletion: true // 设置自动提示
      // });

      this.productId = this.$route.query.id;
      var Product = Parse.Object.extend("Product");
      var product = new Parse.Query(Product);
      product.get(this.productId).then(
        response => {
          if (response) {
            this.productName = response.attributes.name;
            for (var key in response.attributes) {
              this.productdetail[key] = response.attributes[key];
            }
            this.option.map(items => {
              if (this.productdetail.category == items.value) {
                this.productdetail.category = items.label;
              }
            });
            this.productdetail.createdAt = this.utc2beijing(response.createdAt);
            this.productdetail.id = response.id;
            this.dynamicReg = response.attributes.dynamicReg;
            this.productdetail.isshow = 0;
            this.form.Productname = response.attributes.name;
            this.ProductSecret = response.attributes.productSecret;
            this.form.Productkey = this.productId;
            // window.location.origin
            this.productimg = response.attributes.icon;
            if (response.attributes.decoder) {
              setdata = response.attributes.decoder.code;
              this.formInline.name = response.attributes.decoder.name;
              this.formInline.version = response.attributes.decoder.version;
              this.formInline.desc = response.attributes.decoder.desc;
            } else {
              setdata =
                "JSUlLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLQolJSUgQGNvcHlyaWdodCAoQykgMjAxOCwgPHNodXdhPgolJSUgQGRvYwolJSUg5Y2P6K6u6Kej5p6QRGVtbwolJSUgQGVuZAolJSUgQ3JlYXRlZCA6IDA4LiDljYHkuIDmnIggMjAxOCAxNDo0OQolJSUtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tCi1tb2R1bGUoc2h1d2FfZGVtb19kZWNvZGVyKS4KLWF1dGhvcigic2h1d2EiKS4KLWRlZmluZShNU0dfVFlQRSwgPDwiREVNTyI+PikuCi1wcm90b2NvbChbPDwiREVNTyI+Pl0pLgoKLWV4cG9ydChbcGFyc2VfZnJhbWUvMiwgdG9fZnJhbWUvMV0pLgoKCnBhcnNlX2ZyYW1lKEJ1ZmYsIE9wdHMpIC0+CiAgICBwYXJzZV9mcmFtZShCdWZmLCBbXSwgT3B0cykuCgoKcGFyc2VfZnJhbWUoPDw+PiwgQWNjLCBfT3B0cykgLT4KICAgIHs8PD4+LCBBY2N9OwpwYXJzZV9mcmFtZSg8PDE2IzY4LCBSZXN0L2JpbmFyeT4+ID0gQmluLCBBY2MsIF9PcHRzKSB3aGVuIGJ5dGVfc2l6ZShSZXN0KSA9PCA2IC0+CiAgICB7QmluLCBBY2N9OwpwYXJzZV9mcmFtZSg8PDE2IzY4LCBMZW46MTYvbGl0dGxlLWludGVnZXIsIExlbjoxNi9saXR0bGUtaW50ZWdlciwgMTYjNjgsIFJlc3QvYmluYXJ5Pj4gPSBCaW4sIEFjYywgT3B0cykgLT4KICAgIGNhc2UgYnl0ZV9zaXplKFJlc3QpIC0gMiA+PSBMZW4gb2YKICAgICAgICB0cnVlIC0+CiAgICAgICAgICAgIGNhc2UgUmVzdCBvZgogICAgICAgICAgICAgICAgPDxVc2VyWm9uZTpMZW4vYnl0ZXMsIENyYzo4LCAxNiMxNiwgUmVzdDEvYmluYXJ5Pj4gLT4KICAgICAgICAgICAgICAgICAgICBBY2MxID0KICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBzaHV3YV91dGlsczpnZXRfcGFyaXR5KFVzZXJab25lKSA9Oj0gQ3JjIG9mCiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cnVlIC0+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgRnJhbWUgPSAjewogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8PCJtc2d0eXBlIj4+ID0+ID9NU0dfVFlQRSwKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPDwiZGF0YSI+PiA9PiBVc2VyWm9uZQogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQWNjICsrIFtGcmFtZV07CiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmYWxzZSAtPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEFjYwogICAgICAgICAgICAgICAgICAgICAgICBlbmQsCiAgICAgICAgICAgICAgICAgICAgcGFyc2VfZnJhbWUoUmVzdDEsIEFjYzEsIE9wdHMpOwogICAgICAgICAgICAgICAgXyAtPgogICAgICAgICAgICAgICAgICAgIHBhcnNlX2ZyYW1lKFJlc3QsIEFjYywgT3B0cykKICAgICAgICAgICAgZW5kOwogICAgICAgIGZhbHNlIC0+CiAgICAgICAgICAgIHtCaW4sIEFjY30KICAgIGVuZDsKcGFyc2VfZnJhbWUoPDxfOjgsIFJlc3QvYmluYXJ5Pj4sIEFjYywgT3B0cykgLT4KICAgIHBhcnNlX2ZyYW1lKFJlc3QsIEFjYywgT3B0cykuCgoKJSUg57uE6KOF5oiQ5bCB5YyFLCDlj4LmlbDkuLpNYXDlvaLlvI8KdG9fZnJhbWUoI3s8PCJtc2d0eXBlIj4+IDo9ID9NU0dfVFlQRX0gPSBGcmFtZSkgLT4KICAgIFBheWxvYWQgPSB0ZXJtX3RvX2JpbmFyeShGcmFtZSksCiAgICA8PDE2IzAzLCBQYXlsb2FkL2JpbmFyeSwgMTYjMjM+Pi4=";
            }
            if (!this.productdetail.thing) {
              this.productdetail.thing = {
                properties: []
              };
              this.wmxData = this.productdetail.thing.properties.concat([]);
            } else {
              this.wmxData = this.productdetail.thing.properties.concat([]);
            }
            editor.setValue(Base64.decode(setdata));
            editor.gotoLine(editor.session.getLength());
            // editor6.setValue(JSON.stringify(this.productdetail.thing, null, 4));
            var Device = Parse.Object.extend("Device");
            var devices = new Parse.Query(Device);

            devices.equalTo("product", this.productId);
            devices.skip(0);
            devices.count().then(count => {
              this.form.ProductAll = count;
            });
          }
        },
        error => {
          returnLogin(error);
        }
      );
    },
    //产品修改
    handelUpdate(event, row) {
      var isopen;
      if (event == true) {
        isopen = false;
      } else {
        isopen = true;
      }
      this.dynamicReg = isopen;
      var Product = Parse.Object.extend("Product");
      var product = new Parse.Query(Product);
      product.get(this.productId).then(response => {
        response.set("dynamicReg", !isopen);
        response.save().then(
          resultes => {
            if (resultes) {
              this.$message({
                type: "success",
                message: "修改成功"
              });
              this.dynamicReg = !isopen;
            }
          },
          error => {
            returnLogin(error);
          }
        );
      });
      // var isopen =
    },
    //    updateisshow(isshow){
    //     this.$set(this.productdetail,'isshow',isshow)
    //     console.log(this.productdetail)

    //    }
    wmxhandleClose() {
      this.wmxdialogVisible = false;
    },
    //协议编辑
    protol() {
      var log = "";
      Compile(Base64.encode(editor.getValue()))
        .then(res => {
          if (res) {
            this.$message({
              type: "success",
              message: "编译成功"
            });
            log = "编译成功" + res.mod + "\r\n";
            this.warningeditror = res.warnings;
            this.warningeditror.map(items => {
              log += items + "\r\n";
            });
            isupdatetrue += log;
            editor2.setValue(isupdatetrue);
          }
        })
        .catch(error => {
          this.warningeditror = error.error;
          this.warningeditror.map(items => {
            log += items + "\r\n";
          });
          isupdatetrue += log;
          editor2.setValue(isupdatetrue);
        });
    },
    decoderSizeChange(val) {
      this.decoder.length = val;
      this.chaxun();
    },
    devicerCurrentChange(val) {
      this.decoderstart = (val - 1) * this.decoderlength;
      this.chaxun();
    },
    deletedata(id) {
      var Dict = Parse.Object.extend("Dict");
      var datas = new Dict();
      datas.id = id;
      datas.destroy().then(
        resultes => {
          if (resultes) {
            this.$message("成功删除");
            this.chaxun();
          }
        },
        error => {
          returnLogin(error);
        }
      );
    },
    subAce(formName, istrue) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var obj = {
            name: this.formInline.name,
            version: this.formInline.version,
            code: Base64.encode(editor.getValue()),
            desc: this.formInline.desc
          };
          var Product = Parse.Object.extend("Product");
          var product = new Product();
          product.id = this.productId;
          // product.get(this.productId).then(object => {
          product.set("decoder", obj);
          product.save().then(
            res => {
              if (this.issub == false) {
                this.$message({
                  type: "success",
                  message: "保存成功"
                });
                if (istrue == true) {
                  isupdatetrue += "保存成功" + "\r\n";
                  editor2.setValue(isupdatetrue);
                }
              } else {
              }
              this.issub = true;
            },
            error => {
              returnLogin(error);
            }
          );
          // });
        } else {
          this.$message({
            type: "warning",
            message: "输入格式有误"
          });
        }
      });
    },
    subAce1(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var userid = Parse.User.current().id;
          var obj = {
            name: this.formInline.name,
            version: this.formInline.version,
            code: Base64.encode(editor.getValue()),
            desc: this.formInline.desc
          };

          var Dict = Parse.Object.extend("Dict");
          var datas1 = new Parse.Query(Dict);
          datas1.equalTo("data.name", obj.name);
          datas1.equalTo("data.version", obj.version);

          datas1.find().then(
            response => {
              if (response) {
                if (response.length >= 1) {
                  this.$messages("此协议版本已存在");
                  return;
                } else {
                  var datas = new Dict();
                  var acl = new Parse.ACL();
                  acl.setReadAccess(userid, true);
                  acl.setWriteAccess(userid, true);
                  acl.setPublicReadAccess(true);
                  datas.set("type", "decoder");
                  datas.set("data", obj);
                  datas.set("ACL", acl);
                  datas.save().then(
                    resultes => {
                      if (resultes) {
                        this.$message("保存到公共协议库成功");
                      }
                    },
                    error => {
                      this.$message(error.message);
                    }
                  );
                }
              }
            },
            error => {
              returnLogin(error);
            }
          );
        } else {
          this.$message({
            type: "warning",
            message: "输入格式有误"
          });
        }
      });
    },
    //通道更新协议状态
    updatesub(row) {
      subupadte(row.id, "update")
        .then(resultes => {
          if (resultes) {
            this.$message("重载成功");
          }
        })
        .catch(error => {
          this.$message(error.error);
        });
    },

    chaxun() {
      var Dict = Parse.Object.extend("Dict");
      var datas = new Parse.Query(Dict);
      datas.skip(this.decoderstart);
      datas.limit(this.decoderlength);
      datas.equalTo("type", "decoder");
      datas.ascending("-createdAt");
      datas.count().then(
        count => {
          this.decodertotal = count;
          datas.find().then(resultes => {
            if (resultes) {
              this.dialogTableVisible = true;
              this.gridData = resultes;
            }
          });
        },
        error => {
          returnLogin(error);
        }
      );
    },
    editordata(row) {
      this.formInline.name = row.attributes.data.name;
      this.formInline.version = row.attributes.data.version;
      this.formInline.desc = row.attributes.data.desc;
      this.formInline.resource = row.attributes.data.enable;
      editor.setValue(Base64.decode(row.attributes.data.code));
      this.dialogTableVisible = false;
    },
    goToDevices() {
      this.$router.push({
        path: "/roles/thing",
        query: {
          productid: this.productId
        }
      });
    },
    addcategory() {
      this.originwmx = true;
      this.getPropData();
    },
    handleChange(value, direction, movedKeys) {
      console.log(value, direction, movedKeys);
    },
    //用于处理定义好的物模型模板
    TypeInstall(origin, arr) {
      console.log(arr);
      arr.map((items, index) => {
        if (items.DataType == "enum" || items.DataType == "bool") {
          var obj = {
            dataType: {
              specs: {}
            }
          };
          obj.name = items.Name;
          obj.dataType.type = items.DataType;
          obj.required = items.Required;
          obj.identifier = items.Identifier;
          obj.accessMode = items.RwFlag == 1 ? "r" : "rw";
          JSON.parse(items.DataSpecsList).map(child => {
            for (var key in child) {
              var attribute = child["value"];
              var value = child["name"];
              obj.dataType.specs[attribute] = value;
            }
          });
          origin.push(obj);
        } else if (
          items.DataType == "double" ||
          items.DataType == "int" ||
          items.DataType == "float"
        ) {
          var obj = {
            dataType: {
              specs: {}
            }
          };
          obj.name = items.Name;
          obj.dataType.type = items.DataType;
          obj.required = items.Required;
          obj.identifier = items.Identifier;
          obj.accessMode = items.RwFlag == 1 ? "r" : "rw";
          for (var key in JSON.parse(items.DataSpecs)) {
            obj.dataType.specs.min = JSON.parse(items.DataSpecs)["min"];
            obj.dataType.specs.max = JSON.parse(items.DataSpecs)["max"];
            obj.dataType.specs.step = JSON.parse(items.DataSpecs)["step"];
            obj.dataType.specs.unit = JSON.parse(items.DataSpecs)["unit"];
          }
          origin.push(obj);
          //分开结构体单独遍历
        } else if (items.DataType == "struct") {
          var structobj = {
            dataType: {
              specs: []
            }
          };
          structobj.name = items.Name;
          structobj.dataType.type = items.DataType;
          structobj.required = items.Required ? false : true;
          structobj.identifier = items.Identifier;
          structobj.accessMode = items.RwFlag == 1 ? "r" : "rw";
          JSON.parse(items.DataSpecsList).map(children => {
            if (
              children.childDataType == "ENUM" ||
              children.childDataType == "BOOL"
            ) {
              var obj = {
                dataType: {
                  specs: {}
                }
              };
              obj.name = children.childName;
              obj.dataType.type = children.childDataType.toLowerCase();
              obj.required = children.Required;
              obj.identifier = children.identifier;
              obj.accessMode = children.RwFlag == 1 ? "r" : "rw";
              children.childEnumSpecsDTO.map(child => {
                for (var key in child) {
                  var attribute = child["value"];
                  var value = child["name"];
                  obj.dataType.specs[attribute] = value;
                }
              });
              structobj.dataType.specs.push(obj);
            } else if (
              children.childDataType == "DOUBLE" ||
              children.childDataType == "INT" ||
              children.childDataType == "FLOAT"
            ) {
              var obj = {
                dataType: {
                  specs: {}
                }
              };
              obj.name = children.childName;
              obj.dataType.type = children.childDataType.toLowerCase();
              obj.required = children.Required;
              obj.identifier = children.identifier;
              obj.accessMode = children.RwFlag == 1 ? "r" : "rw";
              for (var key in children.childSpecsDTO) {
                obj.dataType.specs.min = children.childSpecsDTO["min"];
                obj.dataType.specs.max = children.childSpecsDTO["max"];
                obj.dataType.specs.step = children.childSpecsDTO["precise"];
                obj.dataType.specs.unit = children.childSpecsDTO["unit"];
              }
              structobj.dataType.specs.push(obj);
            }
          });
          origin.push(structobj);
        }
      });
      var update = {};
      origin = origin.reduce((cur, next) => {
        update[next.identifier]
          ? ""
          : (update[next.identifier] = true && cur.push(next));
        return cur;
      }, []);
    },
    //添加物模型模板
    addProCategory(row) {
      var Product = Parse.Object.extend("Product");
      var product = new Parse.Query(Product);
      var Dict = Parse.Object.extend("Dict");
      var datas = new Parse.Query(Dict);
      datas.equalTo("type", row.attributes.type);
      datas.equalTo("data.key", "detail");
      datas.find().then(
        res => {
          if (res.length) {
            if (res[0].attributes.data.Ability) {
              this.TypeInstall(
                this.productdetail.thing.properties,
                res[0].attributes.data.Ability
              );
              product.get(this.productId).then(resultes => {
                resultes.set("thing", this.productdetail.thing);
                resultes.save().then(
                  resultes => {
                    this.$message({
                      type: "success",
                      message: "添加成功"
                    });
                    this.getProDetail();
                  },
                  error => {
                    returnLogin(error);
                  }
                );
              });
            } else {
              console.log("此选项没有属性功能");
            }
          }
        },
        error => {
          returnLogin(error);
        }
      );
    },
    /*删除物模型*/
    deletewmx(index) {
      this.productdetail.thing.properties.splice(
        (this.wmxstart - 1) * this.wmxlength + index,
        1
      );
      var Product = Parse.Object.extend("Product");
      var product = new Parse.Query(Product);
      product.get(this.productId).then(resultes => {
        resultes.set("thing", this.productdetail.thing);
        resultes.save().then(
          resultes => {
            if (resultes) {
              this.$message({
                type: "success",
                message: "删除成功"
              });
              this.wmxData = this.productdetail.thing.properties.concat([]);
            }
          },
          error => {
            returnLogin(error);
          }
        );
      });
    },
    wmxSizeChange(val) {
      this.wmxstart = 1;
      this.wmxlength = val;
      console.log(
        this.wmxData.slice(
          (this.wmxstart - 1) * this.wmxlength,
          this.wmxstart * this.wmxlength
        )
      );
    },
    wmxCurrentChange(val) {
      this.wmxstart = val;
    },
    //订阅日志按钮
    nowtime() {
      var timestamp3 = Date.parse(new Date());
      var date = new Date(timestamp3);
      var Y = date.getFullYear() + "年";
      var M =
        (date.getMonth() + 1 <= 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) + "月";
      var D =
        (date.getDate() + 1 <= 10 ? "0" + date.getDate() : date.getDate()) +
        "日  ";
      var h =
        (date.getHours() + 1 <= 10 ? "0" + date.getHours() : date.getHours()) +
        ":";
      var m =
        (date.getMinutes() + 1 <= 10
          ? "0" + date.getMinutes()
          : date.getMinutes()) + ":";
      var s =
        date.getSeconds() + 1 <= 10
          ? "0" + date.getSeconds()
          : date.getSeconds();
      return h + m + s + " ";
    },
    //订阅日志
    subProTopic(row) {
      this.subdialog = true;
      this.subdialogid = row.id;
      this.channelname = row.id;
      setTimeout(() => {
        subdialog = ace.edit("subdialog");
        subdialog.session.setMode("ace/mode/text"); // 设置语言
        subdialog.setTheme("ace/theme/gob"); // 设置主题
        subdialog.setReadOnly(true);
        subdialog.setOptions({
          enableBasicAutocompletion: false,
          enableSnippets: true,
          enableLiveAutocompletion: true // 设置自动提示
        });
      });
      var info = {
        topic: "log/channel/" + row.id + "/" + this.productId,
        qos: 2
      };
      var channeltopic = new RegExp(
        "log/channel/" + row.id + "/" + this.productId
      );
      var submessage = "";
      var _this = this;
      Websocket.add_hook(channeltopic, function(Msg) {
        //判断长度
        if (subdialog.session.getLength() >= 1000) {
          submessage = "";
        } else {
          submessage += _this.nowtime() + Msg + `\n`;
        }
        subdialog.setValue(submessage);
        subdialog.gotoLine(subdialog.session.getLength());
      });
      //订阅
      var text0 = JSON.stringify({ action: "start_logger" });
      Websocket.subscribe(info, function(res) {
        if (res.result) {
          console.log(info);
          console.log("订阅成功");
          var sendInfo = {
            topic: "channel/" + row.id + "/" + _this.productId,
            text: text0,
            retained: true,
            qos: 2
          };
          Websocket.sendMessage(sendInfo);
          _this.subdialogtimer = window.setInterval(() => {
            Websocket.sendMessage(sendInfo);
          }, 600000);
        }
      });
    },
    //关闭弹窗操作
    handleCloseSubdialog() {
      var text0 = JSON.stringify({ action: "stop_logger" });
      var sendInfo = {
        topic: "channel/" + this.subdialogid + "/" + this.productId,
        text: text0,
        retained: true,
        qos: 2
      };
      Websocket.sendMessage(sendInfo);
      this.subdialog = false;
      window.clearInterval(this.subdialogtimer);
      this.subdialogtimer = null;
    },
    //停止topic刷新
    stopsub(value) {
      var text0;
      if (value == false) {
        // this.subaction = 'start'
        text0 = JSON.stringify({ action: "stop_logger" });
      } else {
        // this.subaction = 'stop'
        text0 = JSON.stringify({ action: "start_logger" });
      }
      var sendInfo = {
        topic: "channel/" + this.subdialogid + "/" + this.productId,
        text: text0,
        retained: true,
        qos: 2
      };
      Websocket.sendMessage(sendInfo);
    }, //topic增加
    subTopic(formName, isupdated) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var Topic =
            "thing/" + this.productId + "/${DevAddr}/" + this.topicform.topic;
          var Product = Parse.Object.extend("Product");
          var product = new Parse.Query(Product);
          product.get(this.productId).then(resultes => {
            var addTopic = {
              topic: Topic,
              type: this.topicform.type,
              desc: this.topicform.desc
            };
            var arr = [];
            arr.push(addTopic);
            if (isupdated == -1) {
              arr = arr.concat(resultes.attributes.topics);
              resultes.set("topics", arr);
            } else {
              var topicupdated = resultes.attributes.topics.concat([]);
              topicupdated[isupdated] = addTopic;
              resultes.set("topics", topicupdated);
            }
            resultes.save().then(
              response => {
                if (response) {
                  this.$message({
                    type: "success",
                    message: "成功"
                  });
                  this.topicdialogVisible = false;
                  this.$refs[formName].resetFields();
                  (this.topicform.isupdated = -1), (this.topicform.topic = "");
                  this.topicform.desc = "";
                  this.handleClick({ name: "second" });
                }
              },
              error => {
                returnLogin(error);
              }
            );
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    topicSizeChange(val) {
      this.topicstart = 1;
      this.topiclength = val;
    },
    topicCurrentChange(val) {
      this.topicstart = val;
    },
    updatetopic(row, index) {
      this.topicform.topic = row.topic.substr(row.topic.lastIndexOf("/") + 1);
      this.topicform.type = row.type;
      this.topicform.desc = row.desc;
      this.topicdialogVisible = true;
      this.topicform.isupdated = index;
    },
    deletetopic(scope, index) {
      var Product = Parse.Object.extend("Product");
      var product = new Parse.Query(Product);
      product.get(this.productId).then(resultes => {
        var topic = resultes.attributes.topics.concat([]);
        topic.splice(index, 1);
        resultes.set("topics", topic);
        resultes.save().then(
          response => {
            if (response) {
              this.$message({
                type: "success",
                message: "删除成功"
              });
              scope._self.$refs[`popover-${scope.$index}`].doClose();
              this.handleClick({ name: "second" });
            }
          },
          error => {
            returnLogin(error);
          }
        );
      });
    },
    testgraphql() {
      this.$apollo
        .query({
          query: gql`
            ${editorgraphql.getValue()}
          `
        })
        .then(resultes => {
          editor5.setValue(JSON.stringify(resultes, null, 4));
        })
        .catch(error => {
          console.log(error);
          this.$message(error);
        });
    },
    //规则tab显示
    orginRule() {
      getRule()
        .then(response => {
          if (response) {
            this.engineData = response;
          }
        })
        .catch(error => {
          this.$message(error.error);
        });
    },
    //分页
    handleSizeChange(val) {},
    handleCurrentChange(val) {},
    addEngine() {
      this.$router.push({
        path: "/rules_engine/addengine",
        query: {
          title: "新增",
          productid: this.productId
        }
      });
    },
    actions(row) {
      var string = [];
      row.map(items => {
        string.push(items.name);
      });
      return string.join(",");
    },
    //表格单个单元格class添加
    getRowindex(row, rowIndex, columnIndex) {
      if (row.columnIndex == 0) {
        return "firstcolumn";
      }
    },
    detailRules(id) {
      this.$router.push({
        path: "/rules_engine/checkengine",
        query: { id: id }
      });
    },
    deleteRule(id) {
      ruleDelete(id)
        .then(resultes => {
          if (resultes) {
            this.$message("删除成功");
            this.orginRule();
          }
        })
        .catch(error => {
          this.$message(error.error);
        });
    }
  },
  beforeDestroy() {
    window.clearInterval(this.subtimer);
    this.subtimer = null;
    window.clearInterval(this.subdialogtimer);
    this.subdialogtimer = null;
  }
};
</script>
<style scoped>
.editproduct {
  height: 100%;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
}
.mailtable .cloumn {
  text-align: left;
  color: #74777a;
  font-weight: 400;
  background: #fafafc;
  width: 200px;
  font-weight: bold;
  border-right: 1px solid #ebecec;
  border-bottom: 1px solid #ebecec;
}

.mailtable td {
  padding: 15px;
  font-size: 14px;
  text-align: left;
  box-sizing: border-box;
  color: #74777a;
  border: 1px solid #ebecec;
}
.mailtable .notbottom {
  border-bottom: 0;
}

.editheader .product ul {
  width: 100%;
  height: 50px;
  padding-left: 0;
  display: flex;
  justify-content: space-between;
}
.editheader .product ul li {
  list-style: none;
  font-size: 16px;
  text-align: left;
  color: #74777a;
}
/* .editheader .product ul li:first-child,
.editheader .product ul li:last-child {
  width: 25%;
  list-style: none;
  color: #74777a;
  font-size: 16px;
  line-height: 50px;
  float: left;
  text-align: left;
}
.editheader .product ul li:nth-child(2) {
  width: 50%;
  list-style: none;
  color: #74777a;
  font-size: 16px;
  line-height: 50px;
  float: left;
  text-align: left;
} */
</style>
<style>
.editproduct .el-tabs__item {
  font-size: 16px;
  margin-top: 20px;
  margin: 0;
  height: 50px;
  line-height: 50px;
  font-family: auto;
  width: 150px;
}
.editproduct .el-tabs__header {
  margin: 0;
}
.editproduct .el-tabs__content {
  background: #f4f4f4;
  padding: 20px 10px 0 10px;
  box-sizing: border-box;
}
.editproduct .el-tab-pane {
  background: #ffffff;
  padding-top: 10px;
  box-sizing: border-box;
}
.editproduct .el-dialog__body {
  padding: 0 20px;
}
.editproduct .inputnumber {
  width: auto;
}
.editproduct .el-table td,
.editproduct .el-table th {
  padding: 5px 0;
}
.editproduct .warning {
  background: #272822;
  color: #ffffff;
  width: 100%;
}
.editproduct .error {
  background: #272822;
  color: #f56c6c;
  width: 100%;
}
.editproduct .el-form-item {
  margin-bottom: 5px;
}
.editproduct .el-form-item__content {
  clear: both;
  margin-left: 0;
}
.editproduct .el-dialog__header {
  border-bottom: 1px solid #dddddd;
}
.editproduct .el-cascader {
  width: 60%;
}
.editproduct .el-cascader .el-input__inner {
  height: 30px;
}
.editproduct .topiccontent {
  padding: 10px;
  box-sizing: border-box;
}
.editproduct .topicform .el-select {
  width: 100%;
}
.editproduct .row-expand-cover td:first-child .el-icon-arrow-right {
  visibility: hidden;
}
/* .editproduct .row-expand-cover + tr {
  display: none;
} */
.editproduct .el-table__expanded-cell {
  padding: 20px 0 !important;
  text-align: center;
  margin: 0 auto;
  box-sizing: border-box;
  left: 100px;
}
.editproduct .el-table__expanded-cell .el-table th.is-leaf {
  background: #ced7de9c;
}
/* .editproduct #pane-sixeth {
  display: flex;
} */
.editproduct .el-col-2 {
  text-align: center;
}
.green_active {
  color: green;
}
.red_active {
  color: red;
}
.wumoxing .el-form-item__content {
  margin-left: 10px;
}
.task_collection .el-form-item__content {
  clear: none;
}
.task_collection .el-form-item {
  margin-bottom: 10px;
}
</style>
<style lang="scss" scoped>
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
/deep/ .firstcolumn {
  color: #34c388;
  cursor: pointer;
}

.export-p {
  text-align: center;
}
</style>
