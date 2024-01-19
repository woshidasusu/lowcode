<template>
  <div class="preview-block">
    <div style="text-align: end">
      <el-button type="text" icon="el-icon-video-play" @click="handleRun">运行</el-button>
      <el-button type="text" icon="el-icon-refresh" @click="handleEmpty">清空</el-button>
      <el-button type="text" icon="el-icon-download" @click="handleSave">保存</el-button>
    </div>
    <div class="preview-panel">
      <div class="preview-source">
        <div ref="html" data-name="html" class="source-pen"></div>
        <div ref="js" data-name="js" class="source-pen"></div>
        <div ref="css" data-name="css" class="source-pen"></div>
      </div>
      <div class="preview-code">
        <component :is="is" />
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import * as monaco from "monaco-editor";

import { scopedCss, stripTemplate, stripScript, stripStyle } from "@src/utils";

// 基础例子
const defaultCode = `
<template>
  <div>
    <el-alert type="success" :closable="false">
      欢迎使用, 当前版本为 1.0.0
    </el-alert>
  </div>
</template>

<script>
  export default {
    
  };
\<\/script>

<style>
</style>`.trim();

export default {
  name: "CodePreview",
  props: {
    source: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      activeName: "html",
      htmlEditorCode: "",
      jsEditorCode: "",
      cssEditorCode: "",
      codeSource: "",
      originSource: "",
      is: null
    };
  },
  watch: {
    codeSource(nv = defaultCode) {
      const html = stripTemplate(nv);
      const script = stripScript(nv);
      const style = stripStyle(nv);

      this.renderCode({ script, html });
      this.insertCss({ style });
    }
  },
  mounted() {
    const source = this.source || localStorage.getItem("preview-source") || defaultCode;
    this.originSource = source;
    this.codeSource = source;

    this.htmlEditorCode = stripTemplate(source);
    this.jsEditorCode = stripScript(source);
    this.cssEditorCode = stripStyle(source);

    this.htmlEditor = this.renderMonaco(this.$refs.html, "html", this.htmlEditorCode, value => {
      this.htmlEditorCode = value;
      this.compile();
    });

    this.jsEditor = this.renderMonaco(this.$refs.js, "javascript", this.jsEditorCode, value => {
      this.jsEditorCode = value;
      this.compile();
    });

    this.cssEditor = this.renderMonaco(this.$refs.css, "css", this.cssEditorCode, value => {
      this.cssEditorCode = value;
      this.compile();
    });
  },
  methods: {
    renderMonaco(id, language, value, callback) {
      const editor = monaco.editor.create(
        id, // dom容器
        {
          value: value, // 要显示的代码
          language: language, // 代码语言
          tabSize: 2,
          minimap: {
            enabled: false // 关闭小地图
          },
          automaticLayout: true,
          wordWrap: "on", // 代码超出换行
          theme: "vs-dark" // 主题
        }
      );
      // 监听编辑事件
      editor.onDidChangeModelContent(e => {
        callback(editor.getValue());
      });

      return editor;
    },
    compile() {
      console.log({
        originSource: `${this.htmlEditorCode}<script>${this.jsEditorCode}<\/script><style>${this.cssEditorCode}<\/style>`
      });
      this.originSource = `${this.htmlEditorCode}<script>${this.jsEditorCode}<\/script><style>${this.cssEditorCode}<\/style>`;
    },
    renderCode({ script, html }) {
      const js = script.replace(/export default/, "return ");
      const renderComponent = new Function(js)();
      renderComponent.template = `<div id="previewApp">${html}</div>`;
      this.is = renderComponent;
    },
    insertCss({ style }) {
      let css = document.querySelector("#preview-style");
      if (!css) {
        css = document.createElement("style");
        css.setAttribute("id", "preview-style");
        css.setAttribute("type", "text/css");
      }
      css.innerHTML = scopedCss(style, "preview-code");
      document.head.appendChild(css);
    },
    handleRun() {
      this.codeSource = this.originSource;
    },
    handleEmpty() {
      this.$confirm("您当前的代码尚未保存，确认要清空吗？", "清空确认", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.originSource = defaultCode;
          this.codeSource = defaultCode;
          localStorage.setItem("preview-source", defaultCode);
        })
        .catch(() => {});
    },
    handleSave() {
      this.$message.success("保存成功~");
      this.originSource = this.codeSource;
      localStorage.setItem("preview-source", this.codeSource);
    }
  }
};
</script>

<style lang="scss" scoped>
.preview-block {
  display: flex;
  flex-direction: column;
  border: solid 1px #ebebeb;
  border-radius: 3px;
  transition: 0.3s;
  height: 100vh;
  overflow: hidden;
}
.preview-header {
  display: flex;
  align-items: center;
  height: 60px;
}
.preview-panel {
  display: flex;
  flex: 1;
  overflow: hidden;
}
.preview-source {
  display: flex;
  flex-direction: column;
  width: 50%;
  height: 100%;
  background-color: #282c34;
  .source-pen {
    position: relative;
    display: block;
    height: 100%;
    width: 100%;
    &::after {
      content: attr(data-name);
      position: absolute;
      right: 40px;
      top: 20px;
      color: #2c3e50;
    }
    &:not(:last-child) {
      border-bottom: 4px solid #444857;
    }
  }
}
.preview-code {
  display: block;
  width: 50%;
  padding: 24px;
  overflow: auto;
}
</style>
