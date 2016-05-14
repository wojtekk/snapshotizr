require('dotenv').config({silent: true});

const Git = require('./git')
const github = require('./github');
const users = require('./users');

// START PARAMS
const since = new Date('2016-03-01');
const until = new Date('2016-05-31');
const tmpDir = './tmp/';
const repositoriesDir = `${tmpDir}repositories/`;
// END PARAMS

const writer = require('./writer')({directory: `${tmpDir}reports/`});

const git = new Git({directory: repositoriesDir});

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
    const users = require('./users');
    user.repositories.forEach(repository => {
      const userDetails = users.getByGithubName(user.name);
      var res = git.log(since, until, userDetails, repository);
      if (res !== '') {
        console.log("write");
        writer.write(userDetails, repository, res);
      } else {
        console.log("empty");
      }
    });
  });

  return usersRepositories;
}

function cleanUp() {
  //shell.rm('-rf', tmpDir);
}

Promise.all(users.getAll().map(user => github.getUserRepositories(user.githubUserName, since, until)))
  .then(cloneRepositories)
  .then(generateDiffs)
  .then(cleanUp);
