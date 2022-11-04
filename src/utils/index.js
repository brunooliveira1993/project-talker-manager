// const AES = require("crypto-js/aes");
// const SHA256 = require("crypto-js/sha256");

// console.log(SHA256("asdfadsfasd"));

function teste(n1, n2) {
  const random = (min, max) => Math.floor(Math.random() * (max - min) + min);
  return random(n1, n2);
}

teste(1000000000000000, 9999999999999999);
