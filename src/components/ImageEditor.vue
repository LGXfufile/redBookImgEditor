<template>
  <div class="editor-container">
    <!-- 左侧编辑区 -->
    <div class="edit-panel">
      <el-form label-position="left" label-width="80px">
        <!-- 文本块列表 -->
        <el-form-item label="文本块">
          <div v-for="(block, index) in textBlocks" :key="index" class="text-block-item">
            <el-input
              type="textarea"
              v-model="block.content"
              :rows="3"
              placeholder="请输入文本内容"
            />
            <div class="text-block-controls">
              <!-- 文字对齐方式 -->
              <el-radio-group v-model="block.textAlign" size="small">
                <el-radio-button label="left">左对齐</el-radio-button>
                <el-radio-button label="center">居中</el-radio-button>
                <el-radio-button label="right">右对齐</el-radio-button>
              </el-radio-group>

              <el-button type="danger" size="small" @click="removeTextBlock(index)">
                删除
              </el-button>
            </div>
          </div>
          <el-button type="primary" size="small" @click="addTextBlock">
            添加文本块
          </el-button>
        </el-form-item>

        <!-- 模板选择 -->
        <el-form-item label="选择模板">
          <div class="template-list">
            <div
              v-for="template in templates"
              :key="template.id"
              class="template-item"
              :class="{ active: currentTemplate === template.id }"
              @click="selectTemplate(template)"
            >
              {{ template.name }}
            </div>
          </div>
        </el-form-item>

        <!-- 字体设置 -->
        <el-form-item label="字体">
          <el-select v-model="selectedFont" placeholder="选择字体">
            <el-option
              v-for="font in fonts"
              :key="font.value"
              :label="font.label"
              :value="font.value"
            />
          </el-select>
        </el-form-item>

        <!-- 字号设置 -->
        <el-form-item label="字号">
          <el-slider v-model="fontSize" :min="12" :max="72" :step="2" />
        </el-form-item>

        <!-- 文字颜色 -->
        <el-form-item label="文字颜色">
          <el-color-picker v-model="textColor" />
        </el-form-item>

        <!-- 背景设置 -->
        <el-form-item label="背景类型">
          <el-select v-model="backgroundType" placeholder="选择背景类型">
            <el-option label="纯色" value="color" />
            <el-option label="图片" value="image" />
          </el-select>
        </el-form-item>

        <!-- 背景图片选择 -->
        <el-form-item v-if="backgroundType === 'image'" label="背景图片">
          <div class="background-images">
            <div
              v-for="(img, index) in backgroundImages"
              :key="index"
              class="bg-image-item"
              :class="{ active: backgroundImage === img }"
              @click="selectBackgroundImage(img)"
            >
              <img :src="img" alt="背景图片" />
            </div>
          </div>
          <!-- 图片上传 -->
          <el-upload
            class="upload-demo"
            action="#"
            :auto-upload="false"
            :show-file-list="false"
            :on-change="handleImageUpload"
          >
            <el-button type="primary">上传图片</el-button>
          </el-upload>
        </el-form-item>

        <!-- 滤镜效果 -->
        <el-form-item label="滤镜效果">
          <el-select v-model="selectedFilter" placeholder="选择滤镜">
            <el-option
              v-for="filter in filters"
              :key="filter.value"
              :label="filter.label"
              :value="filter.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
    </div>

    <!-- 右侧预览区 -->
    <div class="preview-panel">
      <div
        class="preview-content"
        :style="{
          backgroundColor: backgroundType === 'color' ? backgroundColor : 'transparent',
          backgroundImage: backgroundType === 'image' ? `url(${backgroundImage})` : 'none',
          backgroundSize: 'cover',
          filter: selectedFilter
        }"
      >
        <div
          v-for="(block, index) in textBlocks"
          :key="index"
          class="text-block"
          :style="{
            fontFamily: selectedFont,
            fontSize: `${fontSize}px`,
            color: textColor,
            textAlign: block.textAlign
          }"
        >
          {{ block.content }}
        </div>
      </div>
      <el-button type="primary" @click="saveImage">保存图片</el-button>
    </div>
  </div>
</template>

<script>
import html2canvas from 'html2canvas'

export default {
  name: 'ImageEditor',
  data() {
    return {
      textBlocks: [
        { content: '', textAlign: 'left' }
      ],
      currentTemplate: 'simple',
      selectedFont: 'Microsoft YaHei',
      fontSize: 24,
      textColor: '#000000',
      backgroundType: 'color',
      backgroundColor: '#ffffff',
      backgroundImage: '',
      selectedFilter: 'none',
      templates: [
        { id: 'simple', name: '简约风格' },
        { id: 'retro', name: '复古风格' },
        { id: 'modern', name: '现代风格' }
      ],
      fonts: [
        { label: '微软雅黑', value: 'Microsoft YaHei' },
        { label: '宋体', value: 'SimSun' },
        { label: '黑体', value: 'SimHei' },
        { label: '楷体', value: 'KaiTi' }
      ],
      filters: [
        { label: '无', value: 'none' },
        { label: '复古', value: 'sepia(0.5)' },
        { label: '黑白', value: 'grayscale(1)' },
        { label: '高对比度', value: 'contrast(150%)' },
        { label: '明亮', value: 'brightness(120%)' },
        { label: '模糊', value: 'blur(2px)' }
      ],
      backgroundImages: [
        '/backgrounds/bg1.jpg',
        '/backgrounds/bg2.jpg',
        '/backgrounds/bg3.jpg',
        // 添加更多预设背景图片
      ]
    }
  },
  methods: {
    addTextBlock() {
      this.textBlocks.push({ content: '', textAlign: 'left' })
    },
    removeTextBlock(index) {
      this.textBlocks.splice(index, 1)
    },
    selectTemplate(template) {
      this.currentTemplate = template.id
      switch (template.id) {
        case 'simple':
          this.backgroundColor = '#ffffff'
          this.textColor = '#000000'
          this.selectedFilter = 'none'
          break
        case 'retro':
          this.backgroundColor = '#f5e6d3'
          this.textColor = '#2c1810'
          this.selectedFilter = 'sepia(0.3)'
          break
        case 'modern':
          this.backgroundColor = '#f0f0f0'
          this.textColor = '#333333'
          this.selectedFilter = 'contrast(110%)'
          break
      }
    },
    selectBackgroundImage(image) {
      this.backgroundImage = image
    },
    handleImageUpload(file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        this.backgroundImage = e.target.result
      }
      reader.readAsDataURL(file.raw)
    },
    async saveImage() {
      try {
        const element = document.querySelector('.preview-content')
        const canvas = await html2canvas(element)
        const link = document.createElement('a')
        link.download = 'xiaohongshu-image.png'
        link.href = canvas.toDataURL()
        link.click()
      } catch (error) {
        console.error('保存图片失败:', error)
        this.$message.error('保存图片失败')
      }
    }
  }
}
</script>

<style scoped>
.editor-container {
  display: flex;
  gap: 20px;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.edit-panel {
  flex: 1;
  padding: 20px;
  border: 1px solid #eee;
  border-radius: 8px;
}

.preview-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.preview-content {
  width: 100%;
  aspect-ratio: 4/5;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  white-space: pre-wrap;
  overflow-wrap: break-word;
}

.template-list {
  display: flex;
  gap: 10px;
}

.template-item {
  padding: 10px 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
}

.template-item.active {
  background-color: #409EFF;
  color: white;
}

.text-block-item {
  margin-bottom: 15px;
  border: 1px solid #eee;
  padding: 10px;
  border-radius: 4px;
}

.text-block-controls {
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.background-images {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin-bottom: 10px;
}

.bg-image-item {
  width: 80px;
  height: 80px;
  border: 2px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
}

.bg-image-item.active {
  border-color: #409EFF;
}

.bg-image-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.text-block {
  margin-bottom: 15px;
}

.upload-demo {
  margin-top: 10px;
}
</style>
