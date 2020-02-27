# LeanEngineUI
## 基本信息
- 【背景】   
针对客户项目中要求的主要基础设施需求进行预研和开发,
相对于市面上其他基于 BPMN2.0 研发的工作流引擎(类似于 activiti7 等)更加灵活,定制化简单.

- 【我们要做什么】   
基于 BPMN2.0 规则开发一款轻量级的工作流引擎

- 【我们的方案是】   
使用目前主流的各种前后端技术和基础设施。我们也非常愿意尝试更加 geek 的工具/框架/思维

## 相关地址
- [Kanban](https://www.teambition.com/project/5e44074c78c0fe0022a10382/tasks/view/all)   
- [https://github.com/OneTeam-Lean/LeanEngine.git](https://github.com/OneTeam-Lean/LeanEngine.git)
- [CI](http://ec2-52-82-123-155.cn-northwest-1.compute.amazonaws.com.cn:9000/), UserName: admin

## 代码提交规范
- `[Feat]`: new feature for the USER, not a new feature for build script
- `[Fix]`: bug fix for the USER, not a fix to a build script
- `[Refactor]`: refactoring production code e.g. renaming a variable
- `[Chore]`: updating gradle version etc., no production code change
- `[Style]`: CODE style (not front-end style), code formatting, missing semicolon etc.
- `[Docs]`: changes to the documentation, comment etc.

## 技术栈
- React.js
- Redux

## 项目基本命令
- `yarn start` 启动本地服务
- `yarn build` 构建项目
