const puppeteer = require('puppeteer');
const helper = require("./helper.js");
const axios = require("axios");
const url = require('url');



(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(helper.atPage(25));


  //   await page.screenshot({path: 'example.png'});
  // Get the "viewport" of the page, as reported by the page.
  const dimensions = await page.evaluate(() => {
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
          date: timeTag.innerText
        })
      }
    }
    return ret
  });

  let data = dimensions.map(avInfo => {
    const pathname = url.parse(avInfo.href).pathname
    const avNo = pathname.match(/av(\d+)/)[1]
    return {
      av: avNo,
      up: avInfo.up,
      title: avInfo.title,
      date: avInfo.date
    }
  })
  console.log('data:', data);


  // av,up,title
  try {
    const response = await axios.post('http://localhost:8360/BsiteSrc/pushData', {
      libId: `test`,
      data
    })
    console.log(response);
  } catch (err) {
    console.error(err)
  }
  await browser.close();

})();