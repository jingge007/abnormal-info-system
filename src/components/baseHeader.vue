<template>
  <div class="header_box" :style="headerStyle">
    <div class="header_left">
      <Icon style="cursor: pointer; margin-right: 40px;" type="md-menu" size="26"></Icon>
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

  /deep/ .ivu-breadcrumb {
    font-size: 15px;
  }

  .header_left {
    display: flex;
    align-items: center;
  }

  .header_right {
    display: flex;
    align-items: center;
    padding-right: 50px;

    /deep/ .ivu-dropdown-rel {
      display: flex;
      align-items: center;
      height: 60px;
      margin-left: 20px;
      cursor: pointer;
    }

    .header_center {
      display: flex;
      align-items: center;

      .header_logo {
        width: 38px;
        height: 38px;
        border-radius: 50%;
        border: 1px solid #f1f1f2;
        box-shadow: 2px 7px 8px 0 rgba(29, 35, 41, 0.05);
      }

      .text {
        margin-left: 15px;
        font-size: 14px;
        color: #333;
      }
    }
  }
}
</style>

<script type="text/ecmascript-6">


export default {
  data() {
    return {

    };
  },
  computed: {
    headerStyle() {
      let style = {
        left: '65px',
        width: 'calc(100% - 65px)'
      };
      return this.isCollapsed ? style : '';
    }
  },
  methods: {}
};
</script>