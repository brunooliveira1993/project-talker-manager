const express = require('express');
const bodyParser = require('body-parser');
const { readTalkerData, tokenGenerate, writeTalkerData,
  updateTalkerData, deleteTalkerData } = require('./utils/utilsJs');

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

// ------------------------MIDLEWEARS--------------------------------------
const validationEmailProps = (req, res, next) => {
  const requireEmail = ['email'];
  if (requireEmail.every((prop) => prop in req.body)) {
    const emailRegex = /\S+@\S+\.\S+/;
    const { email } = req.body;
    if (emailRegex.test(email)) {
      next();
    } else {
      res.status(400).send({ message: 'O "email" deve ter o formato "email@email.com"' });
    }
  } else {
    res.status(400).send({ message: 'O campo "email" é obrigatório' });
  }
};

const validationPasswordProps = (req, res, next) => {
  const keys = Object.keys(req.body);
  // const requirePassword = ['password'];
  if (keys.includes('password')) {
    const { password } = req.body;
    if (password.length < 6) {
      res.status(400).send({ message: 'O "password" deve ter pelo menos 6 caracteres' });
    } else {
      next();
    }
  } else {
    res.status(400).send({ message: 'O campo "password" é obrigatório' });
  }
};

const validationName = (req, res, next) => {
  const keys = Object.keys(req.body);
  if (keys.includes('name')) {
    const { name } = req.body;
    if (name.length < 3) {
      res.status(400).send({ message: 'O "name" deve ter pelo menos 3 caracteres' });
    } else {
      next();
    }
  } else {
    res.status(400).send({ message: 'O campo "name" é obrigatório' });
  }
};

const validationAge = (req, res, next) => {
  const keys = Object.keys(req.body);
  if (keys.includes('age')) {
    const { age } = req.body;
    if (Number(age) < 18) {
      res.status(400).send({ message: 'A pessoa palestrante deve ser maior de idade' });
    } else {
      next();
    }
  } else {
    res.status(400).send({ message: 'O campo "age" é obrigatório' });
  }
};

const validationTalk = (req, res, next) => {
  const keys = Object.keys(req.body);
  if (keys.includes('talk')) {
      next();
} else {
  return res.status(400).send({ message: 'O campo "talk" é obrigatório' });
}
};

const validationWatchedKeys = (req, res, next) => {
  const requireKey = ['watchedAt'];
  const dataRegex = /^(0?[1-9]|[12][0-9]|3[01])[/-](0?[1-9]|1[012])[/-]\d{4}$/;
  if (requireKey.every((prop) => prop in req.body.talk)) {
    if (dataRegex.test(req.body.talk.watchedAt)) {
      next();
    } else {
   return res.status(400).send({ message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"' });
    }
  } else {
    return res.status(400).send({ message: 'O campo "watchedAt" é obrigatório' });
  }
};

const validationRateKeys = (req, res, next) => {
  const requireKey = ['rate'];
  const numberRejex = /^[1-5]+$/;
  if (requireKey.every((prop) => prop in req.body.talk)) {
    if (numberRejex.test(Number(req.body.talk.rate))) {
      return next();
    } 
   return res.status(400).send({ message: 'O campo "rate" deve ser um inteiro de 1 à 5' });
  }
    return res.status(400).send({ message: 'O campo "rate" é obrigatório' });
};

const validationToken = (req, res, next) => {
  const requireKey = ['authorization'];
if (requireKey.every((prop) => prop in req.headers)) {
  if (req.headers.authorization.length === 16 || typeof req.headers.authorization !== 'string') {
    return next();
  } 
    return res.status(401).send({ message: 'Token inválido' });
}
return res.status(401).send({ message: 'Token não encontrado' });
};
// ------------------------------------------------------------------------

// ------------------------END POINTS--------------------------------------
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

app.post('/login', validationEmailProps, validationPasswordProps, async (_req, res) => {
  const token = tokenGenerate();
  res.status(200).json({ token: `${token}` });
});

app.post('/talker', validationToken, validationName, validationAge, validationTalk,
validationWatchedKeys, validationRateKeys, async (req, res) => {
  const newTalker = req.body;
  const addTalker = await writeTalkerData(newTalker);
  return res.status(201).json(addTalker);
});

app.put('/talker/:id', validationToken, validationName, validationAge, validationTalk,
validationWatchedKeys, validationRateKeys, async (req, res) => {
  const { id } = req.params;
  const updateTalker = req.body;
  const updateTalkers = await updateTalkerData(Number(id), updateTalker);
  return res.status(200).json(updateTalkers);
});

app.delete('/talker/:id', validationToken, async (req, res) => {
  const { id } = req.params;
  await deleteTalkerData(Number(id));
  return res.status(204).end();
});
// req.header('authorization');