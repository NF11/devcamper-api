const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).send({ message: 'get all' });
});

router.get('/:id', (req, res) => {
  res.status(200).send({ message: 'get one', id: req.params.id });
});

router.post('/', (req, res) => {
  res.status(200).send({ message: 'post' });
});

router.put('/:id', (req, res) => {
  res.status(200).send({ message: 'put', id: req.params.id });
});

router.delete('/:id', (req, res) => {
  res.status(200).send({ message: 'delete' });
});

module.exports = router;
