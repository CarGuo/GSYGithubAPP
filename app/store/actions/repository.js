/**
 * Created by guoshuyu on 2017/11/15.
 */

import {REPOSITORY} from '../type'
import RepositoryDao from '../../dao/repositoryDao'
import {Buffer} from 'buffer'
import marked from 'marked'
import {highlightAuto} from 'highlight.js'

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

const getRepositoryDetailReadme = async (userName, reposName, branch = 'master') => {
    let res = await RepositoryDao.getRepositoryDetailReadmeDao(userName, reposName);
    if (res.result) {
        let b = Buffer(res.data.content, 'base64');
        let data = b.toString('utf8');
        data= data.replace(new RegExp("<img src=\"https://github.com","gm"),"<img src=\"https://raw.githubusercontent.com")
            .replace(new RegExp("/blob/", "gm"),"/");
        let renderer = new marked.Renderer();
        renderer.image = function (href, title, text) {
            if (href.indexOf('https://github.com/') === 0) {
                let subUrl = href.substring(href.lastIndexOf('/'), href.length);
                let fixedUrl = "https://raw.githubusercontent.com/" + userName + "/" + reposName + "/" + branch + subUrl;
                href = fixedUrl;
            }
            let out = '<img src="' + href + '" alt="' + text + '"';
            if (title) {
                out += ' title="' + title + '"';
            }
            out += '/>';
            return out;
        };

        marked.setOptions({
            renderer: renderer,
            gfm: true,
            tables: true,
            breaks: true,
            pedantic: false,
            sanitize: false,
            smartLists: true,
            smartypants: false,
            highlight: function (code) {
                return highlightAuto(code).value;
            }
        });


        return {
            result: true,
            datahtml: generateCodeHtml(marked(data), true, 'markdown_dark.css', '#FFFFFF', '#FF00FF', '#FF00FF'),
            data: data
        }
    } else {
        return {
            result: false,
            data: ""
        }
    }
};

const generateCodeHtml = (mdSource, wrapCode, skin, backgroundColor, accentColor) => {
    console.log('***********', mdSource);
    return "<html>\n" +
        "<head>\n" +
        "<meta charset=\"utf-8\" />\n" +
        "<title></title>\n" +
        "<meta name=\"viewport\" content=\"width=device-width; initial-scale=1.0; maximum-scale=1.0; user-scalable=0;\"/>" +
        "<link rel=\"stylesheet\" type=\"text/css\" href=\"./" + skin + "\">\n" +
        "<link href=\"http:\/\/cdn.bootcss.com/highlight.js/8.0/styles/monokai_sublime.min.css\" rel=\"stylesheet\">\n"+
        "<script src=\"http:\/\/cdn.bootcss.com/highlight.js/8.0/highlight.min.js\"></script>  "+
        "<script>hljs.initHighlightingOnLoad();</script>  "+
        "<style>" +
        "body{background: " + backgroundColor + ";}" +
        "img{display: " + "block" + ";max-width:100%;}" +
        "a {color:" + accentColor + " !important;}" +
        ".highlight pre, pre {" +
        " word-wrap: " + (wrapCode ? "break-word" : "normal") + "; " +
        " white-space: " + (wrapCode ? "pre-wrap" : "pre") + "; " +
        "}" +
        "</style>" +
        "</head>\n" +
        "<body>\n" +
        mdSource +
        "</body>\n" +
        "</html>";
};

export default {
    getTrend,
    searchRepository,
    getUserRepository,
    getStarRepository,
    getRepositoryDetail,
    getRepositoryDetailReadme

}
