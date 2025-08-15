<template>
  <Sider
    hide-trigger
    collapsible
    class="header_box"
    :collapsed-width="65"
    :width="240"
    v-model="collapsedProxy"
    :class="themeType === 'light' ? 'themeLight' : 'themeDark'"
  >
    <!-- Logo：展开/收起两种形态 -->
    <div class="logo_box" @click="logoBtn">
      <img :class="isCollapsed ? 'mini_head_logo' : 'head_logo'" :src="head_logo" alt="">
      <h2 v-if="!isCollapsed" class="title">YMS工作台</h2>
    </div>

    <!-- 菜单 -->
    <Menu
      :theme="theme"
      :active-name="activeName"
      ref="side_menu"
      @on-select="SelectNav"
      :style="menuStyle"
    >
      <template v-for="(item, index) in submenuList">
        <!-- 展开 && 有子菜单 -->
        <Submenu
          v-if="!isCollapsed && !item.singlePage"
          :key="'open-sub-' + index"
          :name="item.name"
        >
          <template slot="title">
            <base-icon :name="item.icon" :size="item.icon_size"></base-icon>
            <span class="text">{{ item.title }}</span>
          </template>
          <MenuItem
            v-for="(ele, ids) in item.children"
            :key="'open-leaf-' + index + '-' + ids"
            :name="ele.name"
          >{{ ele.title }}</MenuItem>
        </Submenu>

        <!-- 展开 && 无子菜单 -->
        <MenuItem
          v-if="!isCollapsed && item.singlePage"
          :key="'open-item-' + index"
          :name="item.name"
        >
          <base-icon
            :name="item.icon"
            :size="item.icon_size"
            :color="item.name === activeName ? '#2d8cf0' : '#666'"
          />
          <span class="text">{{ item.title }}</span>
        </MenuItem>

        <!-- 收起 && 有子菜单 -->
        <Dropdown
          v-if="isCollapsed && !item.singlePage"
          :key="'col-sub-' + index"
          class="icon_wrapper"
          transfer-class-name="dropdown_box"
          @on-click="SelectNav"
          placement="right"
          trigger="hover"
        >
          <div class="icon_inner">
            <base-icon
              :name="item.icon"
              :size="item.size || 22"
              :color="item.name === activeName ? '#2d8cf0' : '#666'"
            />
          </div>
          <DropdownMenu slot="list">
            <DropdownItem
              v-for="(ele, ids) in item.children"
              :key="'col-leaf-' + index + '-' + ids"
              :name="ele.name"
              :selected="ele.name === activeName"
            >
              {{ ele.title }}
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>

        <!-- 收起 && 无子菜单 -->
        <Dropdown
          v-if="isCollapsed && item.singlePage"
          :key="'col-item-' + index"
          class="icon_wrapper"
          transfer-class-name="dropdown_box"
          @on-click="SelectNav"
          placement="right"
          trigger="hover"
        >
          <div class="icon_inner">
            <base-icon
              :name="item.icon"
              :size="item.size || 22"
              :color="item.name === activeName ? '#2d8cf0' : '#666'"
            />
          </div>
          <DropdownMenu slot="list">
            <DropdownItem
              :name="item.name"
              :selected="item.name === activeName"
            >
              {{ item.title }}
            </DropdownItem>
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
      activeName: ''
    };
  },
  computed: {
    collapsedProxy: {
      get() {
        return this.$store.state.isCollapsed;
      },
      set(v) {
        this.$store.commit('setCollapsed', v);
      }
    },
    isCollapsed() {
      return this.$store.state.isCollapsed;
    },
    submenuList() {
      return this.formatRoutesToMenu(router.options.routes[0].children || []);
    },
    menuStyle() {
      return {
        width: this.isCollapsed ? '65px' : '240px',
        height: 'calc(100% - 60px)',
        transition: 'width .2s'
      };
    }
  },
  created() {
    this.activeName = this.$route.name;
  },
  methods: {
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
    SelectNav(name) {
      this.activeName = name;
      this.$router.push({name}).catch(() => {
      });
    },
    logoBtn() {
      this.$router.push({path: '/'}).catch(() => {
      });
    }
  },
  watch: {
    isCollapsed() {
      this.$nextTick(() => {
        if (this.$refs.side_menu) {
          this.$refs.side_menu.updateOpened();
          this.$refs.side_menu.updateActiveName();
        }
      });
    },
    '$route.name'(val) {
      this.activeName = val;
    }
  }
};
</script>

<style lang="less" scoped>
.header_box {
  background: #fff;
  height: 100vh;
  transition: all .2s ease;

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

  .icon_wrapper {
    display: flex;
    justify-content: center;
    padding: 12px 0;
  }

  .icon_inner {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    cursor: pointer;
  }


  /deep/ .ivu-menu-item {
    display: flex;
    align-items: center;

    .text {
      margin-left: 10px;
    }
  }

  .dropdown_box {
    min-width: 140px;
  }
}
</style>
