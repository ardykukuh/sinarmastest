'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class viewerandvoter extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  viewerandvoter.init({
    user: DataTypes.STRING,
    idMovie: DataTypes.STRING,
    flag_vieworvote: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'viewerandvoter',
  });
  return viewerandvoter;
};