const { Sequelize, DataTypes } = require('sequelize');

// Connect to PostgreSQL database
const sequelize = new Sequelize('postgres', 'nhamhhung', '(Nhyeuhh2204!)', {
  host: 'localhost',
  dialect: 'postgres',
});

// Define database models
const Word = sequelize.define('Word', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  word: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  definition: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  translation: {
    type: DataTypes.STRING,
    allowNull: false,
  },
},
{
  tableName: 'words'
});

// Sync the model with the database
Word.sync()
  .then(() => {
    console.log('Word model synced with the database.');
  })
  .catch((error) => {
    console.error('Error syncing Word model:', error);
  });

module.exports = Word;