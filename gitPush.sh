#!/usr/bin/env sh
# 当发生错误时中止脚本
set -e
# 执行git pull
git pull
# 将修改的文件加入暂存区
git add .
# 使用git cz 进入interactive模式
git cz
# 提交到远程仓库
git push
# 查询提交后的状态
git status
