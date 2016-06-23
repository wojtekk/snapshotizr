const Octokat = require('octokat');

module.exports = (opts) => {
  function getModifiedRepos(events, since, until) {
    const repos = events.filter(event => {
      const eventCreateData = new Date(event.createdAt);
      return event.type === 'PushEvent' &&
          eventCreateData >= since &&
          eventCreateData <= until;
    })
      .map(event => event.repo.name);

    const uniqRepos = [...new Set(repos)];

    return uniqRepos;
  }

  function getUserRepositories(user, userPersonalToken, since, until) {
    let octo = new Octokat({
      token: userPersonalToken ? userPersonalToken : opts.token,
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
        .then (function(res) { console.info(res); return res;})
      .catch(err => {
        console.error(err);
      });
  }

  return {
    getUserRepositories,
  };
};
