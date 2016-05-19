const fs = require('fs');
const shell = require('shelljs');

module.exports = (opts) => {
  const directory = opts.directory;

  function write(userDetails, repository, res) {
    const repoDirName = repository.replace('/', '-');
    const reportsDir = `${directory}${userDetails.name}/`;
    shell.mkdir('-p', reportsDir);
    const fileName = `${reportsDir}${repoDirName}.diff`;
    fs.writeFileSync(fileName, res);
  }

  return {
    write,
  };
};
