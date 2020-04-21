## 主要分支
  - 两条一直存在的主要分支
    
    - master：只做版本发布，或紧急bug修改
    
    - develop：开发分支，从master分出

## 辅助分支
  - 功能分支feature
    - 从develop分支分出，开发功能完成后合并到develop分支后删除
  - bug分支
    - 从master分出，修复bug后，合并到master分支和develop分支，删除
    ```js
    // 在develop分支
    git add .
    // 暂存工作区，去修改bug
    git stash
    // 切换到master
    git switch master
    // 创建bug修复分支
    git branch -b fixbug001
    // 修复完成后，切回master
    git switch master
    // 合并bug分支到master
    git merge --no-ff -m 'fixbug001' fixbug001
    // 删除bug分支
    git branch -d fixbug001
    // 切回develop开发分支
    git switch develop
    // 只复制修改bug的那次提交到当前开发分支
    git cherry-pick commitId
    // 恢复工作区，继续开发
    git stash pop
    ```
## git版本管理
  - `git log` 查看提交记录
  - `git reflog` 查看所有历史命令
  - `git reset --hard commit_id` 去往某一个版本
  - `git reset --hard HEAD^` 回到上一个版本
  - `git reset --hard HEAD~n` 回到上n个版本
  
