const users = require('../config/users');

function getAll() {
  return users;
}

function getByGithubName(name) {
  return users.filter(details => details.githubUserName == name).pop();
}

module.exports = {
  getAll,
  getByGithubName,
}
