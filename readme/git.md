因为教程详细，所以行文有些长，新手边看边操作效果出乎你的预料。GitHub 虽然有些许改版，但并无大碍。

▍**Git 是什么？**
Git 是目前世界上最先进的分布式版本控制系统。
工作原理 / 流程：

![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9tbWJpei5xcGljLmNuL21tYml6X3BuZy9lMWptSXpScHdXaWFFeW5wRndXU21yNTlpY2ozODZyS0t4aWFDQzNtNFhIYXhIYWFxTGtZbHVrVFVBTG5ITjc0aWN4M1ZaeUlNM3VFWHo3SkE5bGRpY3dlOEJRLzY0MA?x-oss-process=image/format,png)

- Workspace：工作区

- Index / Stage：暂存区

- Repository：仓库区（或本地仓库）

- Remote：远程仓库

**▍**SVN 与 Git 的最主要的区别？

SVN 是集中式版本控制系统，版本库是集中放在中央服务器的，而干活的时候，用的都是自己的电脑，所以首先要从中央服务器那里得到 最新的版本，然后干活，干完后，需要把自己做完的活推送到中央服务器。集中式版本控制系统是必须联网才能工作，如果在局域网还可以，带宽够大，速度够快，如果在互联网下，如果网速慢的话，就纳闷了。

Git 是分布式版本控制系统，那么它就没有中央服务器的，每个人的电脑就是一个完整的版本库，这样，工作的时候就不需要联网了，因 为版本都是在自己的电脑上。既然每个人的电脑都有一个完整的版本库，那多个人如何协作呢？比如说自己在电脑上改了文件 A，其他人 也在电脑上改了文件 A，这时，你们两之间只需把各自的修改推送给对方，就可以互相看到对方的修改了。

**▍**在 windows 上如何安装 Git？

msysgit 是 windows 版的 Git,如下：

![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9tbWJpei5xcGljLmNuL21tYml6X2pwZy9lMWptSXpScHdXaWFFeW5wRndXU21yNTlpY2ozODZyS0t4b3NpYURMbURmbnY3NVVDVUJWMDZTdUZaQm95YXlySnhhdFB5UGM3Z1VyeVFXTFR5aDBSWmExdy82NDA?x-oss-process=image/format,png)

需要从网上下载一个，然后进行默认安装即可。安装完成后，在开始菜单里面找到 "Git --> Git Bash",如下：

![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9tbWJpei5xcGljLmNuL21tYml6X2pwZy9lMWptSXpScHdXaWFFeW5wRndXU21yNTlpY2ozODZyS0t4RmpRa2c5RDIyc3pMdzFnWjNTczVaWElYYWFpYXRNMDUwWEJ6a0l0U1dFQk1WcnRxOTBhM0JBdy82NDA?x-oss-process=image/format,png)

会弹出一个类似的命令窗口的东西，就说明 Git 安装成功。如下：

![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9tbWJpei5xcGljLmNuL21tYml6X2pwZy9lMWptSXpScHdXaWFFeW5wRndXU21yNTlpY2ozODZyS0t4bjAycWY1WVBFekhNSG5DQzVVZnNmUVVKTFgwUUtGRlU1cGd1Sld5ZE5Rc2lhZVE2YjNOdEhKUS82NDA?x-oss-process=image/format,png)

安装完成后，还需要最后一步设置，在命令行输入如下：

![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9tbWJpei5xcGljLmNuL21tYml6X2pwZy9lMWptSXpScHdXaWFFeW5wRndXU21yNTlpY2ozODZyS0t4SThWVTdtVUdWdEEydHZyNFdMVVNGMHJBdVAwZFZpY1NlaWFiMTM2UHI4c2NhS0FLVzJCVUJYeFEvNjQw?x-oss-process=image/format,png)

因为 Git 是分布式版本控制系统，所以需要填写用户名和邮箱作为一个标识。

注意：git config --global 参数，有了这个参数，表示你这台机器上所有的 Git 仓库都会使用这个配置，当然你也可以对某个仓库指定 的不同的用户名和邮箱。

**▍\*\***如何操作？\*\*

**1\. 创建版本库**

什么是版本库？版本库又名仓库，英文名 repository,你可以简单的理解一个目录，这个目录里面的所有文件都可以被 Git 管理起来，每个文件的修改，删除，Git 都能跟踪，以便任何时刻都可以追踪历史，或者在将来某个时刻还可以将文件”还原”。

所以创建一个版本库也非常简单，如下我是 D 盘 –> www 下 目录下新建一个 testgit 版本库。

![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9tbWJpei5xcGljLmNuL21tYml6X3BuZy9lMWptSXpScHdXaWFFeW5wRndXU21yNTlpY2ozODZyS0t4MWgzdVJTUHcyS0dDcUphNkpLVzJpY0VMTFd2OXlEaWJqSmNRblFRZFdpYWtSSFdDQ0UwWkoxdFd3LzY0MA?x-oss-process=image/format,png)

pwd 命令是用于显示当前的目录。

通过命令 git init 把这个目录变成 git 可以管理的仓库，如下：

![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9tbWJpei5xcGljLmNuL21tYml6X3BuZy9lMWptSXpScHdXaWFFeW5wRndXU21yNTlpY2ozODZyS0t4dzFZVkNsSTcxQkpTTjJ0cHZLYzByOWFzdUFUZThyYzBsOWZnNDFwN1g5Y3o0T0h3QjNkdWF3LzY0MA?x-oss-process=image/format,png)

这时候你当前 testgit 目录下会多了一个.git 的目录，这个目录是 Git 来跟踪管理版本的，没事千万不要手动乱改这个目录里面的文件，否则，会把 git 仓库给破坏了。如下：

![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9tbWJpei5xcGljLmNuL21tYml6X3BuZy9lMWptSXpScHdXaWFFeW5wRndXU21yNTlpY2ozODZyS0t4YW5ldVJ2bHlQSmhuTWdaVExMMzY1aWFUcXZCWmliTHdQaWFxME94aWJsYmhZUklVSmRpYlg1UEhmYVEvNjQw?x-oss-process=image/format,png)

下面先看下 demo 如下演示：

我在版本库 testgit 目录下新建一个记事本文件 readme.txt 内容如下：11111111

第一步：使用命令 git add readme.txt 添加到暂存区里面去。如下：

![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9tbWJpei5xcGljLmNuL21tYml6X3BuZy9lMWptSXpScHdXaWFFeW5wRndXU21yNTlpY2ozODZyS0t4Ykg0b1VuaWNMcnhzcnNNZjViWG90OGhsNEV1RXhJWjB3M3NCTTV6a3REVHh4WUV1UkxPTnhhdy82NDA?x-oss-process=image/format,png)

如果和上面一样，没有任何提示，说明已经添加成功了。

第二步：用命令 git commit 告诉 Git，把文件提交到仓库。

![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9tbWJpei5xcGljLmNuL21tYml6X3BuZy9lMWptSXpScHdXaWFFeW5wRndXU21yNTlpY2ozODZyS0t4MklKaWNEdkY5OVJhc0VqOGxoU25YSTRCNWdsQkFodzU3cUJNdVdVSmRWdzYxc3lrTEJiWkJFQS82NDA?x-oss-process=image/format,png)

现在我们已经提交了一个 readme.txt 文件了，我们下面可以通过命令 git status 来查看是否还有文件未提交，如下：

![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9tbWJpei5xcGljLmNuL21tYml6X3BuZy9lMWptSXpScHdXaWFFeW5wRndXU21yNTlpY2ozODZyS0t4cWNCN0ppYTZPWHlMcWRCaGNKMFg0V1U2MnFOaWNmaWJsbmQwclpGM3l6NkE3alJGdmY4SzI5UWJnLzY0MA?x-oss-process=image/format,png)

说明没有任何文件未提交，但是我现在继续来改下 readme.txt 内容，比如我在下面添加一行 2222222222 内容，继续使用 git status 来查看下结果，如下：

![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9tbWJpei5xcGljLmNuL21tYml6X3BuZy9lMWptSXpScHdXaWFFeW5wRndXU21yNTlpY2ozODZyS0t4OFN4Y1MyMmx2dUQ5N2g1akdKZE1Sd2c1bVZLMlhCeWlhbFpZM0JvRTMyOGNmUjB2UHVLZkNpY2cvNjQw?x-oss-process=image/format,png)

上面的命令告诉我们 readme.txt 文件已被修改，但是未被提交的修改。

把文件添加到版本库中。

首先要明确下，所有的版本控制系统，只能跟踪文本文件的改动，比如 txt 文件，网页，所有程序的代码等，Git 也不列外，版本控制系统可以告诉你每次的改动，但是图片，视频这些二进制文件，虽能也能由版本控制系统管理，但没法跟踪文件的变化，只能把二进制文件每次改动串起来，也就是知道图片从 1kb 变成 2kb，但是到底改了啥，版本控制也不知道。

接下来我想看下 readme.txt 文件到底改了什么内容，如何查看呢？可以使用如下命令：

git diff readme.txt 如下：

![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9tbWJpei5xcGljLmNuL21tYml6X3BuZy9lMWptSXpScHdXaWFFeW5wRndXU21yNTlpY2ozODZyS0t4VU5UMFRHT2ljZ1BpY0lpY0pjT2hmSmdvczRLZXF6ZnVRZ09pY2c1MFZhTk1kQkllN3RreExlWHM1QS82NDA?x-oss-process=image/format,png)

如上可以看到，readme.txt 文件内容从一行 11111111 改成 二行 添加了一行 22222222 内容。

知道了对 readme.txt 文件做了什么修改后，我们可以放心的提交到仓库了，提交修改和提交文件是一样的 2 步(第一步是 git add 第二步是：git commit)。

如下：
![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9tbWJpei5xcGljLmNuL21tYml6X3BuZy9lMWptSXpScHdXaWFFeW5wRndXU21yNTlpY2ozODZyS0t4VW4yMUJDOXFQSDhON3BmZUtYcFdGRDVURWlhMDROR1Q5emljV3FkWHd4YVFnSkZncUd1SDVGa2cvNjQw?x-oss-process=image/format,png)

**2\. 版本回退：**
如上，我们已经学会了修改文件，现在我继续对 readme.txt 文件进行修改，再增加一行

内容为 33333333333333.继续执行命令如下：

![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9tbWJpei5xcGljLmNuL21tYml6X3BuZy9lMWptSXpScHdXaWFFeW5wRndXU21yNTlpY2ozODZyS0t4OFRaTTc2NWFDazdGVkhKdDZWRXRLc2VCU0J3aGRGYzlFd2NoYlZqaGdDSkhQYkZnWmd4UkRRLzY0MA?x-oss-process=image/format,png)

现在我已经对 readme.txt 文件做了三次修改了，那么我现在想查看下历史记录，如何查呢？我们现在可以使用命令 git log 演示如下所 示：

![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9tbWJpei5xcGljLmNuL21tYml6X3BuZy9lMWptSXpScHdXaWFFeW5wRndXU21yNTlpY2ozODZyS0t4WEJUZW5lQUk5MlpPZ3ZoVE96aWNmWkt2SGlhaWJEcW0wQnJIRXpQck9vbzVvc0ZjcUhyUjI4ckJnLzY0MA?x-oss-process=image/format,png)

git log 命令显示从最近到最远的显示日志，我们可以看到最近三次提交，最近的一次是,增加内容为 333333.上一次是添加内容 222222， 第一次默认是 111111.如果嫌上面显示的信息太多的话，我们可以使用命令 git log –pretty=oneline 演示如下：

![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9tbWJpei5xcGljLmNuL21tYml6X3BuZy9lMWptSXpScHdXaWFFeW5wRndXU21yNTlpY2ozODZyS0t4MGZ3NHlDQUx5dW5kN2Z1dUljZFJWdDdYd0hZVWZSQUFOMzhtekV5eGw1U3M4WnV2enJnN0tRLzY0MA?x-oss-process=image/format,png)

现在我想使用版本回退操作，我想把当前的版本回退到上一个版本，要使用什么命令呢？可以使用如下 2 种命令，第一种是：git reset --hard HEAD^ 那么如果要回退到上上个版本只需把 HEAD^ 改成 HEAD^^ 以此类推。那如果要回退到前 100 个版本的话，使用上面的方法肯 定不方便，我们可以使用下面的简便命令操作：git reset --hard HEAD~100 即可。未回退之前的 readme.txt 内容如下：

![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9tbWJpei5xcGljLmNuL21tYml6X3BuZy9lMWptSXpScHdXaWFFeW5wRndXU21yNTlpY2ozODZyS0t4S210azZ1TmliY09KT2lhaWE5NTVyclNLT2F5cVJVZUFkNjJxaWJpY1ozVW9SaWJraWNqTWhscDJWSG40US82NDA?x-oss-process=image/format,png)

如果想回退到上一个版本的命令如下操作：

![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9tbWJpei5xcGljLmNuL21tYml6X3BuZy9lMWptSXpScHdXaWFFeW5wRndXU21yNTlpY2ozODZyS0t4MWVxRHIwckJpYzBZaWFtZVRTcGZEYkdpYm52NmliWHo5STdlZ2pyWWNNeTlKbWRnQ2YyQ0RBZURvdy82NDA?x-oss-process=image/format,png)

再来查看下 readme.txt 内容如下：通过命令 cat readme.txt 查看

![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9tbWJpei5xcGljLmNuL21tYml6X3BuZy9lMWptSXpScHdXaWFFeW5wRndXU21yNTlpY2ozODZyS0t4QVZyMTZwS09sRlp4RXF3V05zalVNbXpjZGlhelhwMklZZW1IQTl1cG43Rkg2ZU5LbG5pYTU3TncvNjQw?x-oss-process=image/format,png)

可以看到，内容已经回退到上一个版本了。我们可以继续使用 git log 来查看下历史记录信息，如下：

![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9tbWJpei5xcGljLmNuL21tYml6X3BuZy9lMWptSXpScHdXaWFFeW5wRndXU21yNTlpY2ozODZyS0t4endSNmliTFBpYTlIbWR6TTEzOE14ZXYyYjZxanNXbFJaUHRVREkxWXc3M1FWMUhmY0NZaWIzRGpRLzY0MA?x-oss-process=image/format,png)

我们看到 增加 333333 内容我们没有看到了，但是现在我想回退到最新的版本，如：有 333333 的内容要如何恢复呢？我们可以通过版本号回退，使用命令方法如下：

git reset --hard 版本号 ，但是现在的问题假如我已经关掉过一次命令行或者 333 内容的版本号我并不知道呢？要如何知道增加 3333 内 容的版本号呢？可以通过如下命令即可获取到版本号：git reflog 演示如下：

![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9tbWJpei5xcGljLmNuL21tYml6X3BuZy9lMWptSXpScHdXaWFFeW5wRndXU21yNTlpY2ozODZyS0t4cEZtaWNkNWljM1FjMUd6NEZWbFRBaFhvZGJnT0NqNU5CTGljaWJEZzdyckZKaWFsSkF1ck03TDdhTlEvNjQw?x-oss-process=image/format,png)

通过上面的显示我们可以知道，增加内容 3333 的版本号是 6fcfc89.我们现在可以命令

git reset --hard 6fcfc89 来恢复了。演示如下：

![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9tbWJpei5xcGljLmNuL21tYml6X3BuZy9lMWptSXpScHdXaWFFeW5wRndXU21yNTlpY2ozODZyS0t4bkJZVmozbHAwdkg2YXpkTG9UOVVnWnhTNHFBM2ZiZU5ERGVQcFloR1dpY2xVbDYwano5VEtMdy82NDA?x-oss-process=image/format,png)

可以看到 目前已经是最新的版本了。

**3\. 理解工作区与暂存区的区别？**
工作区：就是你在电脑上看到的目录，比如目录下 testgit 里的文件(.git 隐藏目录版本库除外)。或者以后需要再新建的目录文件等等都 属于工作区范畴。
版本库(Repository)：工作区有一个隐藏目录.git,这个不属于工作区，这是版本库。其中版本库里面存了很多东西，其中最重要的就是 stage(暂存区)，还有 Git 为我们自动创建了第一个分支 master,以及指向 master 的一个指针 HEAD。

我们前面说过使用 Git 提交文件到版本库有两步：

第一步：是使用 git add 把文件添加进去，实际上就是把文件添加到暂存区。

第二步：使用 git commit 提交更改，实际上就是把暂存区的所有内容提交到当前分支上。

我们继续使用 demo 来演示下：

我们在 readme.txt 再添加一行内容为 4444444，接着在目录下新建一个文件为 test.txt 内容为 test，我们先用命令 git status 来查看下 状态，如下：

![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9tbWJpei5xcGljLmNuL21tYml6X3BuZy9lMWptSXpScHdXaWFFeW5wRndXU21yNTlpY2ozODZyS0t4ZDdzeUdwVDY3T1hzYkZMWG5reEYwYnhNbVdWcnc4SUFpYW0xMzhZMDltRWlhcmhkQzdvNzFnU0EvNjQw?x-oss-process=image/format,png)

现在我们先使用 git add 命令把 2 个文件都添加到暂存区中，再使用 git status 来查看下状态，如下：

![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9tbWJpei5xcGljLmNuL21tYml6X3BuZy9lMWptSXpScHdXaWFFeW5wRndXU21yNTlpY2ozODZyS0t4M29KNFNjbDNURUkyb09tbVo2bDZ6VEg0NVdtak1NQUhHaGRNUXZ0aWFTOUhwdHRHNE0yQ3Z2dy82NDA?x-oss-process=image/format,png)

接着我们可以使用 git commit 一次性提交到分支上，如下：

![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9tbWJpei5xcGljLmNuL21tYml6X3BuZy9lMWptSXpScHdXaWFFeW5wRndXU21yNTlpY2ozODZyS0t4clh0MU1hQTRSMzF6bklJMDE0MldtOUR6N0lGNDljZDRhNzNwcEM5UUZOS29pYU1pY2RsSGh2aFEvNjQw?x-oss-process=image/format,png)

**4\. Git 撤销修改和删除文件操作。**
1\. 撤销修改：
比如我现在在 readme.txt 文件里面增加一行 内容为 555555555555，我们先通过命令查看如下：

![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9tbWJpei5xcGljLmNuL21tYml6X3BuZy9lMWptSXpScHdXaWFFeW5wRndXU21yNTlpY2ozODZyS0t4QWliWkgzdE9OZ0dwOWhXcmlhb0hqZFZXZ2R1VFd4WVZJbkVYTzZjRXlpY2RaVEU1ckhHaWJTdW9NUS82NDA?x-oss-process=image/format,png)

在我未提交之前，我发现添加 5555555555555 内容有误，所以我得马上恢复以前的版本，现在我可以有如下几种方法可以做修改：

第一：如果我知道要删掉那些内容的话，直接手动更改去掉那些需要的文件，然后 add 添加到暂存区，最后 commit 掉。

第二：我可以按以前的方法直接恢复到上一个版本。使用 git reset --hard HEAD^

但是现在我不想使用上面的 2 种方法，我想直接想使用撤销命令该如何操作呢？首先在做撤销之前，我们可以先用 git status 查看下当 前的状态。如下所示：

![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9tbWJpei5xcGljLmNuL21tYml6X3BuZy9lMWptSXpScHdXaWFFeW5wRndXU21yNTlpY2ozODZyS0t4VmswVmw0ak1xb2w3a1pPbm9QTzB0RWEwNVpPZkRpY2FyaWJyaWI4T1oxYTNJTnBLa2ljaWNHVlNJRFEvNjQw?x-oss-process=image/format,png)

可以发现，Git 会告诉你，git checkout -- file 可以丢弃工作区的修改，如下命令：
git checkout -- readme.txt,如下所示：

![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9tbWJpei5xcGljLmNuL21tYml6X3BuZy9lMWptSXpScHdXaWFFeW5wRndXU21yNTlpY2ozODZyS0t4dEdLZDVhNGc0TUpoMWVDNExXeXRsYVRtenlpYnpaQnkzUXo0QXJobFJqZG1HcVpyT1JLTUFiZy82NDA?x-oss-process=image/format,png)

命令 git checkout --readme.txt 意思就是，把 readme.txt 文件在工作区做的修改全部撤销，这里有 2 种情况，如下：

1.readme.txt 自动修改后，还没有放到暂存区，使用 撤销修改就回到和版本库一模一样的状态。 2.另外一种是 readme.txt 已经放入暂存区了，接着又作了修改，撤销修改就回到添加暂存区后的状态。
对于第二种情况，我想我们继续做 demo 来看下，假如现在我对 readme.txt 添加一行 内容为 6666666666666，我 git add 增加到暂存区后，接着添加内容 7777777，我想通过撤销命令让其回到暂存区后的状态。如下所示：

![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9tbWJpei5xcGljLmNuL21tYml6X3BuZy9lMWptSXpScHdXaWFFeW5wRndXU21yNTlpY2ozODZyS0t4ajNoQ2ZpYjY4ZGlidjY1MHNUTWJ0SG9yRWp2V2NsU2dpY25ZYlNOcVdJbFJhT2liNWpwb0tMck1UZy82NDA?x-oss-process=image/format,png)

注意：命令 git checkout -- readme.txt 中的 -- 很重要，如果没有 -- 的话，那么命令变成创建分支了。

2\. 删除文件。
假如我现在版本库 testgit 目录添加一个文件 b.txt,然后提交。如下：

![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9tbWJpei5xcGljLmNuL21tYml6X3BuZy9lMWptSXpScHdXaWFFeW5wRndXU21yNTlpY2ozODZyS0t4Z3pxU1E1bDU4TmZxRk84eVVUMjdCcTFZaGliQVdMRzJaeUN3QVBQSEp0b2JVVVQwMGZvSVZWQS82NDA?x-oss-process=image/format,png)

如上：一般情况下，可以直接在文件目录中把文件删了，或者使用如上 rm 命令：rm b.txt ，如果我想彻底从版本库中删掉了此文件的话 ，可以再执行 commit 命令 提交掉，现在目录是这样的，

![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9tbWJpei5xcGljLmNuL21tYml6X3BuZy9lMWptSXpScHdXaWFFeW5wRndXU21yNTlpY2ozODZyS0t4UERPcklzUjZHVGVOZzBHQVdOS2M5VDFmamlibU5VMXd0QWhsZ2I5TFFTM0tPRWs0ck5vMElMQS82NDA?x-oss-process=image/format,png)

只要没有 commit 之前，如果我想在版本库中恢复此文件如何操作呢？

可以使用如下命令 git checkout -- b.txt，如下所示：

![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9tbWJpei5xcGljLmNuL21tYml6X3BuZy9lMWptSXpScHdXaWFFeW5wRndXU21yNTlpY2ozODZyS0t4cm5WMlcyaG1kMHFjYmFvb3hKRHk0b0pQVEJGNThzOERoZDkzb0EySTZOVExDaHhvRk5IbnJRLzY0MA?x-oss-process=image/format,png)

再来看看我们 testgit 目录，添加了 3 个文件了。如下所示：

![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9tbWJpei5xcGljLmNuL21tYml6X3BuZy9lMWptSXpScHdXaWFFeW5wRndXU21yNTlpY2ozODZyS0t4bzIxNzJZZUozd05TT3pSRjNwSWJCTzBoOWd4NzVpYk12NUhVR1Bqd0RuNjJ2YjR2UG9rNmVBZy82NDA?x-oss-process=image/format,png)

**▍**远程仓库
在了解之前，先注册 github 账号，由于你的本地 Git 仓库和 github 仓库之间的传输是通过 SSH 加密的，所以需要一点设置：
第一步：创建 SSH Key。在用户主目录下，看看有没有.ssh 目录，如果有，再看看这个目录下有没有 id_rsa 和 id_rsa.pub 这两个文件， 如果有的话，直接跳过此如下命令，如果没有的话，打开命令行，输入如下命令：

ssh-keygen -t rsa –C “youremail@example.com”, 由于我本地此前运行过一次，所以本地有，如下所示：

![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9tbWJpei5xcGljLmNuL21tYml6X3BuZy9lMWptSXpScHdXaWFFeW5wRndXU21yNTlpY2ozODZyS0t4YnlHMjdHa3Q3S1F0NEJlWktYVmdQeXlXYTZndTY4U2pDT1M3V05MbVp2UjZLVUVEWkZIMGVBLzY0MA?x-oss-process=image/format,png)

id_rsa 是私钥，不能泄露出去，id_rsa.pub 是公钥，可以放心地告诉任何人。

第二步：登录 github,打开” settings”中的 SSH Keys 页面，然后点击“Add SSH Key”,填上任意 title，在 Key 文本框里黏贴 id_rsa.pub 文件的内容。

![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9tbWJpei5xcGljLmNuL21tYml6X3BuZy9lMWptSXpScHdXaWFFeW5wRndXU21yNTlpY2ozODZyS0t4OUhmUkl3Z3d1VGtpYWdnczhPUzFDWllIR01wbktWeDZZbDJiaWNNOHM5TkdiNjloclZNemlhQkFRLzY0MA?x-oss-process=image/format,png)

点击 Add Key，你就应该可以看到已经添加的 key。

![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9tbWJpei5xcGljLmNuL21tYml6X3BuZy9lMWptSXpScHdXaWFFeW5wRndXU21yNTlpY2ozODZyS0t4RUhPMHd6TTdScEppYmR2SEF6QXdTaWFqTXlNbVJIRFVyajVGclhkaWM2RjAzT0RNMktvRnl0TGx3LzY0MA?x-oss-process=image/format,png)

1\. 如何添加远程库？
现在的情景是：我们已经在本地创建了一个 Git 仓库后，又想在 github 创建一个 Git 仓库，并且希望这两个仓库进行远程同步，这样 github 的仓库可以作为备份，又可以其他人通过该仓库来协作。

首先，登录 github 上，然后在右上角找到“create a new repo”创建一个新的仓库。如下：

![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9tbWJpei5xcGljLmNuL21tYml6X3BuZy9lMWptSXpScHdXaWFFeW5wRndXU21yNTlpY2ozODZyS0t4VlF1U09IMkdFNmliQ3U0WWxjMGtEcnBGWTE1WGI5SGljTmE4V2F6UGU5a29WSjBpYzY3Szd4YTdnLzY0MA?x-oss-process=image/format,png)

在 Repository name 填入 testgit，其他保持默认设置，点击“Create repository”按钮，就成功地创建了一个新的 Git 仓库：

![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9tbWJpei5xcGljLmNuL21tYml6X3BuZy9lMWptSXpScHdXaWFFeW5wRndXU21yNTlpY2ozODZyS0t4QTV2RTRZOGhHZnhraWFieGd5bUdwd2lhQlliODVWU1FYSHowemljemIwQTh2cmtoOGNpYjFpY0ZhaGcvNjQw?x-oss-process=image/format,png)

目前，在 GitHub 上的这个 testgit 仓库还是空的，GitHub 告诉我们，可以从这个仓库克隆出新的仓库，也可以把一个已有的本地仓库与之 关联，然后，把本地仓库的内容推送到 GitHub 仓库。

现在，我们根据 GitHub 的提示，在本地的 testgit 仓库下运行命令：

git remote add origin https://github.com/tugenhua0707/testgit.git

所有的如下：

![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9tbWJpei5xcGljLmNuL21tYml6X3BuZy9lMWptSXpScHdXaWFFeW5wRndXU21yNTlpY2ozODZyS0t4QWE3dmVqYUoyVmM5OUNBNWIwR2xLRlV0VkVJaWFSd2xic0JuaWNwbXhpY1F3NFpURWtQZDg3TlRRLzY0MA?x-oss-process=image/format,png)

把本地库的内容推送到远程，使用 git push 命令，实际上是把当前分支 master 推送到远程。

由于远程库是空的，我们第一次推送 master 分支时，加上了 –u 参数，Git 不但会把本地的 master 分支内容推送的远程新的 master 分支， 还会把本地的 master 分支和远程的 master 分支关联起来，在以后的推送或者拉取时就可以简化命令。推送成功后，可以立刻在 github 页面中看到远程库的内容已经和本地一模一样了，上面的要输入 github 的用户名和密码如下所示：

![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9tbWJpei5xcGljLmNuL21tYml6X3BuZy9lMWptSXpScHdXaWFFeW5wRndXU21yNTlpY2ozODZyS0t4cHhnVW1kUDA5MlZzcEhCaWJVWFZ2YThDY0RkZ1FIeGlheExBaFh1Y1pKMFBBZThBMU1aZlp0N0EvNjQw?x-oss-process=image/format,png)

从现在起，只要本地作了提交，就可以通过如下命令：

```
git push origin master
```

把本地 master 分支的最新修改推送到 github 上了，现在你就拥有了真正的分布式版本库了。

2\. 如何从远程库克隆？

上面我们了解了先有本地库，后有远程库时候，如何关联远程库。

现在我们想，假如远程库有新的内容了，我想克隆到本地来 如何克隆呢？

首先，登录 github，创建一个新的仓库，名字叫 testgit2.如下：

![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9tbWJpei5xcGljLmNuL21tYml6X3BuZy9lMWptSXpScHdXaWFFeW5wRndXU21yNTlpY2ozODZyS0t4eUwzb0xLd1F3V0ZtdzBNZzVwRG45eEpDZ1hnMjd1d0dNV2NwRVFjRzBtaWFpYzhMdXlla0J3MUEvNjQw?x-oss-process=image/format,png)

如下，我们看到：

![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9tbWJpei5xcGljLmNuL21tYml6X3BuZy9lMWptSXpScHdXaWFFeW5wRndXU21yNTlpY2ozODZyS0t4dFVPOXJiN05VbzVJcTdVQ3hzUmtFZlN2aHZLQVNrd1o3RkdnVzJzNTQ4VzNtUloyZk1XRU93LzY0MA?x-oss-process=image/format,png)

现在，远程库已经准备好了，下一步是使用命令 git clone 克隆一个本地库了。如下所示：

![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9tbWJpei5xcGljLmNuL21tYml6X3BuZy9lMWptSXpScHdXaWFFeW5wRndXU21yNTlpY2ozODZyS0t4MDFEdnpiRDFoazZRQ3Q1OWdMaWFDSFE3dk5MRENKMUVQZGlhZFVkQzZ2bnJxOVRGQUh4RzdlZVEvNjQw?x-oss-process=image/format,png)

接着在我本地目录下 生成 testgit2 目录了，如下所示：

![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9tbWJpei5xcGljLmNuL21tYml6X3BuZy9lMWptSXpScHdXaWFFeW5wRndXU21yNTlpY2ozODZyS0t4eWNSR29JN3Z6TU5VRXpNdjdjZlFkZU5BZTZhR3Q0RDk0TXM0eFFrVXpOYnJxZVdPZHdHemJRLzY0MA?x-oss-process=image/format,png)

**▍**创建与合并分支
在 版本回退里，你已经知道，每次提交，Git 都把它们串成一条时间线，这条时间线就是一个分支。截止到目前，只有一条时间线，在 Git 里，这个分支叫主分支，即 master 分支。HEAD 严格来说不是指向提交，而是指向 master，master 才是指向提交的，所以，HEAD 指向的就 是当前分支。

首先，我们来创建 dev 分支，然后切换到 dev 分支上。如下操作：

![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9tbWJpei5xcGljLmNuL21tYml6X3BuZy9lMWptSXpScHdXaWFFeW5wRndXU21yNTlpY2ozODZyS0t4SGtaekU5Sk1XVVFycjBwY3ZGaGN2VVFtdnp4bjd6VnBtVjluaWFhTERKTjVIZmZoRTBHOFRFUS82NDA?x-oss-process=image/format,png)

git checkout 命令加上 –b 参数表示创建并切换，相当于如下 2 条命令

```
git branch dev

git checkout dev
```

git branch 查看分支，会列出所有的分支，当前分支前面会添加一个星号。然后我们在 dev 分支上继续做 demo，比如我们现在在 readme.txt 再增加一行 7777777777777

首先我们先来查看下 readme.txt 内容，接着添加内容 77777777，如下：

![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9tbWJpei5xcGljLmNuL21tYml6X3BuZy9lMWptSXpScHdXaWFFeW5wRndXU21yNTlpY2ozODZyS0t4bWMzMnQ2c25nUGZ3OW1pY1hzblM3NHRLZzJkOWVZT2xMWTNGOVdkVkx6eVpwem1ZZXpqN0NYZy82NDA?x-oss-process=image/format,png)

现在 dev 分支工作已完成，现在我们切换到主分支 master 上，继续查看 readme.txt 内容如下：

![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9tbWJpei5xcGljLmNuL21tYml6X3BuZy9lMWptSXpScHdXaWFFeW5wRndXU21yNTlpY2ozODZyS0t4SGtMbEtuaEZNN2o3eExIV3ZKY3Mwd3U2VFVFZDdFSlQ4Zm5lU0hVU2lhSVBkbnJtSG95dXdZdy82NDA?x-oss-process=image/format,png)

现在我们可以把 dev 分支上的内容合并到分支 master 上了，可以在 master 分支上，使用如下命令 git merge dev 如下所示：

![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9tbWJpei5xcGljLmNuL21tYml6X3BuZy9lMWptSXpScHdXaWFFeW5wRndXU21yNTlpY2ozODZyS0t4YmR3dTlmVjNuRUJsSWlhSmJPNGhydllIaWJCTFZ5ajZaMHo4Q0x4eW9CbjVVUUNkMWNYWUlpY2tBLzY0MA?x-oss-process=image/format,png)

git merge 命令用于合并指定分支到当前分支上，合并后，再查看 readme.txt 内容，可以看到，和 dev 分支最新提交的是完全一样的。

注意到上面的 Fast-forward 信息，Git 告诉我们，这次合并是“快进模式”，也就是直接把 master 指向 dev 的当前提交，所以合并速度非常快。

合并完成后，我们可以接着删除 dev 分支了，操作如下：

![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9tbWJpei5xcGljLmNuL21tYml6X3BuZy9lMWptSXpScHdXaWFFeW5wRndXU21yNTlpY2ozODZyS0t4ZGZHaWJIeTJaNmliYWtJeWpKNVVDc0lJaEM2b0RmdlByUTQ2Y0R5TVpQalN4bFk3a2JSUFlkVHcvNjQw?x-oss-process=image/format,png)

总结创建与合并分支命令如下：

查看分支：`git branch`

创建分支：`git branch name`

切换分支：`git checkout name`

创建+切换分支：`git checkout –b name`

合并某分支到当前分支：`git merge name`

删除分支：`git branch –d name`

如何解决冲突？
下面我们还是一步一步来，先新建一个新分支，比如名字叫 fenzhi1，在 readme.txt 添加一行内容 8888888，然后提交，如下所示：

![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9tbWJpei5xcGljLmNuL21tYml6X3BuZy9lMWptSXpScHdXaWFFeW5wRndXU21yNTlpY2ozODZyS0t4SmtQSVBuUlRqTDVIT2VXSEVIdW1oWEJIQmliZU1NWGRwTnRNNWh6a1Z2M1l2OGljN042b1JVN2cvNjQw?x-oss-process=image/format,png)

同样，我们现在切换到 master 分支上来，也在最后一行添加内容，内容为 99999999，如下所示：

![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9tbWJpei5xcGljLmNuL21tYml6X3BuZy9lMWptSXpScHdXaWFFeW5wRndXU21yNTlpY2ozODZyS0t4TWlhM1prQXAxZGliRnQ5STUzMlhSRTUwRjVVeEhkWk5nWFpFVXI5ZmRlTzlWV3dobWFIMVhQWEEvNjQw?x-oss-process=image/format,png)

现在我们需要在 master 分支上来合并 fenzhi1，如下操作：

![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9tbWJpei5xcGljLmNuL21tYml6X3BuZy9lMWptSXpScHdXaWFFeW5wRndXU21yNTlpY2ozODZyS0t4TnZaU0s4RkZJV0JTT0tnOElMYjFvY2dRUHExY0JNekpFMmgxSXdNcTJQeGZuTmFtb2cwT2xBLzY0MA?x-oss-process=image/format,png)

Git 用<<<<<<<，=======，>>>>>>>标记出不同分支的内容，其中<<<head 是指主分支修改的内容，>>>>>fenzhi1 是指 fenzhi1 上修改的内 容，我们可以修改下如下后保存：</head 是指主分支修改的内容，>

![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9tbWJpei5xcGljLmNuL21tYml6X3BuZy9lMWptSXpScHdXaWFFeW5wRndXU21yNTlpY2ozODZyS0t4ZWM0aWMxOHJYb1lrSTBheWVKVVUwZHozT3N6UHJLZXlNQjhUZHVzM1Z3dW5DSnBqaWMzS0Y4YUEvNjQw?x-oss-process=image/format,png)

如果我想查看分支合并的情况的话，需要使用命令 git log.命令行演示如下：

![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9tbWJpei5xcGljLmNuL21tYml6X3BuZy9lMWptSXpScHdXaWFFeW5wRndXU21yNTlpY2ozODZyS0t4RWJQaWJlRFpDWHZZcTROWGZPbG5XMnZYSXU3cTd2WDVucHNtTmliUGljZVlVT3Z4VHRGbGphMXNRLzY0MA?x-oss-process=image/format,png)

3.分支管理策略。通常合并分支时，git 一般使用”Fast forward”模式，在这种模式下，删除分支后，会丢掉分支信息，现在我们来使 用带参数 –no-ff 来禁用”Fast forward”模式。首先我们来做 demo 演示下：

- 创建一个 dev 分支。

- 修改 readme.txt 内容。

- 添加到暂存区。

- 切换回主分支(master)。

- 合并 dev 分支，使用命令 git merge –no-ff -m “注释” dev

- 1 查看历史记录
  截图如下：

![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9tbWJpei5xcGljLmNuL21tYml6X3BuZy9lMWptSXpScHdXaWFFeW5wRndXU21yNTlpY2ozODZyS0t4N2ljZXluMTNKWGZYRFlpYVRVRE85eHM3S1hJTUJSQjFTakZKdW9iSENSOTdId2Fic29JazVqbXcvNjQw?x-oss-process=image/format,png)

分支策略：首先 master 主分支应该是非常稳定的，也就是用来发布新版本，一般情况下不允许在上面干活，干活一般情况下在新建的 dev 分支上干活，干完后，比如上要发布，或者说 dev 分支代码稳定后可以合并到主分支 master 上来。

**▍**bug 分支
在开发中，会经常碰到 bug 问题，那么有了 bug 就需要修复，在 Git 中，分支是很强大的，每个 bug 都可以通过一个临时分支来修复，修复完成后，合并分支，然后将临时的分支删除掉。

比如我在开发中接到一个 404 bug 时候，我们可以创建一个 404 分支来修复它，但是，当前的 dev 分支上的工作还没有提交。比如如下：

![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9tbWJpei5xcGljLmNuL21tYml6X3BuZy9lMWptSXpScHdXaWFFeW5wRndXU21yNTlpY2ozODZyS0t4djF4emVaV2xhYjhVdldwMTdPU1FCd0Z2UTlWQVNaR1U0QjVpYUY2TnZSN2tsOU1YYVBqd3VHUS82NDA?x-oss-process=image/format,png)

并不是我不想提交，而是工作进行到一半时候，我们还无法提交，比如我这个分支 bug 要 2 天完成，但是我 issue-404 bug 需要 5 个小时内完成。怎么办呢？还好，Git 还提供了一个 stash 功能，可以把当前工作现场 ”隐藏起来”，等以后恢复现场后继续工作。如下：

![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9tbWJpei5xcGljLmNuL21tYml6X3BuZy9lMWptSXpScHdXaWFFeW5wRndXU21yNTlpY2ozODZyS0t4WEtiMWxTRWRuYWF2Q25pYmNPNFg1SnN1bTFCaWJoUE5JQ052RTRFZmljZ09NaWFHbzk1QmlhNjZySHcvNjQw?x-oss-process=image/format,png)

所以现在我可以通过创建 issue-404 分支来修复 bug 了。

首先我们要确定在那个分支上修复 bug，比如我现在是在主分支 master 上来修复的，现在我要在 master 分支上创建一个临时分支，演示如 下：

![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9tbWJpei5xcGljLmNuL21tYml6X3BuZy9lMWptSXpScHdXaWFFeW5wRndXU21yNTlpY2ozODZyS0t4VmxJdGZtczBwWWliZ1BkSFJNVnlpYUhRR2ljb00wN2lhcEtudlU3eFdxOEsxeWhxZmp6bnJyWEtCdy82NDA?x-oss-process=image/format,png)

修复完成后，切换到 master 分支上，并完成合并，最后删除 issue-404 分支。演示如下：

![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9tbWJpei5xcGljLmNuL21tYml6X3BuZy9lMWptSXpScHdXaWFFeW5wRndXU21yNTlpY2ozODZyS0t4TVZ0bDltNGVBZlRuc0d0TTFpYmhlc05vczlJUHdycGNkaWJjaGM3b2NGUWZpYkdjbUpaekp0MUhnLzY0MA?x-oss-process=image/format,png)
现在，我们回到 dev 分支上干活了。

![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9tbWJpei5xcGljLmNuL21tYml6X3BuZy9lMWptSXpScHdXaWFFeW5wRndXU21yNTlpY2ozODZyS0t4WEVPRlBQZ0NJTW5JSjh1ZE5Xb2NtV3dobXdXaWJ1dklTaDdwSXhnRGhEVG1RQmRSWG5kaWFsYncvNjQw?x-oss-process=image/format,png)

工作区是干净的，那么我们工作现场去哪里呢？我们可以使用命令 git stash list 来查看下。如下：

![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9tbWJpei5xcGljLmNuL21tYml6X3BuZy9lMWptSXpScHdXaWFFeW5wRndXU21yNTlpY2ozODZyS0t4b2trUTg1UERSVmtUMjNqUUNQUHFUSWNpYnRidEZ4SWFYN1pIc2hWeGwzNVQzUVJ2czVWVE9iQS82NDA?x-oss-process=image/format,png)

工作现场还在，Git 把 stash 内容存在某个地方了，但是需要恢复一下，可以使用如下 2 个方法：

1.git stash apply 恢复，恢复后，stash 内容并不删除，你需要使用命令 git stash drop 来删除。 2.另一种方式是使用 git stash pop,恢复的同时把 stash 内容也删除了。
演示如下

![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9tbWJpei5xcGljLmNuL21tYml6X3BuZy9lMWptSXpScHdXaWFFeW5wRndXU21yNTlpY2ozODZyS0t4VXpFNzV4QThkZVhGeGR3YW9ra0V0WFhXS2VRdzFmRmxWelMxT1U0MHVmcXhCYTMxcmp5aWNVZy82NDA?x-oss-process=image/format,png)

**▍**多人协作
当你从远程库克隆时候，实际上 Git 自动把本地的 master 分支和远程的 master 分支对应起来了，并且远程库的默认名称是 origin。

1.  要查看远程库的信息 使用  `git remote`

2.  要查看远程库的详细信息 使用  `git remote –v`
    如下演示：

![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9tbWJpei5xcGljLmNuL21tYml6X3BuZy9lMWptSXpScHdXaWFFeW5wRndXU21yNTlpY2ozODZyS0t4eEZGRG5tdUp0RGlid2JUQ1FXUzR6NEU1RE4yTzV4bnE1V0x6SVB5OHkzZlBMdDNYaFVsd0ZpY0EvNjQw?x-oss-process=image/format,png)

**1\. 推送分支：**

推送分支就是把该分支上所有本地提交到远程库中，推送时，要指定本地分支，这样，Git 就会把该分支推送到远程库对应的远程分支上 ：使用命令  `git push origin master`

比如我现在的 github 上的 readme.txt 代码如下：

![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9tbWJpei5xcGljLmNuL21tYml6X3BuZy9lMWptSXpScHdXaWFFeW5wRndXU21yNTlpY2ozODZyS0t4ak1KYXJMUnpSUElwUmRscjBueFlWOGFzelpiaE1iWlpjY2xUR29VNjVnVkVsVExyNWwyckJ3LzY0MA?x-oss-process=image/format,png)

本地的 readme.txt 代码如下：

![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9tbWJpei5xcGljLmNuL21tYml6X3BuZy9lMWptSXpScHdXaWFFeW5wRndXU21yNTlpY2ozODZyS0t4Tlo3UnNzYkQzeDMwYVRTTmx2aFpBbWVYd0RRbnhETWh5N3JqZ3FvdWFZWGF0a2pCWWlhUlJ4Zy82NDA?x-oss-process=image/format,png)

现在我想把本地更新的 readme.txt 代码推送到远程库中，使用命令如下：

![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9tbWJpei5xcGljLmNuL21tYml6X3BuZy9lMWptSXpScHdXaWFFeW5wRndXU21yNTlpY2ozODZyS0t4bFlNcWI5ZEdxcTh2SjNuNmpZS3Q4RG0xQWYwaWFmWGgyZUhTSWppYWprNFF0YXdLWDVOSVdrUFEvNjQw?x-oss-process=image/format,png)

我们可以看到如上，推送成功，我们可以继续来截图 github 上的 readme.txt 内容 如下：

![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9tbWJpei5xcGljLmNuL21tYml6X3BuZy9lMWptSXpScHdXaWFFeW5wRndXU21yNTlpY2ozODZyS0t4TWZkVUVMSThvWlV1bXRpYTkyRUdPYjhIVm9CSnFBenhYTVhTVXNSTDlNbm1uOTRXM3RPUTlqUS82NDA?x-oss-process=image/format,png)

可以看到 推送成功了，如果我们现在要推送到其他分支，比如 dev 分支上，我们还是那个命令 git push origin dev

那么一般情况下，哪些分支要推送呢？

master 分支是主分支，因此要时刻与远程同步。
一些修复 bug 分支不需要推送到远程去，可以先合并到主分支上，然后把主分支 master 推送到远程去。
**2\. 抓取分支：**

多人协作时，大家都会往 master 分支上推送各自的修改。现在我们可以模拟另外一个同事，可以在另一台电脑上（注意要把 SSH key 添加 到 github 上）或者同一台电脑上另外一个目录克隆，新建一个目录名字叫 testgit2

但是我首先要把 dev 分支也要推送到远程去，如下

![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9tbWJpei5xcGljLmNuL21tYml6X2pwZy9lMWptSXpScHdXaWFFeW5wRndXU21yNTlpY2ozODZyS0t4SkFWN04zU3lUdDlKUGNIekRSWndZSjZ5ZHI0UDRqR3dxTGcyQ2hsY2ljaWFhaWFHdEY3aWNwSnFXUS82NDA?x-oss-process=image/format,png)

接着进入 testgit2 目录，进行克隆远程的库到本地来，如下：

![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9tbWJpei5xcGljLmNuL21tYml6X3BuZy9lMWptSXpScHdXaWFFeW5wRndXU21yNTlpY2ozODZyS0t4N05VVWZqendJWXNGcHVYQ2NSQXJmODhlckV0Tkp3RTByYWliaGdpY3Q1VEJxV3BNZ0ZYVEdyWlEvNjQw?x-oss-process=image/format,png)

现在目录下生成有如下所示：

![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9tbWJpei5xcGljLmNuL21tYml6X3BuZy9lMWptSXpScHdXaWFFeW5wRndXU21yNTlpY2ozODZyS0t4YnBFQzVoZmJCcEdDSXBVTHY0NEpqTG1xV0o2U3lNOWY1RXVwSG1MaFJhSUZ4QjZDRVJJdUFRLzY0MA?x-oss-process=image/format,png)

现在我们的小伙伴要在 dev 分支上做开发，就必须把远程的 origin 的 dev 分支到本地来，于是可以使用命令创建本地 dev 分支：

```
git checkout –b dev origin/dev
```

现在小伙伴们就可以在 dev 分支上做开发了，开发完成后把 dev 分支推送到远程库时。

如下：

![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9tbWJpei5xcGljLmNuL21tYml6X3BuZy9lMWptSXpScHdXaWFFeW5wRndXU21yNTlpY2ozODZyS0t4U0kzQmlhTHRhdVMyQ2FmWEo4Tzd1V1g4bWJUdUJMaGliTUNNQWpZa3hlV09xd2lhamlhWENGd1Y2dy82NDA?x-oss-process=image/format,png)

小伙伴们已经向 origin/dev 分支上推送了提交，而我在我的目录文件下也对同样的文件同个地方作了修改，也试图推送到远程库时，如下：

![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9tbWJpei5xcGljLmNuL21tYml6X3BuZy9lMWptSXpScHdXaWFFeW5wRndXU21yNTlpY2ozODZyS0t4dGlhdnR4U0hMcXJDQVA1ZlBMU1AxRThpY05sRmljd3NWYzJWOU1pYmpIQ2RiSVI3MjVEV1YzaWNZOHcvNjQw?x-oss-process=image/format,png)

由上面可知：推送失败，因为我的小伙伴最新提交的和我试图推送的有冲突，解决的办法也很简单，上面已经提示我们，先用 git pull 把最新的提交从 origin/dev 抓下来，然后在本地合并，解决冲突，再推送。

![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9tbWJpei5xcGljLmNuL21tYml6X3BuZy9lMWptSXpScHdXaWFFeW5wRndXU21yNTlpY2ozODZyS0t4dWdaNGljTFRCSzJRbEJpYmpxWFpSRkVoRkhIOTBWdXdsSG8zMGliN2ljMkl2MWFKd0YwVXZLTWlhZEEvNjQw?x-oss-process=image/format,png)

git pull 也失败了，原因是没有指定本地 dev 分支与远程 origin/dev 分支的链接，根据提示，设置 dev 和 origin/dev 的链接：如下：

![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9tbWJpei5xcGljLmNuL21tYml6X3BuZy9lMWptSXpScHdXaWFFeW5wRndXU21yNTlpY2ozODZyS0t4WkplbmJNVlpnclBwaWM2cWtkdFNRTHN2TnBtZTFsdGJzV3JiaWNoSzZwYkpKTVEwaWFoM2t5eUFnLzY0MA?x-oss-process=image/format,png)

这回 git pull 成功，但是合并有冲突，需要手动解决，解决的方法和分支管理中的 解决冲突完全一样。解决后，提交，再 push：
我们可以先来看看 readme.txt 内容了。

![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9tbWJpei5xcGljLmNuL21tYml6X3BuZy9lMWptSXpScHdXaWFFeW5wRndXU21yNTlpY2ozODZyS0t4bTNJanowU2NqWTRjU2EyN2libXZaVVp0WUZENTJiM3E4OEhrOGY2STNjTkxjeG1pYWRpYTBObkx3LzY0MA?x-oss-process=image/format,png)

现在手动已经解决完了，我接在需要再提交，再 push 到远程库里面去。如下所示：

![](https://imgconvert.csdnimg.cn/aHR0cHM6Ly9tbWJpei5xcGljLmNuL21tYml6X3BuZy9lMWptSXpScHdXaWFFeW5wRndXU21yNTlpY2ozODZyS0t4aWFvMHhtM01nb0hxdTh5TEE2cEg3OUJWUzhVUnFmZzFhUjlpYWNQVjBzSlp3NWh0YVBka3dkdncvNjQw?x-oss-process=image/format,png)

**因此：多人协作工作模式一般是这样的：**

首先，可以试图用 git push origin branch-name 推送自己的修改.
如果推送失败，则因为远程分支比你的本地更新早，需要先用 git pull 试图合并。
如果合并有冲突，则需要解决冲突，并在本地提交。再用 git push origin branch-name 推送。

> 感谢龙恩的贡献：http://www.cnblogs.com/tugenhua0707/p/4050072.html

> 参考阮老师整理的部分命令：http://www.ruanyifeng.com/blog/2015/12/git-cheat-sheet.html

##### 一、新建代码库

```
# 在当前目录新建一个Git代码库  
$ git init  
  
# 新建一个目录，将其初始化为Git代码库  
$ git init \[project-name\]  
  
# 下载一个项目和它的整个代码历史  
$ git clone \[url\]
```

##### 二、配置

Git 的设置文件为.gitconfig，它可以在用户主目录下（全局配置），也可以在项目目录下（项目配置）。

```
# 显示当前的Git配置  
$ git config --list  
  
# 编辑Git配置文件  
$ git config -e \[--global\]  
  
# 设置提交代码时的用户信息  
$ git config \[--global\] user.name "\[name\]"  
$ git config \[--global\] user.email "\[email address\]"
```

##### 三、增加/删除文件

```
# 添加指定文件到暂存区  
$ git add \[file1\] \[file2\] ...  
  
# 添加指定目录到暂存区，包括子目录  
$ git add \[dir\]  
  
# 添加当前目录的所有文件到暂存区  
$ git add .  
  
# 添加每个变化前，都会要求确认  
# 对于同一个文件的多处变化，可以实现分次提交  
$ git add -p  
  
# 删除工作区文件，并且将这次删除放入暂存区  
$ git rm \[file1\] \[file2\] ...  
  
# 停止追踪指定文件，但该文件会保留在工作区  
$ git rm --cached \[file\]  
  
# 改名文件，并且将这个改名放入暂存区  
$ git mv \[file-original\] \[file-renamed\]
```

##### 四、代码提交

```
# 提交暂存区到仓库区  
$ git commit -m \[message\]  
  
# 提交暂存区的指定文件到仓库区  
$ git commit \[file1\] \[file2\] ... -m \[message\]  
  
# 提交工作区自上次commit之后的变化，直接到仓库区  
$ git commit -a  
  
# 提交时显示所有diff信息  
$ git commit -v  
  
# 使用一次新的commit，替代上一次提交  
# 如果代码没有任何新变化，则用来改写上一次commit的提交信息  
$ git commit --amend -m \[message\]  
  
# 重做上一次commit，并包括指定文件的新变化  
$ git commit --amend \[file1\] \[file2\] ...
```

##### 五、分支

```
# 列出所有本地分支  
$ git branch  
  
# 列出所有远程分支  
$ git branch -r  
  
# 列出所有本地分支和远程分支  
$ git branch -a  
  
# 新建一个分支，但依然停留在当前分支  
$ git branch \[branch-name\]  
  
# 新建一个分支，并切换到该分支  
$ git checkout -b \[branch\]  
  
# 新建一个分支，指向指定commit  
$ git branch \[branch\] \[commit\]  
  
# 新建一个分支，与指定的远程分支建立追踪关系  
$ git branch --track \[branch\] \[remote-branch\]  
  
# 切换到指定分支，并更新工作区  
$ git checkout \[branch-name\]  
  
# 切换到上一个分支  
$ git checkout -  
  
# 建立追踪关系，在现有分支与指定的远程分支之间  
$ git branch --set-upstream \[branch\] \[remote-branch\]  
  
# 合并指定分支到当前分支  
$ git merge \[branch\]  
  
# 选择一个commit，合并进当前分支  
$ git cherry-pick \[commit\]  
  
# 删除分支  
$ git branch -d \[branch-name\]  
  
# 删除远程分支  
$ git push origin --delete \[branch-name\]  
$ git branch -dr \[remote/branch\]
```

##### 六、标签

```
# 列出所有tag  
$ git tag  
  
# 新建一个tag在当前commit  
$ git tag \[tag\]  
  
# 新建一个tag在指定commit  
$ git tag \[tag\] \[commit\]  
  
# 删除本地tag  
$ git tag -d \[tag\]  
  
# 删除远程tag  
$ git push origin :refs/tags/\[tagName\]  
  
# 查看tag信息  
$ git show \[tag\]  
  
# 提交指定tag  
$ git push \[remote\] \[tag\]  
  
# 提交所有tag  
$ git push \[remote\] --tags  
  
# 新建一个分支，指向某个tag  
$ git checkout -b \[branch\] \[tag\]
```

##### 七、查看信息

```
# 显示有变更的文件  
$ git status  
  
# 显示当前分支的版本历史  
$ git log  
  
# 显示commit历史，以及每次commit发生变更的文件  
$ git log --stat  
  
# 搜索提交历史，根据关键词  
$ git log -S \[keyword\]  
  
# 显示某个commit之后的所有变动，每个commit占据一行  
$ git log \[tag\] HEAD --pretty=format:\%s  
  
# 显示某个commit之后的所有变动，其"提交说明"必须符合搜索条件  
$ git log \[tag\] HEAD --grep feature  
  
# 显示某个文件的版本历史，包括文件改名  
$ git log --follow \[file\]  
$ git whatchanged \[file\]  
  
# 显示指定文件相关的每一次diff  
$ git log -p \[file\]  
  
# 显示过去5次提交  
$ git log -5 --pretty --oneline  
  
# 显示所有提交过的用户，按提交次数排序  
$ git shortlog -sn  
  
# 显示指定文件是什么人在什么时间修改过  
$ git blame \[file\]  
  
# 显示暂存区和工作区的差异  
$ git diff  
  
# 显示暂存区和上一个commit的差异  
$ git diff --cached \[file\]  
  
# 显示工作区与当前分支最新commit之间的差异  
$ git diff HEAD  
  
# 显示两次提交之间的差异  
$ git diff \[first-branch\]...\[second-branch\]  
  
# 显示今天你写了多少行代码  
$ git diff --shortstat "\@\{0 day ago\}"  
  
# 显示某次提交的元数据和内容变化  
$ git show \[commit\]  
  
# 显示某次提交发生变化的文件  
$ git show --name-only \[commit\]  
  
# 显示某次提交时，某个文件的内容  
$ git show \[commit\]:\[filename\]  
  
# 显示当前分支的最近几次提交  
$ git reflog
```

##### 八、远程同步

```
# 下载远程仓库的所有变动  
$ git fetch \[remote\]  
  
# 显示所有远程仓库  
$ git remote -v  
  
# 显示某个远程仓库的信息  
$ git remote show \[remote\]  
  
# 增加一个新的远程仓库，并命名  
$ git remote add \[shortname\] \[url\]  
  
# 取回远程仓库的变化，并与本地分支合并  
$ git pull \[remote\] \[branch\]  
  
# 上传本地指定分支到远程仓库  
$ git push \[remote\] \[branch\]  
  
# 强行推送当前分支到远程仓库，即使有冲突  
$ git push \[remote\] --force  
  
# 推送所有分支到远程仓库  
$ git push \[remote\] --all
```

##### 九、撤销

```
# 恢复暂存区的指定文件到工作区  
$ git checkout \[file\]  
  
# 恢复某个commit的指定文件到暂存区和工作区  
$ git checkout \[commit\] \[file\]  
  
# 恢复暂存区的所有文件到工作区  
$ git checkout .  
  
# 重置暂存区的指定文件，与上一次commit保持一致，但工作区不变  
$ git reset \[file\]  
  
# 重置暂存区与工作区，与上一次commit保持一致  
$ git reset --hard  
  
# 重置当前分支的指针为指定commit，同时重置暂存区，但工作区不变  
$ git reset \[commit\]  
  
# 重置当前分支的HEAD为指定commit，同时重置暂存区和工作区，与指定commit一致  
$ git reset --hard \[commit\]  
  
# 重置当前HEAD为指定commit，但保持暂存区和工作区不变  
$ git reset --keep \[commit\]  
  
# 新建一个commit，用来撤销指定commit  
# 后者的所有变化都将被前者抵消，并且应用到当前分支  
$ git revert \[commit\]  
  
# 暂时将未提交的变化移除，稍后再移入  
$ git stash  
$ git stash pop
```

##### 十、其他

```
# 生成一个可供发布的压缩包  
$ git archive
```

❤️ 爱心三连击

```
1.看到这里了就点个在看支持下吧，你的「点赞，在看」是我创作的动力。
2.关注公众号程序员成长指北，回复「1」加入高级前端交流群！「在这里有好多 前端 开发者，会讨论 前端 Node 知识，互相学习」！
3.也可添加微信【ikoala520】，一起成长。


“在看转发”是最大的支持

```

E:\front\platform>maekdown https://zhuanlan.zhihu.com/p/58140227
'maekdown' 不是内部或外部命令，也不是可运行的程序
或批处理文件。

E:\front\platform>markdown https://zhuanlan.zhihu.com/p/58140227
![收好这份 Git 命令应急手册，关键时刻可保你一命](https://pic2.zhimg.com/v2-1644ae0e25fc3bc1f5c508ef7f2b4ca4_1440w.jpg?source=172ae18b)

今天跟大家分享一个比较有意思的网站 - [Oh shit, git!](http%3A//ohshitgit.com/)。

这个网站整理了一些 Git 新手在使用 Git 时常会遇到的各种突发状况，并贴心的给出了应对方案。

我大致瞄了一眼，文章里面提到的一些问题，大部分新手确实会经常遇到，所以我在这里简单的整理一下，把这些应对方案分享给大家。

你们可以把这篇文章马住或分享给同事，以备不时之需，毕竟不怕神对手，就怕猪队友~

下面切入正题，跟大家聊下在 Git 的使用过程中，经常会出现哪些问题，以及应该对应使用哪种解决方案。

> 注：为了使场景描述更加生动，因此加入了新手女神与高级舔狗两个角色来配合讲解

**女神：哎呀，刚刚有个地方搞错了，怎么重新来过呢？**

女神莫慌，Git 的牛逼之处，在于它自带时光机效果，能让你在项目的历史代码中任意穿梭。

如果项目的某一处地方它自己不小心坏掉了，不妨试下下面的这行命令：

这条命令能列出你在 Git 上的所有操作记录，你只要找到 `HEAD@{index}` 前面所对应的操作索引，并使用下面命令即可：

> 注：使用时需将`HEAD@{index}`替换为对应索引。

**女神：想改个小东西，但代码不小心提交（commit）了，这可咋整？**

这个简单，首先，添加下当前已改动的代码：

然后，运行下面这条命令，它就会把你刚刚添加的代码合并到最后一次提交上了：

**女神：哼！刚刚写的提交历史写得不够好，我想重写一下！**

好的，还是上面提到过的那条代码，运行一下，就可以重写提交历史啦：

**女神：这下惨了，我刚刚不小心把新分支的代码提交到主分支上了！**

女神别着急，我们一步步来，你先创建个新分支（some-new-branch-name）：

```text
$ git branch some-new-branch-name
```

然后把刚才的提交从主分支中移除：

需要注意的是，上面的代码只会切换到最后一条提交记录上，如果你已跑到其它提交记录上怎么办？没关系，你可以用 `git reset HEAD@{number}` 再跑回来。

等你跑回来之后，我们再切换到新分支上：

```text
$ git checkout some-new-branch-name
```

好了，完成啦，现在主分支干干净净，刚刚不小心提交的代码也被移到新分支上了。

需要注意的是，上面的代码只对本地仓库有效，如果你已经把代码提交到远程仓库上，那就得跟队友商量下解决方案了。

啥？我就是你队友？这可真让我受宠若惊 ☺️ 不过没事，等下我帮你在线上主分支上 `reset` 然后 `push -f` 一下就好啦~

**女神：完蛋了，我把代码提交到错误的分支上了！**

别怕别怕，有我在呢。

我们先撤销最后一次提交，但保留变更代码：

```text
$ git reset HEAD~ --soft
$ git stash
```

再切到你想要提交的正确分支（name-of-the-correct-branch）上，并把变更代码提交上去：

```text
$ git checkout name-of-the-correct-branch
$ git stash pop
$ git add .
$ git commit -m "your message here"
```

OK，到这里就搞定了。

如果想要逼格高点，也可以用 `cherry-pick` 这个命令来完成上面那些操作。具体的操作步骤如下。

首先，切换到正确的分支上：

```text
$ git checkout name-of-the-correct-branch
```

然后使用 cherry-pick 来获取最新一条提交记录：

最后再把主分支上那条提交错误的记录删除：

```text
$ git checkout master
$ git reset HEAD~ —-hard
```

**女神：咦？为啥我运行 diff 后啥都没有？**

遇到这种情况，应该是文件没有加入到暂存区的缘故。解决方案很简单，咱们要么把文件加入到暂存区，要么就直接使用下面这条命令：

这样，就可以看到未存入暂存区文件的 diff 效果啦。

**女神：这项目怎么这么乱！好烦呐！我不玩了！**

别气别气，别气坏了身子就不好了，么么哒

如果本地代码仓库把自己折腾得乱七八糟，不用怕，用下面这招，一击必杀：

```text
$ cd ..
$ sudo rm -r fucking-git-repo-dir
$ git clone https://some.github.url/fucking-git-repo-dir.git
$ cd fucking-git-repo-dir
```

是的，这就是备胎（线上仓库）的强大之处，只要你备胎尚在，你就可以大大方方的把本地仓库删了，clone 备胎，从头再来。

**女神：好啦，我没什么问题了，谢谢你哦~**

不不不，这块问题还多着呢？你打开下面这个网站，听我跟你细细道来…

[https://stackoverflow.com/questions/tagged/git](https%3A//stackoverflow.com/questions/tagged/git)

---
