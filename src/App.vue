<template>
  <div id="app">
    <Form ref="pageParams" :model="pageParams" :label-width="100" :rules="ruleValidate">
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
          <FormItem label="入參：" prop="enteringGinseng">
            <Input
                type="textarea"
                size="large"
                :autosize="{ minRows: 4, maxRows: 8}"
                v-model.trim="pageParams.enteringGinseng">
            </Input>
          </FormItem>
        </Col>
        <Col :span="itemCol">
          <FormItem label="报错信息：" prop="errorMessage">
            <Input
                size="large"
                type="textarea"
                :autosize="{ minRows: 20, maxRows: 24}"
                v-model.trim="pageParams.errorMessage">
            </Input>
          </FormItem>
        </Col>
      </Row>
    </Form>
    <div style="display: flex;align-items: center; justify-content: center; width: 1200px; margin-top: 10px;">
      <Button type="primary" style="margin-right: 25px;" @click="handleReport('download')">下载异常报告</Button>
      <Button type="primary" style="margin-right: 25px;" @click="handleReport('link')">生成异常报告链接地址</Button>
      <Button @click="resetBtn">重置数据</Button>
    </div>
  </div>
</template>

<script>
import {saveAs} from 'file-saver';

export default {
  name: 'App',
  data() {
    return {
      itemCol: 24,
      threeItemCol: 8,
      pageParams: {
        system: null,
        systemEnvironment: null,
        method: null,
        errorReportingInterface: '',
        enteringGinseng: '',
        errorMessage: ''
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
        {name: '运营系统', value: 'yms'},
        {name: '供应商系统', value: 'supplier'},
        {name: '分销商系统', value: 'distributor'},
        {name: '商城', value: 'shopping'},
      ],
      systemEnvironmentList: [
        {name: 'dev环境', value: 'dev'},
        {name: 'test环境', value: 'test'},
        {name: 'staging环境', value: 'staging'}
      ],
      methodList: [
        {name: 'GET请求', value: 'get'},
        {name: 'POST请求', value: 'post'},
        {name: 'PUT请求', value: 'put'},
        {name: 'DELETE请求', value: 'delete'},
      ],
    }
  },
  methods: {
    // 重置数据
    resetBtn() {
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
            text += obj[key] + val + '\n' + '\n';
          }
          const blob = new Blob([text], {type: 'text/plain;charset=utf-8'});
          if (type === 'download') {
            let timer = v.$moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
            let name = `错误报告-${timer}`;
            saveAs(blob, `${name}.txt`);
            v.$Message.success('下载成功！');
          } else {
            const url = URL.createObjectURL(blob);
            // 在新窗口中打开展示报错信息
            window.open(url, '_blank');
          }
        }
      });
    }
  }
}
</script>

<style>
#app {
  width: 1200px;
  margin: 30px auto 0;

  .ivu-col .ivu-form-item {
    .ivu-form-item-label {
      padding-right: 0;
    }
  }
}
</style>
