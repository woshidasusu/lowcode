const defaultScript = "export default {}";

export function stripScript(content) {
  const jsBlock = /<script(\s*lang=(['"])(.*?)\2)?>([\s\S]+)<\/script>/u.exec(
    content
  );

  if (!jsBlock) return defaultScript;
  const code = jsBlock[4] || defaultScript;
  return code;
}

export function stripStyle(content) {
  const cssBlock =
    /<style(\s*lang=(['"])(.*?)\2)?\s*(?:scoped)?>([\s\S]+)<\/style>/u.exec(
      content
    );
  if (!cssBlock) return "";
  const code = cssBlock[4] || "";
  return code;
}

export function stripTemplate(content) {
  // 模板中可能不存在 template，这里采用去除其他代码块的方式
  const htmlBlock = content.replace(/<(script|style)[\s\S]+<\/\1>/g, "").trim();
  return htmlBlock;
}

// 将 css 代码块包裹，新增代码作用域
export function scopedCss(cssContent, wrapper) {
  const reg = /([\s\S]*?)\{([\s\S]*?)\}/gu;
  let scopedHtml = "";
  let result;
  while ((result = reg.exec(cssContent))) {
    const [, selectors, definition] = result;
    scopedHtml += `${selectors
      .replace(/\n/g, "")
      .split(",")
      .map(selector => `.${wrapper} ${selector}`)
      .join(",")}{${definition}}`;
  }
  return scopedHtml;
}
