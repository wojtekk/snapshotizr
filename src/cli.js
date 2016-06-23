require('dotenv').config({ silent: true });

const config = require('./config')();
const Git = require('./git');
const github = require('./github')({ token: config.ghe.token, apiUrl: config.ghe.apiUrl });
const users = require('./users')({ users: config.users });

const monthsNames = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];

const commandLineArgs = require('command-line-args');
const cli = commandLineArgs([
  { name: 'month', alias: 'm', type: Number },
  { name: 'skip-cleanup', alias: 's', type: Boolean },
]);
const cliOptions = cli.parse();

const now = new Date();
const month = cliOptions.month - 1 || now.getMonth() - 1;
if (!Number.isInteger(month) || month < 1 || month > 12) {
  console.error('Usage: snapshotizer [-m month]');
  console.error('Month is a number: 1 - 12, default value: previous month');
  process.exit(1);
}

const since = new Date(now.getFullYear(), month, 1);
const until = new Date(now.getFullYear(), month + 1, 0);

console.log(`Snashotizr - reports for ${monthsNames[month]}`);
console.log(`Dates range: ${since} - ${until}`);

const writer = require('./writer')({ directory: config.reportsDir });

const git = new Git({
  url: config.ghe.url,
  directory: config.repositoriesDir,
  depth: config.git.depth,
  skipCleanup: cliOptions['skip-cleanup'],
});

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
        writer.write(since, userDetails, repository, res);
      }
    });
  });

  return usersRepositories;
}

Promise.all(users.getAll()
  .map(user => github.getUserRepositories(user.githubUserName, user.githubPersonalToken, since, until)))
  .then(cloneRepositories)
  .then(generateDiffs)
  .then(git.cleanUp.bind(git))
  .catch((error) => {
    console.log('\nSorry for error :(\nPlease report it as issue to Github project.');
    console.error(error);
    git.cleanUp();
  });
