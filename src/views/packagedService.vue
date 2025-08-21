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

      <!-- 一键打包：Checkbox 分组 + 分组全选 + 背景色 -->
      <FormItem label="一键打包">
        <div class="checkbox-groups">
          <!-- 全选类 -->
          <div class="group group--all">
            <div class="group-head">
              <Checkbox
                :indeterminate="isGroupIndeterminate('all')"
                :value="isGroupChecked('all')"
                @on-change="toggleGroup('all', $event)"
              >
                全选类
              </Checkbox>
            </div>
            <div class="group-body">
              <CheckboxGroup v-model="selectedCategories" @on-change="handleCategoryChange">
                <Checkbox label="all_frontend">全前端服务</Checkbox>
                <Checkbox label="all_backend">全后台服务</Checkbox>
              </CheckboxGroup>
            </div>
          </div>

          <!-- 运营服务 -->
          <div class="group group--operation" v-if="hasAnyYms">
            <div class="group-head">
              <Checkbox
                :indeterminate="isGroupIndeterminate('operation')"
                :value="isGroupChecked('operation')"
                @on-change="toggleGroup('operation', $event)"
              >
                运营服务
              </Checkbox>
            </div>
            <div class="group-body">
              <CheckboxGroup v-model="selectedCategories" @on-change="handleCategoryChange">
                <Checkbox label="frontend_yms">前端服务</Checkbox>
                <Checkbox label="backend_yms">后台服务</Checkbox>
              </CheckboxGroup>
            </div>
          </div>

          <!-- 供应商服务 -->
          <div class="group group--supplier" v-if="hasAnySupplier">
            <div class="group-head">
              <Checkbox
                :indeterminate="isGroupIndeterminate('supplier')"
                :value="isGroupChecked('supplier')"
                @on-change="toggleGroup('supplier', $event)"
              >
                供应商服务
              </Checkbox>
            </div>
            <div class="group-body">
              <CheckboxGroup v-model="selectedCategories" @on-change="handleCategoryChange">
                <Checkbox label="frontend_supplier">前端服务</Checkbox>
                <Checkbox label="backend_supplier">后台服务</Checkbox>
              </CheckboxGroup>
            </div>
          </div>

          <!-- 商城服务（按 systemServicesType 控制显隐，YMS 会有） -->
          <div class="group group--shopping" v-if="hasAnyShopping">
            <div class="group-head">
              <Checkbox
                :indeterminate="isGroupIndeterminate('shopping')"
                :value="isGroupChecked('shopping')"
                @on-change="toggleGroup('shopping', $event)"
              >
                商城服务
              </Checkbox>
            </div>
            <div class="group-body">
              <CheckboxGroup v-model="selectedCategories" @on-change="handleCategoryChange">
                <Checkbox label="frontend_shopping">商城服务</Checkbox>
              </CheckboxGroup>
            </div>
          </div>

          <!-- 分销商服务 -->
          <div class="group group--distributor" v-if="hasAnyDistributor">
            <div class="group-head">
              <Checkbox
                :indeterminate="isGroupIndeterminate('distributor')"
                :value="isGroupChecked('distributor')"
                @on-change="toggleGroup('distributor', $event)"
              >
                分销商服务
              </Checkbox>
            </div>
            <div class="group-body">
              <CheckboxGroup v-model="selectedCategories" @on-change="handleCategoryChange">
                <Checkbox label="frontend_distributor">前端服务</Checkbox>
                <Checkbox label="backend_distributor">后台服务</Checkbox>
              </CheckboxGroup>
            </div>
          </div>
        </div>
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
      selectedCategories: [], // 勾选的分类值（通过它来计算 selectedServices）
      projectList: [
        {label: 'YMS', value: 'YMS'},
        {label: 'VES', value: 'VES'}
      ],
      // 使用你提供的基础数据结构（每个项目有 systemServicesType 和 serviceList）
      servicesMap: {
        YMS: {
          systemServicesType: ['yms', 'supplier', 'distributor', 'shopping'],
          serviceList: [
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
          ]
        },
        VES: {
          systemServicesType: ['yms', 'supplier'],
          serviceList: [
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
      }
    };
  },
  computed: {
    // 当前项目的服务列表（结构为 {name, value} 的数组）
    filteredServices() {
      const proj = this.servicesMap[this.selectedProject];
      return proj ? proj.serviceList : [];
    },

    // 基于 systemServicesType 控制每个分组是否展示 —— 解决 VES 没显示运营的问题
    hasAnyYms() {
      const proj = this.servicesMap[this.selectedProject];
      return proj && Array.isArray(proj.systemServicesType) && proj.systemServicesType.includes('yms');
    },
    hasAnySupplier() {
      const proj = this.servicesMap[this.selectedProject];
      return proj && Array.isArray(proj.systemServicesType) && proj.systemServicesType.includes('supplier');
    },
    hasAnyShopping() {
      const proj = this.servicesMap[this.selectedProject];
      return proj && Array.isArray(proj.systemServicesType) && proj.systemServicesType.includes('shopping');
    },
    hasAnyDistributor() {
      const proj = this.servicesMap[this.selectedProject];
      return proj && Array.isArray(proj.systemServicesType) && proj.systemServicesType.includes('distributor');
    }
  },
  methods: {
    handleProjectChange() {
      // 切换项目时清空
      this.selectedServices = [];
      this.selectedCategories = [];
    },

    // 每个分组对应的子分类 key 列表
    groupCats(key) {
      const map = {
        all: ['all_frontend', 'all_backend'],
        operation: ['frontend_yms', 'backend_yms'],
        supplier: ['frontend_supplier', 'backend_supplier'],
        shopping: ['frontend_shopping'],
        distributor: ['frontend_distributor', 'backend_distributor']
      };
      return map[key] || [];
    },

    // 分组是否全选（所有该组子分类都被勾选）
    isGroupChecked(key) {
      const cats = this.groupCats(key);
      return cats.length > 0 && cats.every(c => this.selectedCategories.includes(c));
    },

    // 分组选中一部分（半选）
    isGroupIndeterminate(key) {
      const cats = this.groupCats(key);
      const cnt = cats.filter(c => this.selectedCategories.includes(c)).length;
      return cnt > 0 && cnt < cats.length;
    },

    // 切换分组全选（会把分组内的子分类加入或移除 selectedCategories，然后重算 selectedServices）
    toggleGroup(key, checked) {
      const cats = this.groupCats(key);
      if (checked) {
        this.selectedCategories = Array.from(new Set([...this.selectedCategories, ...cats]));
      } else {
        this.selectedCategories = this.selectedCategories.filter(c => !cats.includes(c));
      }
      this.handleCategoryChange();
    },

    // 从 selectedCategories 计算 selectedServices（去重、按 serviceList 原顺序）
    handleCategoryChange() {
      const chosen = new Set();
      const list = this.filteredServices; // 保持原始顺序
      const endsStatic = v => v.endsWith('-static');
      const projectPrefix = this.selectedProject.toLowerCase(); // 'yms' 或 'ves'

      const collectForType = (type) => {
        switch (type) {
          case 'all_frontend':
            return list.filter(s => endsStatic(s.value)).map(s => s.value);

          case 'all_backend':
            return list.filter(s => !endsStatic(s.value)).map(s => s.value);

          // 运营（使用 projectPrefix 匹配 core）
          case 'backend_yms':
            // 前缀 {proj}-core 且不是 -static
            return list
              .filter(s => s.value.startsWith(`${projectPrefix}-core`) && !endsStatic(s.value))
              .map(s => s.value);

          case 'frontend_yms':
            // {proj}-core-static（或包含 core 且是 static）
            return list
              .filter(s => (s.value === `${projectPrefix}-core-static`) || (s.value.startsWith(`${projectPrefix}-core`) && endsStatic(s.value)))
              .map(s => s.value);

          // 供应商（兼容命名： {proj}-supplier-* 或 包含 'supplier'）
          case 'backend_supplier':
            return list
              .filter(s =>
                !endsStatic(s.value) &&
                (s.value.startsWith(`${projectPrefix}-supplier`) || s.value.includes('supplier'))
              )
              .map(s => s.value);

          case 'frontend_supplier':
            return list
              .filter(s =>
                (s.value === `${projectPrefix}-supplier-static`) ||
                (s.value.includes('supplier') && endsStatic(s.value))
              )
              .map(s => s.value);

          // 商城（通常是 {proj}-shopping-static 或 包含 'shopping' 且 static）
          case 'frontend_shopping':
            return list
              .filter(s =>
                (s.value === `${projectPrefix}-shopping-static`) ||
                (s.value.includes('shopping') && endsStatic(s.value))
              )
              .map(s => s.value);

          // 分销商（通常是 {proj}-distributor-* 或 包含 'distributor'）
          case 'frontend_distributor':
            return list
              .filter(s =>
                (s.value === `${projectPrefix}-distributor-static`) ||
                (s.value.includes('distributor') && endsStatic(s.value))
              )
              .map(s => s.value);

          case 'backend_distributor':
            return list
              .filter(s =>
                (s.value === `${projectPrefix}-distributor`) ||
                (s.value.includes('distributor') && !endsStatic(s.value))
              )
              .map(s => s.value);

          default:
            return [];
        }
      };

      // 收集所有被勾选分类对应的服务
      this.selectedCategories.forEach(type => {
        collectForType(type).forEach(v => chosen.add(v));
      });

      // 按原 serviceList 顺序输出并去重
      const ordered = [];
      list.forEach(s => {
        if (chosen.has(s.value)) ordered.push(s.value);
      });
      this.selectedServices = ordered;
    },

    copyServices() {
      if (!this.selectedServices.length) {
        return this.$Message.warning('请先选择打包服务');
      }
      this.$tools.copyText(this.selectedServices.join(',')).then(() => this.$Message.success('复制成功！'));
    },

    resetSelection() {
      this.selectedProject = 'YMS';
      this.selectedServices = [];
      this.selectedCategories = [];
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

/* 栅格布局 */
.checkbox-groups {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 16px;
}

/* 分组基样式 */
.group {
  border: 1px solid #f0f0f0;
  border-radius: 10px;
  padding: 12px 12px 10px;
}

/* 分组头/体 */
.group-head {
  font-weight: 600;
  color: #444;
  margin-bottom: 8px;
}

.group-body :deep(.ivu-checkbox-wrapper) {
  margin-right: 14px;
  margin-bottom: 6px;
}

/* 不同分组背景色区分 */
.group--all {
  background: #f5f9ff;
  border-color: #d6e4ff;
}

.group--operation {
  background: #e6f7ff;
  border-color: #bae7ff;
}

.group--supplier {
  background: #f6ffed;
  border-color: #d9f7be;
}

.group--shopping {
  background: #fff0f6;
  border-color: #ffd6e7;
}

.group--distributor {
  background: #fffbe6;
  border-color: #ffe58f;
}
</style>
