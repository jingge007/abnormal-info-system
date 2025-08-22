import Prism from 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'
// 引入常用语言支持
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-java'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-markup'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-sql'

// 高亮代码的通用函数
export function highlightCode(container) {
  if (container) {
    // 查找所有 pre code 元素
    const codeBlocks = container.querySelectorAll('pre code');
    codeBlocks.forEach((block) => {
      // 如果没有指定语言，尝试自动检测或使用默认语言
      if (!block.className || block.className === '') {
        // 尝试从父元素 pre 获取语言信息
        const pre = block.parentElement;
        if (pre && pre.className && pre.className.includes('language-')) {
          // 从 pre 元素获取语言
          const langMatch = pre.className.match(/language-(\w+)/);
          if (langMatch) {
            block.className = `language-${langMatch[1]}`;
          } else {
            block.className = 'language-javascript';
          }
        } else {
          // 默认使用 javascript
          block.className = 'language-javascript';
        }
      }
      
      // 高亮代码块
      Prism.highlightElement(block);
    });
  }
}

export default Prism
