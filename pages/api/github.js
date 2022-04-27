const { Octokit } = require("@octokit/rest");

export default async function getUserData(req, res) {
  const octo = new Octokit({
    auth: process.env.GH_AUTH,
  });

  // Get all the repos from a given user
  const repos = await octo.rest.repos.listForUser({ username: "phoboes" });
  // The return object with final counts:
  const languages = {};

  // Iterate all repo results
  for (let i = 0; i < repos.data.length; i++) {
    let repo = repos.data[i];
    // Grab the last part of the url from the repo's link as an ID
    const repoId = repo.html_url.match("[^/]+(?=/$|$)");
    // Fetch all the languages present within that repo
    const repoLanguages = await octo.rest.repos.listLanguages({
      owner: "phoboes",
      repo: repoId,
    });

    // Break down the object containing the language keys
    const languageKeys = Object.keys(repoLanguages.data);

    // If that language isn't present in the languages object, add it with a count of 1 or add to the existing key if it does
    for (let j = 0; j < languageKeys.length; j++) {
      let key = languageKeys[j];
      if (languages[key] === undefined) {
        languages[key] = 1;
      } else {
        languages[key] = languages[key] + 1;
      }
    }
  }

  return res.status(200).json(languages);
}
