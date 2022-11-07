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

async function updateTalkerData(id, update) {
  const oldTalkers = await readTalkerData();
  const updateTalker = { id, ...update };

  // verifica se o id passado por parametro ja existe em algum objeto do meu json
  const updateTalkers = oldTalkers.reduce((talkerList, currentTaker) => {
    if (currentTaker.id === updateTalker.id) return [...talkerList, updateTalker];
    return [...talkerList, currentTaker];
  }, []);
  const updateData = JSON.stringify(updateTalkers);
  // inscrição de arquivos no banco de dados
  try {
    await fs.writeFile(path.resolve(__dirname, PATH_DATA), updateData);
    console.log(`Atualizou a missão ${id}`);
    return updateTalker;
  } catch (error) {
    console.error(`Erro na leitura ${error}`);
  }
}

async function deleteTalkerData(id) {
  const oldTalkers = await readTalkerData();
  const updateTalker = oldTalkers.filter((talker) => talker.id !== id);
  const updateData = JSON.stringify(updateTalker);

    // deleta arquivos no banco de dados
    try {
      await fs.writeFile(path.resolve(__dirname, PATH_DATA), updateData);
      console.log(`Deletou a missão ${id}`);
      return updateData;
    } catch (error) {
      console.error(`Erro na leitura ${error}`);
    }
  }

module.exports = {
  readTalkerData,
  tokenGenerate,
  writeTalkerData,
  updateTalkerData,
  deleteTalkerData,
};