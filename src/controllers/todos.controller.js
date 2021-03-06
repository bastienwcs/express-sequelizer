const { Op } = require('sequelize');
const { Todo } = require('../models');

// force drop database and create a new element on server restart
/*
Todo.sync({ force: true }).then(() => {
  return Todo.create({
    content: 'example',
  });
});
*/

const findAll = (request, response) => {
  Todo.findAll()
    .then((result) => {
      response.send(result);
    })
    .catch((error) => response.status(500).send(error));
};

const findOne = (request, response) => {
  const { id } = request.params;
  Todo.findOne({
    where: {
      id: id,
    },
  })
    .then((result) => {
      if (result) {
        response.send(result);
      } else {
        response.sendStatus(404);
      }
    })
    .catch((error) => response.status(500).send(error));
};

const findByContent = (request, response) => {
  const { content } = request.params;
  Todo.findAll({
    where: {
      content: {
        [Op.substring]: content,
      },
    },
  })
    .then((result) => {
      if (result.length) {
        response.send(result);
      } else {
        response.sendStatus(404);
      }
    })
    .catch((error) => response.status(500).send(error));
};

const create = (request, response) => {
  const todo = request.body;
  Todo.create(todo)
    .then((result) => {
      response.status(201).send(result);
    })
    .catch((error) => response.status(500).send(error));
};

const update = (request, response) => {
  const { id } = request.params;
  const update = request.body;
  Todo.update(update, {
    where: {
      id: id,
    },
  })
    .then((result) => {
      if (result && result[0] > 0) {
        response.sendStatus(204);
      } else {
        response.sendStatus(404);
      }
    })
    .catch((error) => response.status(500).send(error));
};

const deleteOne = (request, response) => {
  const { id } = request.params;
  Todo.destroy({
    where: {
      id: id,
    },
  })
    .then(() => response.sendStatus(202))
    .catch((error) => response.status(500).send(error));
};

module.exports = { findAll, findOne, findByContent, create, update, deleteOne };
