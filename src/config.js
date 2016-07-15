const _ = require('lodash');

function getUserHome() {
  return process.env[/^win/.test(process.platform) ? 'USERPROFILE' : 'HOME'];
}

module.exports = (opts = {}) => {
  const home = getUserHome();
  const appDir = `${home}/snapshotizr/`;
  const configFile = opts.file || `${appDir}config.js`;
  const configuration = require(configFile);// eslint-disable-line global-require

  const defaultSettings = {
    appDir,
    repositoriesDir: `${appDir}repositories/`,
    reportsDir: `${appDir}reports/`,
    ghe: {
      apiUrl: 'https://github.schibsted.io/api/v3',
      url: 'git@github.schibsted.io:',
    },
    repos: [],
    git: {
      depth: 1000,
    },
  };

  return _.merge({}, defaultSettings, configuration);
};
