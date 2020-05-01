const { Model } = require('objection');

class Friend extends Model {
  static get tableName() {
    return 'friends';
  }
}

module.exports = Friend;
