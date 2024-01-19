// 一键复制
export function copyAtClipboard(text = "") {
  const textareaElem = document.createElement("textarea");

  // 隐藏
  textareaElem.style.position = "absolute";
  textareaElem.style.bottom = 0;
  textareaElem.style.left = 0;
  textareaElem.style.opacity = 0;

  // 添加 dom
  document.body.appendChild(textareaElem);

  // 传值并设置选中
  textareaElem.value = text;
  textareaElem.select();

  // 复制
  document.execCommand("copy");

  // 移除 dom
  document.body.removeChild(textareaElem);
}