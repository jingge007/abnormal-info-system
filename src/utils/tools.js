// tool.js
class Browser {
  /**
   * 复制文本到剪贴板
   * @param {string} value - 要复制的内容
   * @returns {Promise<void>}
   */
  copyText(value) {
    return navigator.clipboard
      ? navigator.clipboard.writeText(value)
      : new Promise((resolve, reject) => {
        try {
          const input = document.createElement('input');
          input.value = value;
          document.body.appendChild(input);
          input.select();
          document.execCommand('copy');
          input.remove();
          resolve();
        } catch (err) {
          reject(err);
        }
      });
  }
  
  /**
   * 判断是否为 JSON 字符串
   * @param {string} str
   * @returns {boolean}
   */
  isJSON(str) {
    if (typeof str !== 'string') return false;
    try {
      const obj = JSON.parse(str);
      return obj && typeof obj === 'object';
    } catch {
      return false;
    }
  }
}

export default new Browser();
