const gConst = require("./gConst.js")

module.exports = {
    atPage(pageNo){
        return gConst.BSITE_IZONE_BASE_SRC + "page=" + pageNo + "&randstamp_rdd=" + Date.now()
    },
}