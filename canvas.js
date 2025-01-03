const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

function drawCenteredText(text, fontSize, verticalOffset = 0) {
  ctx.font = `${fontSize}px SimHei`;
  ctx.textAlign = 'center';    // 水平居中
  ctx.textBaseline = 'middle'; // 垂直居中
  
  // 计算画布中心点，加入垂直偏移量
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2 + verticalOffset; // 添加垂直偏移量
  
  // 在调整后的位置绘制文本
  ctx.fillText(text, centerX, centerY);
}

// 示例使用：
// 向上偏移 10 像素：drawCenteredText(text, fontSize, -10)
// 向下偏移 10 像素：drawCenteredText(text, fontSize, 10) 

// 添加更新函数
function updateTextPosition(offset) {
  // 清除画布
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // 重新绘制文字
  drawCenteredText(currentText, currentFontSize, parseInt(offset));
} 