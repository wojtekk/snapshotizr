require('dotenv').config({ silent: true });

const config = require('./config')();
const Git = require('./git');
const github = require('./github')({ token: config.ghe.token, apiUrl: config.ghe.apiUrl });
const users = require('./users')({ users: config.users });

// START PARAMS
const since = new Date('2016-03-01');
const until = new Date('2016-05-31');
// END PARAMS

const writer = require('./writer')({ directory: config.reportsDir });

const git = new Git({ url: config.ghe.url, directory: config.repositoriesDir });

function cloneRepositories(usersRepositories) {
  usersRepositories.forEach(user => {
    user.repositories.forEach(repository => {
      git.checkout(repository);
    });
  });

  return usersRepositories;
}

function generateDiffs(usersRepositories) {
  usersRepositories.forEach(user => {
    user.repositories.forEach(repository => {
      const userDetails = users.getByGithubName(user.name);
      const res = git.log(since, until, userDetails, repository);
      if (res !== '') {
        writer.write(userDetails, repository, res);
      }
    });
  });

  return usersRepositories;
}

function cleanUp() {
  // shell.rm('-rf', config.repositoriesDir);
}

Promise.all(users.getAll()
  .map(user => github.getUserRepositories(user.githubUserName, since, until)))
  .then(cloneRepositories)
  .then(generateDiffs)
  .then(cleanUp)
  .catch((eror) => {
    console.error(eror);
    cleanUp();
  });
