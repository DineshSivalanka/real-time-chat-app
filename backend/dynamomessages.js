const { v4: uuidv4 } = require('uuid');
const dynamoDB = require('../awsCognify');

const TABLE_NAME = 'ChatsTable';

module.exports = {
  async saveMessage({ username, message, avatar }) {
    const item = {
      messageId: uuidv4(), // ✅ must match your table's primary key name exactly!
      username,
      message,
      avatar,
      timestamp: Date.now(),
    };

    const params = {
      TableName: TABLE_NAME,
      Item: item,
    };

    await dynamoDB.put(params).promise();
    return item;
  },

  async getRecentMessages(limit = 50) {
    const params = {
      TableName: TABLE_NAME,
    };

    const data = await dynamoDB.scan(params).promise();
    return data.Items.sort((a, b) => a.timestamp - b.timestamp).slice(0, limit);
  },
};
