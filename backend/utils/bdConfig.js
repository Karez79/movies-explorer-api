const { PORT = 4000, DB_URL = 'mongodb://0.0.0.0:27017/bitfilmsdb' } = process.env;
module.exports = {
  PORT,
  DB_URL,
};
