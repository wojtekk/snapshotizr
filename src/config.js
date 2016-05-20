const _ = require('lodash');

function getUserHome() {
  return process.env[process.platform.indexOf('win32') !== -1 ? 'USERPROFILE' : 'HOME'];
}

module.exports = (opts = {}) => {
  const home = getUserHome();
  const appDir = `${home}/.snapshotizr/`;
  const configFile = opts.file || `${appDir}/config.js`;
  const configuration = require(configFile);// eslint-disable-line global-require

  const defaultSettings = {
    appDir: `${appDir}`,
    repositoriesDir: `${appDir}repositories/`,
    reportsDir: `${appDir}reports/`,
    ghe: {
      apiUrl: 'https://github.schibsted.io/api/v3',
      url: 'git@github.schibsted.io:',
    },
    git: {
      depth: 1000,
    },
  };

  return _.merge(configuration, defaultSettings);
};
