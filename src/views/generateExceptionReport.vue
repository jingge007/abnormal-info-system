<template>
  <div class="generateExceptionReport_box">
    <Form ref="pageParams" :model="pageParams" :label-width="120" :rules="ruleValidate" @submit.native.prevent>
      <Row type="flex" :gutter="16">
        <Col :span="threeItemCol">
          <FormItem label="所在系统：" prop="system">
            <Select v-model="pageParams.system" transfer size="large">
              <Option v-for="item in systemList" :key="item.value" :value="item.value">{{ item.name }}</Option>
            </Select>
          </FormItem>
        </Col>
        <Col :span="threeItemCol">
          <FormItem label="系统环境：" prop="systemEnvironment">
            <Select v-model="pageParams.systemEnvironment" transfer size="large">
              <Option v-for="item in systemEnvironmentList" :key="item.value" :value="item.value">{{ item.name }}</Option>
            </Select>
          </FormItem>
        </Col>
        <Col :span="threeItemCol">
          <FormItem label="请求方式：" prop="method">
            <Select v-model="pageParams.method" transfer size="large">
              <Option v-for="item in methodList" :key="item.value" :value="item.value">{{ item.name }}</Option>
            </Select>
          </FormItem>
        </Col>
        <Col :span="itemCol">
          <FormItem label="报错接口：" prop="errorReportingInterface">
            <Input
              type="textarea"
              size="large"
              :autosize="{ minRows: 2, maxRows: 4}"
              v-model.trim="pageParams.errorReportingInterface">
            </Input>
          </FormItem>
        </Col>
        <Col :span="itemCol">
          <FormItem label="接口入參：" prop="enteringGinseng">
            <Input
              type="textarea"
              size="large"
              :autosize="{ minRows: 3, maxRows: 5}"
              v-model.trim="pageParams.enteringGinseng">
            </Input>
          </FormItem>
        </Col>
        <Col :span="itemCol">
          <FormItem label="相关备注：" prop="remarks">
            <Input
              type="textarea"
              size="large"
              :autosize="{ minRows: 3, maxRows: 5}"
              v-model.trim="pageParams.remarks">
            </Input>
          </FormItem>
        </Col>
        <Col :span="itemCol">
          <FormItem label="报错信息：" prop="errorMessage">
            <Input
              size="large"
              type="textarea"
              :autosize="{ minRows: 10, maxRows: 14}"
              v-model.trim="pageParams.errorMessage">
            </Input>
          </FormItem>
        </Col>
        <Col :span="itemCol">
          <FormItem label="controller转换：" prop="controllerValue">
            <div style="display: flex; align-items: center;">
              <Input size="large" v-model.trim="pageParams.controllerValue" @on-enter="enterChange" style="width:45%;"></Input>
              <div style="display: flex; align-items: center;">
                <span style="margin-left: 20px; margin-right: 8px;">{{ '转换值：' + conversionValue }}</span>
                <Icon v-if="conversionValue" title="一键复制内容" size="20" style="cursor: pointer;"
                  type="md-copy" @click="copyContentBtn(conversionValue, true)"/>
              </div>
            </div>
          </FormItem>
        </Col>
      </Row>
    </Form>
    <div style="display: flex;align-items: center; justify-content: center; width: 1200px; margin-top: 10px;">
      <Button type="primary" style="margin-right: 25px;" @click="handleReport('copy')">复制异常报告链接</Button>
      <Button type="primary" style="margin-right: 25px;" @click="handleReport('download')">下载异常报告文件</Button>
      <Button type="primary" style="margin-right: 25px;" @click="handleReport('link')">生成异常报告</Button>
      <Button @click="resetBtn">重置数据</Button>
    </div>
  </div>
</template>

<script>
import {saveAs} from 'file-saver';

export default {
  name: 'generateExceptionReport',
  data() {
    return {
      itemCol: 24,
      twoItemCol: 12,
      threeItemCol: 8,
      pageParams: {
        system: 'yms',
        systemEnvironment: 'dev',
        method: 'post',
        errorReportingInterface: '',
        enteringGinseng: '',
        remarks: '',
        errorMessage: '',
        controllerValue: '',
        packagedServices: []
      },
      ruleValidate: {
        system: [
          {required: true, message: '请选择系统', trigger: 'change'}
        ],
        systemEnvironment: [
          {required: true, message: '请选择系统环境', trigger: 'change'}
        ],
        method: [
          {required: true, message: '请选择请求方式', trigger: 'change'}
        ],
        errorReportingInterface: [
          {required: true, message: '报错接口不能为空', trigger: 'blur'}
        ],
        errorMessage: [
          {required: true, message: '报错信息不能为空', trigger: 'blur'}
        ]
      },
      systemList: [
        {name: 'YMS-运营系统', value: 'yms'},
        {name: 'YMS-供应商系统', value: 'supplier'},
        {name: 'YMS-分销商系统', value: 'distributor'},
        {name: 'YMS-商城', value: 'shopping'},

        {name: 'VES-运营系统', value: 'vesYms'},
        {name: 'VES-供应商系统', value: 'vesSupplier'},

        {name: 'ERP3.0-设置中心', value: 'tongTool-setting'},
        {name: 'ERP3.0-新品开发系统', value: 'tongTool-pds'},
        {name: 'ERP3.0-订单处理系统', value: 'tongTool-order'},
        {name: 'ERP3.0-商品管理系统', value: 'tongTool-product'},
        {name: 'ERP3.0-供应商采购系统', value: 'tongTool-sps'},
        {name: 'ERP3.0-客服管理系统', value: 'tongTool-cs'},
        {name: 'ERP3.0-仓储管理系统', value: 'tongTool-wms'},
        {name: 'ERP3.0-数据中心', value: 'tongTool-data-center'},
      ],
      systemEnvironmentList: [
        {name: 'dev环境', value: 'dev'},
        {name: 'test环境', value: 'test'},
        {name: 'uat环境', value: 'uat'},
        {name: 'staging环境', value: 'staging'}
      ],
      methodList: [
        {name: 'GET请求', value: 'get'},
        {name: 'POST请求', value: 'post'},
        {name: 'PUT请求', value: 'put'},
        {name: 'DELETE请求', value: 'delete'},
      ],
      conversionValue: '',
      packagedServiceList: [
        {name: 'yms-compiler', value: 'yms-compiler'},
        {name: 'yms-core-compiler', value: 'yms-core-compiler'},
        {name: 'yms-core-controller', value: 'yms-core-controller'},
        {name: 'yms-core-service', value: 'yms-core-service'},
        {name: 'yms-core-static', value: 'yms-core-static'},
        {name: 'yms-distributor-compiler', value: 'yms-distributor-compiler'},
        {name: 'yms-distributor-controller', value: 'yms-distributor-controller'},
        {name: 'yms-distributor-service', value: 'yms-distributor-service'},
        {name: 'yms-distributor-static', value: 'yms-distributor-static'},
        {name: 'yms-shopping-static', value: 'yms-shopping-static'},
        {name: 'yms-supplier-compiler', value: 'yms-supplier-compiler'},
        {name: 'yms-supplier-controller', value: 'yms-supplier-controller'},
        {name: 'yms-supplier-service', value: 'yms-supplier-service'},
        {name: 'yms-supplier-static', value: 'yms-supplier-static'}
      ],
    }
  },
  methods: {
    // 重置数据
    resetBtn() {
      this.conversionValue = '';
      this.$refs['pageParams'].resetFields();
    },
    // 异常报告的处理
    handleReport(type) {
      let v = this;
      let obj = {
        system: '所在系统：',
        systemEnvironment: '系统环境：',
        method: '请求方式：',
        errorReportingInterface: '报错接口：',
        enteringGinseng: '入參：',
        remarks: '备注：',
        errorMessage: '报错信息：'
      };
      let selectKeyList = ['system', 'systemEnvironment', 'method'];
      let text = '';

      function handleFun(value) {
        let name = '';
        let list = [...v.systemList, ...v.systemEnvironmentList, ...v.methodList];
        list.map((item) => {
          if (item.value === value) {
            name = item.name;
          }
        });
        return name;
      }

      v.$refs['pageParams'].validate((valid) => {
        if (valid) {
          for (let key in v.pageParams) {
            let val = '';
            if (selectKeyList.includes(key)) {
              val = handleFun(v.pageParams[key]);
            } else {
              val = v.pageParams[key];
            }
            text += obj[key] + val + '\r\n' + '\r\n';
          }
          const blob = new Blob([text], {type: 'text/plain;charset=utf-8'});
          // 下载
          if (type === 'download') {
            let timer = v.$moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
            let name = `错误报告-${timer}`;
            saveAs(blob, `${name}.txt`);
          } else if (type === 'link') {
            // 在新窗口中打开展示报错信息
            v.generateExceptionReport(v.pageParams);
          }
          // 复制
          else {
            let path = '';
            v.handleSaveData(v.pageParams).then((id) => {
              let origin = window.location.origin;
              if (origin.includes('localhost')) {
                path = `http://localhost:8080/#/errorReport?id=${id}`
              } else {
                path = `https://abnormal-info-system.taicisou.cn/#/errorReport?id=${id}`
              }
              v.$tools.copyText(path).then(() => {
                v.$Message.success('复制成功！');
              });
            });
          }
        }
      });
    },
    // 将错误信息保存数据对象到LeanCloud云端
    handleSaveData(pageParams) {
      let v = this;
      return new Promise((resolve) => {
        const AbnormalList = v.$leancloud.Object.extend('abnormalList');
        const abnormalList = new AbnormalList();
        let keyList = ['system', 'systemEnvironment', 'method', 'errorReportingInterface', 'enteringGinseng', 'remarks', 'errorMessage'];
        for (let key in pageParams) {
          if (keyList.includes(key)) {
            abnormalList.set(key, pageParams[key]);
          }
        }
        abnormalList.save().then((data) => {
          let id = data.id;
          resolve(id);
        }).catch((error) => {
          console.error('错误信息', error);
        });
      })
    },
    // 生成异常错误报告
    generateExceptionReport(pageParams) {
      let v = this;
      v.handleSaveData(pageParams).then((id) => {
        if (id) {
          const {href} = v.$router.resolve({
            path: '/errorReport',
            query: {
              id: id
            }
          });
          setTimeout(() => {
            window.open(href, '_blank');
          }, 300);
        }
      });
    },
    // Swagger接口controller转换
    enterChange() {
      let value = this.pageParams.controllerValue;
      this.conversionValue = '';
      if (value) {
        // 转换大写为小写并用-连接
        const result = value.replace(/([A-Z])/g, '-$1').toLowerCase();
        this.copyContentBtn(result, false);
        this.$Message.success('已经转换复制成功');
        this.pageParams.controllerValue = '';
      } else {
        this.$Message.warning('请先输入内容！');
        return false;
      }
    },
    // 复制
    copyContentBtn(value, val) {
      this.conversionValue = value;
      this.$tools.copyText(value).then(() => {
        this.$Message.success('复制成功！');
      });
    }
  }
}
</script>

<style lang="less" scoped>
.generateExceptionReport_box {
  width: 1300px;
  margin: 30px auto 0;

  .ivu-col .ivu-form-item {
    .ivu-form-item-label {
      padding-right: 0;
    }
  }
}
</style>