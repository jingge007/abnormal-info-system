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
}

const browserUtils = new Browser();
export default browserUtils;