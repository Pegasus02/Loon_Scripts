var appName = '不背单词'
var bubei = init()
var URL = bubei.getdata("UrlBB")
var KEY = bubei.getdata("CookieBB")

let isGetCookie = typeof $request !== 'undefined'

if (isGetCookie) {
   getcookie()
} else {
   sign()
}

function getcookie() {
  var url = $request.url;
  if (url) {
     var UrlKeyBB = "UrlBB";
     var UrlValueBB = url;
     if (bubei.getdata(UrlKeyBB) != (undefined || null)) {
        if (bubei.getdata(UrlKeyBB) != UrlValueBB) {
           var url = bubei.setdata(UrlValueBB, UrlKeyBB);
           if (!url) {
              bubei.msg("更新" + appName + "Url失败‼️", "", "");
              } else {
              bubei.msg("更新" + appName + "Url成功🎉", "", "");
              }
           } else {
           bubei.msg(appName + "Url未变化❗️", "", "");
           }
        } else {
        var url = bubei.setdata(UrlValueBB, UrlKeyBB);
        if (!url) {
           bubei.msg("首次写入" + appName + "Url失败‼️", "", "");
           } else {
           bubei.msg("首次写入" + appName + "Url成功🎉", "", "");
           }
        }
     } else {
     bubei.msg("写入" + appName + "Url失败‼️", "", "配置错误, 无法读取URL, ");
     }
  if ($request.headers) {
     var CookieKeyBB = "CookieBB";
     var CookieValueBB = JSON.stringify($request.headers);
     if (bubei.getdata(CookieKeyBB) != (undefined || null)) {
        if (bubei.getdata(CookieKeyBB) != CookieValueBB) {
           var cookie = bubei.setdata(CookieValueBB, CookieKeyBB);
           if (!cookie) {
              bubei.msg("更新" + appName + "Cookie失败‼️", "", "");
              } else {
              bubei.msg("更新" + appName + "Cookie成功🎉", "", "");
              }
           } else {
           bubei.msg(appName + "Cookie未变化❗️", "", "");
           }
        } else {
        var cookie = bubei.setdata(CookieValueBB, CookieKeyBB);
        if (!cookie) {
           bubei.msg("首次写入" + appName + "Cookie失败‼️", "", "");
           } else {
           bubei.msg("首次写入" + appName + "Cookie成功🎉", "", "");
           }
        }
     } else {
     bubei.msg("写入" + appName + "Cookie失败‼️", "", "配置错误, 无法读取请求头, ");
     }
  bubei.done()
}
   
function sign() {
  var t1 = new Date().getTime()
  var t2 = t1 + 1
  URL = URL.replace(/by-sign-in\/\d*/g,"by-sign-in/" + t1).replace(/timestamp=\d*/g,"timestamp=" + t2)
  const url = { url: URL, headers: JSON.parse(KEY) }
  bubei.get(url, (error, response, data) => {
    bubei.log(`${appName}, data: ${data}`)
    const title = `${appName}`
    let subTitle = ''
    let detail = ''
    const result = JSON.parse(data)
    if (result.result_code == 200) {
      subTitle = `签到结果: 成功`
    } else {
      subTitle = `签到结果: 未知`
      detail = `说明: ${result.error_body.user_msg}`
    }
    bubei.msg(title, subTitle, detail)
    bubei.done()
  })
}

function init() {
  
  getdata = (key) => {
    $persistentStore.read(key)
  }
  setdata = (key, val) => {
    $persistentStore.write(key, val)
  }
  msg = (title, subtitle, body) => {
    $notification.post(title, subtitle, body)
  }
  log = (message) => console.log(message)
  get = (url, cb) => {
    $httpClient.get(url, cb)
  }
  post = (url, cb) => {
    $httpClient.post(url, cb)
  }
  put = (url, cb) => {
      $httpClient.put(url, cb)
  }
  done = (value = {}) => {
    $done(value)
  }
  return { msg, log, getdata, setdata, get, post, put, done }
}