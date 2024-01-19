// 遍历业务组件目录
const businessList = require.context(
  // 在当前目录检索文件
  './business',
  // 在子目录检索
  true,
  /\.js$/
);

// 遍历基础组件目录
const commonList = require.context(
  // 在当前目录检索文件
  './common/ui',
  // 在子目录检索
  true,
  /\.js$/
);

// 遍历表单组件目录
const formList = require.context(
  // 在当前目录检索文件
  './common/form',
  // 在子目录检索
  true,
  /\.js$/
);

// 遍历容器组件目录
const layoutList = require.context(
  // 在当前目录检索文件
  './common/layout',
  // 在子目录检索
  true,
  /\.js$/
);

function getComponents(list) {
  return list.keys().map(fileName => {
    const content = list(fileName).default;
    return {
      ...content
    };
  });
}

export default [
  {
    name: '基础组件',
    components: getComponents(commonList)
  },
  {
    name: '表单组件',
    components: getComponents(formList)
  },
  {
    name: '容器组件',
    components: getComponents(layoutList)
  },
  {
    name: '业务组件',
    components: getComponents(businessList)
  }
];
