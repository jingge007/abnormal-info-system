<template>
  <div class="container_box" style="padding: 20px;">
    <Form :label-width="80">
      <!-- 项目选择 -->
      <FormItem label="项目">
        <Select v-model="selectedProject" @on-change="selectedServices = ''" style="width: 300px;">
          <Option v-for="item in projectList" :key="item.value" :value="item.value">{{ item.label }}</Option>
        </Select>
      </FormItem>
      <!-- 打包服务选择 -->
      <FormItem label="打包服务">
        <Select v-model="selectedServices" multiple filterable style="width: 800px;" placeholder="请选择打包服务">
          <Option v-for="srv in filteredServices" :key="srv.value" :value="srv.value">{{ srv.name }}</Option>
        </Select>
      </FormItem>
      <!-- 全选按钮 -->
      <FormItem label="全选操作">
        <Button type="primary" @click="selectAll('all')">全选所有服务</Button>
        <Button type="success" style="margin-left:10px;" @click="selectAll('frontend')">全选前端服务</Button>
        <Button type="warning" style="margin-left:10px;" @click="selectAll('backend')">全选后台服务</Button>
      </FormItem>
      <!-- 复制 & 重置按钮 -->
      <FormItem>
        <Button type="primary" @click="copyServices">复制选中值</Button>
        <Button style="margin-left:10px;" @click="resetSelection">重置</Button>
      </FormItem>
    </Form>
  </div>
</template>

<script>
export default {
  name: 'packagedService',
  data() {
    return {
      selectedProject: 'YMS',
      selectedServices: [],
      projectList: [
        {label: 'YMS', value: 'YMS'},
        {label: 'VES', value: 'VES'}
      ],
      servicesMap: {
        YMS: [
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
        VES: [
          {name: 'ves-compiler', value: 'ves-compiler'},
          {name: 'ves-core-compiler', value: 'ves-core-compiler'},
          {name: 'ves-core-controller', value: 'ves-core-controller'},
          {name: 'ves-core-service', value: 'ves-core-service'},
          {name: 'ves-core-static', value: 'ves-core-static'},
          {name: 'ves-supplier-compiler', value: 'ves-supplier-compiler'},
          {name: 'ves-supplier-controller', value: 'ves-supplier-controller'},
          {name: 'ves-supplier-service', value: 'ves-supplier-service'},
          {name: 'ves-supplier-static', value: 'ves-supplier-static'}
        ]
      }
    };
  },
  computed: {
    filteredServices() {
      return this.servicesMap[this.selectedProject] || [];
    }
  },
  methods: {
    selectAll(type) {
      const services = this.filteredServices;
      this.selectedServices = services
        .filter(s => type === 'all' || (type === 'frontend' ? s.value.endsWith('-static') : !s.value.endsWith('-static')))
        .map(s => s.value);
    },
    copyServices() {
      if (!this.selectedServices.length) return this.$Message.warning('请先选择打包服务');
      this.$tools.copyText(this.selectedServices.join(',')).then(() => this.$Message.success('复制成功！'));
    },
    resetSelection() {
      this.selectedProject = 'YMS';
      this.selectedServices = [];
    }
  }
};
</script>

<style lang="less" scoped>
.container_box {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
}
</style>
