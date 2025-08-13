<template>
  <Sider hide-trigger collapsible v-model="localCollapsed"
    :collapsed-width="65" :width="240"
    class="header_box"
    :class="themeType==='light'?'themeLight':'themeDark'">
    <!-- Logo -->
    <div class="logo_box" @click="logoBtn">
      <img :class="isCollapsed ? 'mini_head_logo' : 'head_logo'" :src="head_logo" alt="">
      <h2 v-if="!isCollapsed" class="title">工作台</h2>
    </div>
    <!-- 菜单 -->
    <Menu :theme="theme"
      :active-name="activeName"
      ref="side_menu"
      @on-select="SelectNav"
      :class="isCollapsed ? 'menu_style' : ''"
      :style="{height: 'calc(100% - 60px)'}">
      <template v-for="(item, index) in submenuList">
        <!-- 展开且有子菜单 -->
        <Submenu :name="item.name" :key="index" v-if="!isCollapsed && !item.singlePage">
          <template slot="title">
            <base-icon :name="item.icon" :size="item.icon_size"></base-icon>
            <span class="text">{{ item.title }}</span>
          </template>
          <MenuItem v-for="(ele, ids) in item.children" :key="ids" :name="ele.name">{{ ele.title }}</MenuItem>
        </Submenu>

        <!-- 展开但没有子菜单 -->
        <MenuItem :name="item.name" :key="index" v-if="!isCollapsed && item.singlePage">
          <base-icon :name="item.icon"
            :size="item.icon_size"
            :color="item.name === activeName ? '#2d8cf0' : '#666'"></base-icon>
          <span class="text">{{ item.title }}</span>
        </MenuItem>

        <!-- 收缩有子菜单，悬浮 Dropdown 展示 -->
        <Dropdown v-if="isCollapsed && !item.singlePage"
          :key="index"
          class="icon_style"
          transfer-class-name="dropdown_box"
          @on-click="SelectNav"
          placement="right">
          <base-icon :name="item.icon"
            :size="item.size || 22"
            :color="item.name === activeName ? '#2d8cf0' : '#666'"></base-icon>
          <DropdownMenu slot="list">
            <DropdownItem v-for="(ele, ids) in item.children"
              :key="ids"
              :name="ele.name"
              :selected="ele.name === activeName">
              {{ ele.title }}
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>

        <!-- 收缩无子菜单，悬浮 Dropdown 展示 -->
        <Dropdown v-if="isCollapsed && item.singlePage"
          :key="index"
          class="icon_style"
          transfer-class-name="dropdown_box"
          @on-click="SelectNav"
          placement="right">
          <base-icon :name="item.icon"
            :size="item.size || 22"
            :color="item.name === activeName ? '#2d8cf0' : '#666'"></base-icon>
          <DropdownMenu slot="list">
            <DropdownItem :name="item.name">{{ item.title }}</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </template>
    </Menu>
  </Sider>
</template>

<script>
import router from '@/router';

export default {
  data() {
    return {
      themeType: 'light',
      theme: 'light',
      head_logo: require("@/assets/images/head_logo.png"),
      activeName: '',
      localCollapsed: this.$store.state.isCollapsed
    };
  },
  computed: {
    submenuList() {
      return this.formatRoutesToMenu(router.options.routes[0].children || []);
    },
    isCollapsed: {
      get() {
        return this.$store.state.isCollapsed;
      },
      set(val) {
        this.$store.commit('isCollapsed', val);
      }
    }
  },
  created() {
    this.activeName = this.$route.name;
  },
  methods: {
    // 递归生成菜单结构
    formatRoutesToMenu(routes) {
      return routes
        .filter(r => !r.meta?.hideInMenu)
        .map(r => ({
          icon: r.meta?.icon,
          singlePage: r.meta?.singlePage ?? true,
          icon_size: r.meta?.icon_size,
          size: r.meta?.size,
          name: r.name,
          title: r.meta?.title,
          children: r.children ? this.formatRoutesToMenu(r.children) : []
        }));
    },

    // 点击菜单跳转
    SelectNav(name) {
      this.activeName = name;
      this.$router.push({name}).catch(() => {
      });
    },

    // 点击 logo 跳转首页
    logoBtn() {
      this.$router.push({path: '/'}).catch(() => {
      });
    }
  },
  watch: {
    // 监听侧边栏折叠状态，更新菜单
    isCollapsed(val) {
      this.localCollapsed = val;
      this.$nextTick(() => {
        this.$refs.side_menu.updateOpened();
        this.$refs.side_menu.updateActiveName();
      });
    },
  }
};
</script>

<style lang="less" scoped>
.header_box {
  background: #fff;
  height: 100vh;

  .logo_box {
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border-bottom: 1px solid #f8f8f9;

    .head_logo {
      width: 50px;
      height: 50px;
    }

    .mini_head_logo {
      width: 50px;
      height: 50px;
      border-radius: 50%;
    }

    .title {
      font-size: 18px;
      font-weight: bold;
      margin-left: 8px;
    }
  }

  .menu_box {
    overflow-y: auto;
  }

  .menu_style {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .icon_style {
    margin: 10px 0;
  }

  .dropdown_box {
    min-width: 140px;
  }
}
</style>
