<template>
  <div class="layout-container">
    <div class="title-container">
      <span class="title">比对本地和服务器的元数据</span>
      <div style="margin-left: 20px">
        <template v-if="showOldDiffPage">
          <span>总共有 {{ diffIndexs.length || 0 }} 行不同</span>
          <el-button type="text" @click="jumpDiff">
            快速定位差异点
            <span v-if="curJumpIndex > -1">(第{{ +diffIndexs[curJumpIndex] + 1 }}行)</span>
          </el-button>
        </template>
        <template v-else>
          <span>总共有 {{ diffNode.length || 0 }} 处改动</span>
          <el-button type="text" @click="handleDiffJump">
            快速定位差异点
            <span v-if="curJumpIndex > -1">(第{{ curJumpIndex + 1 }}处改动)</span>
          </el-button>
        </template>

        <el-button type="text" @click="doTransform">
          格式转换成 JSON 字符串（提供给后端去写 sql 更新服务端元数据）
        </el-button>
        <el-button type="text" @click="switchDiffPage">
          切换对比页面
        </el-button>
      </div>
    </div>

    <div v-if="showOldDiffPage" class="code-container">
      <div v-for="i in maxRow" :key="i" class="row" :class="diffIndexMap[i - 1] ? 'diff' : ''">
        <div class="index">{{ i }}</div>
        <div class="item">{{ localMetadata[i - 1] }}</div>
        <div class="item">{{ remoteMetadata[i - 1] }}</div>
      </div>
    </div>

    <div v-else class="code-container">
      <pre v-for="(node, i) in lineList" :key="i" :class="[node.type !== 'regular' ? 'diff' : '', node.type]">{{
        node.value
      }}</pre>
    </div>
  </div>
</template>

<script>
import { copyAtClipboard } from '@src/utils/tools';
import { diffLines } from 'diff';
export default {
  components: {},
  props: {},
  data() {
    return {
      metadata: null,
      localMetadata: [],
      remoteMetadata: [],
      diffIndexMap: {},
      curJumpIndex: -1,
      lineList: [],
      diffNode: [],
      showOldDiffPage: false
    };
  },
  computed: {
    maxRow() {
      if (this.localMetadata && this.remoteMetadata) {
        return Math.max(this.localMetadata.length, this.remoteMetadata.length);
      }
      return 0;
    },
    diffIndexs() {
      return Object.keys(this.diffIndexMap);
    }
  },
  watch: {
    maxRow(newV) {
      this.diffIndexMap = {};
      for (let i = 0; i < newV; i++) {
        if (this.localMetadata[i] !== this.remoteMetadata[i]) {
          this.diffIndexMap[i] = true;
        }
      }
    }
  },
  async mounted() {
    let data = localStorage.getItem('__metadata');
    data = JSON.parse(data);
    this.metadata = data?.metadata;
    this.localMetadata = JSON.stringify(data?.metadata, ' ', 2).split('\n');
    this.remoteMetadata = JSON.stringify(JSON.parse(data?.standard), ' ', 2).split('\n');

    const { resultList, diffList } = this.handleDiff(
      JSON.stringify(JSON.parse(data?.standard), ' ', 2),
      JSON.stringify(data?.metadata, ' ', 2)
    );
    this.lineList = resultList;
    this.diffNode = diffList;
  },
  destroyed() {},
  methods: {
    jumpDiff() {
      if (!this.diffIndexs.length) {
        return this.$message.success('没有找到差异');
      }
      this.curJumpIndex++;
      const to = 30 * (this.diffIndexs[this.curJumpIndex] - 1);
      window.scrollTo(0, to);
    },
    doTransform() {
      copyAtClipboard(JSON.stringify(JSON.stringify(this.metadata)));
      this.$message.success('格式转换并复制成功');
    },
    switchDiffPage() {
      this.showOldDiffPage = !this.showOldDiffPage;
      this.curJumpIndex = -1;
      window.scrollTo(0, 0);
    },

    handleDiff(newV, oldV) {
      const diff = diffLines(newV, oldV);

      const resultList = [];
      const diffList = [];

      for (let i = 0; i < diff.length; i++) {
        if (diff[i].added && diff[i + 1] && diff[i + 1].removed) {
          const swap = diff[i];
          diff[i] = diff[i + 1];
          diff[i + 1] = swap;
        }

        const node = {};
        if (diff[i].removed) {
          node.type = 'del';
          diffList.push(node);
        } else if (diff[i].added) {
          node.type = 'ins';
          diffList.push(node);
        } else {
          node.type = 'regular';
        }
        node.value = diff[i].value;
        resultList.push(node);
      }
      return { resultList, diffList };
    },
    handleDiffJump() {
      if (this.curJumpIndex >= this.diffNode.length - 1) {
        return;
      }
      this.curJumpIndex++;

      const nodeList = document.querySelectorAll('.diff');

      const node = nodeList[this.curJumpIndex];

      window.scrollTo(0, node.offsetTop - document.body.clientHeight / 2);
    }
  }
};
</script>

<style lang="scss" scoped>
* {
  box-sizing: border-box;
}
.layout-container {
  background: #fff;
  min-height: 100vh;
  padding: 0px 40px;
  box-sizing: border-box;
  .del {
    text-decoration: none;
    color: #b30000;
    background-color: #fadad7;
  }
  .ins {
    background-color: #eaf2c2;
    color: #406619;
    text-decoration: none;
  }
  .title-container {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 80px;
    padding: 20px;
    background: #fff;
    .title {
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 16px;
    }
  }
  .code-container {
    margin-top: 80px;
    margin-bottom: 20px;
    border: 1px solid #dcdcdc;

    .row {
      display: flex;
      flex-wrap: nowrap;

      &:not(:last-child) {
        border-bottom: 1px solid #dcdcdc;
      }

      &:hover {
        background: #dcdcdc;
      }

      &.diff {
        border: 1px solid red;
      }

      > div {
        line-height: 30px;
        height: 30px;
        &:not(:last-child) {
          border-right: 1px solid #dcdcdc;
        }
      }

      .index {
        width: 50px;
        text-align: center;
      }

      .item {
        padding: 0 20px;
        width: calc((100% - 50px) / 2);
        flex-shrink: 0;
        white-space: pre-wrap;
        overflow: auto;
      }
    }
  }
}
</style>
