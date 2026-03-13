<template>
  <div class="container_box">
    <div class="flex justify-between mb-4">
      <div class="search-box">
        <Input
          v-model="searchParams.system"
          placeholder="请输入系统名称搜索..."
          style="width: 200px; margin-right: 10px;"
        />
        <Select
          v-model="searchParams.systemEnvironment"
          placeholder="选择系统环境"
          style="width: 150px; margin-right: 10px;"
        >
          <Option value="">全部环境</Option>
          <Option v-for="item in systemEnvironmentList" :key="item.value" :value="item.value">{{ item.name }}</Option>
        </Select>
        <Button type="primary" @click="handleSearch" style="margin-left: 10px;">搜索</Button>
        <Button @click="resetSearch" style="margin-left: 10px;">重置</Button>
      </div>
      <div class="actions">
        <Button type="error" @click="batchDelete" :disabled="selectedRows.length === 0">批量删除</Button>
      </div>
    </div>
    <Table
      :columns="columns"
      :data="reportList"
      @on-selection-change="handleSelectionChange"
      border
      ref="table"
    >
      <template #action="{ row }">
        <Button size="small" @click="viewDetails(row)">查看详情</Button>
        <Button size="small" @click="copyDetailUrl(row)" style="margin-left: 8px;">复制地址</Button>
        <Button size="small" type="error" @click="deleteItem(row)" style="margin-left: 8px;">删除</Button>
      </template>
    </Table>

    <Page
      :total="total"
      :page-size="pageSize"
      :current="currentPage"
      @on-change="handlePageChange"
      @on-page-size-change="handlePageSizeChange"
      show-sizer
      show-elevator
      show-total
      style="margin-top: 20px; text-align: right;"
    />
  </div>
</template>

<script>
import { abnormalReportAPI } from '@/utils/api'
import Browser from '@/utils/tools.js'

export default {
  name: 'abnormalReportList',
  data() {
    return {
      reportList: [], // 异常报告列表数据
      selectedRows: [], // 选中的行
      searchParams: {
        system: '',
        systemEnvironment: ''
      },
      total: 0, // 总数
      pageSize: 20, // 每页条数
      currentPage: 1, // 当前页码
      systemEnvironmentList: [
        {name: 'dev环境', value: 'dev'},
        {name: 'test环境', value: 'test'},
        {name: 'uat环境', value: 'uat'},
        {name: 'staging环境', value: 'staging'}
      ],
      systemObj: {
        yms: 'YMS-运营系统',
        supplier: 'YMS-供应商系统',
        distributor: 'YMS-分销商系统',
        shopping: 'YMS-商城',
        vesYms: 'VES-运营系统',
        vesSupplier: 'VES-供应商系统',
        'tongTool-setting': 'ERP3.0-设置中心',
        'tongTool-pds': 'ERP3.0-新品开发系统',
        'tongTool-order': 'ERP3.0-订单处理系统',
        'tongTool-product': 'ERP3.0-商品管理系统',
        'tongTool-sps': 'ERP3.0-供应商采购系统',
        'tongTool-cs': 'ERP3.0-客服管理系统',
        'tongTool-wms': 'ERP3.0-仓储管理系统',
        'tongTool-data-center': 'ERP3.0-数据中心',
        dev: '开发环境',
        test: '测试环境',
        uat: 'uat环境',
        staging: '生产环境'
      },
      // 表格列配置
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: 'ID',
          key: 'exceptionReportId',
          minWidth: 130
        },
        {
          title: '所在系统',
          key: 'system',
          minWidth: 150,
          render: (h, params) => {
            return h('span', this.systemObj[params.row.system] || params.row.system)
          }
        },
        {
          title: '系统环境',
          key: 'systemEnvironment',
          minWidth: 100,
          render: (h, params) => {
            return h('span', this.systemObj[params.row.systemEnvironment] || params.row.systemEnvironment)
          }
        },
        {
          title: '报错接口',
          key: 'errorReportingInterface',
          minWidth: 300
        },
        {
          title: '请求方式',
          key: 'method',
          minWidth: 80
        },
        {
          title: '创建时间',
          key: 'createdAt',
          minWidth: 140
        },
        {
          title: '操作',
          slot: 'action',
          minWidth: 200,
          align: 'center'
        }
      ]
    }
  },
  mounted() {
    this.fetchReportList()
  },
  methods: {
    // 获取异常报告列表数据
    async fetchReportList() {
      try {
        const response = await abnormalReportAPI.getReportList({
          page: this.currentPage,
          pageSize: this.pageSize,
          ...this.searchParams
        })

        this.total = response.data.total
        this.reportList = response.data.list.map(item => {
          return {
            ...item,
            createdAt: Browser.formatDate(new Date(item.createdAt))
          }
        })
      } catch (error) {
        this.$Message.error('获取数据失败: ' + error.message)
      }
    },

    // 处理表格选择变化
    handleSelectionChange(selection) {
      this.selectedRows = selection
    },

    // 查看详情
    viewDetails(row) {
      const routeData = this.$router.resolve({
        name: 'errorReport',
        query: {id: row.exceptionReportId}
      });
      window.open(routeData.href, '_blank');
    },

    // 删除单个项目
    deleteItem(row) {
      this.$Modal.confirm({
        title: '确认删除',
        content: '确定要删除这条记录吗？',
        onOk: async () => {
          try {
            await abnormalReportAPI.deleteReport(row.exceptionReportId)
            this.$Message.success('删除成功')
            this.fetchReportList() // 重新获取列表数据
          } catch (error) {
            this.$Message.error('删除失败: ' + error.message)
          }
        }
      })
    },

    // 批量删除
    batchDelete() {
      this.$Modal.confirm({
        title: '确认删除',
        content: `确定要删除选中的${this.selectedRows.length}条记录吗？`,
        onOk: async () => {
          try {
            // 批量删除记录
            const exceptionReportIds = this.selectedRows.map(row => row.exceptionReportId);
            await abnormalReportAPI.batchDeleteReport(exceptionReportIds);
            this.$Message.success('批量删除成功');
            this.fetchReportList(); // 重新获取列表数据
          } catch (error) {
            this.$Message.error('批量删除失败: ' + error.message);
          }
        }
      })
    },

    // 处理页码变化
    handlePageChange(page) {
      this.currentPage = page
      this.fetchReportList()
    },

    // 处理页面大小变化
    handlePageSizeChange(pageSize) {
      this.pageSize = pageSize
      this.currentPage = 1
      this.fetchReportList()
    },

    // 处理搜索
    handleSearch() {
      this.currentPage = 1
      this.fetchReportList()
    },

    // 重置搜索
    resetSearch() {
      this.searchParams = {
        system: '',
        systemEnvironment: ''
      }
      this.currentPage = 1
      this.fetchReportList()
    },

    // 复制详情地址
    async copyDetailUrl(row) {
      try {
        const routeData = this.$router.resolve({
          name: 'errorReport',
          query: {id: row.exceptionReportId}
        });
        // 生成完整的URL，包括协议、域名和端口
        const baseUrl = window.location.origin;
        const detailUrl = `${baseUrl}${routeData.href}`;
        await Browser.copyText(detailUrl);
        this.$Message.success('地址复制成功');
      } catch (error) {
        this.$Message.error('复制失败: ' + error.message);
      }
    }
  }
}
</script>

<style lang="less" scoped>
.container_box {
  padding: 20px;
}

.search-box {
  margin-bottom: 20px;
}

.actions {
  display: flex;
  gap: 10px;
}

.ivu-table {
  height: 600px;
  overflow: auto;
}

.ivu-table-header {
  position: sticky;
  top: 0;
  z-index: 1;
  background: #fff;
}
</style>