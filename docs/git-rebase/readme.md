# git rebase 命令

git rebase 实在是使用 git 进行开发的时候频率很广的一个命令，这里介绍使用这个命令的几种场景

## 指定参照分支后，合并当前分支的多个 commit 到一个 commit

假设这里有一个主分支 master 和一个从 master 建立的工作分支 worker

```
$ git branch
* master

$ git checkout -b worker

$ git branch
  master
* worker
```

先看一下 master 分支的 log

```
$ git log

commit 94fdadff81ae11127d9ddce7fadf356e97f85728 (master)
Author: wb-ly388295 <wb-ly388295@koubei.com>
Date:   Thu May 31 12:15:56 2018 +0800

    init
```

在 worker 分支中，我为了完成某个新增需求，新增了两个 commit 信息

```
$ git log

commit 8e006d43864f45cf010aad579e256398e6649a2a (HEAD -> worker)
Author: wb-ly388295 <wb-ly388295@koubei.com>
Date:   Thu May 31 12:33:10 2018 +0800

    新增index.php文件

commit 9425886213d976b26886e1a234145d738142a687
Author: wb-ly388295 <wb-ly388295@koubei.com>
Date:   Thu May 31 12:32:54 2018 +0800

    新增index.html文件
```

需求完成后，我需要把这些修改全部合并到 master 分支上去，先看一下使用 git merge 会产生的结果

```
$ git checkout master
$ git merge worker
$ git log

commit 8e006d43864f45cf010aad579e256398e6649a2a (HEAD -> worker)
Author: wb-ly388295 <wb-ly388295@koubei.com>
Date:   Thu May 31 12:33:10 2018 +0800

    新增index.php文件

commit 9425886213d976b26886e1a234145d738142a687
Author: wb-ly388295 <wb-ly388295@koubei.com>
Date:   Thu May 31 12:32:54 2018 +0800

    新增index.html文件

commit 94fdadff81ae11127d9ddce7fadf356e97f85728 (master)
Author: wb-ly388295 <wb-ly388295@koubei.com>
Date:   Thu May 31 12:15:56 2018 +0800

    init
```

发生了什么？worker 上所有的提交信息都被添加到 master 分支的日志上去了，实际开发中新的 commit 肯定不止 2 次，可能是几十次 也可能是上百次，难道也全部都添加到 master 分支的日志上去是不现实的，我们需要把这些 commit 合并保存成一个 commit 再合并到 master 分支上去，这个时候就用到 git rebase 方法了。

> git rebase 方法的目的，就是为了给当前分支设置一个基线，git 会自动检查出基线之外所有的 commit 日志，并把这些 commit 日志全部清除掉，合并成一个新的 commit

下面来看一下使用 git rebase 的结果

```
// 先把代码还原到git merge之前的状态
$ git checkout worker
$ git rebase -i master // 这里的mster就是我们设置的参照物，也就是上面说的基线，worker日志中和master最后一条日志之后的所有commit都将被删除与合并
```

命令执行后,会发现弹出了一个临时文件，包含以下内容：

```
pick 9425886 新增index.html文件
pick 8e006d4 新增index.php文件

# Rebase 94fdadf..8e006d4 onto 94fdadf (2 commands)
#
# Commands:
# p, pick = use commit
# r, reword = use commit, but edit the commit message
# e, edit = use commit, but stop for amending
# s, squash = use commit, but meld into previous commit
# f, fixup = like "squash", but discard this commit's log message
# x, exec = run command (the rest of the line) using shell
# d, drop = remove commit
#
# These lines can be re-ordered; they are executed from top to bottom.
#
# If you remove a line here THAT COMMIT WILL BE LOST.
#
# However, if you remove everything, the rebase will be aborted.
#
# Note that empty commits are commented out
```

在这里把除了第一个 pick 之外的所有 pick 都改成 squash，并保存

```
pick 9425886 新增index.html文件
squash 8e006d4 新增index.php文件

# Rebase 94fdadf..8e006d4 onto 94fdadf (2 commands)
#
# Commands:
# p, pick = use commit
# r, reword = use commit, but edit the commit message
# e, edit = use commit, but stop for amending
# s, squash = use commit, but meld into previous commit
# f, fixup = like "squash", but discard this commit's log message
# x, exec = run command (the rest of the line) using shell
# d, drop = remove commit
#
# These lines can be re-ordered; they are executed from top to bottom.
#
# If you remove a line here THAT COMMIT WILL BE LOST.
#
# However, if you remove everything, the rebase will be aborted.
#
# Note that empty commits are commented out
```

保存成功后，又弹出来一个新的临时文件，内容如下：

```
# This is a combination of 2 commits.
# This is the 1st commit message:

新增index.html文件

# This is the commit message #2:

新增index.php文件

# Please enter the commit message for your changes. Lines starting
# with '#' will be ignored, and an empty message aborts the commit.
#
# Date:      Thu May 31 12:32:54 2018 +0800
#
# interactive rebase in progress; onto 94fdadf
# Last commands done (2 commands done):
#    pick 9425886 新增index.html文件
#    squash 8e006d4 新增index.php文件
# No commands remaining.
# You are currently rebasing branch 'worker' on '94fdadf'.
#
# Changes to be committed:
#       new file:   index.html
#       new file:   index.php
#
```

我们可以在这个临时文件中把之前的 commit 信息全部删掉，写上新的 commit message

```
# This is a combination of 2 commits.
# This is the 1st commit message:

新增两个文件index.html\index.php

# Please enter the commit message for your changes. Lines starting
# with '#' will be ignored, and an empty message aborts the commit.
#
# Date:      Thu May 31 12:32:54 2018 +0800
#
# interactive rebase in progress; onto 94fdadf
# Last commands done (2 commands done):
#    pick 9425886 新增index.html文件
#    squash 8e006d4 新增index.php文件
# No commands remaining.
# You are currently rebasing branch 'worker' on '94fdadf'.
#
# Changes to be committed:
#       new file:   index.html
#       new file:   index.php
#
```

保存后，控制台会提示我们合并成功的信息

```
[detached HEAD 3022a4a] 新增两个文件index.html\index.php
 Date: Thu May 31 12:32:54 2018 +0800
 2 files changed, 0 insertions(+), 0 deletions(-)
 create mode 100644 index.html
 create mode 100644 index.php
Successfully rebased and updated refs/heads/worker.
```

这个时候再重新查看一下 worker 分支的日志,就会发现之前的两个 commit 已经没有了，只有我们合并后保存的新 commit

```
$ git checkout worker
$ git log

commit 3022a4a6300bbe0d130fbcab17012404a275055f (HEAD -> worker)
Author: wb-ly388295 <wb-ly388295@koubei.com>
Date:   Thu May 31 12:32:54 2018 +0800

    新增两个文件index.html\index.php

commit 94fdadff81ae11127d9ddce7fadf356e97f85728 (master)
Author: wb-ly388295 <wb-ly388295@koubei.com>
Date:   Thu May 31 12:15:56 2018 +0800

    init
```

现在我们可以把 worker 合并到 master 分支上去了

## 基线的分支也有新的 commit 怎么办

假设这里有一个主分支 master 和一个从 master 建立的工作分支 worker

```
$ git branch
* master

$ git checkout -b worker
$ git branch
  master
* worker

$ touch index.html
$ git add .
$ git commit -m '新增index.html'
$ git checkout master
$ touch index.php
$ git add .
$ git commit -m '新增index.php'
```

现在 master 和 worker 上分别有一个新增的 commit 了

```
$ git checkout master
$ git log
commit ae4c56dcf532204084ca0e1f4f2a00dc1263bf57 (master)
Author: wb-ly388295 <wb-ly388295@koubei.com>
Date:   Thu May 31 12:48:11 2018 +0800

    新增index.php

$ git checkout worker
$ git log
commit eb37ee743adc324e36101cab2581a426bc52e855
Author: wb-ly388295 <wb-ly388295@koubei.com>
Date:   Thu May 31 12:53:17 2018 +0800

    新增index.html
```

先来看一下使用 git merge 的后果

```
$ git checkout worker
$ git merge master  
```

git merge 后会自动产生一个合并的 commit，并出现一个临时文件，可以在里面写入 commit message，我没有进行修改，直接保存后再查看分支的日志:˝

```
$ git log

commit 0b26458538722e37355b9e22b7df1fc18e2d7a21 (HEAD -> worker)
Merge: eb37ee7 ae4c56d
Author: wb-ly388295 <wb-ly388295@koubei.com>
Date:   Thu May 31 12:53:25 2018 +0800

    Merge branch 'master' into worker

commit eb37ee743adc324e36101cab2581a426bc52e855
Author: wb-ly388295 <wb-ly388295@koubei.com>
Date:   Thu May 31 12:53:17 2018 +0800

    新增index.html

commit ae4c56dcf532204084ca0e1f4f2a00dc1263bf57 (master)
Author: wb-ly388295 <wb-ly388295@koubei.com>
Date:   Thu May 31 12:48:11 2018 +0800

    新增index.php

commit 94fdadff81ae11127d9ddce7fadf356e97f85728
Author: wb-ly388295 <wb-ly388295@koubei.com>
Date:   Thu May 31 12:15:56 2018 +0800

    init
```

可以发现，worker 分支不仅把 master 上关于 index.php 的 commit 保存过来，还出现了一个新的 commit，那么使用 git rebase 会怎么样

```
// 先把代码还原到git merge之前的状态

$ git checkout worker
$ git rebase -i master

// 同样的这里会显示一个临时文件，用来修改rebase的详细配置，这里要注意，在实际项目中，至少要保留一个pack，保存后再来查看一下log

$ git log
commit 13e62952cbb7415af0d8e9640a5548a017189c72 (HEAD -> worker)
Author: wb-ly388295 <wb-ly388295@koubei.com>
Date:   Thu May 31 13:04:39 2018 +0800

    新增index.html

commit ae4c56dcf532204084ca0e1f4f2a00dc1263bf57 (master)
Author: wb-ly388295 <wb-ly388295@koubei.com>
Date:   Thu May 31 12:48:11 2018 +0800

    新增index.php

commit 94fdadff81ae11127d9ddce7fadf356e97f85728
Author: wb-ly388295 <wb-ly388295@koubei.com>
Date:   Thu May 31 12:15:56 2018 +0800

    init
```

同样的道理，如果 worker 分支上新增了多个 commit，也可以在设置 rebase-todo 的临时文件中，把指定的 commit 合并为 1 个 commit

## 代码冲突

那么如果作为参照物的分支和当前分支修改了同一个文件的内容怎么办？

这个时候在保存了 rebase 的临时文件后，控制台会提示有文件冲突，只需要找到冲突的文件，保存正确的代码后，使用 git add 命令把冲突的文件添加到暂存区，再使用 git rebase --continue 命令继续执行 rebase 命令即可

> 这里一定要注意 git add 后是不需要手动 git commit 的
