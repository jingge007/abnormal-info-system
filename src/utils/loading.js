// loading 管理

// 配置全局 loading 有遮罩层，防止误操作

// 添加旋转动画样式
const styleElement = document.createElement('style');
styleElement.textContent = `
  @keyframes loading-spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  .loading-icon-spin {
    display: inline-block;
    animation: loading-spin 1s infinite linear;
  }
`;
if (!document.head.querySelector('#loading-styles')) {
  styleElement.id = 'loading-styles';
  document.head.appendChild(styleElement);
}

export function startLoading(text) {
  // 创建一个全局遮罩层元素
  const mask = document.createElement('div');
  mask.id = 'loading-mask';
  mask.style.position = 'fixed';
  mask.style.top = '0';
  mask.style.left = '0';
  mask.style.width = '100%';
  mask.style.height = '100%';
  mask.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
  mask.style.zIndex = '9998';
  mask.style.display = 'flex';
  mask.style.justifyContent = 'center';
  mask.style.alignItems = 'center';
  
  // 创建 loading 内容容器
  const loadingContainer = document.createElement('div');
  loadingContainer.style.backgroundColor = '#fff';
  loadingContainer.style.padding = '32px 30px';
  loadingContainer.style.borderRadius = '12px';
  loadingContainer.style.textAlign = 'center';
  loadingContainer.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
  
  // 创建 loading 图标
  const icon = document.createElement('i');
  icon.className = 'ivu-icon ivu-icon-ios-loading loading-icon-spin';
  icon.style.fontSize = '28px';
  icon.style.color = '#2D8CF0';
  icon.style.display = 'inline-block';
  
  // 创建 loading 文本
  const textElement = document.createElement('div');
  textElement.style.marginTop = '5px';
  textElement.style.fontSize = '17px';
  textElement.style.color = '#2D8CF0';
  textElement.textContent = text || '加载中...';
  
  // 组装元素
  loadingContainer.appendChild(icon);
  loadingContainer.appendChild(textElement);
  mask.appendChild(loadingContainer);
  
  // 保存 mask 元素引用，用于后续移除
  if (window.loadingMask) {
    document.body.removeChild(window.loadingMask);
  }
  window.loadingMask = mask;
  
  // 添加到 body
  document.body.appendChild(mask);
}

export function endLoading() {
  return new Promise(resolve => {
    // 添加一个小延迟，确保动画效果能够显示
    setTimeout(() => {
      // 移除遮罩层
      if (window.loadingMask && document.body.contains(window.loadingMask)) {
        document.body.removeChild(window.loadingMask);
        window.loadingMask = null;
      }
      resolve(true);
    }, 300);
  });
}

/* ====== 新接口 + scope 自动管理 ====== */
const loadingMap = Object.create(null);

// 显示 loading（兼容旧调用）
export function showLoading(text = '加载中...', scope = 'global') {
  if (!loadingMap[scope]) loadingMap[scope] = 0;
  if (loadingMap[scope] === 0) {
    startLoading(text);
  }
  loadingMap[scope]++;
}

// 隐藏 loading（兼容旧调用）
export function hideLoading(scope = 'global', status = 200) {
  if (typeof scope === 'number') {
    status = scope;
    scope = 'global';
  }
  if (!loadingMap[scope]) return;
  loadingMap[scope]--;
  if (loadingMap[scope] <= 0) {
    delete loadingMap[scope];
    // 只有 504 或 500 才显示请求异常
    if (status === 504 || status === 500) {
      // 这里可以添加错误提示，暂时使用console.log
      console.error(status === 504 ? '请求超时' : '服务器错误');
    }
    endLoading();
  }
}

/**
 * 检查是否有loading正在显示
 * @returns {boolean}
 */
export function isLoading() {
  return Object.keys(loadingMap).length > 0;
}

/**
 * 强制清理所有 loading（路由切换/取消请求）
 */
export function clearAllLoading() {
  Object.keys(loadingMap).forEach(k => delete loadingMap[k]);
  // 移除遮罩层
  if (window.loadingMask && document.body.contains(window.loadingMask)) {
    document.body.removeChild(window.loadingMask);
    window.loadingMask = null;
  }
}
