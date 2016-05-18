module.exports = (opts) => {
  const users = opts.users;

  function getAll() {
    return users;
  }

  function getByGithubName(name) {
    return users.filter(details => details.githubUserName == name).pop();
  }

  return {
    getAll,
    getByGithubName,
  }
}
