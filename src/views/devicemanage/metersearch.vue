<template>
  <div id="metersearch" style="display:flex;">
    <Resource1  :regiondata='departmentdata' @meterdetail="handleNodeClick" @department="getDeSearch" />
    <div style="width:calc(100% - 360px);">
      <el-form :inline="true" :model="formInline" class="demo-form-inline" size="small">
        <el-form-item label="用户编号">
          <el-input v-model="formInline.userId" placeholder="请输入用户编号" @change="handleUserChange"></el-input>
        </el-form-item>
        <el-form-item label="用户名称">
          <el-input v-model="formInline.user" placeholder="请输入用户名称"></el-input>
        </el-form-item>
        <el-form-item label="电能表地址">
          <el-input v-model="formInline.electricityId" placeholder="请输入电能表地址"></el-input>
        </el-form-item>
        <el-form-item label="集中器地址">
          <el-input v-model="formInline.cost" placeholder="请输入集中器地址"></el-input>
        </el-form-item>
        <el-form-item label="用户地址">
          <el-input v-model="formInline.yhdz" placeholder="请输入地址"></el-input>
        </el-form-item>
        <div>
          <el-form-item>
            <el-button type="primary" size="small" @click="inquire">查询</el-button>
            <el-button type="primary" size="small" @click="addsmartmeter">新增</el-button>
          </el-form-item>
        </div>
      </el-form>

      <div id="table">
        <el-table
          ref="multipleTable"
          :data="tableData3"
          tooltip-effect="dark"
          style="width:100%;margin-top:30px;text-align:center;"
          highlight-current-row
          class="tb-edit"
          border
          stripe
          height="750"
          id="out-table"
        >
          <el-table-column type="selection" width="40"></el-table-column>
          <el-table-column label="供电单位" show-overflow-tooltip align="center" width="80">
            <template slot-scope="scope">
              <span>{{scope.row.gddw}}</span>
            </template>
          </el-table-column>

          <el-table-column label="用户编号" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{scope.row.yhabh}}</span>
            </template>
          </el-table-column>
          <el-table-column label="用户名称" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{scope.row.yhmc}}</span>
            </template>
          </el-table-column>

          <el-table-column label="台区名称" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{scope.row.tq}}</span>
            </template>
          </el-table-column>

          <el-table-column label="集中器地址" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{scope.row.vcaddr}}</span>
            </template>
          </el-table-column>

          <el-table-column label="电能表地址" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{scope.row.addr}}</span>
            </template>
          </el-table-column>

          <el-table-column label="PN值" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{scope.row.pn}}</span>
            </template>
          </el-table-column>

          <el-table-column label="抄表类型" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{scope.row.cblx}}</span>
            </template>
          </el-table-column>

          <el-table-column label="采集器编号" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{scope.row.deveui}}</span>
            </template>
          </el-table-column>

          <el-table-column label="应用编号" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{scope.row.appeui}}</span>
            </template>
          </el-table-column>

          <el-table-column label="用户地址" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{scope.row.yhdz}}</span>
            </template>
          </el-table-column>

          <el-table-column prop label="操作" align="center" width="150">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="success"
                @click="editorMeter(scope.row),dialogFormVisible = true"
              >修 改</el-button>
              <el-button size="mini" type="danger" @click="deleteMeter(scope.row)">删 除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 修改信息 -->
        <el-dialog title="修改信息" :visible.sync="dialogFormVisible">
          <el-form :model="mod_form">
            <el-divider content-position="left">抄表档案</el-divider>
            <el-form-item label="供电单位" :label-width="formLabelWidth">
              <el-input v-model="mod_form.gddw" autocomplete="off" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="用户编号" :label-width="formLabelWidth">
              <el-input v-model="mod_form.yhabh" autocomplete="off" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="用户名称" :label-width="formLabelWidth">
              <el-input v-model="mod_form.yhmc" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="用户类别" :label-width="formLabelWidth">
              <el-select v-model="mod_form.yhlb" clearable placeholder="请选择用户类别">
                <el-option
                  v-for="item of mod_form.yhlb_arr"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="台区名称" :label-width="formLabelWidth">
              <el-input v-model="mod_form.tq" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="集中器地址" :label-width="formLabelWidth">
              <el-input v-model="mod_form.vcaddr" autocomplete="off" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="电能表地址" :label-width="formLabelWidth">
              <el-input v-model="mod_form.addr" autocomplete="off" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="PN值" :label-width="formLabelWidth">
              <el-input v-model="mod_form.pn" autocomplete="off"></el-input>
            </el-form-item>
             <el-form-item label="CT倍率" :label-width="formLabelWidth" >
              <el-input v-model.number="mod_form.ct" autocomplete="off" placeholder="请输入ct值" :min='1'></el-input>
            </el-form-item>
              <el-form-item label="PT倍率" :label-width="formLabelWidth" >
              <el-input v-model.number="mod_form.pt" autocomplete="off" placeholder="请输入pt值" :min='1'></el-input>
            </el-form-item>
            <el-form-item label="抄表类型" :label-width="formLabelWidth">
              <el-select v-model="mod_form.cblx" disabled clearable placeholder="请选择抄表类型">
                <el-option
                  v-for="item of mod_form.cblx_arr"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="采集器编号" :label-width="formLabelWidth">
              <el-input v-model="mod_form.deveui" autocomplete="off" placeholder="请输入采集器编号"></el-input>
            </el-form-item>
            <el-form-item label="应用编号" :label-width="formLabelWidth">
              <el-input v-model="mod_form.appeui" autocomplete="off" placeholder="请输入应用编号"></el-input>
            </el-form-item>
            <el-form-item label="用户地址" :label-width="formLabelWidth">
              <el-cascader
                size="large"
                :options="options"
                v-model="mod_form.addr"
                @change="handleModChange"
              ></el-cascader>
              <el-input
                type="textarea"
                :rows="2"
                v-model="mod_form.yhdz"
                autocomplete="off"
                placeholder="详细地址"
              ></el-input>
            </el-form-item>

            <!-- 电表信息 -->
            <el-divider></el-divider>
            <div
              style="display:flex;justify-content:space-between;width:100%;padding:0 10%;line-height:0;"
            >
              <p style="font-size:20px;font-weight:500;">电表信息(选填)</p>
              <el-button
                type="info"
                style="padding:10px;"
                @click="handleClickUpdateShow"
              >{{updateShow?'隐藏':'显示'}}</el-button>
            </div>
            <div
              v-show="updateShow"
              style="display:flex;flex-wrap: wrap;justify-content: space-around;"
            >
              <el-form-item label="资产编号" :label-width="formLabelWidth">
                <el-input v-model="mod_form.zcbh" autocomplete="off" placeholder="请输入资产标号编号"></el-input>
              </el-form-item>
              <el-form-item label="出厂编号" :label-width="formLabelWidth">
                <el-input v-model="mod_form.ccbh" autocomplete="off" placeholder="请输入出厂编号"></el-input>
              </el-form-item>
              <el-form-item label="远程控制密码" :label-width="formLabelWidth">
                <el-input
                  show-password
                  v-model="mod_form.dbmm"
                  autocomplete="off"
                  placeholder="请输入远程控制密码"
                ></el-input>
              </el-form-item>
              <el-form-item label="采集器编号" :label-width="formLabelWidth">
                <el-input
                  show-password
                  v-model="mod_form.deveui"
                  autocomplete="off"
                  placeholder="请输入采集编号"
                ></el-input>
              </el-form-item>
              <el-form-item label="注册应用号" :label-width="formLabelWidth">
                <el-input
                  show-password
                  v-model="mod_form.appeui"
                  autocomplete="off"
                  placeholder="请输入注册应用号"
                ></el-input>
              </el-form-item>
              <el-form-item label="计量点编号" :label-width="formLabelWidth">
                <el-input v-model="mod_form.jldbh" autocomplete="off" placeholder="请输入计量点编号"></el-input>
              </el-form-item>
              <el-form-item label="投运时间" :label-width="formLabelWidth">
                <el-date-picker v-model="mod_form.tysj" type="date" placeholder="选择日期"></el-date-picker>
              </el-form-item>
              <el-form-item label="上次检验日期" :label-width="formLabelWidth">
                <el-date-picker v-model="mod_form.scjyrq" type="date" placeholder="选择日期"></el-date-picker>
              </el-form-item>
              <el-form-item label="到货批次号" :label-width="formLabelWidth">
                <el-input v-model="mod_form.dhpc" autocomplete="off" placeholder="请输入到货批次号"></el-input>
              </el-form-item>
              <el-form-item label="综合倍率" :label-width="formLabelWidth">
                <el-input v-model="mod_form.zhbl" autocomplete="off" placeholder="请输入综合倍率"></el-input>
              </el-form-item>
              <el-form-item label="抄表区段" :label-width="formLabelWidth">
                <el-input v-model="mod_form.cbqd" autocomplete="off" placeholder="请输入抄表区段"></el-input>
              </el-form-item>
              <el-form-item label="线路" :label-width="formLabelWidth">
                <el-input v-model="mod_form.xl" autocomplete="off" placeholder="请输入线路"></el-input>
              </el-form-item>
              <el-form-item label="厂站" :label-width="formLabelWidth">
                <el-input v-model="mod_form.cz" autocomplete="off" placeholder="请输入厂站"></el-input>
              </el-form-item>
              <el-form-item label="额定电压" :label-width="formLabelWidth">
                <el-input v-model="mod_form.eddy" autocomplete="off" placeholder="请输入额定电压"></el-input>
              </el-form-item>
              <el-form-item label="标定电流" :label-width="formLabelWidth">
                <el-input v-model="mod_form.bddl" autocomplete="off" placeholder="请输入标定电流"></el-input>
              </el-form-item>
              <el-form-item label="准确率" :label-width="formLabelWidth">
                <el-input v-model="mod_form.zqd" autocomplete="off" placeholder="请输入准确率"></el-input>
              </el-form-item>
              <el-form-item label="生产厂家" :label-width="formLabelWidth">
                <el-input v-model="mod_form.sccj" autocomplete="off" placeholder="请输入生产厂家"></el-input>
              </el-form-item>
              <el-form-item label="主副表标志" :label-width="formLabelWidth">
                <el-input v-model="mod_form.zfbbz" autocomplete="off" placeholder="请输入主副表标志"></el-input>
              </el-form-item>
              <el-form-item label="计量点位置" :label-width="formLabelWidth">
                <el-input v-model="mod_form.jldwz" autocomplete="off" placeholder="请输入计量点位置"></el-input>
              </el-form-item>
              <el-form-item label="计量点地址" :label-width="formLabelWidth">
                <el-input v-model="mod_form.jlddz" autocomplete="off" placeholder="请输入计量点地址"></el-input>
              </el-form-item>
              <el-form-item label="通信规约" :label-width="formLabelWidth">
                <el-input v-model="mod_form.txgw" autocomplete="off" placeholder="请输入通信规约"></el-input>
              </el-form-item>
              <el-form-item label="逻辑地址" :label-width="formLabelWidth">
                <el-input v-model="mod_form.ljdz" autocomplete="off" placeholder="请输入逻辑地址"></el-input>
              </el-form-item>
              <el-form-item label="波特率" :label-width="formLabelWidth">
                <el-input v-model="mod_form.btl" autocomplete="off" placeholder="请输入波特率"></el-input>
              </el-form-item>
              <el-form-item label="计量表箱(柜)" :label-width="formLabelWidth">
                <el-input v-model="mod_form.jlbx" autocomplete="off" placeholder="请输入计量表箱(柜)"></el-input>
              </el-form-item>
              <el-form-item label="箱(柜)位置号" :label-width="formLabelWidth">
                <el-input v-model="mod_form.xgwzh" autocomplete="off" placeholder="请输入箱(柜)位置号"></el-input>
              </el-form-item>
              <el-form-item label="计量装置分类" :label-width="formLabelWidth">
                <el-select v-model="mod_form.jlzzfl" clearable placeholder="请选择计量装置分类">
                  <el-option
                    v-for="item of mod_form.jlzzfl_arr"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="通信方式" :label-width="formLabelWidth">
                <el-select v-model="mod_form.txfs" clearable placeholder="请选择通信方式">
                  <el-option
                    v-for="item of mod_form.txfs_arr"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="计量方式" :label-width="formLabelWidth">
                <el-select v-model="mod_form.jlfs" clearable placeholder="请选择计量方式">
                  <el-option
                    v-for="item of mod_form.jlfs_arr"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="设备类别" :label-width="formLabelWidth">
                <el-select v-model="mod_form.sblx" clearable placeholder="请选择设备类别">
                  <el-option
                    v-for="item of mod_form.sblx_arr"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="设备类型" :label-width="formLabelWidth">
                <el-select v-model="mod_form.sblx" clearable placeholder="请选择设备类型">
                  <el-option
                    v-for="item of mod_form.sblx_arr"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="sure">确 定</el-button>
          </div>
        </el-dialog>
        <!-- 新增的模态框 -->
        <el-dialog title="新增" :visible.sync="dialogFormVisibleAdd">
          <el-form  ref="add_form" :model="add_form" :rules="add_form_rules">
            <!-- 抄表档案 -->
            <el-divider content-position="left">抄表档案</el-divider>
            <el-form-item label="供电单位" :label-width="formLabelWidth" prop="gddw">
              <el-input v-model="add_form.gddw"  autocomplete="off" readonly></el-input>
            </el-form-item>
            <el-form-item label="用户编号" :label-width="formLabelWidth">
              <el-input v-model="add_form.yhabh" autocomplete="off" placeholder="请输入用户编号"></el-input>
            </el-form-item>
            <el-form-item label="用户名称" :label-width="formLabelWidth">
              <el-input v-model="add_form.yhmc" autocomplete="off" placeholder="请输入用户名称"></el-input>
            </el-form-item>
            <el-form-item label="用户类别" :label-width="formLabelWidth">
              <el-select v-model="add_form.yhlb" clearable placeholder="请选择用户类别">
                <el-option
                  v-for="item of add_form.yhlb_arr"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="台区名称" :label-width="formLabelWidth" prop="tq">
              <el-input v-model="add_form.tq" autocomplete="off" placeholder="请输入台区名称"></el-input>
            </el-form-item>
            <el-form-item label="集中器地址" :label-width="formLabelWidth" prop="vcaddr">
              <el-input
                v-model="add_form.vcaddr"
                readonly
                autocomplete="off"
                placeholder="请输入集中器地址"
              ></el-input>
            </el-form-item>
            <el-form-item label="电能表地址"  :label-width="formLabelWidth" prop="addr">
              <el-input
                v-model="add_form.addr"
                autocomplete="off"
                placeholder="请输入电能表地址"
              ></el-input>
            </el-form-item>
            <el-form-item label="PN值" :label-width="formLabelWidth" prop="pn">
              <el-input v-model.number="add_form.pn" autocomplete="off" placeholder="请输入PN值"></el-input>
            </el-form-item>
            <el-form-item label="CT倍率" :label-width="formLabelWidth" prop="ct">
              <el-input v-model.number="add_form.ct" autocomplete="off" placeholder="请输入ct值" :min='1'></el-input>
            </el-form-item>
              <el-form-item label="PT倍率" :label-width="formLabelWidth" prop="pt">
              <el-input v-model.number="add_form.pt" autocomplete="off" placeholder="请输入ct值" :min='1'></el-input>
            </el-form-item>
            <el-form-item label="抄表类型" :label-width="formLabelWidth">
              <el-select v-model="add_form.cblx" clearable placeholder="请选择抄表类型">
                <el-option
                  v-for="item of add_form.cblx_arr"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="采集器编号" :label-width="formLabelWidth" prop="deveui" :status-icon="true"    >
              <el-input v-model="add_form.deveui" autocomplete="off" placeholder="请输入采集器编号"></el-input>
            </el-form-item>
            <el-form-item label="应用编号" :label-width="formLabelWidth">
              <el-input v-model="add_form.appeui" autocomplete="off" placeholder="请输入应用编号"></el-input>
            </el-form-item>
            <el-form-item label="用户地址" :label-width="formLabelWidth">
              <el-cascader
                size="large"
                :options="options"
                v-model="add_form.provinces"
                @change="handleAddChange"
              ></el-cascader>
              <el-input
                type="textarea"
                :rows="2"
                v-model="add_form.yhdz"
                autocomplete="off"
                placeholder="详细地址"
              ></el-input>
            </el-form-item>

            <!-- 电表信息 -->
            <el-divider></el-divider>
            <div
              style="display:flex;justify-content:space-between;width:100%;padding:0 10%;line-height:0;"
            >
              <p style="font-size:20px;font-weight:500;">电表信息(选填)</p>
              <el-button
                type="info"
                style="padding:10px;"
                @click="handleClickAddShow"
              >{{addShow?'隐藏':'显示'}}</el-button>
            </div>
            <div
              v-show="addShow"
              style="display:flex;flex-wrap: wrap;justify-content: space-around;"
            >
              <el-form-item label="资产编号" :label-width="formLabelWidth">
                <el-input v-model="add_form.zcbh" autocomplete="off" placeholder="请输入资产标号编号"></el-input>
              </el-form-item>
              <el-form-item label="出厂编号" :label-width="formLabelWidth">
                <el-input v-model="add_form.ccbh" autocomplete="off" placeholder="请输入出厂编号"></el-input>
              </el-form-item>
              <el-form-item label="远程控制密码" :label-width="formLabelWidth">
                <el-input
                  show-password
                  v-model="add_form.dbmm"
                  autocomplete="off"
                  placeholder="请输入远程控制密码"
                ></el-input>
              </el-form-item>
              <el-form-item label="采集器编号" :label-width="formLabelWidth">
                <el-input
                  show-password
                  v-model="add_form.deveui"
                  autocomplete="off"
                  placeholder="请输入采集器编号"
                ></el-input>
              </el-form-item>
              <el-form-item label="注册应用号" :label-width="formLabelWidth">
                <el-input
                  show-password
                  v-model="add_form.appeui"
                  autocomplete="off"
                  placeholder="请输入注册应用号"
                ></el-input>
              </el-form-item>
              <el-form-item label="计量点编号" :label-width="formLabelWidth">
                <el-input v-model="add_form.jldbh" autocomplete="off" placeholder="请输入计量点编号"></el-input>
              </el-form-item>
              <el-form-item label="投运时间" :label-width="formLabelWidth">
                <el-date-picker v-model="add_form.tysj" type="date" placeholder="选择日期"></el-date-picker>
              </el-form-item>
              <el-form-item label="上次检验日期" :label-width="formLabelWidth">
                <el-date-picker v-model="add_form.scjyrq" type="date" placeholder="选择日期"></el-date-picker>
              </el-form-item>
              <el-form-item label="到货批次号" :label-width="formLabelWidth">
                <el-input v-model="add_form.dhpc" autocomplete="off" placeholder="请输入到货批次号"></el-input>
              </el-form-item>
              <el-form-item label="综合倍率" :label-width="formLabelWidth">
                <el-input v-model="add_form.zhbl" autocomplete="off" placeholder="请输入综合倍率"></el-input>
              </el-form-item>
              <el-form-item label="抄表区段" :label-width="formLabelWidth">
                <el-input v-model="add_form.cbqd" autocomplete="off" placeholder="请输入抄表区段"></el-input>
              </el-form-item>
              <el-form-item label="线路" :label-width="formLabelWidth">
                <el-input v-model="add_form.xl" autocomplete="off" placeholder="请输入线路"></el-input>
              </el-form-item>
              <el-form-item label="厂站" :label-width="formLabelWidth">
                <el-input v-model="add_form.cz" autocomplete="off" placeholder="请输入厂站"></el-input>
              </el-form-item>
              <el-form-item label="额定电压" :label-width="formLabelWidth">
                <el-input v-model="add_form.eddy" autocomplete="off" placeholder="请输入额定电压"></el-input>
              </el-form-item>
              <el-form-item label="标定电流" :label-width="formLabelWidth">
                <el-input v-model="add_form.bddl" autocomplete="off" placeholder="请输入标定电流"></el-input>
              </el-form-item>
              <el-form-item label="准确率" :label-width="formLabelWidth">
                <el-input v-model="add_form.zqd" autocomplete="off" placeholder="请输入准确率"></el-input>
              </el-form-item>
              <el-form-item label="生产厂家" :label-width="formLabelWidth">
                <el-input v-model="add_form.sccj" autocomplete="off" placeholder="请输入生产厂家"></el-input>
              </el-form-item>
              <el-form-item label="主副表标志" :label-width="formLabelWidth">
                <el-input v-model="add_form.zfbbz" autocomplete="off" placeholder="请输入主副表标志"></el-input>
              </el-form-item>
              <el-form-item label="计量点位置" :label-width="formLabelWidth">
                <el-input v-model="add_form.jldwz" autocomplete="off" placeholder="请输入计量点位置"></el-input>
              </el-form-item>
              <el-form-item label="计量点地址" :label-width="formLabelWidth">
                <el-input v-model="add_form.jlddz" autocomplete="off" placeholder="请输入计量点地址"></el-input>
              </el-form-item>
              <el-form-item label="通信规约" :label-width="formLabelWidth">
                <el-input v-model="add_form.txgw" autocomplete="off" placeholder="请输入通信规约"></el-input>
              </el-form-item>
              <el-form-item label="逻辑地址" :label-width="formLabelWidth">
                <el-input v-model="add_form.ljdz" autocomplete="off" placeholder="请输入逻辑地址"></el-input>
              </el-form-item>
              <el-form-item label="波特率" :label-width="formLabelWidth">
                <el-input v-model="add_form.btl" autocomplete="off" placeholder="请输入波特率"></el-input>
              </el-form-item>
              <el-form-item label="计量表箱(柜)" :label-width="formLabelWidth">
                <el-input v-model="add_form.jlbx" autocomplete="off" placeholder="请输入计量表箱(柜)"></el-input>
              </el-form-item>
              <el-form-item label="箱(柜)位置号" :label-width="formLabelWidth">
                <el-input v-model="add_form.xgwzh" autocomplete="off" placeholder="请输入箱(柜)位置号"></el-input>
              </el-form-item>
              <el-form-item label="计量装置分类" :label-width="formLabelWidth">
                <el-select v-model="add_form.jlzzfl" clearable placeholder="请选择计量装置分类">
                  <el-option
                    v-for="item of add_form.jlzzfl_arr"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="通信方式" :label-width="formLabelWidth">
                <el-select v-model="add_form.txfs" clearable placeholder="请选择通信方式">
                  <el-option
                    v-for="item of add_form.txfs_arr"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="计量方式" :label-width="formLabelWidth">
                <el-select v-model="add_form.jlfs" clearable placeholder="请选择计量方式">
                  <el-option
                    v-for="item of add_form.jlfs_arr"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="设备类别" :label-width="formLabelWidth">
                <el-select v-model="add_form.sblx" clearable placeholder="请选择设备类别">
                  <el-option
                    v-for="item of add_form.sblx_arr"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="设备类型" :label-width="formLabelWidth">
                <el-select v-model="add_form.sblx" clearable placeholder="请选择设备类型">
                  <el-option
                    v-for="item of add_form.sblx_arr"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
            <el-button type="primary" @click="add_user('add_form')">确 定</el-button>
          </div>
        </el-dialog>
      </div>
      <div class="block">
        <el-pagination
          small
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[25, 50, 100]"
          :page-size="pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
        <el-tooltip content="刷新" placement="top">
          <span class="iconfont iconicon-refresh" @click="reload"></span>
        </el-tooltip>
        <el-tooltip content="导出当前表格" placement="top">
          <span class="iconfont iconxls der" @click="now_derive"></span>
        </el-tooltip>
        <el-tooltip content="分页导出表格" placement="top">
          <span class="iconfont iconfile-xls ders" @click="show_table4"></span>
        </el-tooltip>

        <el-dialog title="提示" :visible.sync="centerDialogVisible" width="15%" center>
          <div>
            <p>导出页从</p>
            <input v-model="page_start" min="1" />
            <p>到</p>
            <input v-model="page_end" min="2" />
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="page_derive" plain>导出</el-button>
            <el-button type="primary" @click="centerDialogVisible = false">关闭</el-button>
          </span>
        </el-dialog>
      </div>
    </div>
    <!--新增框-->
    <el-dialog title="新增户表" :visible.sync="addmeter" width="50%">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="省份">
          <el-input v-model="ruleForm.province" placeholder="请输入省份"></el-input>
        </el-form-item>
        <el-form-item label="市级">
          <el-input v-model="ruleForm.city" placeholder="请输入市"></el-input>
        </el-form-item>
        <el-form-item label="用户编号" prop="yhabh">
          <el-input v-model="ruleForm.yhabh"></el-input>
        </el-form-item>
        <el-form-item label="表地址" prop="addr">
          <el-input v-model="ruleForm.addr"></el-input>
        </el-form-item>
        <el-form-item label="集中器地址" prop="vcaddr">
          <el-input v-model="ruleForm.vcaddr" :min="12" :max="12"></el-input>
        </el-form-item>
        <el-form-item label="pn值" prop="pn">
          <el-input v-model="ruleForm.pn" type="number" :min="0"></el-input>
        </el-form-item>
        <el-form-item label="部门选择" prop="departmentid">
          <el-cascader
            style="width:100%;"
            placeholder="请选择部门"
            v-model="ruleForm.departmentid"
            :props="treeprops"
            :options="treeData"
            auto-complete="off"
            clearable
            :show-all-levels="false"
            change-on-select
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addmeter = false" style="float:left">关 闭</el-button>
        <el-button @click="submitForm('ruleForm')" style="float:right" type="primary">确 认</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  timestampToTime,
  getmetersearch,
  getmeterinfo,
  gettables1
} from "@/api/login";
// 引入element-china-area-data地址三级联动
import { regionData, CodeToText } from "element-china-area-data";
import { addmeterforuser, CountAll } from "@/api/filemanage";
import Parse from "parse";
import FileSaver from "file-saver";
import XLSX from "xlsx";
import { setTimeout } from "timers";
import { Promise } from "q";
// import SizeSelect from '@/components/SizeSelect';
import "@/styles/iconfont/iconfont.css";
import { addMeter } from "@/api/metersearch";
// import Resource from "@/components/resource";
import Resource1 from "@/components/resource/resource";
import { utc2beijing } from "@/utils/index";
let arr = [];
export default {
  data() {
    let validateVcaddr = (rule, value, callback) => {
      let regx =/^[0-9A-Z]{12}$|^[0-9A-Z]{8}$/ 
      if (value=='') {
        callback(new Error("请在左边树挑选集中器"));
      } else {
        if (!regx.test(value)) {
          callback(new Error("长度必须为是十二位或八位"));
        }else{
           callback();
        }
       
      }
    };
    let validateAddr = (rule, value, callback) => {
      let regx =/^\d{12}$/ 
      if ( value=='') {
        callback(new Error("请输入电表地址"));
      } else {
        if (!regx.test(value)) {
          callback(new Error("长度必须为是十二位"));
        }else{
           callback();
        }
       
      }
    };
    let validatePn= (rule, value, callback) => {
      if (value=='') {
        callback(new Error("请输入电表pn"));
      } else {
        if (!value< 0 || value > 2032) {
          callback(new Error("请输入正确的pn值(0-2032之间)"));
        }else{
           callback();
        }
       
      }
    };
    let validateYhbh= (rule, value, callback) => {
      let reg = /^[0-9]+$/
      if (value=='') {
        callback(new Error("请输入用户编号"));
      } else {
        if (!reg.test(value)) {
          callback(new Error("请输入正确的用户编号"))
        }else{
           callback();
        }
       
      }
    }; 
    let validateGddw= (rule, value, callback) => {
      if (!value) {
        callback(new Error("左边树选择集中器地址可关联供电单位"));
      } else {
        callback();
      }
    };
    let validateDevui = (rule, value, callback) => {
      let regx1 =/^[0-9A-Z]{12}$/ 
      if (value =='') {
        callback(new Error("请输入采集器地址"));
      } else {
        if (!regx1.test(value)) {
          callback(new Error("采集器长度为是十二位"));
        }else{
          callback();
        }
        
      }
    };
    return {
      // 新增集中器和电表是否可用
      isaddr: false,
      isvcaddr: false,
      // 表格加载中
      loading: true,
      // 地址三级联动
      options: regionData,
      // 新增内容
      add_form: {
        dbmm: "",
        gsmc: "", //公司名称
        yhabh: "",
        vcaddr: "",
        deveui: "",
        tq: "",
        yhmc: "",
        pn: "",
        addr: "",
        yhdz: "",
        cblx: "",
        cblx_arr: [
          { label: "虚拟通道", value: 1 },
          { label: "物理通道", value: 2 }
        ],
        addr: [], //三级地址
        provinces: [], //省市区
        provinces1: [],
        gddw: "", //供电单位
        yhlb: "", //用户类别
        yhlb_arr: [{ label: "公变客户", value: "1"  }],
        zcbh: "", //资产编号
        jldbh: "", //计量点编号
        sblb: "", //设备类别
        sblb_arr: [{ label: "电能表", value: 1 }],
        sblx: "", //设备类型
        sblx_arr: [{ label: "单相电子式电能表", value: 1 }],
        ccbh: "", //出厂编号
        tysj: new Date().getTime(), //投运时间
        dhpc: "", //到货批次号
        zhbl: "", //综合倍率
        cbqd: "", //抄表区段
        xl: "", //线路
        cz: "", //厂站
        eddy: "", //额定电压
        bddl: "", //标定电流
        zqd: "", //准确率
        sccj: "", //生产厂家
        jlzzfl: "", //计量装置分类
        jlfs: "", //计量方式
        zfbbz: "", //祝福表标志
        jldwz: "", //计量点位置
        jlddz: "", //计量点地址
        scjyrq: new Date().getTime(), //上次验证日期
        txfs: "", //通信方式
        txfs_arr: [{ label: "低供低计", value: 1 }],
        txgw: "", //通信规约
        ljdz: "", //逻辑地址
        btl: "", //波特率
        jlbx: "", //计量表箱
        xgwzh: "", //箱位置号
        deveui: "", //采集器编号
        appeui: "" ,//注册应用号
        ct:1,
        pt:1
      },
      // 表单验证
     add_form_rules:{
       ct:[
         {required:true, message:'请输入CT倍率值', trigger:'blur'},
         {
           type:'number',message:'CT倍率值必须为数值'
         }
       ],
        pt:[
         {required:true, message:'请输入PT倍率值', trigger:'blur'},
         {
           type:'number',message:'PT倍率值必须为数值'
         }
       ],
       tq: [
            { required: true, message: '请输入台区名称', trigger: 'blur' },
          ],
          vcaddr:[
             { validator: validateVcaddr, required: true, trigger: "blur" }
          ],
           gddw:[
             { validator: validateGddw, required: true, trigger: "blur" }
          ],
           addr:[
             { validator: validateAddr, required: true, trigger: "blur" }
          ],
           pn:[
             { validator: validatePn, required: true, trigger: "blur" }
          ],
           yhbh:[
             { validator: validateYhbh, required: true, trigger: "blur" }
          ],
           deveui:[
             { validator: validateDevui, required: true, trigger: "blur" }
          ]
        },
      // 当前表的表头
      Config: {
        tq: "台区名称",
        yhabh: "用户编号",
        yhmc: "用户名称",
        vcaddr: "集中器地址",
        addr: "电能表地址",
        pn: "PN值",
        yhlb: "用户类别",
        cblx: "通道类型",
        deveui: "采集器编号",
        appeui: "应用编号",
        yhdz: "用户地址",
        zcbh: "资产编号",
        sb: "设备类别",
        sblx: "设备类型",
        sccj: "生产厂家",
        ccbh: "出厂编号",
        txfs: "通信方式",
        txgw: "通信规约",
        ljdz: "逻辑地址",
        dbmm: "远程控制密码",
        btl: "波特率",
        zhbl: "综合倍率",
        eddy: "额定电压",
        bddl: "标定电流",
        zqd: "准确度",
        dhpc: "到货批次号",
        tysj: "投运时间",
        cbqd: "抄表区段",
        xl: "线路",
        cz: "厂站",
        jlzzfl: "计量装置分类",
        jlfs: "计量方式",
        zfbbz: "主副表标志",
        jldbh: "计量点编号",
        jldwz: "计量点位置",
        jlddz: "计量点地址",
        scjyrq: "上次检验日期",
        jlbx: "计量表箱(柜)",
        xgwzh: "箱(柜)位置号"
      },
      // 模板的示例
      Config_tmp: {
        tq: "广东南利嘉投资有限公司（小区1）",
        yhabh: "0305420166778469,用户编号不能相同",
        yhmc: "南澳县南利嘉物业管理有限公司",
        vcaddr: "集中器地址为12位,集中器地址不能相同",
        addr: "电表地址为12位,电表地址不能相同",
        pn: "0-2000,同一个集中器pn不能相同",
        yhlb: "[公变普通用户][公变大客户][专变用户]",
        cblx: "[虚拟通道][物理通道]",
        deveui: "c4c13b8fc4a39b0c",
        appeui: "c4cd82096a4837c1",
        yhdz: "广东省汕头市南澳县云澳镇南利嘉银都华轩商铺",

        zcbh: "03001SF00000271700107078",
        sb: "电能表",
        sblx: "[单相电子式电能表][三相电子式电能表]",
        sccj: "生产厂家",
        ccbh: "03001SF00000251700249151",
        txfs: "通信方式",
        txgw: "DL/T645",
        ljdz: "逻辑地址",
        dbmm: "远程控制密码",
        btl: "2",
        zhbl: "综合倍率",
        eddy: "额定电压",
        bddl: "标定电流",
        zqd: "准确度",
        dhpc: "到货批次号",
        tysj: "投运时间",
        cbqd: "抄表区段",
        xl: "线路",
        cz: "厂站",
        jlzzfl: "计量装置分类",
        jlfs: "低供低计",
        zfbbz: "主副表标志",
        jldbh: "1111111129145564",
        jldwz: "用户测试",
        jlddz: "计量点地址",
        scjyrq: "上次检验日期",
        jlbx: "计量表箱(柜)",
        xgwzh: "箱(柜)位置号"
      },
      // 当前行信息
      now_row: {},
      // 弹窗表单
      dialogFormVisible: false, //修改
      dialogFormVisibleAdd: false, //新增
      // 修改内容
      mod_form: {
        yhabh: "",
        vcaddr: "",
        deveui: "",
        tq: "",
        yhmc: "",
        pn: "",
        addr: "",
        yhdz: "",
        cblx: "",
        cblx_arr: [
          { label: "虚拟通道", value: 1 },
          { label: "物理通道", value: 2 }
        ],
        addr: [],
        provinces: [],
        provinces1: "",
        gddw: "",
        yhlb: "", //用户类别
        yhlb_arr: [{ label: "公变客户", value: 1 }],
        zcbh: "", //资产编号
        jldbh: "", //计量点编号
        sblb: "", //设备类别
        sblb_arr: [{ label: "电能表", value: 1 }],
        sblx: "", //设备类型
        sblx_arr: [{ label: "单相电子式电能表", value: 1 }],
        ccbh: "", //出厂编号
        tysj: new Date().getTime(), //投运时间
        dhpc: "", //到货批次号
        zhbl: "", //综合倍率
        cbqd: "", //抄表区段
        xl: "", //线路
        cz: "", //厂站
        eddy: "", //额定电压
        bddl: "", //标定电流
        zqd: "", //准确率
        sccj: "", //生产厂家
        jlzzfl: "", //计量装置分类
        jlfs: "", //计量方式
        zfbbz: "", //祝福表标志
        jldwz: "", //计量点位置
        jlddz: "", //计量点地址
        scjyrq: new Date().getTime(), //上次验证日期
        txfs: "", //通信方式
        txfs_arr: [{ label: "低供低计", value: 1 }],
        txgw: "", //通信规约
        ljdz: "", //逻辑地址
        btl: "", //波特率
        jlbx: "", //计量表箱
        xgwzh: "", //箱位置号
        dbmm: "", //电表密码
        deveui: "", //采集器编号
        appeui: "", //注册应用号
        ct:1,
        pt:1
      },
      formLabelWidth: "120px",
      table4: false,
      // 查询
      no_two: false,
      formInline: {
        user: "",
        userId: "",
        electricityId: "",
        cost: "",
        yhdz: ""
      },
      centerDialogVisible: false,
      page_start: 1,
      page_end: 2,
      treeprops: {
        value: "objectId",
        label: "name"
      },
      deptName: "",
      metersearch: "",
      start: 0,
      pagesize: 25,
      total: 0,
      tableData3: [],
      multipleSelection: [],
      vcaddr: "",
      draw: 1,
      addr: "",
      dialogVisible: false,
      node: null,
      data: [],
      defaultProps: {
        children: "children",
        label: "name"
      },
      departmentid: [],
      gridData: [],
      meterdialog: false,
      ruleForm: {
        yhabh: "",
        pn: 0,
        addr: "",
        vcaddr: "",
        country: "",
        province: "",
        city: "",
        departmentid: "",
        organization: "",
        mode: "vconcentrator",
        version: "v1"
      },
      
      // 获取excel导入的信息
      demo: "",
      gsmc: "",
      gsmc_child: [], //选中的所有子
      file: "", //文件
      deriveWhere: [], //导出条件
      addShow: false, //新增隐藏
      updateShow: false, //修改隐藏
      isshowonce: false,
      departmentdata:[]
    };
  },
  mounted() {
    this.getTree();
  },
  methods: {
    getDeSearch(val){
      var Department = Parse.Object.extend('Department')
      var department = new Parse.Query(Department)
      department.equalTo('name',val)
      department.find().then(resultes=>{
       this.departmentdata = resultes
      })
    },
    // 修改隐藏
    handleClickUpdateShow() {
      this.updateShow = !this.updateShow;
    },
    // 新增隐藏
    handleClickAddShow() {
      this.addShow = !this.addShow;
    },
    // 批量导入
    handleBatchClick() {
      let file = this.$refs.file;
      this.file = file;
      file.click();
    },
    handleFileChange(obj) {
      let wb; //读取完成的数据
      let rABS = false; //是否将文件读取为二进制字符串
      this.importf(obj, rABS, wb);
    },
    //导入
    importf(obj, rABS, wb) {
      if (!obj.files) {
        return;
      }
      let f = obj.files[0];
      let reader = new FileReader();
      reader.onload = e => {
        let data = e.target.result;
        if (rABS) {
          wb = XLSX.read(btoa(this.fixdata(data)), {
            //手动转化
            type: "base64"
          });
        } else {
          wb = XLSX.read(data, {
            type: "binary"
          });
        }
        console.log(wb);
        return;
        //wb.SheetNames[0]是获取Sheets中第一个Sheet的名字
        // //wb.Sheets[Sheet名]获取第一个Sheet的数据
        // 解析json
        let json = JSON.parse(
          JSON.stringify(
            XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], {
              blankrows: true,
              defval: ""
            })
          )
        );
        let head = [
          "tq",
          "yhabh",
          "yhmc",
          "vcaddr",
          "addr",
          "pn",
          "yhlb",
          "cblx",
          "deveui",
          "appeui",
          "yhdz",
          "zcbh",
          "sb",
          "sblx",
          "sccj",
          "ccbh",
          "txfs",
          "txgw",
          "ljdz",
          "dbmm",
          "btl",
          "zhbl",
          "eddy",
          "bddl",
          "zqd",
          "dhpc",
          "tysj",
          "cbqd",
          "xl",
          "cz",
          "jlzzfl",
          "jlfs",
          "zfbbz",
          "jldbh",
          "jldwz",
          "jlddz",
          "scjyrq",
          "dbmjlbxm",
          "xgwzh"
        ];
        let arr = [];
        for (let i = 0; i < json.length; i++) {
          let obj = {};
          let x = 0;
          obj.gddw = this.add_form.gddw;
          for (let key in json[i]) {
            if (x == head.length) {
              break;
            }
            obj[head[x]] = String(json[i][key]);
            x++;
          }
          arr.push(obj);
          console.log(obj);
          // continue;
          if (arr.length == json.length) {
            this.upload(arr, 0);
          }
        }
      };
      if (rABS) {
        reader.readAsArrayBuffer(f);
      } else {
        reader.readAsBinaryString(f);
      }
    },
    upload(arr, i) {
      if (i >= arr.length) {
        return;
      }
      addMeter({
        addr: arr[i].addr,
        yhdz: arr[i].yhdz,
        organization: this.gsmc,
        pn: arr[i].pn,
        vcaddr: arr[i].vcaddr,
        gddw: arr[i].gddw,
        tq: arr[i].tq,
        yhmc: arr[i].yhmc,
        yhabh: arr[i].yhabh,
        yhlb: arr[i].yhlb,
        zcbh: arr[i].zcbh,
        jldbh: arr[i].jldbh,
        sblb: arr[i].sblb,
        sblx: arr[i].sblx,
        ccbh: arr[i].ccbh,
        tysj: arr[i].tysj,
        dhpc: arr[i].dhpc,
        zhbl: arr[i].zhbl,
        cbqd: arr[i].cbqd,
        xl: arr[i].xl,
        cz: arr[i].cz,
        eddy: arr[i].eddy,
        bddl: arr[i].bddl,
        zqd: arr[i].zqd,
        sccj: arr[i].sccj,
        jlzzfl: arr[i].jlzzfl,
        jlfs: arr[i].jlfs,
        zfbbz: arr[i].zfbbz,
        jldwz: arr[i].jldwz,
        jlddz: arr[i].jlddz,
        scjyrq: arr[i].scjyrq,
        txfs: arr[i].txfs,
        txgw: arr[i].txgw,
        ljdz: arr[i].ljdz,
        btl: arr[i].btl,
        jlbx: arr[i].jlbx,
        xgwzh: arr[i].xgwzh,
        dbmm: arr[i].dbmm,
        deveui: arr[i].deveui,
        appeui: arr[i].appeui
      })
        .then(res => {
          if (res) {
            this.upload(arr, i + 1);
            this.$message({
              message: "导入成功!",
              type: "success"
            });
            if (i == arr.length - 1) {
              this.data = [];
              this.reload();
              this.$message({
                message: "全部导入成功!",
                type: "success"
              });
            }
          }
        })
        .catch(res => {
          this.$message({
            showClose: true,
            message: "导入失败,用户编号或者电表编号重复!",
            type: "error"
          });
        });
    },
    //文件流转BinaryString
    fixdata(data) {
      let o = "",
        l = 0,
        w = 10240;
      for (; l < data.byteLength / w; ++l)
        o += String.fromCharCode.apply(
          null,
          new Uint8Array(data.slice(l * w, l * w + w))
        );
      o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)));
      return o;
    },
    // 地址联动
    handleModChange(value) {
      // 修改
      let data =
        CodeToText[value[0]] +
        ", " +
        CodeToText[value[1]] +
        ", " +
        CodeToText[value[2]];
        this.mod_form.provinces = value
      this.mod_form.provinces1 = data
    },
    handleAddChange(value) {
      //新增
      
      let data =
        CodeToText[value[0]] +
        ", " +
        CodeToText[value[1]] +
        ", " +
        CodeToText[value[2]];
      this.add_form.provinces = value
      this.add_form.provinces1 = data
      console.log(this.add_form.provinces)
    },
    meterdetail(row) {
      console.log(row);
      // this.formInline.vcaddr = row.alias;
    },
    // 新增数据
    add_user(formName) {
      this.$confirm("此操作将添加此条记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "success"
      })
        .then(() => {
          // 验证字段
          this.$refs[formName].validate((valid) => {
          if (valid) {
            addMeter({
              addr: this.add_form.addr,
              yhbh: this.add_form.provinces1 + " " + this.add_form.yhdz,
              organization: this.gsmc,
              pn: this.add_form.pn,
              vcaddr: this.add_form.vcaddr,
              gddw: this.add_form.gddw,
              tq: this.add_form.tq,
              yhmc: this.add_form.yhmc,
              yhabh: this.add_form.yhabh,
              yhlb: this.add_form.yhlb,
              zcbh: this.add_form.zcbh,
              jldbh: this.add_form.jldbh,
              sblb: this.add_form.sblb,
              sblx: this.add_form.sblx,
              ccbh: this.add_form.ccbh,
              tysj: this.add_form.tysj,
              dhpc: this.add_form.dhpc,
              zhbl: this.add_form.zhbl,
              cbqd: this.add_form.cbqd,
              xl: this.add_form.xl,
              cz: this.add_form.cz,
              eddy: this.add_form.eddy,
              bddl: this.add_form.bddl,
              zqd: this.add_form.zqd,
              sccj: this.add_form.sccj,
              jlzzfl: this.add_form.jlzzfl,
              jlfs: this.add_form.jlfs,
              zfbbz: this.add_form.zfbbz,
              jldwz: this.add_form.jldwz,
              jlddz: this.add_form.jlddz,
              scjyrq: this.add_form.scjyrq,
              txfs: this.add_form.txfs,
              txgw: this.add_form.txgw,
              ljdz: this.add_form.ljdz,
              btl: this.add_form.btl,
              jlbx: this.add_form.jlbx,
              xgwzh: this.add_form.xgwzh,
              dbmm: this.add_form.dbmm,
              deveui:this.add_form.deveui,
              ct:this.add_form.ct,
              pt:this.add_form.pt             
          })
            .then(res => {
              this.dialogFormVisibleAdd = false;
              this.getTree();
              this.add_form.addr = "";
              this.add_form.provinces = [];
              this.add_form.yhdz = "";
              this.gsmc = "";
              this.add_form.pn = "";
              this.add_form.vcaddr = "";
              this.add_form.gddw = "";
              this.add_form.tq = "";
              this.add_form.yhmc = "";
              this.add_form.yhabh = "";
              if (res.code == 101) {
                this.$message({
                  type: "success",
                  message: "添加成功!"
                });
              }
            })
            .catch(res => {
              this.$notify.error({
                title: "错误",
                message: res.error
              });
            });
          } else {
            console.log('error submit!!');
            return false;
          }
        });
          
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消添加"
          });
        });
    },
    // 导出模板
    derive_tmp() {
      let arr = [];
      let arr_content = [];
      for (let item in this.Config) {
        arr.push(this.Config[item]);
      }
      arr.push("组织架构");
      for (let item in this.Config_tmp) {
        arr_content.push(this.Config_tmp[item]);
      }
      arr_content.push("示例：南澳后宅供电所");
      const ws = XLSX.utils.aoa_to_sheet([arr, arr_content]);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
      XLSX.writeFile(wb, "模板.xlsx");
    },
    // 用户编号显示用户名称
    handleUserChange() {
      let Smartmeter = Parse.Object.extend("Smartmeter");
      let smartmeter = new Parse.Query(Smartmeter);
      if (this.formInline.userId) {
        for (let i = 0; i < this.tableData3.length; i++) {
          if (this.tableData3[i].yhabh == this.formInline.userId) {
            this.formInline.user = this.tableData3[i].yhmc;
          }
        }
      }
    },
    // Parse请求
    Parse() {
      let Smartmeter = Parse.Object.extend("Smartmeter");
      let smartmeter = new Parse.Query(Smartmeter);
      return smartmeter;
    },
    // 模糊查询
    inquire() {
      this.start = 0;
      this.deriveWhere = []; // 搜索条件的数组
      let Smartmeter = Parse.Object.extend("Smartmeter");
      let smartmeter = new Parse.Query(Smartmeter);
      if (this.formInline.electricityId != "") {
        smartmeter.equalTo("addr", this.formInline.electricityId);
      }
      if (this.formInline.cost != "") {
        smartmeter.equalTo("vcaddr", this.formInline.cost);
      }
      this.tableData3 = [];
      smartmeter.skip(this.start);
      smartmeter.limit(this.pagesize);
      smartmeter.count().then(count => {
        this.total = count;
      });
      smartmeter.find().then(
        res => {
          res.map(items => {
            let obj = {};
            obj.objectId = items.id;
            obj.vcaddr = items.attributes.vcaddr;
            obj.addr = items.attributes.addr;
            obj.deveui = items.attributes.deveui;
            obj.tq = items.attributes.tq;
            obj.yhabh = items.attributes.yhabh;
            obj.yhmc = items.attributes.yhmc;
            obj.yhdz = items.attributes.yhdz;
            obj.pn = items.attributes.pn;
            obj.gddw = items.attributes.gddw;
            obj.appeui = items.attributes.appeui;
            obj.cblx = items.attributes.cblx;
            this.tableData3.push(obj);
          });
        },
        error => {
          this.$message.error(error.error);
        }
      );
    },
    // 正则过滤
    Reg(val) {
      return val.replace(/[\*\\\[\]\+\^\$\.\?\|\%\【\】\(\)\（\）]+/g, "");
    },
    // 导出
    derive(json, obj) {
      // console.log(json);
      // console.log(obj);
      let table = [[]];
      // 获取头部
      let s = 0;
      for (let i in obj) {
        table[0][s] = obj[i];
        s++;
      }
      s = null;
      // 拼接json
      for (let i of json) {
        // console.log(i);
        let line = [];
        for (let j in obj) {
          line.push(i[j]);
        }
        table.push(line);
      }
      const ws = XLSX.utils.json_to_sheet(table, { skipHeader: true });
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
      XLSX.writeFile(wb, "档案信息表.xlsx");
    },
    // 当前页导出
    now_derive() {
      this.yhmxFordepartment4(
        this.pagesize,
        this.start,
        this.departmentid,
        this.deriveWhere
      );
    },
    // 显示模态框
    show_table4() {
      this.centerDialogVisible = true;
    },
    //分页导出
    page_derive() {
      // 正在导出中
      this.$notify({
        title: "提示",
        message: "正在导出中，请稍后……",
        duration: 10000,
        showClose: false,
        type: "warning"
      });
      // 导出
      this.centerDialogVisible = false;
      // 查询到所有需要的数据
      let start = this.page_start - 1;
      let end = this.page_end - 1;
      this.yhmxFordepartment4(
        this.pagesize * (end - start + 1),
        start,
        this.departmentid,
        this.deriveWhere
      );
    },
    // 刷新
    reload() {
      this.yhmxFordepartment(
        this.pagesize,
        this.start,
        this.departmentid,
        this.isshowonce
      );
    },
    addsmartmeter() {
      this.dialogFormVisibleAdd = true;
    },
    // 修改
    editorMeter(row) {
      this.mod_form.yhabh = row.yhabh;
      this.mod_form.vcaddr = row.vcaddr;
      this.mod_form.deveui = row.deveui;
      this.mod_form.yhmc = row.yhmc;
      this.mod_form.pn = row.pn;
      this.mod_form.addr = row.addr;
      this.mod_form.yhdz = row.yhdz;
      this.mod_form.tq = row.tq;
      this.mod_form.gddw = row.gddw;
      this.mod_form.yhlb = row.yhlb;
      this.mod_form.zcbh = row.zcbh;
      this.mod_form.jldbh = row.jldbh;
      this.mod_form.sblb = row.sblb;
      this.mod_form.sblx = row.sblx;
      this.mod_form.ccbh = row.ccbh;
      this.mod_form.tysj = row.tysj;
      this.mod_form.dhpc = row.dhpc;
      this.mod_form.zhbl = row.zhbl;
      this.mod_form.cbqd = row.cbqd;
      this.mod_form.xl = row.xl;
      this.mod_form.cz = row.cz;
      this.mod_form.eddy = row.eddy;
      this.mod_form.bddl = row.bddl;
      this.mod_form.zqd = row.zqd;
      this.mod_form.sccj = row.sccj;
      this.mod_form.jlzzfl = row.jlzzfl;
      this.mod_form.jlfs = row.jlfs;
      this.mod_form.zfbbz = row.zfbbz;
      this.mod_form.jldwz = row.jldwz;
      this.mod_form.jlddz = row.jlddz;
      this.mod_form.scjyrq = row.scjyrq;
      this.mod_form.txfs = row.txfs;
      this.mod_form.txgw = row.txgw;
      this.mod_form.ljdz = row.ljdz;
      this.mod_form.btl = row.btl;
      this.mod_form.jlbx = row.jlbx;
      this.mod_form.xgwzh = row.xgwzh;
      this.mod_form.deveui = row.deveui;
      this.mod_form.appeui = row.appeui;
      this.mod_form.cblx = row.cblx;
      this.smartmeterid = row.objectId;
      this.mod_form.ct = row.ct
      this.mod_form.pt = row.pt
    },
    // 确定修改
    sure() {
      this.$confirm("此操作将修改此条记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "success"
      })
        .then(() => {
          let Yhmx = Parse.Object.extend("Smartmeter");
          let query = new Parse.Query(Yhmx);
          query.get(this.smartmeterid).then(object => {
            object.set("yhabh", this.mod_form.yhabh);
            object.set("vcaddr", this.mod_form.vcaddr);
            object.set("deveui", this.mod_form.deveui);
            object.set("tq", this.mod_form.tq);
            object.set("yhmc", this.mod_form.yhmc);
            object.set("pn", parseInt(this.mod_form.pn));
            object.set("addr", this.mod_form.addr);
            object.set("yhdz", this.mod_form.provinces1 + this.mod_form.yhdz);
            object.set("gddw", this.mod_form.gddw);
            object.set("yhlb", this.mod_form.yhlb);
            object.set("zcbh", this.mod_form.zcbh);
            object.set("jldbh", this.mod_form.jldbh);
            object.set("sblb", this.mod_form.sblb);
            object.set("sblx", this.mod_form.sblx);
            object.set("ccbh", this.mod_form.ccbh);
            object.set("tysj", this.mod_form.tysj);
            object.set("dhpc", this.mod_form.dhpc);
            object.set("zhbl", this.mod_form.zhbl);
            object.set("cbqd", this.mod_form.cbqd);
            object.set("xl", this.mod_form.xl);
            object.set("cz", this.mod_form.cz);
            object.set("eddy", this.mod_form.eddy);
            object.set("bddl", this.mod_form.bddl);
            object.set("zqd", this.mod_form.zqd);
            object.set("sccj", this.mod_form.sccj);
            object.set("jlzzfl", this.mod_form.jlzzfl);
            object.set("jlfs", this.mod_form.jlfs);
            object.set("zfbbz", this.mod_form.vzfbbz);
            object.set("jldwz", this.mod_form.jldwz);
            object.set("jlddz", this.mod_form.jlddz);
            object.set("scjyrq", this.mod_form.scjyrq);
            object.set("txfs", this.mod_form.txfs);
            object.set("txgw", this.mod_form.txgw);
            object.set("ljdz", this.mod_form.ljdz);
            object.set("btl", this.mod_form.btl);
            object.set("jlbx", this.mod_form.jlbx);
            object.set("xgwzh", this.mod_form.xgwzh);
            object.set("dbmm", this.mod_form.dbmm);
            object.set("ct", this.mod_form.ct);
            object.set("pt", this.mod_form.pt);
            object.save().then(
              resultes => {
                this.$message({
                  type: "success",
                  message: "修改成功!"
                });
                this.yhmxFordepartment(
                  this.pagesize,
                  this.start,
                  this.departmentid,
                  this.isshowonce
                );
                this.dialogFormVisible = false;
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
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消修改"
          });
        });
    },
    addhubiaometer() {
      this.addmeter = true;
    },
    // 删除
    deleteMeter(row) {
      this.$confirm("此操作将永久删除此户表关系, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let Yhmx = Parse.Object.extend("Smartmeter");
          let query = new Parse.Query(Yhmx);
          query.get(row.objectId).then(object => {
            object.destroy().then(
              response => {
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
                this.getTree();
                // this.yhmxFordepartment(
                //   this.pagesize,
                //   this.start,
                //   this.departmentid,
                //   this.isshowonce
                // );
              },
              error => {
                console.error("Error while deleting User", error);
              }
            );
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    queryList(nodeId, origindata, arr) {
      origindata.map(items => {
        if (nodeId == items.ParentId && items.icon == "集中器") {
          arr.push(items.objectId);
          this.queryList(items.objectId, origindata, arr);
        } else if (nodeId == items.ParentId && items.icon != "集中器") {
          this.queryList(items.objectId, origindata, arr);
        }
      });
      return arr;
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.ruleForm.organization = this.ruleForm.departmentid[
            this.ruleForm.departmentid.length - 1
          ];
          addmeterforuser(this.ruleForm).then(resultes => {
            if (resultes.result == true) {
              this.$message({
                message: "新增/成功",
                type: "success"
              });
              this.addmeter = false;
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    handleSizeChange(val) {
      this.pagesize = val;
      // console.log(arr.length,this.isshowonce)
      // if (arr.length == 0) {
      //   this.yhmxFordepartment(this.pagesize, this.start, this.departmentid,this.isshowonce);
      // } else {
      this.yhmxFordepartment(
        this.pagesize,
        this.start,
        this.departmentid,
        this.isshowonce
      );
      // }
    },
    handleCurrentChange(val) {
      this.start = (val - 1) * this.pagesize;
      // if (arr.length == 0) {
      //   this.yhmxFordepartment(this.pagesize, this.start, this.departmentid,this.isshowonce);
      // } else {
      this.yhmxFordepartment(
        this.pagesize,
        this.start,
        this.departmentid,
        this.isshowonce
      );
      // }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // table3
    yhmxFordepartment(pagesize, start, departments, ishsow) {
      this.tableData3 = [];
      let Yhmx = Parse.Object.extend("Smartmeter");
      let query = new Parse.Query(Yhmx);
      query.limit(pagesize);
      query.skip(start);
      query.ascending(["vcaddr", "pn"]);
      if (ishsow) {
        query.equalTo("vcaddr", departments);
        query.count().then(count => {
          if (count) {
            this.total = count;
          } else {
            this.total = 0;
            setTimeout(() => {
              this.loading = false;
            }, 3000);
          }
        });
      } else {
        CountAll("Smartmeter")
          .then(response => {
            this.total = response.count;
          })
          .catch(error => {
            this.$message.error(error.error);
          });
        // this.total=30000000
      }

      query.find().then(
        results => {
          results.map(items => {
            let obj = {};
            obj.objectId = items.id;
            obj.vcaddr = items.attributes.vcaddr;
            obj.addr = items.attributes.addr;
            obj.deveui = items.attributes.deveui;
            obj.appeui = items.attributes.appeui;
            obj.tq = items.attributes.tq;
            obj.yhabh = items.attributes.yhabh;
            obj.yhmc = items.attributes.yhmc;
            obj.yhdz = items.attributes.yhdz;
            obj.pn = items.attributes.pn;
            obj.gddw = items.attributes.gddw;
            obj.cblx = items.attributes.cblx;
            obj.ct = items.attributes.ct
            obj.pt = items.attributes.pt
            this.tableData3.push(obj);
          });
          this.loading = false;
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
          } else {
            this.$message.error(error.error);
          }
        }
      );
    },
    // table4
    yhmxFordepartment4(pagesize, start, departments, where) {
      let query = this.Parse();
      query.limit(pagesize);
      query.skip(start);
      if (where.length > 0) {
        query.equalTo("$and", where);
      }
      if (this.departmentid != "") {
        query.equalTo("vcaddr", departments);
      }

      query.count().then(count => {
        if (count) {
          this.total = count;
          query.find().then(results => {
            this.derive(JSON.parse(JSON.stringify(results)), this.Config);
            this.$notify({
              title: "成功",
              message: "导出成功",
              type: "success"
            });
          });
        } else {
          this.total = 0;
        }
      });
    },
    // 获取资源树
    getTree() {
      // let Department = Parse.Object.extend("Department");
      // let department = new Parse.Query(Department);
      // department.limit(20000);
      // department.find().then(
      //   resultes => {
      //     this.data = [];
      //     resultes.map(items => {
      //       let obj = {};
      //       items.createtime = utc2beijing(items.attributes.createdAt);
      //       obj.name = items.attributes.name,
      //       obj.ParentId = items.attributes.ParentId;
      //       obj.objectId = items.id;
      //       obj.createtime = items.createtime;
      //       obj.icon = items.attributes.org_type;
      //       obj.is_show = items.attributes.leafnode;
      //       this.data.push(obj);
      //       if(items.attributes.org_type=='集中器'){
      //         this.departmentid.push(items.id);
      //       }
      //     });
      this.yhmxFordepartment(
        this.pagesize,
        this.start,
        this.departmentid,
        this.isshowonce
      );

      //     this.gsmc_child=this.departmentid;
      //   },
      //   error => {
      //     if (error.code == "209") {
      //       this.$message({
      //         type: "warning",
      //         message: "登陆权限过期，请重新登录"
      //       });
      //       this.$router.push({
      //         path: "/login"
      //       });
      //     }
      //   }
      // );
    },
    //树联动父级
    //原数组data2 nodeId2点击树元素的parentId，arrRes新的数组
    getParent(data2, nodeId2, arrRes) {
      data2.map(items => {
        if (items.objectId == nodeId2) {
          arrRes.push(items.objectId);
          this.getParent(data2, items.ParentId, arrRes);
        } else if (items.ParentId == 0 && items.objectId == nodeId2) {
          arrRes.push(items.objectId);
        }
      });
      return arrRes;
    },
    // 获取父级信息
    getParentId(where, value, icon) {
      let Department = Parse.Object.extend("Department");
      let query = new Parse.Query(Department);
      query.equalTo(where, value);
      query.find().then(res => {
        if (icon == "集中器") {
          this.add_form.gddw = res[0].attributes.name;
        } else if (icon == "电表") {
          this.add_form.vcaddr = res[0].attributes.name;
          this.getParentId("objectId", res.ParentId, "集中器");
        }
      });
    },
    // 树形控件点击集中器操作
    handleNodeClick(row) {
      this.loading = true;
      this.isshowonce = true;
      this.start = 0;
      if (row.icon == "电表") {
        this.add_form.addr = row.name;
        this.getParentId("objectId", row.ParentId, "电表");
        this.isaddr = true;
        this.isvcaddr = true;
      } else {
        this.add_form.gddw = row.name;
        this.isaddr = false;
        this.isvcaddr = false;
      }
      this.add_form.gsmc = row.objectId;
      
      if (row.leaf == true) {
        let arr1 = [row.objectId];
        this.gsmc_child = arr;
        this.departmentid = row.alias;
        if (row.icon == "集中器") {
          this.formInline.cost = row.name;
          this.formInline.electricityId = "";
          this.gsmc = row.objectId;
          this.add_form.vcaddr = row.name
          var Vcon = Parse.Object.extend('Vcon')
          var vcon = new Parse.Query(Vcon)
          vcon.get(this.gsmc).then(resultes=>{
            this.add_form.gddw = resultes.attributes.organization.attributes.name
          })
        }
        this.yhmxFordepartment(
          this.pagesize,
          this.start,
          row.alias,
          this.isshowonce
        );
      }
    },
    handleClose() {
      this.dialogVisible = false;
    },
    gotodetail() {
      this.$router.push({ path: "/devicemanage/meterdetail" });
    }
  },
  components: {
    Resource1
  }
};
</script>
<style scoped>
#metersearch {
  background: #ffffff;
  box-sizing: border-box;
  font-size: 13px;
  overflow-x: scroll;
  min-height: 100%;
}
#metersearch > button {
  padding: 3px 15px;
}
#metersearch .resource1 {
  width: 360px;
  height: 100vh;
  flex-shrink: 0;
  overflow: scroll;
  padding-top: 10px;
}
</style>

<style>
#metersearch .el-table th {
  background: #fafafa;
  color: #666666;
  font-weight: 600;
}
#metersearch .el-dialog__body {
  background: #f5f5f5;
}
#metersearch .el-dialog__footer {
  padding-bottom: 50px;
}
#metersearch
  .el-tree--highlight-current
  .el-tree-node.is-current
  > .el-tree-node__content {
  background-color: #cccccc;
}
#metersearch .tb-edit .el-input,
#metersearch .tb-edit .current-row .el-input + span {
  display: none;
}
#metersearch .tb-edit .current-row .el-input {
  display: block;
}
#metersearch .el-table td,
.el-table th {
  padding: 0;
}
#metersearch .el-button--mini,
.el-button--mini.is-round {
  padding: 6px;
}
/* #metersearch .el-table {
  height: 650px !important;
} */
#metersearch .el-table .cell {
  line-height: 30px;
}
#metersearch .el-table th,
#metersearch .el-pagination {
  background: #daf0fe;
}
#metersearch .el-pagination {
  padding: 8px 5px;
}
#metersearch .block {
  display: flex;
  background: #daf0fe;
  width: 100%;
  flex-wrap: wrap;
}
#metersearch .block span.der,
.block span.ders,
#metersearch .block span.iconicon-refresh {
  font-size: 20px;
  cursor: pointer;
  margin: 10px 0 0 1rem;
}
#metersearch .block span.der {
  color: #207245;
}
#metersearch .block span.ders {
  color: #84bf56;
}
#metersearch .block .el-dialog__body div {
  display: flex;
  justify-content: center;
  align-items: center;
}
#metersearch .block .el-dialog__body input {
  width: 15%;
  height: 26px;
  text-align: center;
  margin: 0 6px;
}
#metersearch .upload-demo {
  display: inline-block;
  margin-left: 10px;
}
/* 修改信息 */
/* #metersearch .el-dialog {
  width: 34%;
} */
#metersearch .el-dialog {
  height: 450px;
  overflow: scroll;
}
#metersearch .el-dialog input {
  width: 150px;
}
#metersearch .el-cascader .el-input .el-input__inner,
#metersearch .el-cascader .el-cascader__label {
  font-size: 12px;
  height: 25px;
  width: 270px !important;
}
#metersearch .el-dialog__wrapper .el-dialog {
  margin-top: 5vh !important;
}
#metersearch .el-dialog .el-dialog__body {
  padding: 10px;
}
#metersearch .el-dialog .el-dialog__body .el-form {
  display: flex;
  flex-wrap: wrap;
}
#metersearch .el-dialog .el-dialog__footer {
  padding-bottom: 10px;
}
#metersearch .el-form-item {
  margin: 10px 0;
}
/* 左边菜单 */
#metersearch .el-col.left {
  height: 800px;
}
#metersearch .el-col .el-form-item__content input,
.el-col .el-input--prefix input {
  height: 25px;
  line-height: 25px;
  width: 200px;
}
#metersearch .el-col .el-form-item .el-input > input {
  width: 180px;
}
#metersearch .el-col .el-input__icon {
  line-height: 25px;
}
#metersearch .el-divider .el-divider__text {
  background-color: #f5f5f5;
  font-size: 20px;
}
#metersearch .el-date-editor {
  width: auto;
}
/* #metersearch .number:last-child{
  display: none;
} */
#metersearch .el-pagination__jump {
  display: none;
}
/* 切换页数图标 */
.btn-prev:before {
  content: "上一页";
}
.btn-next:before {
  content: "下一页";
}
.btn-prev i.el-icon,
.btn-next i.el-icon {
  display: none !important;
}
</style>
