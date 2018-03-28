app.json 内的颜色值，只可以使用颜色对应的十六进制吗，即`#fff`等

页面加载生命周期为 onLoad -> onShow -> onReady,(加载完成后 -> 显示页面 -> 页面渲染完成)，

**从 tab 中**切换页面，会触发 onHide 和 onShow 事件，不会触发 onUnload 事件
