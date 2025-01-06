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
            @input="handleTextInput"
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
            <select v-model="fontFamily" @change="handleFontChange" class="select-style">
              <option value="微软雅黑">微软雅黑</option>
              <option value="宋体">宋体</option>
              <option value="黑体">黑体</option>
              <option value="楷体">楷体</option>
              <option value="仿宋">仿宋</option>
              <option value="华文行楷">行楷</option>
              <option value="华文隶书">隶书</option>
              <option value="方正舒体">舒体</option>
              <option value="方正姚体">姚体</option>
              <option value="华文新魏">新魏</option>
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

          <div class="control-item">
            <label>字体样式：</label>
            <div class="style-buttons">
              <button 
                class="btn style-btn"
                :class="{ active: isBold }"
                @click="toggleBold"
                title="加粗"
              >
                B
              </button>
            </div>
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

      <!-- 文本块列表 -->
      <div class="section">
        <h3>文本块列表</h3>
        <div class="text-blocks-list">
          <div 
            v-for="(block, index) in textBlocks" 
            :key="index"
            class="text-block-item"
            :class="{ active: selectedBlockIndex === index }"
            @click="selectBlock(index)"
          >
            <span class="block-preview">{{ block.text || '文本块' + (index + 1) }}</span>
          </div>
        </div>
        <div class="text-actions">
          <button 
            class="btn primary" 
            @click="addTextBlock"
            :disabled="textBlocks.length >= maxTextBlocks"
          >
            添加文本块
          </button>
          <button 
            class="btn delete" 
            @click="deleteText"
            :disabled="selectedBlockIndex === -1 && !currentText"
          >
            删除
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentText: '测试文字',
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
      fontMap: {
        '微软雅黑': 'Microsoft YaHei',
        '宋体': 'SimSun',
        '黑体': 'SimHei',
        '楷体': 'KaiTi',
        '仿宋': 'FangSong',
        '华文行楷': 'STXingkai',
        '华文隶书': 'STLiti',
        '方正舒体': 'FZShuTi',
        '方正姚体': 'FZYaoti',
        '华文新魏': 'STXinwei'
      },
      textBlocks: [],
      maxTextBlocks: 3,
      selectedBlockIndex: -1,
      isBold: false
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
      
      this.ctx.fillStyle = '#ffffff';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      
      this.ctx.textAlign = this.textAlign;
      this.ctx.textBaseline = 'middle';
      
      this.$nextTick(() => {
        this.drawText();
      });
    },
    drawText() {
      if (!this.canvas || !this.ctx) return;
      
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      
      this.drawBackground();
      
      const fontFamilyName = this.fontMap[this.fontFamily] || this.fontFamily;
      const fontWeight = this.isBold ? 'bold' : 'normal';
      this.ctx.font = `${fontWeight} ${this.fontSize}px "${fontFamilyName}"`;
      this.ctx.fillStyle = this.textColor;
      this.ctx.textAlign = this.textAlign;
      this.ctx.textBaseline = 'middle';
      
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
      
      if (this.selectedBlockIndex !== -1) {
        const block = this.textBlocks[this.selectedBlockIndex];
        this.ctx.fillText(block.text || '测试文字', x, y);
      } else {
        this.ctx.fillText(this.currentText || '测试文字', x, y);
      }
      
      if (this.textBlocks.length > 0) {
        this.textBlocks.forEach((block, index) => {
          if (index !== this.selectedBlockIndex) {
            this.drawSingleBlock(block, index);
          }
        });
      }
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
      if (this.textBlocks.length >= this.maxTextBlocks) {
        alert('最多只能添加3个文本块');
        return;
      }
      
      const newBlock = {
        text: this.currentText || '新文本块',
        fontSize: this.fontSize,
        fontFamily: this.fontFamily,
        textColor: this.textColor,
        textAlign: this.textAlign,
        verticalOffset: this.verticalOffset,
        isBold: this.isBold
      };
      
      this.textBlocks.push(newBlock);
      this.selectedBlockIndex = this.textBlocks.length - 1;
      this.currentText = '';
      this.drawAllBlocks();
    },
    deleteText() {
      if (this.selectedBlockIndex !== -1) {
        this.textBlocks.splice(this.selectedBlockIndex, 1);
        this.selectedBlockIndex = -1;
        this.currentText = '';
        this.drawAllBlocks();
      } else {
        this.currentText = '';
        this.drawText();
      }
    },
    selectTemplate(templateName) {
      this.currentTemplate = templateName;
      this.applyTemplateStyle(templateName);
    },
    applyTemplateStyle(templateName) {
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
      
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      
      if (this.backgroundType === 'gradient') {
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, this.gradientColors.start);
        gradient.addColorStop(1, this.gradientColors.end);
        
        this.ctx.fillStyle = gradient;
      } else {
        this.ctx.fillStyle = '#ffffff';
      }
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      
      this.drawText();
    },
    applyFilter() {
      this.drawText();
    },
    handleFontSizeChange(event) {
      this.fontSize = parseInt(event.target.value);
      this.drawText();
    },
    handleFontChange(event) {
      const selectedFont = event.target.value;
      this.fontFamily = selectedFont;
      
      document.fonts.ready.then(() => {
        this.drawText();
      });
    },
    selectBlock(index) {
      this.selectedBlockIndex = index;
      const block = this.textBlocks[index];
      this.currentText = block.text;
      this.fontSize = block.fontSize;
      this.fontFamily = block.fontFamily;
      this.textColor = block.textColor;
      this.textAlign = block.textAlign;
      this.verticalOffset = block.verticalOffset;
      this.isBold = block.isBold || false;
    },
    drawAllBlocks() {
      if (!this.canvas || !this.ctx) return;
      
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      
      this.drawBackground();
      
      this.textBlocks.forEach((block, index) => {
        this.drawSingleBlock(block, index);
      });
    },
    drawSingleBlock(block, index) {
      const fontFamilyName = this.fontMap[block.fontFamily] || block.fontFamily;
      this.ctx.font = `${block.fontSize}px "${fontFamilyName}"`;
      this.ctx.fillStyle = block.textColor;
      this.ctx.textAlign = block.textAlign;
      this.ctx.textBaseline = 'middle';
      
      let x;
      switch(block.textAlign) {
        case 'left':
          x = 50;
          break;
        case 'right':
          x = this.canvas.width - 50;
          break;
        default:
          x = this.canvas.width / 2;
      }
      
      const y = this.canvas.height / 2 + parseInt(block.verticalOffset);
      this.ctx.fillText(block.text, x, y);
    },
    drawBackground() {
      if (this.backgroundType === 'gradient') {
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, this.gradientColors.start);
        gradient.addColorStop(1, this.gradientColors.end);
        this.ctx.fillStyle = gradient;
      } else {
        this.ctx.fillStyle = '#ffffff';
      }
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    },
    handleTextInput() {
      this.drawText();
    },
    toggleBold() {
      this.isBold = !this.isBold;
      this.drawText();
    }
  },
  watch: {
    backgroundType: {
      handler(newValue) {
        this.updateBackground();
      }
    },
    currentText: {
      handler(newValue) {
        this.drawText();
      }
    }
  }
}
</script>

<style scoped>
.text-editor {
  height: 100%;
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
  cursor: pointer;
  background-color: white;
}

.select-style:hover {
  border-color: #c0c4cc;
}

.select-style:focus {
  border-color: #409eff;
  outline: none;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
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

@font-face {
  font-family: 'STXingkai';
  src: local('STXingkai');
}

@font-face {
  font-family: 'STLiti';
  src: local('STLiti');
}

@font-face {
  font-family: 'FZShuTi';
  src: local('FZShuTi');
}

@font-face {
  font-family: 'FZYaoti';
  src: local('FZYaoti');
}

@font-face {
  font-family: 'STXinwei';
  src: local('STXinwei');
}

.text-blocks-list {
  margin-bottom: 12px;
}

.text-block-item {
  padding: 8px 12px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  margin-bottom: 8px;
  cursor: pointer;
  transition: all 0.2s;
  background: white;
}

.text-block-item:hover {
  border-color: #409eff;
}

.text-block-item.active {
  border-color: #409eff;
  background: #ecf5ff;
}

.block-preview {
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 14px;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn:disabled:hover {
  transform: none;
}

.style-buttons {
  display: flex;
  gap: 4px;
}

.style-btn {
  width: 32px;
  height: 32px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 16px;
}

.style-btn.active {
  background: #409eff;
  color: white;
  border-color: #409eff;
}

.style-btn:hover {
  background: #f5f7fa;
}

.style-btn.active:hover {
  background: #66b1ff;
}
</style> 