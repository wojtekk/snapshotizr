const Octokat = require('octokat');
const _ = require('lodash');

module.exports = (opts) => {
  function getModifiedRepos(events, since, until) {
    let repos = events.filter(event => {
      const eventCreateData = new Date(event.createdAt);
      return event.type === 'PushEvent' &&
        eventCreateData >= since &&
        eventCreateData <= until;
    })
      .map(event => event.repo.name);

    repos = repos.concat(opts.repos);
    return _.uniq(repos);
  }

  function getUserRepositories(user, userPersonalToken, since, until) {
    const octo = new Octokat({
      token: userPersonalToken || opts.token,
      rootURL: opts.apiUrl,
    });

    if (userPersonalToken) {
      console.info(`Authorizing as ${user} using his/her token`);
    }

    console.info(`Fetching information from GHE about ${user} commitment`);
    return octo.users(user).events.fetchAll()
      .then(res => Object.assign({},
        { name: user, repositories: getModifiedRepos(res, since, until) })
      )
      .catch(err => {
        console.error(err);
      });
  }

  return {
    getUserRepositories,
  };
};
