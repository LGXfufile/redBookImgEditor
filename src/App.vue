<template>
  <div id="app">
    <header class="app-header">
      <h1>图创 - 智能图文编辑器</h1>
    </header>
    <main class="editor-container">
      <!-- 左侧控制面板 -->
      <div class="editor-panel">
        <TextEditor />
      </div>
      <!-- 右侧画布区域 -->
      <div class="canvas-panel">
        <div class="canvas-wrapper">
          <div class="canvas-border">
            <canvas id="canvas" width="1242" height="1660"></canvas>
          </div>
        </div>
        <div class="download-bar">
          <button class="download-btn" @click="downloadImage">
            <span class="icon">⬇️</span>
            保存图片
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import TextEditor from './components/TextEditor.vue'

export default {
  name: 'App',
  components: {
    TextEditor
  },
  methods: {
    async downloadImage() {
      try {
        const canvas = document.getElementById('canvas');
        const link = document.createElement('a');
        const dataUrl = canvas.toDataURL('image/png');
        link.download = `图创_${new Date().getTime()}.png`;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error('下载失败:', error);
        alert('图片下载失败，请重试');
      }
    }
  }
}
</script>

<style>
/* 重置样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #f5f5f5;
  overflow: hidden;
}

#app {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  height: 60px;
  padding: 0 24px;
  background: white;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.app-header h1 {
  font-size: 20px;
  color: #2c3e50;
  font-weight: 600;
}

.editor-container {
  flex: 1;
  min-height: 0;
  padding: 20px;
  display: flex;
  gap: 20px;
}

.editor-panel {
  width: 360px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.canvas-panel {
  flex: 1;
  min-width: 0;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 100px);
}

.canvas-wrapper {
  flex: 1;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 0;
  overflow: hidden;
  background-color: #f5f5f5;
}

.canvas-border {
  padding: 12px;
  background: white;
  border: 1px solid #e4e7ed;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  position: relative;
  width: min(100%, calc((100vh - 180px) * 0.75));
  aspect-ratio: 3/4;
  display: flex;
  align-items: center;
  justify-content: center;
}

canvas {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
  border: 1px solid #dcdfe6;
  image-rendering: -webkit-optimize-contrast;
  image-rendering: crisp-edges;
}

.download-bar {
  padding: 16px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: center;
}

.download-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: #409eff;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.download-btn:hover {
  background: #66b1ff;
  transform: translateY(-1px);
}

.download-btn:active {
  transform: translateY(0);
}

.icon {
  font-size: 18px;
}

/* 适配小屏幕 */
@media (max-height: 768px) {
  .app-header {
    height: 50px;
  }
  
  .app-header h1 {
    font-size: 18px;
  }
  
  .editor-container {
    padding: 12px;
    gap: 12px;
  }
  
  .editor-panel {
    width: 320px;
  }
  
  .canvas-wrapper {
    padding: 12px;
  }
  
  canvas {
    max-height: calc(100vh - 160px);
  }
  
  .canvas-border {
    padding: 8px;
  }
}

/* 防止 Vue DevTools 影响布局 */
.__vuedevtools_frame__ {
  position: fixed !important;
  z-index: 9999999 !important;
}

/* 添加响应式布局支持 */
@media (max-width: 1280px) {
  .editor-panel {
    width: 320px;
  }
  
  .canvas-wrapper {
    padding: 12px;
  }
}

/* 适配小屏幕 */
@media (max-height: 768px) {
  .canvas-border {
    width: min(100%, calc((100vh - 140px) * 0.75));
  }
}

/* 适配宽屏 */
@media (min-width: 1440px) {
  .canvas-panel {
    max-width: calc(100vh * 0.75);
    margin: 0 auto;
  }
}
</style>
