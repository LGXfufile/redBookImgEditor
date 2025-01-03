<template>
  <div class="app">
    <el-container>
      <el-header>
        <h1>小红书快速制图</h1>
      </el-header>
      <el-main>
        <ImageEditor />
      </el-main>
    </el-container>
  </div>
</template>

<script>
import ImageEditor from './components/ImageEditor.vue'

export default {
  name: 'App',
  components: {
    ImageEditor
  }
}
</script>

<style>
.app {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.el-header {
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.el-main {
  padding: 20px;
}
</style>
