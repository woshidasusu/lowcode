# store 模块说明

该模块通过 vuex 创建了内存级别的数据仓库来处理数据存储

使用时，需要注意：如果有跨页面的数据交互，那么需要特别注意浏览器刷新的场景导致内存数据丢失会不会造成页面异常

## 封装说明

该模块通过封装一些工具方法，来达到两种场景的使用：

1. 全局单例的数据仓库
2. 按需动态挂载、卸载的模块间数据仓库

另外，为了减少繁琐的代码编写，封装了一些工具方法来自动生成部分代码，因此如果要使用工具方法，需要遵守一定的规范

这里有一篇详细的文档分析，有兴趣可以打开查阅：[谈谈我用 vuex 的一些想法](https://juejin.cn/post/6934569178519207949)

## 工具方法说明

### storeToComputed

- 使用示例

```javascript
import { storeToComputed } from '@src/store/storeToComputed';

export default {
  //...
  computed: {
    // 将 this.$store.state.xxx 映射成 this.xxx
    ...storeToComputed('app', ['appContext', 'appPermission'])
  }
};
```

`storeToComputed` 是用来将 store 转为 computed 的 set 和 get，具体内部做了什么，可以直接查看方法的注释，这样处理可以简化在 vue 里使用 store 的方式

### generateMutationsByState

- 使用示例

```javascript
import { generateMutationsByState } from '@src/store/helper';

const state = {
  appContext: null
};

const mutations = {
  ...generateMutationsByState(state)
};
```

`generateMutationsByState` 是来自动生成 mutations 的工具方法，具体生成什么规范的代码，可以查看方法注释，这样可以减少 mutations 的编写工作

## 使用说明和示例

### 全局单例的数据仓库

**目录：** modules

在这个目录里的 store 在应用初始化时，就会被创建，而且一直存活于内存中，所以属于全局单例模式， state 直接字面量对象维护即可

### 按需动态挂载、卸载的模块间数据仓库

**目录：** dynamic

这个目录下的 store 都是在运行期间，页面进入相应模块，手动调用了 `register()` 时，才会动态的挂载到内存中，离开页面时，也需要手动调用 `unregister()` 来动态卸载

为了避免动态挂载卸载时，模块间的数据污染问题，所以 state 都通过一个函数来返回数据对象模型，这样才能确保每次挂载时，都是一份全新的数据副本，不会有上次数据的遗留污染

另外，为了方便维护，所有动态挂载、卸载的模块，都维护在 `dynamicStore.js` 文件里，这个文件还有另外一个目的，让外部 vue 使用时都需要明确的引入，这样就可以通过 `ctrl + 左键`方式快速跳转打开

- 使用示例

```javascript
// xxx.vue
import dynamicStore from '@src/store/dynamic-store';
// ...
export default {
  created() {
    dynamicStore.upgradeTask.register();
  },
  destroyed() {
    dynamicStore.upgradeTask.unregister();
  }
};
```

```javascript
// dynamicStore.js
import upgradeTask from '@src/store/dynamic/customerCare/upgradeTask';

// 模块 key 值列表，需确保唯一性
const UPGRADE_TASK = 'upgradeTask';

export default {
  upgradeTask: {
    // 满意度提升管理 - 提升任务管理模块
    ...generateStoreOperate(UPGRADE_TASK, upgradeTask)
  }
};
```

## vuex-peek 插件

可以配合 vscode 插件：vuex-peek 来使用，认准作者：suxq

这是专门开发用来解决 `ctrl + 左键` 可以识别定义在 store 里的变量且响应文件跳转的插件

如果你不觉得手动全局搜索来寻找 store 文件是个麻烦事，那这个插件对你就没有什么用处，可以略过
