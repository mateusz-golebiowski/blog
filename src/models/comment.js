'use strict';
module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    content: DataTypes.STRING,
    username: DataTypes.STRING,
    email: DataTypes.STRING
  }, {});
  Comment.associate = function(models) {
    Comment.belongsTo(models.Post, {
      onDelete: 'cascade',
      hooks: true
    });
  };
  return Comment;
};