<template>
  <div class="errorReport_box">
    <h1 class="title_box">{{ systemTitle }}</h1>
    <h2 class="text_box">{{ systemEnvironmentTitle + '异常错误报告'}}</h2>
    <div class="content_box">
      <div class="errorReport_item_box" v-for="item in errorReportList">
        <h2 class="title">{{ item.title }}</h2>
        <template v-if="optionskeyList.includes(item.paramsKey)">
          <div class="content_item_box">
            <div class="options_box">
              <Icon title="一键复制内容" size="20" class="copyIcon" type="md-copy" @click="copyContentBtn(item.paramsKey)"/>
            </div>
            <div class="content" v-if="item.paramsValue">
              <template v-if="item.isJSON">
                <jsonView :data="item.paramsValue" :deep="5" theme="vs-code" :font-size="16" :line-height="25"></jsonView>
              </template>
              <template v-else>
                <div class="content">
                  {{ item.paramsValue }}
                </div>
              </template>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="content_item_box">
            <div class="options_box" v-if="['errorReportingInterface'].includes(item.paramsKey)">
              <Icon title="一键复制内容" size="20" class="copyIcon" type="md-copy" @click="copyContentBtn(item.paramsKey)"/>
            </div>
            <div class="content" :class="item.paramsKey === 'errorReportingInterface' ? 'setSizeStyle': ''">
              <template v-if="'errorReportingInterface' === item.paramsKey">
                <Tag :color="handleStyle('color')" size="large" class="font-size-14 mr10">{{ handleStyle('text') }}</Tag>
                <span>{{ item.paramsValue }}</span>
              </template>
              <template v-else>
                {{ item.paramsValue }}
              </template>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import jsonView from 'vue-json-views'

export default {
  name: "errorReport",
  data() {
    let v = this;
    return {
      systemTitle: '',
      systemEnvironmentTitle: '',
      detailsInfo: {},
      errorReportList: [
        {title: '所在系统：', paramsKey: 'system', paramsValue: ''},
        {title: '系统环境：', paramsKey: 'systemEnvironment', paramsValue: ''},
        {title: '报错接口：', paramsKey: 'errorReportingInterface', paramsValue: ''},
        {title: '接口入參：', paramsKey: 'enteringGinseng', paramsValue: ''},
        {title: '报错信息：', paramsKey: 'errorMessage', paramsValue: ''},
      ],
      optionskeyList: ['enteringGinseng', 'errorMessage'],
      systemObj: {
        yms: 'yms-运营系统',
        supplier: 'yms-供应商系统',
        distributor: '分销商系统',
        shopping: '商城',

        vesYms: 'ves-运营系统',
        vesSupplier: 'ves-供应商系统',

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
      }
    }
  },
  created() {
    this.getErrorData();
  },
  methods: {
    // 处理样式
    handleStyle(type) {
      let text = '';
      if (Object.keys(this.detailsInfo).length > 0) {
        let tagObj = {
          post: {
            color: 'success',
            text: 'POST'
          },
          get: {
            color: 'primary',
            text: 'GET'
          },
          put: {
            color: 'warning',
            text: 'PUT'
          },
          delete: {
            color: 'error',
            text: 'DELETE'
          },
        }
        if (type === 'color') {
          text = tagObj[this.detailsInfo.method].color || '';
        } else {
          text = tagObj[this.detailsInfo.method].text || '';
        }
      }
      return text;
    },
    // 一键复制内容
    copyContentBtn(type) {
      let val = '';
      if (type === 'errorReportingInterface') {
        val = this.detailsInfo[type];
      } else {
        val = this.detailsInfo[type];
      }
      this.$tools.copyText(val)
      this.$Message.success('复制成功！');
    },
    // 获取错误信息
    getErrorData() {
      let v = this;
      let id = v.$route.query.id;
      if (id) {
        const query = new v.$leancloud.Query("abnormalList");
        query.get(id).then((data) => {
          let obj = data.toJSON();
          v.detailsInfo = JSON.parse(JSON.stringify(obj));
          if (Object.keys(obj).length > 0) {
            v.errorReportList.map((item) => {
              for (let key in obj) {
                if (item.paramsKey === key) {
                  if (['system', 'systemEnvironment'].includes(key)) {
                    let val = obj[key]
                    if (key === 'system') {
                      v.systemTitle = v.systemObj[val];
                    }
                    if (key === 'systemEnvironment') {
                      v.systemEnvironmentTitle = v.systemObj[val];
                    }
                    item.paramsValue = v.systemObj[val];
                  } else {
                    if (v.$tools.isJSON(obj[key])) {
                      item.paramsValue = JSON.parse(obj[key]);
                      item.isJSON = true;
                    } else {
                      item.paramsValue = obj[key];
                    }
                  }
                }
              }
            });
            v.$forceUpdate();
          }
        });
      }
    }
  },
  components: {
    jsonView
  }
}
</script>

<style lang="less" scoped>
.errorReport_box {
  width: 100%;
  height: 100vh;
  background-color: #F7F7F8;

  .title_box {
    width: 100%;
    font-size: 24px;
    font-weight: bold;
    color: #333;
    padding: 20px 0;
    text-align: center;
  }

  .text_box {
    width: 100%;
    font-size: 20px;
    font-weight: bold;
    color: #333;
    padding: 10px 0;
    text-align: center;
  }

  .content_box {
    width: 1500px;
    padding: 20px;
    margin: 0 auto;
    box-sizing: border-box;

    .errorReport_item_box {
      width: 100%;
      display: flex;
      align-items: flex-start;
      margin-bottom: 24px;

      .title {
        text-align: right;
        width: 100px;
        font-size: 17px;
        color: #000;
        font-weight: bold;
      }

      .content_item_box {
        flex: 1;
        overflow: hidden;
        border-radius: 5px;
        overflow: hidden;

        .options_box {
          width: 100%;
          height: 32px;
          background-color: #343541;
          padding: 0 20px;
          box-sizing: border-box;
          display: flex;
          justify-content: flex-end;
          align-items: center;

          .copyIcon {
            font-size: 20px;
            cursor: pointer;
            color: #fff;
          }
        }

        .content {
          width: 100%;
          background-color: #1e1e1e;
          color: #fff;
          padding: 15px;
          font-size: 15px;
          font-weight: normal;
          word-wrap: break-word;
          word-break: break-all;

          ///deep/ .json-view-container {
          //  background-color: transparent;
          //}
        }

        .setSizeStyle {
          font-size: 17px;
        }
      }
    }
  }

}
</style>