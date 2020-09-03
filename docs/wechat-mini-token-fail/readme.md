<!-- Date: 2018-03-26 03:40 -->

# wechat 微信小程序中如何处理 token 过期事件

之前的网站应用中，如果用户的登录信息失效，也就是说用户上一次的 token 超过了有效期，会先跳转到登录页面，登录成功后再会跳到之前的页面，这种交互很不好，比如用户在注册的时候，信息都填写好了，回跳之后又要重新填写一遍。所以就需要让用户在当前页面内进行重新登录操作，并在登录成功后，自动执行被挂起的任务。

微信小程序中是可以使用微信的静默登录功能的，完全不需要新增一个 login 页面，来进行回调操作

当用户 token 失效的时候，我不想在每个 ajax 请求结果中都添加上 token 失效的处理，那样会导致大量相同并且冗余的代码，所以需要把小程序自带的网络请求以及文件上传 api 重新封装一遍，

util.js

```js
const wxLogin = () => {
  return new Promise((resolve, reject) => {
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 code
        ajax("/v1/cif/loginByCode.do", {
          code: res.code
        })
          .then(res => {
            if (res.code === "000000") {
              // 保存用户基础非敏感信息到storage以及globalData
              wx.setStorageSync("token", res.data.token);
              wx.setStorageSync("userId", res.data.userId);
              getApp().globalData["userId"] = res.data.userId;
              getApp().globalData["token"] = res.data.token;
              resolve();
            } else {
              message(res.message || "登录失败");
              console.log(res.message || "登录失败");
              reject(res);
            }
          })
          .catch(res => {
            console.log("登录时，网络错误");
            reject(res);
          });
      }
    });
  });
};
const ajax = (url = "", data = {}, file = {}} => {
  let initUrl = "";
  if (/^https?/.test(url)) {
    initUrl = url;  // 这里主要用于使用其他地址测试接口，不需要添加真实服务器地址的域名前缀
  } else {
    initUrl = "https://api.com" + url;
  }
  return new Promise((resolve, reject) => {
    if (file.name) {
      wx.uploadFile({
        url: initUrl,
        filePath: file.path,
        name: file.name,
        formData: resolveData(data),
        success(res) {
          console.log(url + ":");
          console.log(resolveData(data));
          console.log(JSON.parse(res.data));

          // 主要内容在这里：当token过期后马上重新登录，并重新执行一次ajax请求，这里的001101是后端返回代表了token失效的识别码
          if (res.data.code === "001101") {
            wxLogin().then(res => {
              console.log(url,
                data,
                file,
                success)
              return ajax(
                url,
                data,
                file,
                success
              ).then(res => {
                // 重新登录获取token后，直接返回data内容即可，不需要再判断了，这的res实际上已经是res.data中的数据了
                resolve(res)
              }).catch(err => {
                reject(err)
              })
            }).catch(err => {
              reject(res)
            })
          } else {
            resolve(JSON.parse(res.data))
          }
        },
        error(res) {
          reject(res);
        }
      });
    } else {
      wx.request({
        method: "POST",
        url: initUrl,
        data: resolveData(data),
        success(res) {
          console.log(url + ":");
          console.log(resolveData(data));
          console.log(res.data);

          // 主要内容在这里：当token过期后马上重新登录，并重新执行一次ajax请求，这里的001101是后端返回代表了token失效的识别码
          if (res.data.code === "001101") {
            wxLogin().then(res=>{
              console.log(url,
                data,
                file,
                success)
              return ajax(
                url,
                data,
                file,
                success
              ).then(res=>{
                // 重新登录获取token后，直接返回data内容即可，不需要再判断了，这的res实际上已经是res.data中的数据了
                resolve(res)
              }).catch(err=>{
                reject(err)
              })
            }).catch(err=>{
                reject(res)
            })
          }else{
            resolve(res.data)
          }
        },
        error(res) {
          reject(res);
        }
      });
    }
  });
};
```

这里要稍微注意一个地方，当一个页面打开的时候同时调用多个 ajax 请求，会引起多次 wx.login 事件，所以还是建议对页面中的请求做一个优化，一个请求先发出去，成功之后再执行其他请求。
