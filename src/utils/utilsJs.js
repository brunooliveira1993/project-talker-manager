const path = require('path');

const PATH_DATA = '../talker.json';
const fs = require('fs').promises;

async function readTalkerData() {
  try {
    const data = await fs.readFile(path.resolve(__dirname, PATH_DATA));
    const talker = JSON.parse(data);
    return talker;
  } catch (error) {
    console.error(`Erro na leitura ${error}`);
  }
}

module.exports = {
  readTalkerData,
};