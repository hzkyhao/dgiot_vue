#!/usr/bin/env sh
# 当发生错误时中止脚本
set -e
git pull # 执行git pull
sleep 3  # 等3秒后执行下一条
git add . # 将修改的文件加入暂存区
sleep 5  #等5秒后执行下一条
git cz # 使用git cz 进入interactive模式
sleep 5  # 等5秒后执行下一条
git push # 提交到远程仓库
sleep 5  # 等5秒后执行下一条
git status # 查询提交后的状态
chmod a+x gitPush.sh  # 退出shell脚本
./gitPush.sh  # 返回上一页
echo $? # 退出脚本
