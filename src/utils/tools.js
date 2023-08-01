class Browser {
  /**
   * @Description: 复制
   * @params: value 复制内容
   */
  copyText (value) {
    return new Promise(resolve => {
      let oInput = document.createElement('input');
      oInput.value = value;
      document.body.appendChild(oInput);
      oInput.select();
      window.document.execCommand('Copy');
      oInput.remove();
      resolve();
    });
  }

  /**
   * @Description: 判断当前字符串是否是json格式数据
   * @author jing
   * @date 2023/8/1 10:36
   * @params:
   */
  isJSON(str) {
    if (typeof str == 'string') {
      try {
        var obj = JSON.parse(str);
        if (typeof obj == 'object' && obj) {
          return true;
        } else {
          return false;
        }
      } catch (e) {
        return false;
      }
    }
  }
}

const browserUtils = new Browser();
export default browserUtils;