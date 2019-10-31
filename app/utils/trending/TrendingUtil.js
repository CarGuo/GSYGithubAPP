/**
 * TrendingUtil
 * 工具类：用于将github trending html 转换成 TrendingRepoModel
 * 项目地址:https://github.com/crazycodeboy/GitHubTrending
 * 博客地址:http://www.devio.org
 * @flow
 */


import TrendingRepoModel from './TrendingRepoModel';
import StringUtil from './StringUtil';

var TAGS = {
    meta: {
        start: '<span class="d-inline-block float-sm-right"',
        flag: '/svg>',
        end: '</span>end'
    },
    starCount: {
        start: '<svg aria-label="star"',
        flag: '/svg>',
        end: '</a>'
    },
    forkCount: {
        start: '<svg aria-label="repo-forked"',
        flag: '/svg>',
        end: '</a>'
    }

}
export default class TrendingUtil {
    static htmlToRepo(responseData) {
        responseData = responseData.replace(/\n/, '');
        var repos = [];
        var splitWithH3 = responseData.split('<article');
        splitWithH3.shift();
        for (var i = 0; i < splitWithH3.length; i++) {
            var repo = new TrendingRepoModel();
            var html = splitWithH3[i];

            this.parseRepoBaseInfo(repo, html);

            var metaNoteContent = this.parseContentWithNote(html, 'class="f6 text-gray mt-2">', '</div>') + "end";
            repo.meta = this.parseRepoLabelWithTag(repo, metaNoteContent, TAGS.meta);
            repo.starCount = this.parseRepoLabelWithTag(repo, metaNoteContent, TAGS.starCount);
            repo.forkCount = this.parseRepoLabelWithTag(repo, metaNoteContent, TAGS.forkCount);

            this.parseRepoLang(repo, metaNoteContent);
            this.parseRepoContributors(repo, metaNoteContent);
            repos.push(repo);
        }
        return repos;
    }

    static parseContentWithNote(htmlStr, startFlag, endFlag) {
        var noteStar = htmlStr.indexOf(startFlag);
        if (noteStar == -1) {
            return '';
        } else {
            noteStar += +startFlag.length;
        }

        var noteEnd = htmlStr.indexOf(endFlag, noteStar);
        var content = htmlStr.substring(noteStar, noteEnd);
        return StringUtil.trim(content)
    }

    static parseRepoBaseInfo(repo, htmlBaseInfo) {
        var urlIndex = htmlBaseInfo.indexOf('<a href="') + '<a href="'.length;
        var url = htmlBaseInfo.slice(urlIndex, htmlBaseInfo.indexOf('">', urlIndex));
        repo.url = url;
        repo.fullName = url.slice(1, url.length);
        if (repo.fullName && repo.fullName.indexOf('/') !== -1) {
            repo.name = repo.fullName.split('/')[0];
            repo.reposName = repo.fullName.split('/')[1];
        }

        var description = this.parseContentWithNote(htmlBaseInfo, '<p class="col-9 text-gray my-1 pr-4">', '</p>');
        repo.description = description;
    }

    static parseRepoLabelWithTag(repo, noteContent, tag) {
        let startFlag;
        if (TAGS.starCount === tag || TAGS.forkCount === tag) {
            //startFlag = tag.start + ' href="/' + repo.fullName + tag.flag;
            startFlag = tag.start;
        } else {
            startFlag = tag.start;
        }
        let content = this.parseContentWithNote(noteContent, startFlag, tag.end);
        let metaContent = content.substring(content.indexOf(tag["flag"]) + tag["flag"].length, content.length);
        return StringUtil.trim(metaContent);
    }

    static parseRepoLang(repo, metaNoteContent) {
        var content = this.parseContentWithNote(metaNoteContent, 'programmingLanguage">', '</span>');
        repo.language = StringUtil.trim(content);
    }

    static parseRepoContributors(repo, htmlContributors) {
        htmlContributors = this.parseContentWithNote(htmlContributors, 'Built by', '</a>');
        var splitWitSemicolon = htmlContributors.split('"');
        repo.contributorsUrl = splitWitSemicolon[1];
        var contributors = [];
        for (var i = 0; i < splitWitSemicolon.length; i++) {
            var url = splitWitSemicolon[i];
            if (url.search('http') !== -1) {
                contributors.push(url);
            }
        }
        repo.contributors = contributors;
    }
}
