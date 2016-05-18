const shell = require('shelljs');

const silent = false;

class Git {
  constructor(opts) {
    this.baseDir = opts.directory;
    this.gitUrl = opts.url;
  }

  checkout(repository) {
    const repoDirName = repository.replace('/', '-');
    const directory = `${this.baseDir}${repoDirName}/`;
    if (!shell.test('-d', directory)) {
      shell.mkdir('-p', directory);
      const repoUrl = `${this.gitUrl}/${repository}.git`;
      let res = shell.exec(`git clone ${repoUrl} ${directory}`, {silent});
      return res.code === 0;
    } else {
      return true;
    }
  }

  log(since, until, userDetails, repository) {
    const repoDirName = repository.replace('/', '-');
    const directory = `${this.baseDir}${repoDirName}/`;
    const userName = `--author="${userDetails.name}"`;
    const emails = userDetails.emails.map(email => `--author="${email}"`).join(' ');
    const sinceParam = `--since "${since.getUTCDate()}"`;
    const untilParam = `--until "${until.getUTCDate()}"`;
    const logOptions = '--patch --ignore-all-space --ignore-space-at-eol --no-color --summary';
    const options = `-c core.pager=cat -C "${directory}"`;
    const command = `git ${options} log ${sinceParam} ${untilParam} ${userName} ${emails} ${logOptions}`;
    const res = shell.exec(command, {silent:true});
    return res.stdout;
  }
}


module.exports = Git;
