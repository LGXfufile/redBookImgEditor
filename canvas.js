const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

function drawCenteredText(text, fontSize) {
  ctx.font = `${fontSize}px SimHei`;
  ctx.textAlign = 'center';    // 水平居中
  ctx.textBaseline = 'middle'; // 垂直居中
  
  // 计算画布中心点
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  
  // 直接在中心点绘制文本
  ctx.fillText(text, centerX, centerY);
} 