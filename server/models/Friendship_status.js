const { Model } = require('objection');

class Friendship_status extends Model {
  static get tableName() {
    return 'friendship_statuses';
  }
}

module.exports = Friendship_status;
