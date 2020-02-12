const Sequelize = require('sequelize');

const sequelize = new Sequelize('node-proyect', 'admin', 'leantech', {
    dialect: 'mysql', host: 'localhost'
});

module.exports = sequelize;