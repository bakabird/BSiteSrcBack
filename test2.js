var urlencode = require('urlencode');

console.log(urlencode(`【IZONE\\安宥真】安宥真在舞台上的一些甩发cut 每一根发丝都毫不留情地甩到你心里`)); // default is utf8
console.log(urlencode(`【IZONE\\安宥真】安宥真在舞台上的一些甩发cut 每一根发丝都毫不留情地甩到你心里`,'gbk')); // default is utf8
console.log(urlencode('苏千', 'gbk')); // '%CB%D5%C7%A7'

// decode gbk
console.log(urlencode.decode('%A1%BE%49%5A%4F%4E%45%5C%B0%B2%E5%B6%D5%E6%A1%BF%B0%B2%E5%B6%D5%E6%D4%DA%CE%E8%CC%A8%C9%CF%B5%C4%D2%BB%D0%A9%CB%A6%B7%A2%63%75%74%20%C3%BF%D2%BB%B8%F9%B7%A2%CB%BF%B6%BC%BA%C1%B2%BB%C1%F4%C7%E9%B5%D8%CB%A6%B5%BD%C4%E3%D0%C4%C0%EF', 'gbk'))
