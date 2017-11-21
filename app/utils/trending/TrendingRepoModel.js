/**
 * TrendingRepoModel
 * 项目地址:https://github.com/crazycodeboy/GitHubTrending
 * 博客地址:http://www.devio.org
 * @flow
 */

export default class TrendingRepoModel {
    constructor(fullName, url, description, language, meta, contributors, contributorsUrl,
                starCount, forkCount, name, reposName) {
        this.fullName = fullName;
        this.url = url;
        this.description = description;
        this.language = language;
        this.meta = meta;
        this.contributors = contributors;
        this.contributorsUrl = contributorsUrl;
        this.starCount = starCount;
        this.forkCount = forkCount;
        this.name = name;
        this.reposName = reposName;
    }
}
