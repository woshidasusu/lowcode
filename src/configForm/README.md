# 配置化表单

## 导读

本篇主要帮助新人来快速上手配置化渲染，研发人员的各种角色里会跟页面配置化打交道的大概分三类角色，不同角色所关注的侧重点都会有所差异，可以根据自己角色查看相关教程

### 【前端 - 使用者】- 【1】如何使用 

这类角色基本只借助配置化渲染器来实现功能，只是用而已，不会接触到配置化渲染器内部代码，需要掌握：

- 元数据各种规则的配置
- 自定义组件的用法
- 自定义数据服务（函数库）的用法
- 预置的各种组件和容器用法及使用场景
- 表单模型的建模规则

### 【前端 - 维护者】- 【2】如何维护

这类角色需要深入配置化渲染器内部源码去修复 BUG、或扩展现有功能，需要掌握

- 上述前端使用者罗列的所有知识点
- 配置化渲染器内部的运行流程
- 元数据的获取流程
- 元数据的解析过程
- 从元数据上自动构建表单模型的过程
- 跟后端配置化方案的打通过程（未实现）
- 可视化拖拉拽平台的维护
- 配置化渲染器内部的各种处理器
- 预置组件或规则的扩展

### 【后端 - 发布者】- 【3】如何发布

建议前端也需要掌握，这类角色需要将页面配置化的元数据发布到对应环境，需要掌握：

- 元数据存储在哪些表，表的各字段含义
- 发布或更新元数据的 SQL 如何编写
- 个性化租户和标准租户如何维护

其实整套方案并不复杂，建议可以全部了解