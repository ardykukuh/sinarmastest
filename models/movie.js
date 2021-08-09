'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class movie extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  movie.init({
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    duration: DataTypes.INTEGER,
    artists: DataTypes.STRING,
    genres: DataTypes.STRING,
    urlmovie: DataTypes.STRING,
    viewed: DataTypes.INTEGER,
    voted: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'movie',
  });
  return movie;
};