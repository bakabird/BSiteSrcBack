const puppeteer = require('puppeteer');
const helper = require("./helper.js");
const axios = require("axios");
const url = require('url');
const urlencode = require('urlencode');
const NAME = "B站搜索结果备份机-爬虫模块"

function pSetSecout(sec) {
  return new Promise((rso, rje) => {
    try {
      setTimeout(() => {
        rso()
      }, sec * 1000)
    } catch (err) {
      rje(err)
    }
  })
}

async function getCollects(page) {
  let dimensions = await page.evaluate(() => {
    const box = document.querySelector("#all-list > div.flow-loader > ul")
    let ret = []
    if (box) {
      const list = box.children
      for (let i = 0; i < list.length; i++) {
        const item = list[i]
        const aVideoTag = item.querySelector("a.img-anchor")
        const aUpTag = item.querySelector("a.up-name")
        const timeTag = item.querySelector(".time")
        ret.push({
          href: aVideoTag.href,
          title: aVideoTag.title,
          up: aUpTag.innerText,
          uploaddate: timeTag.innerText
        })
      }
    }
    return ret
  });
  Log("get dimensions ", dimensions.length)
  // av,up,title,date
  let collect = dimensions.map(avInfo => {
    const pathname = url.parse(avInfo.href).pathname
    const avNo = pathname.match(/av(\d+)/)[1]
    return {
      av: avNo,
      up: urlencode(avInfo.up, 'gbk'),
      title: urlencode(avInfo.title, 'gbk'),
      uploaddate: avInfo.uploaddate
    }
  })
  // console.log('collect:', collect);
  return collect
}

async function isAvArchive(av) {
  try {
    const response = await axios.get('http://localhost:8360/BsiteSrc/isAvE', {
      params: {
        libId: `test`,
        av: Number(av)
      }
    })
    // Log("isAvArchive", av, response.data);
    if (response.status === 200) {
      return response.data.data
    } else {
      Log("isAvArchive", av, "response.status is not 200");
      return true
    }
  } catch (err) {
    console.error(err)
    return true
  }
}

async function pushData(data) {
  try {
    const response = await axios.post('http://localhost:8360/BsiteSrc/pushData', {
      libId: `test`,
      data
    })
    // console.log(response);
  } catch (err) {
    console.error(err)
  }
}

async function gotoPage(page, curPage) {
  let retry = 3
  while (retry > 0) {
    try {
      await page.goto(helper.atPage(curPage));
      break
    } catch (err) {
      Log("await page.goto(helper.atPage(curPage)) 遇到错误，剩余重试次数", retry)
      const retrySec = 3 + Math.round(Math.random() * 10)
      Log(" >>> wait ", retrySec)
      await pSetSecout(retrySec)
      retry = retry - 1
    }
  }
  if (retry === 0) {
    throw Error("重试次数用完，本次turn结束！")
  }
}

function Log() {
  console.log(NAME, (new Date()).toLocaleString(), `INFO:`, ...arguments)
}

(async () => {
  const browser = await puppeteer.launch({headless: false});
  let page = await browser.newPage();
  // a run
  // - [0] collect
  // - if last exist
  //   - AFLG = true
  // - pushData
  // - if AFLG
  //   - NEXTPAGE -> [0]
  // - END
  async function run() {
    let curPage = 1
    let turnOver = false

    while (!turnOver) {
      try {
        Log("run a turn")
        await gotoPage(page,curPage)
        const collects = await getCollects(page)
        const isLastExist = await isAvArchive(collects[collects.length - 1].av)
        Log("isLastExist", isLastExist)
        await pushData(collects)
        // turnOver = true
        if (isLastExist || curPage >= 50) {
          Log("- last exist: this turn over")
          turnOver = true
        } else {
          curPage = curPage + 1
          Log("- last not exist: goNextPage: cutPage is ", curPage)
          const bufferSec = 3 + Math.round(Math.random() * 10)
          Log(" >>> wait ", bufferSec)
          await pSetSecout(bufferSec)
        }
      } catch (err) {
        console.error(err)
        break
      }
    }
  }

  // run
  // waiting 14~16min run again
  while (true) {
    Log("A RUN START")
    await run()
    Log("A RUN END")
    const waitSec = 60 * 15 + Math.round(Math.random() * 60 * 5)
    Log("NEXT RUN WILL ON " + waitSec / 60 + " MINUTES LATER")
    await pSetSecout(waitSec)
  }
})();