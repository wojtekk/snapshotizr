const Octokat = require('octokat');
const _ = require('lodash');

module.exports = (opts) => {
  const octo = new Octokat({
    token: opts.token,
    rootURL: opts.apiUrl,
  });

  function getUserRepositories(user, since, until, page = 1, repos) {
    console.info(`Fetching information from GHE about ${user} commitment - page: ${page}`);
    return octo.users(user).events.fetch({ page })
      .then(res => getModifiedRepos(user, // eslint-disable-line no-use-before-define
        res.items, since, until, page, repos))
      .catch(err => {
        console.error(err);
      });
  }

  function getModifiedRepos(user, events, since, until, page, previousRepos) {
    const repos = events.filter(event => {
      const eventCreateData = new Date(event.createdAt);
      return event.type === 'PushEvent' &&
        eventCreateData >= since &&
        eventCreateData <= until;
    })
    .map(event => event.repo.name);

    const uniqRepos = _.uniq(_.merge(repos, previousRepos));
    const lastEventData = new Date(events[events.length - 1].createdAt);
    if (lastEventData > since) {
      return getUserRepositories(user, since, until, page + 1, uniqRepos);
    }
    return Object.assign({}, { name: user, repositories: uniqRepos });
  }

  return {
    getUserRepositories,
  };
};
