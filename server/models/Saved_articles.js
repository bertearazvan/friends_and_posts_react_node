const { Model } = require('objection');

class Post extends Model {
  static get tableName() {
    return 'saved_articles';
  }
}

module.exports = Post;
