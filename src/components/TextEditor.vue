<template>
  <div class="text-editor">
    <div class="control-panel">
      <!-- 文本输入区 -->
      <div class="section">
        <h3>文本编辑</h3>
        <div class="control-group">
          <textarea 
            v-model="currentText"
            placeholder="请输入文字"
            @input="drawText"
          ></textarea>
          <div class="text-actions">
            <button class="btn primary" @click="addTextBlock">添加文本块</button>
            <button class="btn delete" @click="deleteText">删除</button>
          </div>
        </div>
      </div>

      <!-- 文本样式 -->
      <div class="section">
        <h3>文本样式</h3>
        <div class="control-group">
          <div class="control-item">
            <label>对齐方式：</label>
            <div class="align-buttons">
              <button 
                v-for="align in alignments" 
                :key="align.value"
                class="btn align-btn"
                :class="{ active: textAlign === align.value }"
                @click="setAlign(align.value)"
              >
                {{ align.icon }}
              </button>
            </div>
          </div>

          <div class="control-item">
            <label>字体：</label>
            <select v-model="fontFamily" @change="drawText" class="select-style">
              <option value="微软雅黑">微软雅黑</option>
              <option value="SimHei">黑体</option>
              <option value="SimSun">宋体</option>
            </select>
          </div>

          <div class="control-item">
            <label>字号：</label>
            <div class="slider-container">
              <input 
                type="range" 
                v-model.number="fontSize"
                min="12"
                max="72"
                @input="handleFontSizeChange"
              >
              <span class="slider-value">{{ fontSize }}px</span>
            </div>
          </div>

          <div class="control-item">
            <label>文字颜色：</label>
            <input type="color" v-model="textColor" @input="drawText" class="color-picker">
          </div>
        </div>
      </div>

      <!-- 模板设置 -->
      <div class="section">
        <h3>模板设置</h3>
        <div class="control-group">
          <div class="template-buttons">
            <button 
              v-for="template in templates" 
              :key="template.name"
              :class="['btn template-btn', { active: currentTemplate === template.name }]"
              @click="selectTemplate(template.name)"
            >
              {{ template.label }}
            </button>
          </div>
        </div>
      </div>

      <!-- 效果调整 -->
      <div class="section">
        <h3>效果调整</h3>
        <div class="control-group">
          <div class="control-item">
            <label>背景类型：</label>
            <select v-model="backgroundType" @change="updateBackground" class="select-style">
              <option value="pure">纯色</option>
              <option value="gradient">渐变</option>
            </select>
          </div>

          <div class="control-item" v-if="backgroundType === 'gradient'">
            <label>渐变颜色：</label>
            <div class="gradient-colors">
              <input 
                type="color" 
                v-model="gradientColors.start" 
                @input="updateBackground"
                class="color-picker"
              >
              <span>至</span>
              <input 
                type="color" 
                v-model="gradientColors.end" 
                @input="updateBackground"
                class="color-picker"
              >
            </div>
          </div>

          <div class="control-item">
            <label>滤镜效果：</label>
            <select v-model="filter" @change="applyFilter" class="select-style">
              <option value="none">无</option>
              <option value="contrast">对比度</option>
              <option value="brightness">亮度</option>
            </select>
          </div>

          <div class="control-item">
            <label>垂直位置：</label>
            <div class="slider-container">
              <input 
                type="range" 
                v-model="verticalOffset"
                min="-100"
                max="100"
                step="1"
                @input="handleVerticalOffsetChange"
              >
              <span class="slider-value">{{ verticalOffset }}px</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentText: '',
      verticalOffset: 0,
      canvas: null,
      ctx: null,
      fontSize: 32,
      fontFamily: '微软雅黑',
      textColor: '#000000',
      currentTemplate: 'simple',
      backgroundType: 'pure',
      filter: 'none',
      templates: [
        { name: 'simple', label: '简约风格' },
        { name: 'classic', label: '复古风格' },
        { name: 'modern', label: '现代风格' }
      ],
      alignments: [
        { value: 'left', icon: '⬅️' },
        { value: 'center', icon: '↔️' },
        { value: 'right', icon: '➡️' }
      ],
      textAlign: 'center',
      gradientColors: {
        start: '#ffffff',
        end: '#f0f0f0'
      },
    }
  },
  mounted() {
    this.canvas = document.querySelector('#canvas');
    this.ctx = this.canvas.getContext('2d');
    this.initCanvas();
  },
  methods: {
    initCanvas() {
      if (!this.canvas || !this.ctx) return;
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.drawText();
    },
    drawText() {
      if (!this.canvas || !this.ctx) return;
      
      // 完全清除画布
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      
      // 如果是渐变背景，重新绘制背景
      if (this.backgroundType === 'gradient') {
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, this.gradientColors.start);
        gradient.addColorStop(1, this.gradientColors.end);
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      } else {
        // 纯色背景
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      }
      
      // 设置文字样式
      this.ctx.font = `${this.fontSize}px ${this.fontFamily}`;
      this.ctx.fillStyle = this.textColor;
      this.ctx.textAlign = this.textAlign;
      this.ctx.textBaseline = 'middle';
      
      // 计算文字位置
      let x;
      switch(this.textAlign) {
        case 'left':
          x = 50;
          break;
        case 'right':
          x = this.canvas.width - 50;
          break;
        default:
          x = this.canvas.width / 2;
      }
      
      const y = this.canvas.height / 2 + parseInt(this.verticalOffset);
      
      // 绘制文本
      this.ctx.fillText(this.currentText || '测试文字', x, y);
    },
    handleVerticalOffsetChange(event) {
      this.verticalOffset = parseInt(event.target.value);
      this.drawText();
    },
    setAlign(align) {
      if (!this.ctx) return;
      this.textAlign = align;
      this.ctx.textAlign = align;
      
      let x;
      switch(align) {
        case 'left':
          x = 50;
          break;
        case 'right':
          x = this.canvas.width - 50;
          break;
        default:
          x = this.canvas.width / 2;
      }
      
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.font = `${this.fontSize}px ${this.fontFamily}`;
      this.ctx.fillStyle = this.textColor;
      const y = this.canvas.height / 2 + parseInt(this.verticalOffset);
      this.ctx.fillText(this.currentText || '测试文字', x, y);
    },
    addTextBlock() {
      // 添加新文本块的逻辑
      this.currentText = '';
      this.drawText();
    },
    deleteText() {
      this.currentText = '';
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    selectTemplate(templateName) {
      this.currentTemplate = templateName;
      // 应用模板样式
      this.applyTemplateStyle(templateName);
    },
    applyTemplateStyle(templateName) {
      // 根据模板名称应用相应的样式
      switch(templateName) {
        case 'simple':
          this.fontSize = 32;
          this.textColor = '#000000';
          break;
        case 'classic':
          this.fontSize = 28;
          this.textColor = '#4A4A4A';
          break;
        case 'modern':
          this.fontSize = 36;
          this.textColor = '#2C3E50';
          break;
      }
      this.drawText();
    },
    updateBackground() {
      if (!this.canvas || !this.ctx) return;
      
      // 清除画布
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      
      if (this.backgroundType === 'gradient') {
        // 创建渐变
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, this.gradientColors.start);
        gradient.addColorStop(1, this.gradientColors.end);
        
        // 填充渐变背景
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      } else {
        // 纯色背景
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      }
      
      // 重新绘制文本
      this.drawText();
    },
    applyFilter() {
      // 应用滤镜效果
      this.drawText();
    },
    handleFontSizeChange(event) {
      this.fontSize = parseInt(event.target.value);
      this.drawText(); // 重新绘制整个画布
    }
  },
  watch: {
    backgroundType: {
      handler(newValue) {
        this.updateBackground();
      }
    }
  }
}
</script>

<style scoped>
.text-editor {
  height: 100%; /* 填充父容器高度 */
  display: flex;
  flex-direction: column;
}

.control-panel {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
}

.section {
  margin-bottom: 28px;
}

.section:last-child {
  margin-bottom: 0;
}

h3 {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 16px 0;
  padding-bottom: 8px;
  border-bottom: 1px solid #eee;
}

.control-group {
  padding: 0 4px;
}

.control-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.control-item:last-child {
  margin-bottom: 0;
}

textarea {
  width: 100%;
  height: 80px;
  padding: 12px;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  resize: vertical;
  margin-bottom: 12px;
  font-size: 14px;
}

.text-actions {
  display: flex;
  gap: 12px;
}

.btn-group {
  display: flex;
  gap: 4px;
}

.btn {
  padding: 8px 16px;
  border: 1px solid #dcdfe6;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
}

.btn.primary {
  background: #409eff;
  color: white;
  border-color: #409eff;
}

.btn.delete {
  background: #f56c6c;
  color: white;
  border-color: #f56c6c;
}

.icon-btn {
  padding: 6px 12px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.template-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
  gap: 8px;
}

.template-btn {
  text-align: center;
}

.select-style {
  flex: 1;
  padding: 8px;
  border: 1px solid #e4e7ed;
  border-radius: 6px;
  font-size: 14px;
}

.slider-container {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
}

input[type="range"] {
  flex: 1;
}

.slider-value {
  min-width: 48px;
  font-size: 14px;
  color: #606266;
}

.color-picker {
  width: 80px;
  height: 32px;
  padding: 2px;
  border: 1px solid #e4e7ed;
  border-radius: 6px;
  cursor: pointer;
}

label {
  min-width: 70px;
  font-size: 14px;
  color: #606266;
  white-space: nowrap;
}

::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-thumb {
  background: #ddd;
  border-radius: 3px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

.btn:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.btn:active {
  transform: translateY(0);
}

textarea:focus,
select:focus,
input:focus {
  outline: none;
  border-color: #409eff;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.1);
}

.btn.icon-btn.active {
  background: #409eff;
  color: white;
  border-color: #409eff;
}

.align-buttons {
  display: flex;
  gap: 4px;
  flex-shrink: 0;
}

.align-btn {
  width: 40px;
  height: 32px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
}

.align-btn.active {
  background: #409eff;
  color: white;
  border-color: #409eff;
}

.align-btn:hover {
  background: #f5f7fa;
}

.align-btn.active:hover {
  background: #66b1ff;
}

.gradient-colors {
  display: flex;
  align-items: center;
  gap: 8px;
}

.gradient-colors .color-picker {
  width: 60px;
  height: 28px;
}
</style> 