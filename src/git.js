const shell = require('shelljs');

class Git {
  constructor(opts) {
    this.baseDir = opts.directory;
    this.gitUrl = opts.url;
    this.skipCleanup = opts.skipCleanup || false;
    this.depth = opts.depth || 1000;
  }

  checkout(repository) {
    const repoDirName = repository.replace('/', '-');
    const directory = `${this.baseDir}${repoDirName}/`;
    if (!shell.test('-d', directory)) {
      shell.mkdir('-p', directory);
      const repoUrl = `${this.gitUrl}${repository}.git`;
      console.info(`Cloning repository ${repository}`);
      const res = shell.exec(`git clone ${repoUrl} ${directory}`, { silent: true });
      if (res.code) {
        console.error('Error during git clone:\n', res.stderr);
      }
      return res.code === 0;
    }
    const repoUrl = `${this.gitUrl}${repository}.git`;
    console.info(`Pulling repository ${repository}`);
    const res = shell.exec(`git -C ${directory} pull ${repoUrl}`, { silent: true });
    if (res.code) {
      console.error('Error during git pull:\n', res.stderr);
    }
    return res.code === 0;
  }

  log(since, until, userDetails, repository) {
    console.info(`Generating diff for user: ${userDetails.name}, repository: ${repository}`);
    const repoDirName = repository.replace('/', '-');
    const directory = `${this.baseDir}${repoDirName}/`;
    const userName = `--author="${userDetails.name}"`;
    const emails = userDetails.emails.map(email => `--author="${email}"`).join(' ');
    const sinceParam = `--since "${since}"`;
    const untilParam = `--until "${until}"`;
    const logOptions = '--patch --ignore-all-space --ignore-space-at-eol --no-color --summary';
    const options = `-c core.pager=cat -C "${directory}"`;
    const command = `git ${options} log ${sinceParam} ${untilParam} ` +
      `${userName} ${emails} ${logOptions}`;
    const res = shell.exec(command, { silent: true });
    if (res.code) {
      console.error('Error during git log:\n', res.stderr);
    }
    return res.stdout;
  }

  cleanUp() {
    if (!this.skipCleanup) {
      shell.rm('-rf', this.baseDir);
    }
  }
}

module.exports = Git;
