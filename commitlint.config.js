module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
      'type-enum': [2, 'always', [
          'build',
          'ci',
          'chore',
          'docs',
          'feat',
          'fix',
          'perf',
          'refactor',
          'revert',
          'style',
          'test'
      ]],
      // 'subject-full-stop': [0, 'never'],
      // 'subject-case': [0, 'never']
  }
};

// https://juejin.cn/post/6844903871832145927

// 使用git commt -m 无法提交代·码,是因为没有正确的按照规范提交
// 正确的提交方式为
// git add .
// git cz
// git cz后已进入interactive模式 此时需要对下列选进行选择或输入

// 1.Select the type of change that you're committing 选择改动类型 (<type>) // select 上下方向键可选择  必选 （可选值如下）

//   build：主要目的是修改项目构建系统(例如 glup，webpack，rollup 的配置等)的提交
//   ci：主要目的是修改项目继续集成流程(例如 Travis，Jenkins，GitLab CI，Circle等)的提交
//   docs：文档更新
//   feat：新增功能
//   fix：bug 修复
//   perf：性能优化
//   refactor：重构代码(既没有新增功能，也没有修复 bug)
//   style：不影响程序逻辑的代码修改(修改空白字符，补全缺失的分号等)
//   test：新增测试用例或是更新现有测试
//   revert：回滚某个更早之前的提交
//   chore：不属于以上类型的其他类型

// 2.What is the scope of this change (e.g. component or file name)? 填写改动范围 (<scope>) // input 输入改动文件夹访问  非必选

// 3.Write a short, imperative tense description of the change: 写一个精简的描述 (<subject>) // input 输入你的commit简要信息  必选

// 4.Provide a longer description of the change: (press enter to skip) 对于改动写一段长描述 (<body>)// input 输入你的commit长描述  非必选

// 5.Are there any breaking changes? (y/n) 是破坏性修改吗？默认n (<footer>) // input y/n  非必选

// 6.Does this change affect any openreve issues? (y/n) 改动修复了哪个问题？默认n (<footer>) // input y/n  非必选

// 然后 git push
