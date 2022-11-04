// const AES = require("crypto-js/aes");
// const SHA256 = require("crypto-js/sha256");

// console.log(SHA256("asdfadsfasd"));

function teste() {
const data = '22/10/2019';
const dataRegex = /^(0?[1-9]|[12][0-9]|3[01])[/-](0?[1-9]|1[012])[/-]\d{4}$/;
console.log(dataRegex.test(data));
}

teste();
