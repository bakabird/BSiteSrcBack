const url = require('url');
const pathname = url.parse("https://www.bilibili.com/video/av91403304?from=search&seid=7289117398218580912").pathname 
const ret = pathname.match(/av(\d+)/)

if(ret){
    console.log(ret[1])
}