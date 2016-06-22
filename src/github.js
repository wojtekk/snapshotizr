const Octokat = require('octokat');

module.exports = (opts) => {
  const octo = new Octokat({
    token: opts.token,
    rootURL: opts.apiUrl,
  });

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

  function getUserRepositories(user, since, until) {
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
