const puppeteer = require('puppeteer');
const helper = require("./helper.js");
const util = require("util")

function pSetTimeout(sec) {
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


(async () => {

   const browser = await puppeteer.launch();
   const page = await browser.newPage();
   await page.goto(helper.atPage(25));

   // runfirst
   // waiting 14~16min run again

   // a run
    // [0] collect
    // if last exist  -> AFLG
    // pushData
    // if AFLG
    //  NEXTPAGE -> [0]
    // END

 //   await page.screenshot({path: 'example.png'});
    // Get the "viewport" of the page, as reported by the page.
   const dimensions = await page.evaluate(() => {
     const box = document.querySelector("#all-list > div.flow-loader > ul")
     let ret = []
     if(box){
         const list = box.children
         for(let i = 0;i < list.length;i++){
             const item = list[i]
             const aVideoTag = item.querySelector("a.img-anchor")
             const aUpTag = item.querySelector("a.up-name")
             const timeTag = item.querySelector(".time")
             ret.push({
                 href: aVideoTag.href,
                 title: aVideoTag.title,
                 up: aUpTag.innerText,
                 time: timeTag.innerText
             })
         }
     }
     return ret
   });

   console.log('Dimensions:', dimensions);

   await browser.close();
})();