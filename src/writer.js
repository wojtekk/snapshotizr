const fs = require('fs');
const shell = require('shelljs');

module.exports = (opts) => {
  const directory = opts.directory;

  function write(date, userDetails, repository, res) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const repoDirName = repository.replace('/', '-');
    const userName = userDetails.name;
    const reportsDir = `${directory}${year}-${month > 9 ? month : `0${month}`}-${userName}/`;
    shell.mkdir('-p', reportsDir);
    const fileName = `${reportsDir}${repoDirName}.diff`;
    console.info(`Saving diff: ${fileName}`);

    fs.writeFileSync(fileName, res);
  }

  return {
    write,
  };
};
