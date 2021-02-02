# git
## git 冲突如何解决
同事在使用git pull代码时，经常会碰到有冲突的情况，提示如下信息：

error: Your local changes to 'c/environ.c' would be overwritten by merge.  Aborting.
Please, commit your changes or stash them before you can merge.

这个意思是说更新下来的内容和本地修改的内容有冲突，先提交你的改变或者先将本地修改暂时存储起来。

处理的方式非常简单，主要是使用git stash命令进行处理，分成以下几个步骤进行处理。

**1、先将本地修改存储起来**

$ git stash

这样本地的所有修改就都被暂时存储起来 。是用git stash list可以看到保存的信息：

![git stash暂存修改](http://www.01happy.com/wp-content/uploads/2013/08/git-stash%E6%9A%82%E5%AD%98%E4%BF%AE%E6%94%B9.png "git stash暂存修改")

git stash暂存修改

其中stash@{0}就是刚才保存的标记。

**2、pull内容**

暂存了本地修改之后，就可以pull了。

$ git pull

**3、还原暂存的内容**

$ git stash pop stash@{0}

系统提示如下类似的信息：

Auto-merging c/environ.c
CONFLICT (content): Merge conflict in c/environ.c

意思就是系统自动合并修改的内容，但是其中有冲突，需要解决其中的冲突。

**4、解决文件中冲突的的部分**

打开冲突的文件，会看到类似如下的内容：

![git冲突内容](http://www.01happy.com/wp-content/uploads/2013/08/git%E5%86%B2%E7%AA%81%E5%86%85%E5%AE%B9.png "git冲突内容")

git冲突内容


其中Updated upstream 和=====之间的内容就是pull下来的内容，====和stashed changes之间的内容就是本地修改的内容。碰到这种情况，git也不知道哪行内容是需要的，所以要自行确定需要的内容。

解决完成之后，就可以正常的提交了。