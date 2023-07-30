<template>
  <div class="errorReport_box">
    <h1 class="title_box">{{systemTitle + '异常错误报告'}}</h1>
   <div class="content_box">
     <div class="errorReport_item_box" v-for="item in errorReportList">
       <h2 class="title">{{item.title}}</h2>
       <div class="content_item_box">
         <div class="options_box" v-if="optionskeyList.includes(item.paramsKey)">
           <Icon title="一键复制内容" size="20" class="copyIcon" type="md-copy" @click="copyContentBtn(item.paramsValue)" />
         </div>
         <div class="content" :class="item.paramsKey === 'errorReportingInterface' ? 'setSizeStyle': ''">
           {{item.paramsValue}}
         </div>
       </div>
     </div>
   </div>
  </div>
</template>

<script>

export default {
  name: "errorReport",
  data() {
    let v = this;
    return {
      systemTitle: '',
      errorReportList: [
        {title: '所在系统：', paramsKey: 'system', paramsValue: ''},
        {title: '系统环境：', paramsKey: 'systemEnvironment', paramsValue: ''},
        {title: '报错接口：', paramsKey: 'errorReportingInterface', paramsValue: ''},
        {title: '接口入參：', paramsKey: 'enteringGinseng', paramsValue: ''},
        {title: '报错信息：', paramsKey: 'errorMessage', paramsValue: ''},
      ],
      optionskeyList: ['enteringGinseng', 'errorReportingInterface', 'errorMessage'],
      systemObj:{
        yms:'运营系统',
        supplier:'供应商系统',
        distributor:'分销商系统',
        shopping:'商城',
        dev:'dev环境',
        test:'test环境',
        staging:'staging环境'
      }
    }
  },
  created() {
   this.getErrorData();
  },
  methods:{
    // 一键复制内容
    copyContentBtn(value) {
      if (value) {
        this.$tools.copyText(value)
        this.$Message.success('复制成功！');
      }
    },
    // 获取错误信息
    getErrorData() {
      let v= this;
      let id = v.$route.query.id;
      if (id) {
        const query = new v.$leancloud.Query("abnormalList");
        query.get(id).then((data) => {
          let obj =data.toJSON();
          if (Object.keys(obj).length >0) {
            v.errorReportList.map((item) => {
              for(let key in obj) {
                if (item.paramsKey === key) {
                  if (['system', 'systemEnvironment'].includes(key)) {
                    let val = obj[key]
                    if(key === 'system') {
                      v.systemTitle = v.systemObj[val];
                    }
                    item.paramsValue = v.systemObj[val];
                  } else {
                    item.paramsValue = obj[key];
                  }
                }
              }
            });
            v.$forceUpdate();
          }
        });
      }
    }
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
        font-size: 15px;
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
          background-color: #000000;
          color: #fff;
          padding: 15px;
          font-size: 15px;
          font-weight: normal;
        }
        .setSizeStyle {
          font-size: 17px;
        }
      }
    }
  }

}
</style>