/**
 * Created by guoshuyu on 2017/11/15.
 */

import {REPOSITORY} from '../type'
import RepositoryDao from '../../dao/repositoryDao'
import {Buffer} from 'buffer'

import showdown from 'showdown'

var marked = require('marked');

const getTrend = (page = 0, since = 'daily', languageType, callback) => async (dispatch, getState) => {
    let res = await RepositoryDao.getTrendDao(page, since, languageType);
    if (res && res.result) {
        if (page === 0) {
            dispatch({
                type: REPOSITORY.TREND_REPOSITORY,
                res: res.data
            });
        } else {
            let trend = getState()['repository'].trend_repos_data_list;
            dispatch({
                type: REPOSITORY.TREND_REPOSITORY,
                res: trend.concat(res.data)
            });
        }
        callback && callback(res.data);
    } else {
        callback && callback(null);
    }
};

const searchRepository = async (q, language, sort, order, page = 1, pageSize) => {
    if (language) {
        q = q + `%2Blanguage%3A${language}`;
    }
    let res = await RepositoryDao.searchRepositoryDao(q, sort, order, page, pageSize);
    return {
        result: res.result,
        data: res.data
    }
};

const getUserRepository = async (userName, page = 1) => {
    let res = await RepositoryDao.getUserRepositoryDao(userName, page);
    return {
        result: res.result,
        data: res.data
    }
};

const getStarRepository = async (userName, page = 1) => {
    let res = await RepositoryDao.getStarRepositoryDao(userName, page);
    return {
        result: res.result,
        data: res.data
    }
};

const getRepositoryDetail = async (userName, reposName) => {
    let res = await RepositoryDao.getRepositoryDetailDao(userName, reposName);
    return {
        result: res.result,
        data: res.data
    }
};

const getRepositoryDetailReadme = async (userName, reposName) => {
    let res = await RepositoryDao.getRepositoryDetailReadmeDao(userName, reposName);
    if (res.result) {
        let b = Buffer(res.data.content, 'base64');
        let data = b.toString('utf8');
        let converter = new showdown.Converter();
        converter.setFlavor('github');
        let html = converter.makeHtml(data);

        marked.setOptions({
            renderer: new marked.Renderer(),
            gfm: true,
            tables: true,
            breaks: false,
            pedantic: false,
            sanitize: false,
            smartLists: true,
            smartypants: false
        });
        let dd = fixLinks(marked(data), null, userName, reposName);
        console.log("***********", dd);
        return {
            result: true,
            datahtml: generateCodeHtml(dd, true, 'markdown_dark.css', '#FFFFFF', '#FF00FF', '#FF00FF'),
            data: data
        }
    } else {
        return {
            result: false,
            data: ""
        }
    }
};

const generateCodeHtml = (mdSource, wrapCode,
                          skin, backgroundColor, accentColor) => {
    return "<html>\n" +
        "<head>\n" +
        "<meta charset=\"utf-8\" />\n" +
        "<title>MD View</title>\n" +
        "<meta name=\"viewport\" content=\"width=device-width; initial-scale=1.0; maximum-scale=1.0; user-scalable=0;\"/>" +
        "<link rel=\"stylesheet\" type=\"text/css\" href=\"./" + skin + "\">\n" +
        "<style>" +
        "body{background: " + backgroundColor + ";}" +
        "a {color:" + accentColor + " !important;}" +
        ".highlight pre, pre {" +
        " word-wrap: " + (wrapCode ? "break-word" : "normal") + "; " +
        " white-space: " + (wrapCode ? "pre-wrap" : "pre") + "; " +
        " background-color:" + (wrapCode ? "#FF0000" : "#F00000") + "; " +
        "}" +
        "</style>" +
        "</head>\n" +
        "<body>\n" +
        mdSource +
        "</body>\n" +
        "</html>";
};

const fixLinks = (source, baseUrl, owner, repo, branch = 'master') => {
    //let imagesMatcher = source.match("src=\"(.*?)\"");
    let imagesMatcher = /src="(.*?)"/.exec(source);
    if (imagesMatcher) {
        imagesMatcher.forEach((oriUrl) => {
            console.log('%%%%%%', oriUrl)
            let subUrl = oriUrl.substring(oriUrl.lastIndexOf('/'), oriUrl.length);
            let fixedUrl = "https://raw.githubusercontent.com/" + owner + "/" + repo + "/" + branch + subUrl;
            source = source.replace("src=\"" + oriUrl + "\"", "src=\"" + fixedUrl + "\"");

        })
    }
    return source;
}

export default {
    getTrend,
    searchRepository,
    getUserRepository,
    getStarRepository,
    getRepositoryDetail,
    getRepositoryDetailReadme

}
