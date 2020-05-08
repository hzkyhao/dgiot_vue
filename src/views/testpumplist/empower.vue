<template>
  <div class="empower">
      <el-steps :active="allactive" simple>
        <el-step title="填写认证信息" icon="el-icon-edit">
          
        </el-step>
        <el-step title="填写实验室基本信息" icon="el-icon-upload"></el-step>
        <el-step title="审核结果" icon="el-icon-picture"></el-step>
      </el-steps>
    
    <!--认证企业新增-->
  <div v-if="allactive==1">
      <el-steps :active="active">
          <el-step title="认证企业新增" icon="el-icon-s-check" description="企业认证新增"></el-step>
          <!-- <el-step title="企业检测资质备案" icon="el-icon-s-promotion" description="企业检测资质备案"></el-step> -->
          <el-step title="预览提交" icon="el-icon-picture"></el-step>
        </el-steps>
   
    <div class="empowerone" v-if="active==1">
      <el-card shadow="always">
        <el-form ref="form" :model="form" label-width="140px" :rules="formrules">
          <el-row>
            <!--左边表单-->
            <el-col :span="12">
              <div class="grid-content bg-purple">
                <el-form-item label="企业名称" prop="businessname">
                  <el-input v-model="form.businessname" placeholder="请填写企业名称"></el-input>
                </el-form-item>
                <el-form-item label="企业简称" >
                  <el-input v-model="form.abbrname" placeholder="请填写企业简称"></el-input>
                </el-form-item>
                <el-form-item label="法人代表名称" prop="corporname">
                  <el-input v-model="form.corporname" placeholder="请输入法人姓名"></el-input>
                </el-form-item>
                <el-form-item label="法人代表身份证" required>
                  <el-col :span="11">
                     <img v-if="form.frontimageUrl" :src="form.frontimageUrl" class="avatar" />
                      <i v-else class="el-icon-plus avatar-uploader-icon" ></i>
                        <form
                          method="POST"
                          enctype="multipart/form-data"
                          ref="uploadform"
                          style="position: absolute"
                        >
                          <input
                            type="file"
                            @change="upload($event,'front')"
                            style="position:relative;top:-200px; opacity:0;z-index:5;height:200px;width:200px;cursor:pointer"
                          />
                      </form>
                       <div
                        class="el-upload__text"
                        style="position:absolute;top:90px;color:#8c939d;
                      left:110px;"
                      v-show="form.frontimageUrl==''"
                      >正面</div>
                    <!-- <el-upload
                      class="avatar-uploader"
                      action="/iotapi/upload"
                      :show-file-list="false"
                      :on-success="handleAvatarSuccessFront"
                      :before-upload="beforeAvatarUpload"
                    >
                      <img v-if="form.frontimageUrl" :src="form.frontimageUrl" class="avatar" />
                      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                     
                    </el-upload> -->
                    <el-button
                      size="small"
                      type="danger"
                      style="position: absolute;left: 200px;top:150px;margin-left:0"
                      v-show="form.frontimageUrl!=''"
                      @click="form.frontimageUrl=''"
                    >删除</el-button>
                  </el-col>
                  <el-col class="line" :span="2">-</el-col>
                  <el-col :span="11" style="position:relative">
                    <img v-if="form.contraryimageUrl" :src="form.contraryimageUrl" class="avatar" />
                      <i v-else class="el-icon-plus avatar-uploader-icon" ></i>
                        <form
                          method="POST"
                          enctype="multipart/form-data"
                          ref="uploadform"
                          style="position: absolute"
                        >
                          <input
                            type="file"
                            @change="upload($event,'contrary')"
                            style="position:relative;top:-200px; opacity:0;z-index:5;height:200px;width:200px;cursor:pointer"
                          />
                      </form>
                      <div
                        class="el-upload__text"
                        style="position:absolute;top:90px;color:#8c939d;
                      left:110px;"
                      v-show="form.contraryimageUrl==''"
                      >反面</div>
                    <!-- </el-upload> -->
                    <el-button
                      size="small"
                      type="danger"
                      style="position: absolute;left:190px;top: 150px;margin-left:0"
                      v-show="form.contraryimageUrl!=''"
                      @click="form.contraryimageUrl=''"
                    >删除</el-button>
                  </el-col>
                </el-form-item>
                <el-form-item label="注册地址" prop="addr">
                  <el-cascader
                    size="large"
                    :options="options"
                    v-model="form.addr"
                    @change="handleModChange"
                  ></el-cascader>
                </el-form-item>
                <el-form-item label="营业年限" prop="businessduration">
                  <el-select v-model="form.businessduration" placeholder="请选择营业年限">
                    <el-option label="初创企业" value="1"></el-option>
                    <el-option label="1-3年" value="2"></el-option>
                    <el-option label="3-5年" value="3"></el-option>
                    <el-option label="5-10年" value="4"></el-option>
                    <el-option label="10年以上" value="5"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="注册资金" prop="registeredcapital">
                  <el-input v-model="form.registeredcapital" placeholder="请填写注册资金"><template slot="append">万元</template></el-input>
                </el-form-item>
                <el-form-item label="企业描述" >
                  <el-input
                    type="textarea"
                    placeholder="请输入企业描述信息"
                    v-model="form.businessdesc"
                    maxlength="300"
                    :rows="4"
                    show-word-limit
                  ></el-input>
                </el-form-item>
              </div>
            </el-col>
            <!--右边表单-->
            <el-col :span="12">
              <div class="grid-content bg-purple-light">
                <el-form-item label="企业英文名称" >
                  <el-input v-model="form.englishname" placeholder="请输入企业英文名称"></el-input>
                </el-form-item>
                <el-form-item label="统一社会信用代码" prop="creditcode">
                  <el-input v-model="form.creditcode" placeholder="请输入社会信用代码"></el-input>
                </el-form-item>
                <el-form-item label="法人代表身份证号" prop="identity">
                  <el-input v-model="form.identity" placeholder="请输入法人身份证号码（18位）"></el-input>
                </el-form-item>
                <el-form-item label="企业营业执照" required>
                   <img v-if="form.businesslicense" :src="form.businesslicense" class="avatar" />
                       <i v-else class="el-icon-plus avatar-uploader-icon" style="width:300px;height:200px"></i>
                        <form
                          method="POST"
                          enctype="multipart/form-data"
                          ref="uploadform"
                          style="position: absolute"
                        >
                          <input
                            type="file"
                            @change="upload($event,'business')"
                            style="position:relative;top:-200px; opacity:0;z-index:5;height:200px;width:200px;cursor:pointer"
                          />
                      </form>
                       <div
                      class="el-upload__text"
                      style="position:absolute;top:90px;color:#8c939d;
                      left:100px;"
                      v-show="form.businesslicense==''"
                    >企业营业执照</div>
                  <el-button
                    size="small"
                    type="danger"
                    style="position: absolute;left: 200px;top:150px;margin-left:0"
                    v-show="form.businesslicense!=''"
                    @click="form.businesslicense=''"
                  >删除</el-button>
                </el-form-item>
                <el-form-item label="街道地址" prop="roadress">
                  <el-input v-model="form.roadress" placeholder="请填写企业街道地址"></el-input>
                </el-form-item>
                <el-form-item label="企业规模">
                  <el-select v-model="form.region" placeholder="请选择企业规模">
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
                    v-model="form.businessscope"
                    maxlength="300"
                    :rows="4"
                    show-word-limit
                  ></el-input>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
        </el-form>
        <div style="text-align:center;">
          <el-button type="primary" style="margin-top: 12px;" @click="next('form')">提交,下一步</el-button>
          <el-button type="info">取消</el-button>
        </div>
      </el-card>
    </div>
  
    <!--企业检测资质备案-->
    <!-- <div class="empowertwo" v-if="active==2">
      <el-card shadow="always">
        <div slot="header" class="clearfix">
          <span style="color:#409EFF;font-size:14px;">CNAS证书</span>
        </div>
        <div class="empowertwoheader">
          <el-form :model="ruleForm" ref="ruleForm" label-width="120px" class="demo-ruleForm" :rules="ruleRules">
            <el-row> -->
              <!--证书认证上-->
              <!-- <el-col :span="12">
                <div class="grid-content bg-purple">
                  <el-form-item label="证书编号" prop="cnasname">
                    <el-input v-model="ruleForm.cnasname"></el-input>
                  </el-form-item>
                  <el-form-item label="签发日期" prop="dateOfIssue">
                    <el-date-picker
                      type="date"
                      placeholder="选择签发日期"
                      v-model="ruleForm.dateOfIssue"
                      style="width: 100%;"
                      value-format="timestamp"
                    ></el-date-picker>
                  </el-form-item>
                  <el-form-item label="初次认可" prop="initialRecognition">
                    <el-date-picker
                      type="date"
                      placeholder="选择初次认可日期"
                      v-model="ruleForm.initialRecognition"
                      style="width: 100%;"
                      value-format="timestamp"
                    ></el-date-picker>
                  </el-form-item>
                  <el-form-item label="资质内容">
                    <el-input
                      type="textarea"
                      placeholder="请输入证书资质信息"
                      v-model="ruleForm.cnasdesc"
                      :rows="8"
                    ></el-input>
                  </el-form-item>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="grid-content bg-purple-light">
                  <el-form-item label="发证机关" prop="licencsIssuing">
                    <el-input v-model="ruleForm.licencsIssuing"></el-input>
                  </el-form-item>
                  <el-form-item label="有效期至" prop="termOfValidity">
                    <el-date-picker
                      type="date"
                      placeholder="选择有效期至"
                      v-model="ruleForm.termOfValidity"
                      style="width: 100%;"
                      value-format="timestamp"
                    ></el-date-picker>
                  </el-form-item>
                  <el-form-item label="更新时间" prop="updatedDate">
                    <el-date-picker
                      type="date"
                      placeholder="选择更新日期"
                      v-model="ruleForm.updatedDate"
                      value-format="timestamp"
                      style="width: 100%;"
                    ></el-date-picker>
                  </el-form-item>
                  <el-form-item label="证书电子文件" required>
                    <el-upload
                      class="avatar-uploader"
                      action="/iotapi/upload"
                      :show-file-list="false"
                      :on-success="handleAvatarSuccessBusiness1"
                      :before-upload="beforeAvatarUpload1"
                    >
                      <img v-if="ruleForm.cnasimgsrc" :src="ruleForm.cnasimgsrc" class="avatar" />
                      <i v-else class="el-icon-plus avatar-uploader-icon" style="width:300px;height:200px"></i>
                      <div
                        class="el-upload__text"
                        style="position:absolute;top:90px;color:#8c939d;
                      left:80px;"
                      >证书电子文件</div>
                    </el-upload>
                    <el-button
                      size="small"
                      type="danger"
                      style="position: absolute;left: 200px;top:150px;margin-left:0"
                      v-show="ruleForm.cnasimgsrc!=''"
                      @click="ruleForm.cnasimgsrc=''"
                    >删除</el-button>
                  </el-form-item>
                </div>
              </el-col>
            </el-row>
            </el-form> -->
            <!-- <p
              style="border-bottom:1px solid #cccccc;color:#409EFF;font-size:14px;height:40px"
            >CMA证书</p> -->
            <!--CMA证书-->
            <!-- <el-form :model="ruleformcma" ref="ruleformcma" label-width="120px" class="demo-ruleForm" :rules="ruleformrulecma">
            <el-row>
              <el-col :span="12">
                <div class="grid-content bg-purple">
                  <el-form-item label="证书编号" prop="cmaname">
                    <el-input v-model="ruleformcma.cmaname"></el-input>
                  </el-form-item>
                  <el-form-item label="签发日期" prop="cmadateOfIssue">
                    <el-date-picker
                      type="date"
                      placeholder="选择签发日期"
                      v-model="ruleformcma.cmadateOfIssue"
                      value-format="timestamp"
                      style="width: 100%;"
                    ></el-date-picker>
                  </el-form-item>
                  <el-form-item label="资质内容">
                    <el-input
                      type="textarea"
                      placeholder="请输入证书资质信息"
                      v-model="ruleformcma.cmadesc"
                      :rows="8"
                    ></el-input>
                  </el-form-item>
                  
                </div>
              </el-col>
              <el-col :span="12">
                <div class="grid-content bg-purple-light">
                   <el-form-item label="发证机关" prop="cmalicencsIssuing">
                    <el-input v-model="ruleformcma.cmalicencsIssuing"></el-input>
                  </el-form-item>
                  <el-form-item label="有效期至" prop="cmatermOfValidity">
                    <el-date-picker
                      type="date"
                      placeholder="选择签发日期"
                      v-model="ruleformcma.cmatermOfValidity"
                      style="width: 100%;"
                      value-format="timestamp"
                    ></el-date-picker>
                  </el-form-item>
                  <el-form-item label="证书电子文件" required>
                    <el-upload
                      class="avatar-uploader"
                      action="/iotapi/upload"
                      :show-file-list="false"
                      :on-success="handleAvatarSuccessBusiness2"
                      :before-upload="beforeAvatarUpload2"
                    >
                      <img v-if="ruleformcma.cmaimgsrc" :src="ruleformcma.cmaimgsrc" class="avatar" />
                      <i v-else class="el-icon-plus avatar-uploader-icon" style="width:300px;height:200px"></i>
                      <div
                        class="el-upload__text"
                        style="position:absolute;top:90px;color:#8c939d;
                      left:80px;"
                      >证书电子文件</div>
                    </el-upload>
                    <el-button
                      size="small"
                      type="danger"
                      style="position: absolute;left: 200px;top:150px;margin-left:0"
                      v-show="ruleformcma.cmaimgsrc!=''"
                      @click="ruleformcma.cmaimgsrc=''"
                    >删除</el-button>
                  </el-form-item>
                </div>
              </el-col>
            </el-row>
          </el-form>
          <el-form :inline="true" :model="otherForm" label-width="120px">
            <el-row>
              <el-col :span="12">
                <el-form-item >
                  <template slot="label">
                    <span style="color:#409EFF">其他资质(可选)</span>
                  </template>
                  <el-input v-model="otherForm.other" placeholder="请输入证书名称"></el-input>
                </el-form-item>
                <el-form-item v-show="otherForm.other!=''">
                  <el-button type="primary" @click="addOther">确定</el-button>
                </el-form-item>
                <el-form-item v-show="otherForm.other!=''">
                  <el-button type="primary">取消</el-button>
                </el-form-item>
              </el-col>
          </el-row>
          </el-form> -->
        <!-- </div> -->
        <!-- <div style="text-align:center;">
          <el-button type="primary" style="margin-top: 12px;" @click="nextTo('ruleForm','ruleformcma')">确定,下一步</el-button>
          <el-button type="info">取消</el-button>
          <el-button type="info" @click="goBack">返回上一步</el-button>
        </div> -->
      <!-- </el-card> -->
    <!-- </div> -->
    <!--预览提交-->
    <div class="empowerthird" v-if="active==2">
       <el-divider>企业认证</el-divider>
      <el-form ref="form1" :model="form" label-width="140px" :rules="formrules1">
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
                      :on-success="handleAvatarSuccessFront"
                      :before-upload="beforeAvatarUpload"
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
                      :on-success="handleAvatarSuccessContrary"
                      :before-upload="beforeAvatarUpload"
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
                    @change="handleModChange"
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
                <el-form-item label="企业英文名称" prop="englishname">
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
                    :on-success="handleAvatarSuccessBusiness"
                    :before-upload="beforeAvatarUpload"
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
                      :on-success="handleAvatarSuccessBusiness1"
                      :before-upload="beforeAvatarUpload1"
                    >
                      <img v-if="ruleForm1.cnasimgsrc" :src="ruleForm1.cnasimgsrc" class="avatar" />
                      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                      <div
                        class="el-upload__text"
                        style="position:absolute;top:90px;color:#8c939d;
                      left:80px;"
                      >证书电子文件</div>
                    </el-upload> -->
                    <!-- <el-button
                      size="small"
                      type="danger"
                      style="position: absolute;left: 200px;top:150px;margin-left:0"
                      v-show="ruleForm1.cnasimgsrc!=''"
                    >删除</el-button> -->
                  <!-- </el-form-item> -->
                  
                <!-- </div>
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
                      :on-success="handleAvatarSuccessBusiness2"
                      :before-upload="beforeAvatarUpload2"
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
            >{{item.title}}</p> -->
              <!--证书认证上-->
              <!-- <el-col :span="12">
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
         
          <div style="text-align:center;">
          <el-button type="primary" style="margin-top: 12px;" @click="addEmpower">提交审核</el-button>
          <el-button type="info" @click="goBack">返回上一步</el-button>
        </div>
    </div>
  </div>
  <!--实验室认证-->
  <div v-if="allactive==2">
     <el-steps :active="laboratoryactive" simple>
        <el-step title="填写实验室信息" icon="el-icon-s-promotion">
          
        </el-step>
        <el-step title="预览提交审核" icon="el-icon-upload"></el-step>
      </el-steps>
    <div class="block" style="padding:30px;box-sizing:border-box" v-if="laboratoryactive==1">
       <p
        style="border:1px solid #cccccc;font-size:20px;height:40px;line-height:40px;margin:0;padding-left:20px;"
      >企业实验室认证</p>
      <div class="blocktop" style="margin-top:20px;">
        <el-tabs v-model="editableTabsValue" type="card" closable @tab-remove="removeTab">
          <el-button type="primary" @click="addTab(editableTabsValue)" size="small" style="float:right">新增</el-button>
            <el-tab-pane
              v-for="(item) in editableTabs"
              :key="item.name"
              :label="item.title"
              :name="item.name"
            >
            <LaboratoryForm  @resultes="getLaboratory"/>
          </el-tab-pane>
        </el-tabs>
        <div style="text-align:center">
          <el-row>
            <el-button type="primary" @click="previewLaboratory">确定,预览</el-button>
            <el-button type="info">取消</el-button>
          </el-row>
        </div>
      </div>
     
    </div>
    <div v-if="laboratoryactive==2" >
      <el-tabs v-model="laboratoryFormvalue" type="card" >
            <el-tab-pane
              v-for="(item,index) in laboratorylist"
              :key="item.laboratoryForm.name"
              :label="'实验室'+(index+1)"
              :name="item.laboratoryForm.name"
            >
            <Preview :laboratoryForm="item.laboratoryForm" :otherform="item.otherslist" />
          </el-tab-pane>
        </el-tabs>
        <div style="text-align:center">
          <el-row>
            <el-button type="primary" @click="allactive=3">确定</el-button>
            <el-button type="info" @click="laboratoryactive=1">返回上一步</el-button>
          </el-row>
        </div>
    </div>
  </div>
  <div v-if="allactive==3">
    <div class="block" style="margin:0 auto;text-align:center;padding:30px;">
      <el-image>
        <div slot="error" class="image-slot">
         <svg-icon icon-class="empowerexamine" style="width:8rem;height:8rem">

         </svg-icon>
        </div>
      </el-image>
      <p style="font-size: 25px;color: #409EFF;">正在审核中</p>
      <p style="font-size: 20px;">审核员联系电话：17201202365</p>
      <p style="color:#cccccc;font-size:14px">预计3到5个工作日完成，请耐心等待，谢谢您的配合和理解</p>
      <p><el-button type="primary" @click="cancelAdd">撤销审核<i class="el-icon-s-fold"></i></el-button></p>
    </div>
  </div>
    <!--其他资质弹窗-->
    <el-dialog
      title="其他资质添加"
      :visible.sync="dialogVisible"
      width="60%"
      :before-close="handleClose">
      <div class="dialogform">
         <el-form :model="addotherform" ref="addotherform" label-width="120px" class="demo-addotherform" :rules="otheformrule">
            <el-row>
               <p
              style="border-bottom:1px solid #cccccc;color:#409EFF;font-size:14px;"
            >其他证书</p>
              <!--证书认证上-->
              <el-col :span="12">
                <div class="grid-content bg-purple">
                  <el-form-item label="证书编号" prop="name">
                    <el-input v-model="addotherform.name"></el-input>
                  </el-form-item>
                  <el-form-item label="签发日期" prop="dateOfIssue">
                    <el-date-picker
                      type="date"
                      placeholder="选择签发日期"
                      v-model="addotherform.dateOfIssue"
                      value-format="timestamp"
                      style="width: 100%;"
                    ></el-date-picker>
                  </el-form-item>
                  <el-form-item label="初次认可" prop="initialRecognition">
                    <el-date-picker
                      type="date"
                      placeholder="选择签发日期"
                      v-model="addotherform.initialRecognition"
                      value-format="timestamp"
                      style="width: 100%;"
                    ></el-date-picker>
                  </el-form-item>
                  <el-form-item label="资质内容">
                    <el-input
                      type="textarea"
                      placeholder="请输入证书资质信息"
                      v-model="addotherform.desc"
                      :rows="8"
                    ></el-input>
                  </el-form-item>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="grid-content bg-purple-light">
                  <el-form-item label="发证机关" prop="licencsIssuing">
                    <el-input v-model="addotherform.licencsIssuing"></el-input>
                  </el-form-item>
                  <el-form-item label="有效期至" prop="termOfValidity">
                    <el-date-picker
                      type="date"
                      placeholder="选择有效期至"
                      v-model="addotherform.termOfValidity"
                      value-format="timestamp"
                      style="width: 100%;"
                    ></el-date-picker>
                  </el-form-item>
                  <el-form-item label="更新时间" prop="updatedDate">
                    <el-date-picker
                      type="date"
                      placeholder="选择签发更新时间"
                      v-model="addotherform.updatedDate"
                      value-format="timestamp"
                      style="width: 100%;"
                    ></el-date-picker>
                  </el-form-item>
                  <el-form-item label="证书电子文件" required>
                    <el-upload
                      class="avatar-uploader"
                      action="/iotapi/upload"
                      :show-file-list="false"
                      :on-success="handleAvatarSuccessOther"
                      :before-upload="beforeAvatarUploadOther"
                    >
                      <img v-if="addotherform.imgsrc" :src="addotherform.imgsrc" class="avatar" />
                      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                      <div
                        class="el-upload__text"
                        style="position:absolute;top:90px;color:#8c939d;
                      left:50px;"
                      >证书电子文件</div>
                    </el-upload>
                    <el-button
                      size="small"
                      type="danger"
                      style="position: absolute;left: 200px;top:150px;margin-left:0"
                      v-show="addotherform.imgsrc!=''"
                      @click="addotherform.imgsrc=''"
                    >删除</el-button>
                  </el-form-item>
                </div>
              </el-col>
            </el-row>
         </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateOther('addotherform')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { regionData, CodeToText } from "element-china-area-data";
import { resolve } from "q";
import { setTimeout } from 'timers';
import Parse from 'parse'
import {returnLogin} from '@/utils/return'
import LaboratoryForm from '@/components/laboratoryForm'
import Cookies from 'js-cookie'
import Preview from '@/components/laboratoryForm/preview'
var otherEmpowerlist=[]
export default {
  components:{
  LaboratoryForm,
  Preview
  },
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
      laboratoryactive:1,
     editableTabsValue: '1',
     laboratoryFormvalue:'1',
      editableTabs: [{
        title: '实验室1',
        name: '1',
        content: ''
      }],
      tabIndex: 1,
      
      allactive:1,
      active: 1,
      form: {
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
      formrules: {
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
      //资质认证
      ruleForm: {
        cnasname: "",
        dateOfIssue:'',
        updatedDate: "",
        initialRecognition:'',
        termOfValidity:'',
        licencsIssuing:'',
        cnasimgsrc: "",
        cnasdesc:'',
       
      },
      ruleformcma:{
        cmaname: "",
        cmadateOfIssue: "",
        cmalicencsIssuing:'',
        cmatermOfValidity:'',
        cmaimgsrc: "",
        cmadesc:''
      },
      ruleformrulecma:{
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
      otherForm:{
        other:''
      },
      ruleRules:{
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
      dialogVisible:false,
      addotherform:{
        name: "",
        dateOfIssue:'',
        updatedDate: "",
        initialRecognition:'',
        termOfValidity:'',
        licencsIssuing:'',
        imgsrc: "",
        desc:'',
      },
      previewother:{
        otherform:[]
      },
      otheformrule:{
        name:[
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
          ]
      },
      ewpowerid:'',
      laboratorylist:[],
      imgtype:''
    };
  },
  mounted() {
   this.originData()
  },

  methods: {
    upload(event,type) {
      this.imgtype=type
      if (event) {
        var file = event.target.files[0]; //name: "dangqi1.png" || type: "image/png"
        var name = file.name;
        var testmsg = event.target.files[0].type
        var type = file.type.split("/")[0];
        var extension =
        testmsg === "image/jpeg" ||
        testmsg === "image/JPEG" ||
        testmsg === "image/png" ||
        testmsg === "image/PNG" ||
        testmsg === "image/bpm" ||
        testmsg === "image/BPM";
        if (!extension) {
          //将图片img转化为base64
            this.$message({
            message: "请上传图片",
            type: "error"
          });
          return false; //必须加上return false; 才能阻止
        }else{
          var reader = new FileReader();
          reader.readAsDataURL(file);
          var that = this;
          reader.onloadend = function() {
            var dataURL = reader.result;
            var blob = that.dataURItoBlob(dataURL);
            that.uploadFile(blob, name); //执行上传接口
          };
        }
      }
    },
    dataURItoBlob(dataURI) {
      // base64 解码
      var byteString = atob(dataURI.split(",")[1]);
      var mimeString = dataURI
        .split(",")[0]
        .split(":")[1]
        .split(";")[0];
      var ab = new ArrayBuffer(byteString.length);
      var ia = new Uint8Array(ab);
      for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      return new Blob([ab], { type: mimeString });
    },
    uploadFile(imgUrl, name) {
      var formdata = new FormData();
     formdata.append("file", imgUrl, name);
      formdata.append("output", 'json')
      formdata.append("path",Cookies.get('appids'))
       formdata.append("scene",Cookies.get('appids'))
      formdata.append("auth_token", Cookies.get('access_token')) //下面是要传递的参数
      //此处必须设置为  multipart/form-data
      let config = {
        headers: {
          "Content-Type": "multipart/form-data" //之前说的以表单传数据的格式来传递fromdata
        }
      };
      this.$http
        .post(Cookies.get('fileserver'),formdata)
        .then(res => { 
          if(res){
            if(this.imgtype=='front'){
              this.form.frontimageUrl= res.body.url
            }else if(this.imgtype=='contrary'){
              this.form.contraryimageUrl = res.body.url
            }else if(this.imgtype=='business'){
              this.form.businesslicense = res.body.url
            }
            
          }
        }).catch(error=>{
          
          this.$message.error(error.bodyText)
        });
    },
    addTab(targetName) {
        let newTabName = ++this.tabIndex + '';
        this.editableTabs.push({
          title: '实验室'+this.tabIndex,
          name: newTabName,
          content: 'New Tab content'
        });
        this.editableTabsValue = newTabName;
      },
      removeTab(targetName) {
        let tabs = this.editableTabs;
        let activeName = this.editableTabsValue;
        if (activeName === targetName) {
          tabs.forEach((tab, index) => {
            if (tab.name === targetName) {
              let nextTab = tabs[index + 1] || tabs[index - 1];
              if (nextTab) {
                activeName = nextTab.name;
              }
            }
          });
        }
        
        this.editableTabsValue = activeName;
        this.editableTabs = tabs.filter(tab => tab.name !== targetName);
      },
    //标签页点击事件
    tagGoIndex(index){
      this.isshowactive = index
    },
    //实验室认证
    addTag(){
      this.dynamicTags.push('实验室')
    },
    //初始化事件判断是否有填写
    originData(){
        var Authentication = Parse.Object.extend('Authentication')
        var authentication = new Parse.Query(Authentication)
          authentication.find().then(response=>{
              console.log(response)
          if(response.length>0){
            if(response[0].attributes.empower){
             this.form.name=response[0].attributes.empower.name 
             this.form.region=response[0].attributes.empower.region
             this.form.desc=response[0].attributes.empower.desc,
             this.form.identity=response[0].attributes.empower.identity
             this.form.frontimageUrl=response[0].attributes.empower.frontimageUrl //身份证正面照
             this.form.contraryimageUrl=response[0].attributes.empower.contraryimageUrl //身份证反面照
             this.form.businesslicense=response[0].attributes.empower.businesslicense //企业营业执照
             this.form.businessname=response[0].attributes.empower.businessname//公司名称
             this.form.abbrname=response[0].attributes.empower.abbrname //企业简称
             this.form.corporname=response[0].attributes.empower.corporname //法人代表名称
             this.form.englishname=response[0].attributes.empower.englishname //英文名称
             this.form.creditcode=response[0].attributes.empower.creditcode//统一社会信用代码
             this.form.addr=response[0].attributes.empower.addr //设备地址
             this.form.roadress=response[0].attributes.empower.roadress //街道地址
             this.form.businessduration=response[0].attributes.empower.businessduration //营业年限
             this.form.businessdesc=response[0].attributes.empower.businessdesc //企业描述
             this.form.businessscope=response[0].attributes.empower.businessscope //经营范围
             this.form.registeredcapital=response[0].attributes.empower.registeredcapital //注册资金
             this.ewpowerid=response[0].id
            }
            if(response[0].attributes.cnas){
              this.ruleForm.cnasname =response[0].attributes.cnas.cnasname ,
              this.ruleForm.dateOfIssue=response[0].attributes.cnas.dateOfIssue,
              this.ruleForm.updatedDate = response[0].attributes.cnas.updatedDate,
              this.ruleForm.initialRecognition = response[0].attributes.cnas.initialRecognition,
              this.ruleForm.termOfValidity = response[0].attributes.cnas.termOfValidity,
              this.ruleForm.licencsIssuing= response[0].attributes.cnas.licencsIssuing
              this.ruleForm.cnasimgsrc= response[0].attributes.cnas.cnasimgsrc
              this.ruleForm.cnasdesc=response[0].attributes.cnas.cnasdesc
            }
            if(response[0].attributes.cma){
              this.ruleformcma.cmaname = response[0].attributes.cma.cmaname,
              this.ruleformcma.cmadateOfIssue = response[0].attributes.cma.cmadateOfIssue,
              this.ruleformcma.cmalicencsIssuing = response[0].attributes.cma.cmalicencsIssuing,
              this.ruleformcma.cmatermOfValidity = response[0].attributes.cma.cmatermOfValidity,
              this.ruleformcma.cmaimgsrc=response[0].attributes.cma.cmaimgsrc,
              this.ruleformcma.cmadesc = response[0].attributes.cma.cmadesc
            }
            if(response[0].attributes.other){
              otherEmpowerlist = response[0].attributes.other
            }
          }
        },error=>{
          returnLogin(error)
        })
    },
    //第一个确定
    next(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if(this.form.frontimageUrl==''){
            this.$message.error('请上传身份证正面照')
            return
          }
          if(this.form.contraryimageUrl==''){
            this.$message.error('请上传身份证背面照')
            return
          }
          if(this.form.businesslicense==''){
            this.$message.error('请上传企业营业执照')
            return
          }
          var userid = Parse.User.current().id
          var Authentication = Parse.Object.extend('Authentication')
          var authentication = new Authentication()
          if(this.empowerid!=''){
            authentication.id = this.ewpowerid
          }
          var acl = new Parse.ACL()
          authentication.set('empower',{
            name: this.form.name,
            region: this.form.region,
            desc: this.form.desc,
            identity: this.form.identity,
            frontimageUrl: this.form.frontimageUrl, //身份证正面照
            contraryimageUrl:this.form.contraryimageUrl, //身份证反面照
            businesslicense: this.form.businesslicense, //企业营业执照
            businessname: this.form.businessname, //公司名称
            abbrname: this.form.abbrname, //企业简称
            corporname: this.form.corporname, //法人代表名称
            englishname: this.form.englishname, //英文名称
            creditcode: this.form.creditcode, //统一社会信用代码
            addr: this.form.addr, //设备地址
            roadress: this.form.roadress, //街道地址
            businessduration: this.form.businessduration, //营业年限
            businessdesc: this.form.businessdesc, //企业描述
            businessscope: this.form.businessscope, //经营范围
            registeredcapital: this.form.registeredcapital //注册资金
          })
          acl.setRoleWriteAccess('Auditor',true)
          acl.setRoleReadAccess('Auditor',true)
          acl.setRoleWriteAccess('Labadmin',true)
          acl.setRoleReadAccess('Labadmin',true)
          acl.setRoleWriteAccess('Inspector',true)
          acl.setRoleReadAccess('Inspector',true)
          acl.setReadAccess(userid,true)
          acl.setWriteAccess(userid,true)
          authentication.set("ACL",acl)
         authentication.save().then(resultes=>{
           if(resultes){
             this.$message.success('企业认证成功')
              this.active++;
              this.form1 = this.form
              if(this.ewpowerid==''){
                 var Authentication = Parse.Object.extend('Authentication')
                 var authentication = new Parse.Query(Authentication)
                 authentication.find().then(response=>{
                   this.ewpowerid = response[0].id
                 })
                
              }
                
           }
         },error=>{
           returnLogin(error)
         })
        } else {
          this.$message.error("有必填项未填写");
          return false;
        }
      });
    },
    beforeAvatarUpload1(file){
      var testmsg = file.name.substring(file.name.lastIndexOf(".") + 1);
      var extension =
        testmsg === "jpg" ||
        testmsg === "JPG" ||
        testmsg === "png" ||
        testmsg === "PNG" ||
        testmsg === "bpm" ||
        testmsg === "BPM";
      const isLt50M = file.size / 1024 / 1024 < 10;
      if (!extension) {
        this.$message({
          message: "上传图片只能是jpg / png / bpm格式!",
          type: "error"
        });
        return false; //必须加上return false; 才能阻止
      }
      if (!isLt50M) {
        this.$message({
          message: "上传文件大小不能超过 10MB!",
          type: "error"
        });
        return false;
      }
      return extension || isLt50M;
    },
    beforeAvatarUpload2(file){
      var testmsg = file.name.substring(file.name.lastIndexOf(".") + 1);
      var extension =
        testmsg === "jpg" ||
        testmsg === "JPG" ||
        testmsg === "png" ||
        testmsg === "PNG" ||
        testmsg === "bpm" ||
        testmsg === "BPM";
      const isLt50M = file.size / 1024 / 1024 < 10;
      if (!extension) {
        this.$message({
          message: "上传图片只能是jpg / png / bpm格式!",
          type: "error"
        });
        return false; //必须加上return false; 才能阻止
      }
      if (!isLt50M) {
        this.$message({
          message: "上传文件大小不能超过 10MB!",
          type: "error"
        });
        return false;
      }
      return extension || isLt50M;
    },
    handleClose(){
      this.dialogVisible = false
    },
   
    nextTo(formName1,formName2){
      var valid1
      var valid2
        this.$refs[formName1].validate(valid => {
          if (valid) {
            valid1 = true
          }
        })
         this.$refs[formName2].validate(valid => {
           if(valid){
              valid2 = true
           }
         })
         if(valid1||valid2){
           if(valid1){
              if(this.ruleForm.cnasimgsrc==''){
               this.$message.error('请上传CNAS证件照片')
                return
            }
           }
           if(valid2){
              if(this.ruleformcma.cmaimgsrc==''){
                  this.$message.error('请上传CMA证件照片')
                  return
              }
            }
             var Authentication = Parse.Object.extend('Authentication')
             var authentication = new Authentication()
             authentication.id = this.ewpowerid
             authentication.set('cnas',{
              cnasname:this.ruleForm.cnasname,
              dateOfIssue:this.ruleForm.dateOfIssue,
              updatedDate: this.ruleForm.updatedDate,
              initialRecognition:this.ruleForm.initialRecognition,
              termOfValidity:this.ruleForm.termOfValidity,
              licencsIssuing:this.ruleForm.licencsIssuing,
              cnasimgsrc: this.ruleForm.cnasimgsrc,
              cnasdesc:this.ruleForm.cnasdesc,
             })
             authentication.set('cma',{
              cmaname: this.ruleformcma.cmaname,
              cmadateOfIssue: this.ruleformcma.cmadateOfIssue,
              cmalicencsIssuing:this.ruleformcma.cmalicencsIssuing,
              cmatermOfValidity:this.ruleformcma.cmatermOfValidity,
              cmaimgsrc: this.ruleformcma.cmaimgsrc,
              cmadesc:this.ruleformcma.cmadesc
             })
             authentication.set('status','Pending')
             authentication.save().then(response=>{
               if(response){
                this.$message.success('添加成功')
                 this.active++
                 this.form1 = this.form
                 this.ruleForm1 = this.ruleForm
                 this.ruleForm2 = this.ruleformcma
                 this.previewother.otherform = otherEmpowerlist
               }
            },error=>{
              returnLogin(error)
            })
         }
    },
    //其他资质添加
    updateOther(formName){
         this.$refs[formName].validate(valid => {
          if (valid) {
            if(this.addotherform.imgsrc==''){
              this.$message.error('请上传资质照片')
              return
            }
            var obj = {
              title:this.otherForm.other,
              name:this.addotherform.name,
              dateOfIssue:this.addotherform.dateOfIssue,
              updatedDate:this.addotherform.updatedDate,
              initialRecognition:this.addotherform.initialRecognition,
              termOfValidity:this.addotherform.termOfValidity,
              licencsIssuing:this.addotherform.licencsIssuing,
              imgsrc:this.addotherform.imgsrc,
              desc:this.addotherform.desc
            }
            otherEmpowerlist.push(obj)
            this.$refs[formName].resetFields()
            this.addotherform.imgsrc=''
            this.dialogVisible=false
          }
         })
    },
    //确定
    addOther(){
      if(this.otherForm.other==''){
        this.$message.warning('请填写其他资质名称')
      }else{
        this.dialogVisible = true
      }
    },
    goBack(){
      if(this.active>1&&this.active<=3){
         this.active--
      }
     
    },
    handleModChange(value) {
      // 修改
      console.log(value)
    },
    //提交审核
    addEmpower(){
  
    this.form1 = this.form
    this.ruleForm1 = this.ruleForm
    this.ruleForm2 = this.ruleformcma
     var Authentication = Parse.Object.extend('Authentication')
     var authentication = new Authentication()
     authentication.id = this.ewpowerid
     authentication.set('other',otherEmpowerlist)
     authentication.save().then(resultes=>{
       if(resultes){
           this.$message.success('提交成功')    
           this.allactive++
       }
     })
    },
    cancelAdd(){
      this.allactive=1
      this.active=1
    },
    getLaboratory(value){
     
      this.laboratorylist.push(value)
    },
    previewLaboratory(){
      if(this.laboratorylist.length==0){
        this.$message.error('请至少提交一个实验室认证')
        return
      }
      this.laboratoryFormvalue = this.laboratorylist[0].laboratoryForm.name
      this.laboratoryactive = 2
    }
  }
};
</script>
<style lang="scss" scoped>
.empower {
  width: 100%;
  height: 100%;
  padding: 20px 60px;
  box-sizing: border-box;
  background: #ffffff;
  .empowerone {
    width: 100%;
    height: auto;
    .el-form {
      .el-col-12 {
        padding: 20px;
        @media screen and (max-width: 1300px) {
          width: 100%;
        }
        /deep/ .el-select {
          width: 100%;
        }
        /deep/ .el-cascader {
          width: 100%;
        }
      }
    }
  }
  .empowerthird {
    width: 100%;
    height: auto;
    .el-form {
      .el-col-12 {
        padding: 20px;
        @media screen and (max-width: 1300px) {
          width: 100%;
        }
        /deep/ .el-select {
          width: 100%;
        }
        /deep/ .el-cascader {
          width: 100%;
        }
      }
    }
  }
  .empowertwo {
    width: 100%;
    height: auto;
    .el-form {
      .el-col-12 {
        padding: 20px;
        
        @media screen and (max-width: 1300px) {
          width: 100%;
        }
        /deep/ .el-select {
          width: 100%;
        }
        /deep/ .el-cascader {
          width: 100%;
        }
      }
    }
  }
  /deep/ .el-form-item--small{
    margin-bottom:18px;
    /deep/ .el-select {
          width: 100%;
        }
    /deep/ .el-date-editor{
      width:100%
    }
  }
  // /deep/ .el-form-item__label{
  //         background:pink;
  //       }
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
  border:1px solid #cccccc;
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
.empower .el-tabs__header{
  margin-top:20px;
}
</style>
