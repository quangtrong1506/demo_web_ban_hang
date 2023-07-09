var a = [
  "không ",
  "một ",
  "hai ",
  "ba ",
  "bốn ",
  "năm ",
  "sáu ",
  "bảy ",
  "tám ",
  "chín ",
  "mười ",
  "hai mươi ",
  "ba mươi ",
  "bốn mươi ",
  "năm mươi ",
  "sáu mươi ",
  "bảy mươi ",
  "tám mươi ",
  "chín mươi ",
];
function formatPrice(price) {
  price = price.toString().trim().replace(/[,.]/g, "");
  var newPrice = new Intl.NumberFormat().format(price);
  return {
    number: price,
    numberFormat: newPrice,
  };
}

function numToWords(num) {
  var newNum = num.toString();
  if (newNum.length > 9) return "overflow";
  var tmp = "";
  for (var i = 0; i < 10 - newNum.length; i++) {
    tmp += "0";
  }
  newNum = tmp + newNum;
  var str = "";
  var n = newNum.split("");
  str +=
    a[n[0]] +
    "tỷ " +
    a[n[1]] +
    "trăm " +
    a[n[2]] +
    "mươi " +
    a[n[3]] +
    "triệu " +
    a[n[4]] +
    "trăm " +
    a[n[5]] +
    "mươi " +
    a[n[6]] +
    "nghìn " +
    a[n[7]] +
    "trăm " +
    a[n[8]] +
    "mươi " +
    a[n[9]];

  str = str.replaceAll("không tỷ ", "");
  str = str.replaceAll(" không triệu không trăm không không mươi", "");
  str = str.replaceAll(" không trăm không mươi không", "");
  console.log(str);
}
