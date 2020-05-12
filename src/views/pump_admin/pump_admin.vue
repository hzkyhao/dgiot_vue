<template>
  <div class="empower">
      <h3>企业资质审核</h3>
      <div class="empower_top">
          <el-form :inline="true" :model="formInline" class="demo-form-inline" size="small" label-width="100px">
              <el-form-item label="审核状态">
                <el-select v-model="formInline.region" placeholder="审核状态">
                  <el-option label="全部" value="all"></el-option>
                  <el-option label="待审核" value="Pending"></el-option>
                  <el-option label="审核中" value="Auditing"></el-option>
                  <el-option label="审核通过" value="Pass"></el-option>
                  <el-option label="审核未通过" value="Failed"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="开始时间">
                <el-date-picker
                    v-model="formInline.starttime"
                    type="datetime"
                    placeholder="选择开始时间">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间">
                <el-date-picker
                    v-model="formInline.endtime"
                    type="datetime"
                    placeholder="选择结束时间">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="企业名称">
                <el-input v-model="formInline.name" placeholder="请输入企业名称"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="getEmpower">查询</el-button>
                <el-button type="primary" >重置</el-button>
            </el-form-item>
        </el-form>
        <div class="pump_table">
            <el-table
                :data="tableData"
                border
                style="width: 100%;text-align:center">
                <el-table-column
                type="index"
                label="序号"
                align="center"
                width="50"
                >
                </el-table-column>
                <el-table-column
                label="企业名称"
                align="center"
                >
                <template slot-scope="scope">
                    <span>{{scope.row.attributes.empower.abbrname}}</span>
                </template>
                </el-table-column>
                <el-table-column
               
                label="统一社会信用代码"
                width="200"
                align="center"
                >
                 <template slot-scope="scope">
                    <span>{{scope.row.attributes.empower.creditcode}}</span>
                </template>
                </el-table-column>
                <el-table-column
              
                label="法定代表人姓名"
                width="150"
                align="center">
                 <template slot-scope="scope">
                    <span>{{scope.row.attributes.empower.businessname}}</span>
                </template>
                </el-table-column>
                
                <el-table-column
                label="法定代表人身份证号码"
                width="200"
                align="center">
                 <template slot-scope="scope">
                    <span>{{scope.row.attributes.empower.identity}}</span>
                </template>
                </el-table-column>
                <el-table-column
               
                label="注册地址"
                width="200"
                align="center">
                <template slot-scope="scope">
                   <span>{{getAddr(scope.row.attributes.empower.addr)+scope.row.attributes.empower.roadress}}</span>
                </template>
                </el-table-column>
                <el-table-column
                prop="address"
                label="联系人"
                align="center">
                </el-table-column>
                <el-table-column
                prop="address"
                label="联系人电话"
                width="200"
                align="center">
                </el-table-column>
                <el-table-column
                prop="address"
                label="申请时间"
                width="200"
                align="center">
                 <template slot-scope="scope">
                    <span>{{utc2beijing(scope.row.createdAt)}}</span>
                </template>
                </el-table-column>
                <el-table-column
                prop="address"
                label="实验室名称"
                width="200"
                align="center">
                </el-table-column>
                <!-- <el-table-column
                
                label="CMA证书编号"
                width="200"
                align="center">
                <template slot-scope="scope">
                    <span>{{scope.row.attributes.cma.cmaname}}</span>
                </template>
                </el-table-column>
                <el-table-column
                label="CMA证书有效期"
                width="200"
                align="center">
                <template slot-scope="scope">
                    <span v-if="scope.row.attributes.cma.cmatermOfValidity">{{timestampToTime(scope.row.attributes.cma.cmatermOfValidity)}}</span>
                    <span v-else></span>
                </template>
                </el-table-column>
                <el-table-column
                label="CNAS证书编号"
                width="200"
                align="center">
                <template slot-scope="scope">
                    <span>{{scope.row.attributes.cnas.cnasname}}</span>
                </template>
                </el-table-column>
                <el-table-column
                
                label="CNAS证书有效期"
                width="200"
                align="center">
                <template slot-scope="scope">
                    <span v-if="scope.row.attributes.cnas.termOfValidity">{{timestampToTime(scope.row.attributes.cnas.termOfValidity)}}</span>
                    <span v-else></span>
                </template>
                </el-table-column>
                <el-table-column
                label="其他资质"
                width="200"
                align="center">
                <template slot-scope="scope">
                    <span v-if="scope.row.attributes.other.length!=0">{{Others(scope.row.attributes.other)}}</span>
                    <span v-else></span>
                </template>
                </el-table-column> -->
                <el-table-column
               
                label="审核日期"
                width="200"
                align="center">
                <template slot-scope="scope">
                    <span v-if="scope.row.attributes.auditDate">{{timestampToTime(scope.row.attributes.auditDate).substring(0,10)}}</span>
                    <span v-else></span>
                </template>
                  
                </el-table-column>
                <el-table-column
                
                label="审核状态"
                align="center">
                <template slot-scope="scope">
                    <el-tag type="info" v-if="scope.row.attributes.status=='Pending'">待审核</el-tag>
                    <el-tag type="success" v-else-if="scope.row.attributes.status=='Pass'">审核通过</el-tag>
                    <el-tag type="danger" v-else-if="scope.row.attributes.status=='Faild'">审核未通过</el-tag>
                    <el-tag type="primary" v-else>审核中</el-tag>
                </template>
                </el-table-column>
                <el-table-column
                label="审核意见"
                width="200"
                align="center">
                <template slot-scope="scope">
                    <span v-if="scope.row.attributes.suggestion">{{scope.row.attributes.suggestion}}</span>
                    <span v-else></span>
                </template>
                </el-table-column>
                <el-table-column
                width="150"
                label="审核管理"
                align="center">
                <template slot-scope="scope">
                    <el-button type="primary" size="small" @click="lookUp(scope.row.id)">查看</el-button>
                    <el-button type="success" size="small" @click="examine(scope.row.id)">审核</el-button>
                </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="block">
            <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :page-sizes="[10, 200, 30, 50]"
            :page-size="pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
            </el-pagination>
        </div>
      </div>
      <!--审核弹窗-->
      <el-dialog
        title="认证审核"
        :visible.sync="dialogVisible"
        width="40%">
        <div>
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="审核状态" prop="status">
                    <el-radio-group v-model="ruleForm.status">
                    <el-radio label="Pending">待审核</el-radio>
                    <el-radio label="Auditing">审核中</el-radio>
                    <el-radio label="Failed">审核未通过</el-radio>
                    <el-radio label="Pass">审核通过</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="审核意见" prop="suggestion">
                    <el-input type="textarea" v-model="ruleForm.suggestion" :rows="4"></el-input>
                </el-form-item>
            </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitForm('ruleForm')">提 交</el-button>
        </span>
      </el-dialog>
      <!--查看弹窗-->
      <el-dialog title="资质认证" :visible.sync="dialogFormVisible" width="80%">
       <el-divider>企业认证</el-divider>
      <el-form ref="form1" :model="form1" label-width="140px" :rules="formrules1">
          <el-row>
            <!--左边表单-->
            <el-col :span="12">
              <div class="grid-content bg-purple">
                <el-form-item label="企业名称" prop="businessname">
                  <el-input v-model="form1.businessname" placeholder="请填写企业名称" readonly></el-input>
                </el-form-item>
                <el-form-item label="企业简称" prop="abbrname">
                  <el-input v-model="form1.abbrname" placeholder="请填写企业简称" readonly></el-input>
                </el-form-item>
                <el-form-item label="法人代表名称" prop="corporname">
                  <el-input v-model="form1.corporname" placeholder="请输入法人姓名" readonly></el-input>
                </el-form-item>
                <el-form-item label="法人代表身份证" required>
                  <el-col :span="11">
                    <el-upload
                      class="avatar-uploader"
                      action="/iotapi/upload"
                      :show-file-list="false"
                    >
                      <img v-if="form1.frontimageUrl" :src="form1.frontimageUrl" class="avatar" />
                      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                      <div
                        class="el-upload__text"
                        style="position:absolute;top:90px;color:#8c939d;
                      left:80px;"
                      >身份证正面</div>
                    </el-upload>
                  </el-col>
                  <el-col class="line" :span="2">-</el-col>
                  <el-col :span="11" style="position:relative">
                    <el-upload
                      class="avatar-uploader"
                      action="/iotapi/upload"
                      :show-file-list="false"
                      
                    >
                      <img v-if="form1.contraryimageUrl" :src="form1.contraryimageUrl" class="avatar" />
                      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                      <div
                        class="el-upload__text"
                        style="position:absolute;top:90px;color:#8c939d;
                      left:80px;"
                      >身份证正反面</div>
                    </el-upload>
                  </el-col>
                </el-form-item>
                <el-form-item label="注册地址" prop="addr">
                  <el-cascader
                    size="large"
                    :options="options"
                    v-model="form1.addr"
                     readonly
                  ></el-cascader>
                </el-form-item>
                <el-form-item label="营业年限" prop="businessduration">
                  <el-select v-model="form1.businessduration" placeholder="请选择营业年限" readonly>
                    <el-option label="初创企业" value="1"></el-option>
                    <el-option label="1-3年" value="2"></el-option>
                    <el-option label="3-5年" value="3"></el-option>
                    <el-option label="5-10年" value="4"></el-option>
                    <el-option label="10年以上" value="5"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="注册资金" prop="registeredcapital">
                  <el-input v-model="form1.registeredcapital" placeholder="请填写注册资金" readonly></el-input>
                </el-form-item>
                <el-form-item label="企业描述" prop="businessdesc">
                  <el-input
                    type="textarea"
                    placeholder="请输入企业描述信息"
                    v-model="form1.businessdesc"
                    maxlength="300"
                    :rows="4"
                    show-word-limit
                    readonly
                  ></el-input>
                </el-form-item>
              </div>
            </el-col>
            <!--右边表单-->
            <el-col :span="12">
              <div class="grid-content bg-purple-light">
                <el-form-item label="企业英文名称" >
                  <el-input v-model="form1.englishname" placeholder="请输入企业英文名称" readonly></el-input>
                </el-form-item>
                <el-form-item label="统一社会信用代码" prop="creditcode">
                  <el-input v-model="form1.creditcode" placeholder="请输入社会信用代码" readonly></el-input>
                </el-form-item>
                <el-form-item label="法人代表身份证号" prop="identity">
                  <el-input v-model="form1.identity" placeholder="请输入法人身份证号码（18位）" readonly></el-input>
                </el-form-item>
                <el-form-item label="企业营业执照" required>
                  <el-upload
                    class="avatar-uploader"
                    action="/iotapi/upload"
                    :show-file-list="false"
                   
                  >
                    <img v-if="form1.businesslicense" :src="form1.businesslicense" class="avatar" />
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    <div
                      class="el-upload__text"
                      style="position:absolute;top:90px;color:#8c939d;
                      left:80px;"
                    >企业营业执照</div>
                  </el-upload>
                </el-form-item>
                <el-form-item label="街道地址" prop="roadress">
                  <el-input v-model="form1.roadress" placeholder="请填写企业街道地址" readonly></el-input>
                </el-form-item>
                <el-form-item label="企业规模">
                  <el-select v-model="form1.region" placeholder="请选择企业规模" readonly>
                    <el-option label="10人以下" value="1"></el-option>
                    <el-option label="11-50人" value="2"></el-option>
                    <el-option label="50-100人" value="3"></el-option>
                    <el-option label="101-500人" value="4"></el-option>
                    <el-option label="501-1000人" value="5"></el-option>
                     <el-option label="1000人以上" value="6"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="经营范围" prop="businessscope">
                  <el-input
                    type="textarea"
                    placeholder="请输入企业经营范围信息"
                    v-model="form1.businessscope"
                    maxlength="300"
                    :rows="4"
                    readonly
                    show-word-limit
                  ></el-input>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
        </el-form>
         <!-- <el-divider>资质认证</el-divider>
         <p
              style="border-bottom:1px solid #cccccc;color:#409EFF;font-size:14px;height:40px"
            >CNAS证书</p>
         <el-form :model="ruleForm1" ref="ruleForm1" label-width="120px" class="demo-ruleForm" :rules="ruleRules1">
            <el-row> -->
              <!--证书认证上-->
              <!-- <el-col :span="12">
                <div class="grid-content bg-purple">
                  <el-form-item label="证书编号" prop="cnasname">
                    <el-input v-model="ruleForm1.cnasname"></el-input>
                  </el-form-item>
                  <el-form-item label="签发日期" prop="dateOfIssue">
                    <el-date-picker
                      type="date"
                      placeholder="选择签发日期"
                      v-model="ruleForm1.dateOfIssue"
                      value-format="timestamp"
                      style="width: 100%;"
                    ></el-date-picker>
                  </el-form-item>
                  <el-form-item label="初次认可" prop="initialRecognition">
                    <el-date-picker
                      type="date"
                      placeholder="选择初次认可日期"
                      v-model="ruleForm1.initialRecognition"
                      style="width: 100%;"
                      value-format="timestamp"
                    ></el-date-picker>
                  </el-form-item>
                  <el-form-item label="资质内容">
                    <el-input
                      type="textarea"
                      placeholder="请输入证书资质信息"
                      v-model="ruleForm1.cnasdesc"
                      :rows="8"
                    ></el-input>
                  </el-form-item>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="grid-content bg-purple-light">
                  <el-form-item label="发证机关" prop="licencsIssuing">
                    <el-input v-model="ruleForm1.licencsIssuing"></el-input>
                  </el-form-item>
                  <el-form-item label="有效期至" prop="termOfValidity">
                    <el-date-picker
                      type="date"
                      placeholder="选择有效期至"
                      v-model="ruleForm1.termOfValidity"
                      value-format="timestamp"
                      style="width: 100%;"
                    ></el-date-picker>
                  </el-form-item>
                  <el-form-item label="更新时间" prop="updatedDate">
                    <el-date-picker
                      type="date"
                      placeholder="选择更新日期"
                      v-model="ruleForm1.updatedDate"
                      value-format="timestamp"
                      style="width: 100%;"
                    ></el-date-picker>
                  </el-form-item>
                  <el-form-item label="证书电子文件" required>
                    <el-upload
                      class="avatar-uploader"
                      action="/iotapi/upload"
                      :show-file-list="false"
                      
                    >
                      <img v-if="ruleForm1.cnasimgsrc" :src="ruleForm1.cnasimgsrc" class="avatar" />
                      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                      <div
                        class="el-upload__text"
                        style="position:absolute;top:90px;color:#8c939d;
                      left:80px;"
                      >证书电子文件</div>
                    </el-upload>
                  </el-form-item>
                  
                </div>
              </el-col>
             
            </el-row>
             </el-form>
            <p
              style="border-bottom:1px solid #cccccc;color:#409EFF;font-size:14px;height:40px"
            >CMA证书</p> -->
            <!--CMA证书-->
             <!-- <el-form :model="ruleForm2" ref="ruleForm2" label-width="120px" class="demo-ruleForm" :rules="ruleRules2">
            <el-row>
              
              <el-col :span="12">
                <div class="grid-content bg-purple">
                  <el-form-item label="证书编号" prop="cmaname">
                    <el-input v-model="ruleForm2.cmaname"></el-input>
                  </el-form-item>
                  <el-form-item label="签发日期" prop="cmadateOfIssue">
                    <el-date-picker
                      type="date"
                      placeholder="选择签发日期"
                      v-model="ruleForm2.cmadateOfIssue"
                      value-format="timestamp"
                      style="width: 100%;"
                    ></el-date-picker>
                  </el-form-item>
                  <el-form-item label="资质内容">
                    <el-input
                      type="textarea"
                      placeholder="请输入证书资质信息"
                      v-model="ruleForm2.cmadesc"
                      :rows="8"
                    ></el-input>
                  </el-form-item>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="grid-content bg-purple-light">
                   <el-form-item label="发证机关" prop="cmalicencsIssuing">
                    <el-input v-model="ruleForm2.cmalicencsIssuing"></el-input>
                  </el-form-item>
                  <el-form-item label="有效期至" prop="cmatermOfValidity">
                    <el-date-picker
                      type="date"
                      placeholder="选择签发日期"
                      v-model="ruleForm2.cmatermOfValidity"
                      value-format="timestamp"
                      style="width: 100%;"
                    ></el-date-picker>
                  </el-form-item>
                  <el-form-item label="证书电子文件" required>
                    <el-upload
                      class="avatar-uploader"
                      action="/iotapi/upload"
                      :show-file-list="false"
                    >
                      <img v-if="ruleForm2.cmaimgsrc" :src="ruleForm2.cmaimgsrc" class="avatar" />
                      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                      <div
                        class="el-upload__text"
                        style="position:absolute;top:90px;color:#8c939d;
                      left:80px;"
                      >证书电子文件</div>
                    </el-upload>
                  </el-form-item>
                </div>
              </el-col>
            </el-row>
          </el-form> -->
          <!-- <div >

          </div> -->
          
          <!-- <el-row v-for="(item,index) in previewother.otherform" :key="index" :value="item">
            <el-form :model="item" ref="addotherform" label-width="120px" class="demo-addotherform" >
               <p
              style="border-bottom:1px solid #cccccc;color:#409EFF;font-size:14px;"
            >{{item.title}}</p>
              证书认证上
               <el-col :span="12">
                <div class="grid-content bg-purple">
                  <el-form-item label="证书编号" >
                    <el-input v-model="item.name"></el-input>
                  </el-form-item>
                  <el-form-item label="签发日期" >
                    <el-date-picker
                      type="date"
                      placeholder="选择签发日期"
                      v-model="item.dateOfIssue"
                      value-format="timestamp"
                      style="width: 100%;"
                    ></el-date-picker>
                  </el-form-item>
                  <el-form-item label="初次认可" >
                    <el-date-picker
                      type="date"
                      placeholder="选择签发日期"
                      v-model="item.initialRecognition"
                      value-format="timestamp"
                      style="width: 100%;"
                    ></el-date-picker>
                  </el-form-item>
                  <el-form-item label="资质内容">
                    <el-input
                      type="textarea"
                      placeholder="请输入证书资质信息"
                      v-model="item.desc"
                      :rows="8"
                    ></el-input>
                  </el-form-item>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="grid-content bg-purple-light">
                  <el-form-item label="发证机关">
                    <el-input v-model="item.licencsIssuing"></el-input>
                  </el-form-item>
                  <el-form-item label="有效期至" >
                    <el-date-picker
                      type="date"
                      placeholder="选择有效期至"
                      v-model="item.termOfValidity"
                      value-format="timestamp"
                      style="width: 100%;"
                    ></el-date-picker>
                  </el-form-item>
                  <el-form-item label="更新时间">
                    <el-date-picker
                      type="date"
                      placeholder="选择签发更新时间"
                      v-model="item.updatedDate"
                      value-format="timestamp"
                      style="width: 100%;"
                    ></el-date-picker>
                  </el-form-item>
                  <el-form-item label="证书电子文件" required>
                    <el-upload
                      class="avatar-uploader"
                      action="/iotapi/upload"
                      :show-file-list="false"
                    >
                      <img v-if="item.imgsrc" :src="item.imgsrc" class="avatar" />
                      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                      <div
                        class="el-upload__text"
                        style="position:absolute;top:90px;color:#8c939d;
                      left:50px;"
                      >证书电子文件</div>
                    </el-upload>
                  </el-form-item>
                </div>
              </el-col>
              </el-form>
            </el-row> -->
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
        </div>
      </el-dialog>
  </div>
</template>

<script>
import { regionData, CodeToText } from "element-china-area-data";
import Parse from "parse";
import { returnLogin } from '@/utils/return';
export default {
  name: "",
  data() {
    const idrules = function(rule, value, callback) {
      var rules = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;
      if (!rules.test(value)) {
        if (value.length != 18) {
          callback(new Error("请输入18位身份证号"));
        } else {
          callback(new Error("需要输入正确身份证号码"));
        }
      } else {
        callback();
      }
    };
    const Englishname = function(rule, value, callback) {
      var rules = /^[a-zA-Z&.,\'\/\-\s]+$/g;
      if (!rules.test(value)) {
        callback(new Error("请输入英文名称"));
      } else {
        callback();
      }
    };
    const CreditCode = function(rule, value, callback) {
      var rules = /[^_IOZSVa-z\W]{2}\d{6}[^_IOZSVa-z\W]{10}/;
      if (!rules.test(value)) {
        
        callback(new Error("请输入正确统一社会编码"));
      } else {
        if(value.length>18){
          callback(new Error("请输入18位统一社会编码"));
        }else{
          callback();
        }
        
      }
    };
    const Registered = function(rule, value, callback) {
      var rules = /^(([^0][0-9]+|0)\.([0-9]{1,2})$)|^(([^0][0-9]+|0)$)|^(([1-9]+)\.([0-9]{1,2})$)|^(([1-9]+)$)/;

      if (!rules.test(value)) {
        callback(new Error("请填写公司注册资金,精确2位小数"));
      } else {
        callback();
      }
    };
    return {
      dialogVisible: false,
      formInline: {
        user: "",
        region: "all"
      },
      tableData: [],
      start: 0,
      pagesize: 10,
      total: 0,
      authenticationid: "",
      ruleForm: {
        status: "",
        suggestion: ""
      },
      rules: {
        status: [
          { required: true, message: "请选择审核状态", trigger: "change" }
        ],
        suggestion: [{ required: true, message: "请填写认证审核意见", trigger: "blur" }]
      },
      //查看
      dialogFormVisible:false,
      form1: {
        name: "",
        region: "",
        desc: "",
        identity: "",
        frontimageUrl: "", //身份证正面照
        contraryimageUrl: "", //身份证反面照
        businesslicense: "", //企业营业执照
        businessname: "", //公司名称
        abbrname: "", //企业简称
        corporname: "", //法人代表名称
        englishname: "", //英文名称
        creditcode: "", //统一社会信用代码
        addr: "", //设备地址
        roadress: "", //街道地址
        businessduration: "", //营业年限
        businessdesc: "", //企业描述
        businessscope: "", //经营范围
        registeredcapital: "" //注册资金
      },
      formrules1: {
        identity: [
          { required: true, message: "请输入正确身份证号", trigger: "blur" },
          { validator: idrules, trigger: "blur" }
        ],
        businessname: [
          { required: true, message: "请输入企业名称", trigger: "blur" }
        ],
        abbrname: [
          { required: true, message: "请输入企业简称", trigger: "blur" }
        ],
        corporname: [
          { required: true, message: "请输入法人姓名", trigger: "blur" }
        ],
        englishname: [
          { required: true, message: "请输入企业英文名称", trigger: "blur" },
          { validator: Englishname }
        ],
        creditcode: [
          {
            required: true,
            message: "请输入统一社会信用代码",
            trigger: "blur"
          },
          { validator: CreditCode }
        ],
        addr: [
          { required: true, message: "请选择公司注册地址", trigger: "change" }
        ],
        roadress: [
          { required: true, message: "请输入街道地址", trigger: "blur" }
        ],
        registeredcapital: [
          {
            required: true,
            message: "请输入公司注册资金",
            trigger: "blur"
          },
          { validator: Registered }
        ],
        businessduration: [
          { required: true, message: "请选择公司营业年限", trigger: "change" }
        ],
        businessdesc: [
          { required: true, message: "请输入企业描述信息", trigger: "blur" }
        ],
        businessscope: [
          { required: true, message: "请输入企业经营范围", trigger: "blur" }
        ]
      },
      options: regionData,
      ruleForm1: {
        cnasname: "",
        dateOfIssue:'',
        updatedDate: "",
        initialRecognition:'',
        termOfValidity:'',
        licencsIssuing:'',
        cnasimgsrc: "",
        cnasdesc:'',
      
      },
      ruleForm2:{
          cmaname: "",
          cmadateOfIssue: "",
          cmalicencsIssuing:'',
          cmatermOfValidity:'',
          cmaimgsrc: "",
          cmadesc:''
      },
      ruleRules2:{
         cmaname:[
          {required: true, message: "请输入正确证书编号", trigger: "blur" }
        ],
        cmadateOfIssue: [
            { type: 'date', required: true, message: '选择签发日期', trigger: 'change' }
          ],
        cmalicencsIssuing:[
          {required: true, message: "请输入发证机关", trigger: "blur" }
        ],
        cmatermOfValidity:[
            { type: 'date', required: true, message: '请选择有效期至', trigger: 'change' }
          ],
      },
      ruleRules1:{
        cnasname:[
          {required: true, message: "请输入正确证书编号", trigger: "blur" }
        ],
        licencsIssuing:[
          {required: true, message: "请输入发证机关", trigger: "blur" }
        ],
        dateOfIssue: [
            { type: 'date', required: true, message: '选择签发日期', trigger: 'change' }
          ],
        updatedDate:  [
            { type: 'date', required: true, message: '请选择更新时间', trigger: 'change' }
          ],
        initialRecognition: [
            { type: 'date', required: true, message: '请选择初次认可时间', trigger: 'change' }
          ],
        termOfValidity: [
            { type: 'date', required: true, message: '请选择有效期至', trigger: 'change' }
          ],
      
      },
      previewother:{
        otherform:[]
      },
    };
  },
  mounted() {
    this.getEmpower();
  },
  methods: {
    //地址
    getAddr(addr) {
      var addrlength = addr.length;
      var text = "";
      for (var i = 0; i < addr.length; i++) {
        text += CodeToText[addr[i]] + "/";
      }
      return text;
    },
    //其他资质
    Others(other) {
      var othertext = [];
      for (var i = 0; i < other.length; i++) {
        othertext.push(other[i].name);
      }
      return othertext.join(",");
    },
    //得到初始化审核列表
    getEmpower() {
/*       var Authentication = Parse.Object.extend("Authentication");
      var authentication = new Parse.Query(Authentication);
      authentication.limit(this.pagesize);
      authentication.skip(this.start);
      if(this.formInline.region!='all'){
        authentication.equalTo('status',this.formInline.region)
      }
      authentication.count().then(count => {
        this.total = count;
        authentication.find().then(resultes => {
          this.tableData = resultes;
        });
      },error=>{
        returnLogin(error)
      }); */

      // classes/Authentication

      let where = {}

      if(this.formInline.region!='all'){
        where['status'] = this.formInline.region
      }

/*       {
      params:{
            limit: 200,
            where: where,
            keys: "count(*)",
          }} */

      this.$axiosWen.get('/classes/Authentication'
          )
        .then(response => {

          console.log(response);
          
        })


    },
    timestampToTime(timestamp) {
      var date = new Date(timestamp);
      var Y = date.getFullYear() + "-";
      var M =
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) + "-";
      var D =
        (date.getDate() + 1 <= 10 ? "0" + date.getDate() : date.getDate()) +
        " ";
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
      return Y + M + D + h + m + s;
    },
    utc2beijing(utc_datetime) {
      // 转为正常的时间格式 年-月-日 时:分:秒
      var date = new Date(+new Date(utc_datetime) + 8 * 3600 * 1000)
        .toISOString()
        .replace(/T/g, " ")
        .replace(/\.[\d]{3}Z/, "");
      return date; // 2017-03-31 16:02:06
    },
    examine(id) {
      this.authenticationid = id;
      this.dialogVisible = true
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    //审核提交
    submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
           var nowtime = new Date().getTime()
           var Authentication = Parse.Object.extend("Authentication");
           var authentication = new Authentication();
           authentication.id = this.authenticationid
           authentication.set('status',this.ruleForm.status)
           authentication.set('suggestion',this.ruleForm.suggestion)
           authentication.set('auditDate',nowtime)
           authentication.save().then(resultes=>{
               if(resultes){
                   this.$refs[formName].resetFields()
                   this.dialogVisible = false
                   this.getEmpower()
               }
           })

          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      lookUp(id){
        this.dialogFormVisible = true
        var Authentication = Parse.Object.extend("Authentication");
        var authentication = new Parse.Query(Authentication);
        authentication.get(id).then(response=>{
          if(response){
            if(response.attributes.empower){
             this.form1.name=response.attributes.empower.name 
             this.form1.region=response.attributes.empower.region
             this.form1.desc=response.attributes.empower.desc,
             this.form1.identity=response.attributes.empower.identity
             this.form1.frontimageUrl=response.attributes.empower.frontimageUrl //身份证正面照
             this.form1.contraryimageUrl=response.attributes.empower.contraryimageUrl //身份证反面照
             this.form1.businesslicense=response.attributes.empower.businesslicense //企业营业执照
             this.form1.businessname=response.attributes.empower.businessname//公司名称
             this.form1.abbrname=response.attributes.empower.abbrname //企业简称
             this.form1.corporname=response.attributes.empower.corporname //法人代表名称
             this.form1.englishname=response.attributes.empower.englishname //英文名称
             this.form1.creditcode=response.attributes.empower.creditcode//统一社会信用代码
             this.form1.addr=response.attributes.empower.addr //设备地址
             this.form1.roadress=response.attributes.empower.roadress //街道地址
             this.form1.businessduration=response.attributes.empower.businessduration //营业年限
             this.form1.businessdesc=response.attributes.empower.businessdesc //企业描述
             this.form1.businessscope=response.attributes.empower.businessscope //经营范围
             this.form1.registeredcapital=response.attributes.empower.registeredcapital //注册资金
            }
            
          }
        })
      }
  }
};
</script>

<style lang='scss' scoped>
.empower {
  height: 100%;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  .empower_top {
    padding-left: 40px;
    width: 100%;
    height: auto;
    box-sizing: border-box;
    .pump_table {
      margin-top: 10px;
    }
    .block {
      margin-top: 20px;
    }
  }
  /deep/ .el-select {
          width: 100%;
        }
        /deep/ .el-cascader {
          width: 100%;
        }
        /deep/ .el-dialog{
          margin-bottom:40px;
        }
}
</style>
<style>
.empower .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.empower.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.empower .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 250px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.empower .avatar {
  width:250px;
  height: 178px;
  display: block;
}
 .image-slot {
    font-size: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 250px;
    height: 250px;
    background: #f5f7fa;
    color: #909399;
}
</style>

