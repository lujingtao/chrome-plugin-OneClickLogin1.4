@[toc](动易网站后台一键登录v1.4)

# 一、介绍
上篇[《chrome自制插件--简单一键登录（附插件开发介绍）》](https://blog.csdn.net/iamlujingtao/article/details/102576385)我介绍了chrome插件开发和后台一键登录简单版，本篇提供功能强大的正式版。
<font color="red">注意：本插件针对动易系统后台登录，当然你也可以修改源码，适应你的系统和实际使用情况。</font>


# 二、功能
1、智能识别新旧版本系统，如果识别失败请手动添加记录
2、新增“默认帐号”管理功能，在没有配置网站记录的情况下会用默认帐号登录
3、管理记录（右击插件图标–> 选项，进入配置页面）
4、导入\导出记录
5、明文备份记录

# 三、安装

<font color="red">重要提示：如果你之前一直都是插件的使用者，那么请先用“导出”功能先备份，重新安装后再“导入”！新用户就无视了。</font>

![在这里插入图片描述](https://img-blog.csdnimg.cn/20191015224157379.jpg?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2lhbWx1amluZ3Rhbw==,size_16,color_FFFFFF,t_70)
打开chrome，点击地址栏最右侧的“扳手按钮”--> 设置 --> 扩展程序 --> 勾选“开发人员模式” --> 载入正在开发的扩展程序，选择插件目录。

完成，好了，这时候你会看到chrome地址栏旁边多了一个“一键登录”按钮。 

# 四、使用

1、打开任意一个动易系统网站，然后点击插件图标即可，会自动使用默认帐号登录。
2、如果网站使用其它帐号密码，那么可以进行配置，右击插件图标--> 选项，进入配置页面：

界面很简单，不用提示也知道怎么操作了，需要注意的是底部的“导出” “导入”功能是用于备份和恢复已添加过的记录的。

 演示：
 ![在这里插入图片描述](https://img-blog.csdnimg.cn/20191015233533421.gif)

# 五、GitHub源码
[-->GitHub源码](https://github.com/lujingtao/chrome-plugin-OneClickLogin1.4)