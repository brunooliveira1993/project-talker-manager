const express = require('express');
const bodyParser = require('body-parser');
const { readTalkerData, tokenGenerate } = require('./utils/utilsJs');

const app = express();
app.use(express.json());
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});

app.get('/talker', async (_req, res) => {
  const talker = await readTalkerData();
  return res.status(200).json(talker);
});

app.get('/talker/:id', async (req, res) => {
  const { id } = req.params;
  const talker = await readTalkerData();
  const talkerId = talker.filter((element) => element.id === Number(id));
  if (talkerId.length !== 0) return res.status(200).json(talkerId[0]);
  return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
});

app.post('/login', async (_req, res) => {
  const token = tokenGenerate();
  res.status(200).json({ token: `${token}` });
});