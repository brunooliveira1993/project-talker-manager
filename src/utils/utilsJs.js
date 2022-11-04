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

function tokenGenerate() {
  const random = (min, max) => Math.floor(Math.random() * (max - min) + min);
  const result = random(1000000000000000, 9999999999999999);
  return result;
}

async function writeTalkerData(newTalker) {
  try {
    const oldTalkers = await readTalkerData();
    const newTalkerID = {
      id: oldTalkers.length + 1,
      ...newTalker,
    };
    const addNewTalker = JSON.stringify([...oldTalkers, newTalkerID]);
    await fs.writeFile(path.resolve(__dirname, PATH_DATA), addNewTalker);
    return newTalkerID;
  } catch (error) {
    console.error(`Erro na leitura ${error}`);
  }
}

module.exports = {
  readTalkerData,
  tokenGenerate,
  writeTalkerData,
};