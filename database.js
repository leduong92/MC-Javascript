const sequelize = require('sequelize');

module.exports.sql = new sequelize('demo', 'sa', 'sa', {
    host: 'localhost',
    dialect: 'mssql',
    operatorsAliases: false,
    pool: {
        max: 5,
        min: 0,
        acquire: 3000,
        idle: 10000
    }
});

module.exports.postgresql = new sequelize('qim_training', 'qim_training', 'qim_training', {
    host: '10.203.192.193',
    dialect: 'postgres',
    operatorsAliases: false,
    pool: {
        max: 5,
        min: 0,
        acquire: 3000,
        idle: 10000
    }
});