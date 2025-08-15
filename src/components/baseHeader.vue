<template>
  <div class="header_box" :style="headerStyle">
    <div class="header_left">
      <Icon style="cursor: pointer; margin-right: 40px;" type="md-menu" size="26" @click="changeMenu"></Icon>
      <Breadcrumb>
        <BreadcrumbItem>工作台</BreadcrumbItem>
        <BreadcrumbItem>{{ $route.meta.title }}</BreadcrumbItem>
      </Breadcrumb>
    </div>
  </div>
</template>

<style lang="less" scoped>
.header_box {
  display: flex;
  justify-content: space-between;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  width: calc(100% - 240px);
  position: fixed;
  top: 0;
  right: 0;
  left: 240px;
  z-index: 11;
  height: 60px;
  line-height: 60px;
  background-color: #fff;
  padding: 0 20px;
  box-sizing: border-box;
  transition: left .2s ease, width .2s ease;

  /deep/ .ivu-breadcrumb {
    font-size: 15px;
  }

  .header_left {
    display: flex;
    align-items: center;
  }
}
</style>

<script>
export default {
  computed: {
    isCollapsed() {
      return this.$store.state.isCollapsed
    },
    headerStyle() {
      return this.isCollapsed
        ? { left: '65px', width: 'calc(100% - 65px)' }
        : { left: '240px', width: 'calc(100% - 240px)' }
    }
  },
  methods: {
    changeMenu() {
      this.$store.commit('toggleCollapsed')
    }
  }
}
</script>

