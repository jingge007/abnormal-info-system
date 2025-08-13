<template>
  <div class="container_box">
    <Form :label-width="80">
      <!-- 项目选择 -->
      <FormItem label="项目">
        <Select v-model="selectedProject" @on-change="handleProjectChange" style="width: 300px;">
          <Option v-for="item in projectList" :key="item.value" :value="item.value">{{ item.label }}</Option>
        </Select>
      </FormItem>

      <!-- 打包服务选择 -->
      <FormItem label="打包服务">
        <Select
          v-model="selectedServices"
          multiple
          filterable
          style="width: 800px;"
          placeholder="请选择打包服务"
        >
          <Option v-for="srv in filteredServices" :key="srv.value" :value="srv.value">
            {{ srv.name }}
          </Option>
        </Select>
      </FormItem>

      <!-- 一键打包下拉 -->
      <FormItem label="一键打包">
        <Dropdown @on-click="handleCategorySelect">
          <Button type="primary">
            一键打包 <Icon type="ios-arrow-down"></Icon>
          </Button>
          <DropdownMenu slot="list">
            <!-- 全选类 -->
            <DropdownItem disabled class="group-title">全选类</DropdownItem>
            <DropdownItem
              v-if="hasFrontend"
              name="all_frontend"
              :class="{active: selectedCategory==='all_frontend'}"
            >
              <Icon type="logo-html5" class="menu-icon frontend"/> 全前端服务
            </DropdownItem>
            <DropdownItem
              v-if="hasBackend"
              name="all_backend"
              :class="{active: selectedCategory==='all_backend'}"
            >
              <Icon type="md-cog" class="menu-icon backend"/> 全后台服务
            </DropdownItem>

            <!-- 运营服务 -->
            <DropdownItem v-if="hasFrontendYMS || hasBackendYMS" disabled class="group-title">运营服务</DropdownItem>
            <DropdownItem
              v-if="hasFrontendYMS"
              name="frontend_yms"
              :class="{active: selectedCategory==='frontend_yms'}"
            >
              <Icon type="ios-desktop" class="menu-icon yms"/> 前端服务
            </DropdownItem>
            <DropdownItem
              v-if="hasBackendYMS"
              name="backend_yms"
              :class="{active: selectedCategory==='backend_yms'}"
            >
              <Icon type="md-settings" class="menu-icon yms"/> 后台服务
            </DropdownItem>

            <!-- 供应商服务 -->
            <DropdownItem v-if="hasFrontendSupplier || hasBackendSupplier" disabled class="group-title">供应商服务</DropdownItem>
            <DropdownItem
              v-if="hasFrontendSupplier"
              name="frontend_supplier"
              :class="{active: selectedCategory==='frontend_supplier'}"
            >
              <Icon type="ios-construct" class="menu-icon supplier"/> 前端服务
            </DropdownItem>
            <DropdownItem
              v-if="hasBackendSupplier"
              name="backend_supplier"
              :class="{active: selectedCategory==='backend_supplier'}"
            >
              <Icon type="md-hammer" class="menu-icon supplier"/> 后台服务
            </DropdownItem>

            <!-- 商城服务 -->
            <DropdownItem v-if="hasFrontendShopping || hasBackendShopping" disabled class="group-title">商城服务</DropdownItem>
            <DropdownItem
              v-if="hasFrontendShopping"
              name="frontend_shopping"
              :class="{active: selectedCategory==='frontend_shopping'}"
            >
              <Icon type="md-cart" class="menu-icon shopping"/> 前端服务
            </DropdownItem>
            <DropdownItem
              v-if="hasBackendShopping"
              name="backend_shopping"
              :class="{active: selectedCategory==='backend_shopping'}"
            >
              <Icon type="md-archive" class="menu-icon shopping"/> 后台服务
            </DropdownItem>

            <!-- 分销商服务 -->
            <DropdownItem v-if="hasFrontendDistributor || hasBackendDistributor" disabled class="group-title">分销商服务</DropdownItem>
            <DropdownItem
              v-if="hasFrontendDistributor"
              name="frontend_distributor"
              :class="{active: selectedCategory==='frontend_distributor'}"
            >
              <Icon type="md-people" class="menu-icon distributor"/> 前端服务
            </DropdownItem>
            <DropdownItem
              v-if="hasBackendDistributor"
              name="backend_distributor"
              :class="{active: selectedCategory==='backend_distributor'}"
            >
              <Icon type="md-person" class="menu-icon distributor"/> 后台服务
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </FormItem>

      <!-- 复制 & 重置 -->
      <FormItem>
        <Button type="primary" @click="copyServices">复制选中值</Button>
        <Button style="margin-left: 10px;" @click="resetSelection">重置</Button>
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
      selectedCategory: '',
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
    },
    hasFrontend() {
      return this.filteredServices.some(s => s.value.endsWith('-static'));
    },
    hasBackend() {
      return this.filteredServices.some(s => !s.value.endsWith('-static'));
    },
    hasFrontendYMS() {
      return this.filteredServices.some(s => s.value.includes('yms') && s.value.endsWith('-static'));
    },
    hasBackendYMS() {
      return this.filteredServices.some(s => s.value.includes('yms') && !s.value.endsWith('-static'));
    },
    hasFrontendSupplier() {
      return this.filteredServices.some(s => s.value.includes('supplier') && s.value.endsWith('-static'));
    },
    hasBackendSupplier() {
      return this.filteredServices.some(s => s.value.includes('supplier') && !s.value.endsWith('-static'));
    },
    hasFrontendShopping() {
      return this.filteredServices.some(s => s.value.includes('shopping') && s.value.endsWith('-static'));
    },
    hasBackendShopping() {
      return this.filteredServices.some(s => s.value.includes('shopping') && !s.value.endsWith('-static'));
    },
    hasFrontendDistributor() {
      return this.filteredServices.some(s => s.value.includes('distributor') && s.value.endsWith('-static'));
    },
    hasBackendDistributor() {
      return this.filteredServices.some(s => s.value.includes('distributor') && !s.value.endsWith('-static'));
    },
  },
  methods: {
    /** 切换项目时清空选中服务和分类 */
    handleProjectChange() {
      this.selectedServices = [];
      this.selectedCategory = '';
    },
    /** 一键打包下拉选择逻辑，按前端/后台分类筛选服务 */
    handleCategorySelect(type) {
      this.selectedCategory = type;
      const services = this.filteredServices;
      let selected = [];
      switch (type) {
        case 'all_frontend':
          selected = services.filter(s => s.value.endsWith('-static')).map(s => s.value);
          break;
        case 'all_backend':
          selected = services.filter(s => !s.value.endsWith('-static')).map(s => s.value);
          break;
        default:
          const isFrontend = type.startsWith('frontend');
          const keyword = type.split('_')[1];
          selected = services
            .filter(s => (isFrontend ? s.value.endsWith('-static') : !s.value.endsWith('-static')))
            .filter(s => s.value.includes(keyword))
            .map(s => s.value);
      }
      this.selectedServices = selected;

      // 一键打包完成后直接复制选中值
      if (selected.length) {
        this.$tools.copyText(selected.join(',')).then(() => {
          this.$Message.success('一键打包已复制选中值！');
        });
      } else {
        this.$Message.warning('没有可选服务可复制');
      }
    },
    /** 复制当前选中的打包服务 */
    copyServices() {
      if (!this.selectedServices.length) {
        return this.$Message.warning('请先选择打包服务');
      }
      this.$tools.copyText(this.selectedServices.join(',')).then(() => this.$Message.success('复制成功！'));
    },
    /** 重置选中项目、服务和分类 */
    resetSelection() {
      this.selectedProject = 'YMS';
      this.selectedServices = [];
      this.selectedCategory = '';
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

.group-title {
  font-weight: bold;
  color: #999;
  cursor: default;
  font-size: 12px;
  padding: 4px 10px;
}

.menu-icon {
  margin-right: 6px;
  font-size: 14px;
}

.frontend {
  color: #1890ff;
}

.backend {
  color: #52c41a;
}

.yms {
  color: #fa8c16;
}

.supplier {
  color: #722ed1;
}

.shopping {
  color: #f5222d;
}

.distributor {
  color: #13c2c2;
}

.active {
  background-color: #e6f7ff;
}
</style>
