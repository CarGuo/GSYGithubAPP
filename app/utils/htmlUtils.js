import marked from 'marked'
import {highlightAuto, configure} from 'highlight.js'
import * as Constant from '../style/constant'
import {Platform} from 'react-native'
import {Actions} from 'react-native-router-flux'

/**
 * markdown to html parser
 */


export const generateCode2HTml = (mdData) => {
    let currentData = (mdData && mdData.indexOf("<code>") === -1) ?
        "<body>\n" +
        "<pre class=\"pre\">\n" +
        "<code>\n" +
        mdData +
        "</code>\n" +
        "</pre>\n" +
        "</body>\n" :

        "<body>\n" +
        "<pre class=\"pre\">\n" +
        mdData +
        "</pre>\n" +
        "</body>\n";
    return generateHtml(currentData)
};

export const generateHtml = (mdData) => {
    if (!mdData) {
        return "";
    }
    let data = mdData.replace(/<code(([\s\S])*?)<\/code>/gi, function (match, capture) {
        if (match) {
            if (Platform.OS === 'android') {
                if (match && match.indexOf("\n") !== -1) {
                    match = match.replace(/[\n]/g, '</br>');
                }
            }
            return match;
        } else {
            return match;
        }
    });

    return generateCodeHtml(data, false);
};


export const generateMd2Html = (mdData, userName, reposName, branch = 'master', needMd = true) => {
    let dataPre = mdData.replace(/src=*[^>]*>/gi, function (match, capture) {
        let newStr = match;
        if (match) {
            newStr = match.replace(new RegExp("/blob/", "gm"), "/raw/");
        }
        return newStr;
    });
    let data = dataPre.replace(/<pre[^>]*>([^]+)<\/pre>/gi, function (match, capture) {
        if (capture) {
            let newStr = highlightAuto(capture).value;
            if (Platform.OS === 'android') {
                if (newStr && newStr.indexOf("\n") !== -1) {
                    newStr = newStr.replace(/[\n]/g, '</p>');
                }
            }
            return "<pre><code>" + newStr + "</code></pre>";
        } else {
            return match;
        }
    });
    let renderer = new marked.Renderer();
    renderer.image = function (href, title, text) {
        if (href.indexOf('https://github.com/') === 0) {
            href = href.replace(new RegExp("/blob/", "gm"), "/raw/");
        }
        let out = '<img src="' + href + '" alt="' + text + '"';
        if (title) {
            out += ' title="' + title + '"';
        }
        out += '/>';
        return out;
    };

    configure({
        'useBR': true
    });

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
            let newCode = highlightAuto(code).value;
            if (Platform.OS === 'android') {
                if (newCode && newCode.indexOf("\n") !== -1) {
                    return newCode.replace(/[\n]/g, '</p>');
                }
            }
            return newCode;
        }
    });
    let source = (needMd) ? marked(data) : data;
    return generateCodeHtml(source, false);
};

/**
 * style for mdHTml
 */
export const generateCodeHtml = (mdHTML, wrap, backgroundColor = Constant.white, actionColor = Constant.actionBlue) => {
    return "<html>\n" +
        "<head>\n" +
        "<meta charset=\"utf-8\" />\n" +
        "<title></title>\n" +
        "<meta name=\"viewport\" content=\"width=device-width; initial-scale=1.0; maximum-scale=1.0; user-scalable=0;\"/>" +
        "<link href=\"https:\/\/cdn.bootcss.com/highlight.js/9.12.0/styles/dracula.min.css\" rel=\"stylesheet\">\n" +
        "<script src=\"https:\/\/cdn.bootcss.com/highlight.js/9.12.0/highlight.min.js\"></script>  " +
        "<script>hljs.initHighlightingOnLoad();</script>  " +
        "<style>" +
        "body{background: " + backgroundColor + ";}" +
        "a {color:" + actionColor + " !important;}" +
        ".highlight pre, pre {" +
        " word-wrap: " + (wrap ? "break-word" : "normal") + "; " +
        " white-space: " + (wrap ? "pre-wrap" : "pre") + "; " +
        "}" +
        "thead, tr {" +
        "background:" + Constant.miWhite + ";}" +
        "td, th {" +
        "padding: 5px 10px;" +
        "font-size: 12px;" +
        "direction:hor" +
        "}" +
        "tr:nth-child(even) {" +
        "background:" + Constant.primaryLightColor + ";" +
        "color:" + Constant.miWhite + ";" +
        "}" +
        "tr:nth-child(odd) {" +
        "background: " + Constant.miWhite + ";" +
        "color:" + Constant.primaryLightColor + ";" +
        "}" +
        "th {" +
        "font-size: 14px;" +
        "color:" + Constant.miWhite + ";" +
        "background:" + Constant.primaryLightColor + ";" +
        "}" +
        "</style>" +
        "</head>\n" +
        "<body>\n" +
        mdHTML +
        "</body>\n" +
        "</html>";
};

const formatCode = (codeSource) => {
    if (!codeSource && codeSource.length === 0) return codeSource;
    return codeSource.replace(new RegExp("<", "gm"), "&lt;").replace(new RegExp(">", "gm"), "&gt;");
};

export const parseDiffSource = (diffSource, wrap) => {
    //let diffSource = formatCode(currentSource);
    let lines = diffSource.split("\n");
    let source = "";
    let addStartLine = -1;
    let removeStartLine = -1;
    let addLineNum = 0;
    let removeLineNum = 0;
    let normalLineNum = 0;
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        let lineNumberStr = "";
        let classStr = "";
        let curAddNumber = -1;
        let curRemoveNumber = -1;

        if (line.indexOf("+") === 0) {
            classStr = "class=\"hljs-addition\";";
            curAddNumber = addStartLine + normalLineNum + addLineNum;
            addLineNum++;
        } else if (line.indexOf("-") === 0) {
            classStr = "class=\"hljs-deletion\";";
            curRemoveNumber = removeStartLine + normalLineNum + removeLineNum;
            removeLineNum++;
        } else if (line.indexOf("@@") === 0) {
            classStr = "class=\"hljs-literal\";";
            removeStartLine = getRemoveStartLine(line);
            addStartLine = getAddStartLine(line);
            addLineNum = 0;
            removeLineNum = 0;
            normalLineNum = 0;
        } else if (!(line.indexOf("\\") === 0)) {
            curAddNumber = addStartLine + normalLineNum + addLineNum;
            curRemoveNumber = removeStartLine + normalLineNum + removeLineNum;
            normalLineNum++;
        }
        lineNumberStr = getDiffLineNumber(curRemoveNumber === -1 ? "" : (curRemoveNumber + ""),
            curAddNumber === -1 ? "" : (curAddNumber + ""));
        source = source + "\n" + "<div " + classStr + ">" + (wrap ? "" : lineNumberStr + getBlank(1)) + line + "</div>"
    }
    return source;
};


const getRemoveStartLine = (line) => {
    try {
        return parseInt(line.substring(line.indexOf("-") + 1, line.indexOf(",")));
    } catch (e) {
        return 1;
    }
};

const getAddStartLine = (line) => {
    try {
        return parseInt(line.substring(line.indexOf("+") + 1,
            line.indexOf(",", line.indexOf("+"))));
    } catch (e) {
        return 1;
    }
};

const getDiffLineNumber = (removeNumber, addNumber) => {
    let minLength = 4;
    return getBlank(minLength - removeNumber.length) + removeNumber + getBlank(1) +
        getBlank(minLength - addNumber.length) + addNumber
};

const getBlank = (num) => {
    let builder = "";
    for (let i = 0; i < num; i++) {
        builder += " ";
    }
    return builder;
};


export const getFullName = (repository_url) => {
    if (repository_url.charAt(repository_url.length - 1) === "/") {
        repository_url = repository_url.substring(0, repository_url.length - 1);
    }
    let fullName = '';
    if (repository_url) {
        let splicurl = repository_url.split("/");
        if (splicurl.length > 2) {
            fullName = splicurl[splicurl.length - 2] + "/" + splicurl[splicurl.length - 1];
        }
    }
    return fullName;
};


export function launchUrl(url) {
    if (!url && url.length === 0) return;
    let gitHubName = getFullName(url);
    if (gitHubName === '') {
        //openInBrowser(context, uri.toString());
        return;
    }
    let userName = gitHubName.split("/")[0];
    let repoName = gitHubName.split("/")[1];
    if (__DEV__) {
        console.log("launchUrl", url)
    }
    if (isRepoUrl(url)) {
        Actions.RepositoryDetail({
            repositoryName: repoName,
            ownerName: userName,
            title: gitHubName,
        });
    } else if (isUserUrl(url)) {
        Actions.PersonPage({currentUser: userName});
    } else if (isIssueUrl(url)) {
        console.log(url + "issue");
        Actions.RepositoryDetail({
            repositoryName: repoName,
            ownerName: userName,
            title: gitHubName,
        });
    } else if (isReleasesUrl(url)) {
        console.log(url + "release");
        //todo  release
    } else if (isReleaseTagUrl(url)) {
        console.log(url + "tag");
        //todo  tag
    } else if (isCommitUrl(url)) {
        console.log(url + "commit");
        //todo  commit
    } else {
        Actions.WebPage({uri: event.url});
    }
}

const GITHUB_BASE_URL_PATTERN_STR = "(https://)?(http://)?(www.)?github.com";
const REPO_FULL_NAME_PATTERN = /(https:\/\/)?(http:\/\/)?(www.)?github.com([a-z]|[A-Z]|\\d|-)*\/([a-z]|[A-Z]|\\d|-|\\.|_)*/;
const USER_PATTERN = /(https:\/\/)?(http:\/\/)?(www.)?github.com\/([a-z]|[A-Z]|\\d|-)*(\/)?/;
const REPO_PATTERN = /(https:\/\/)?(http:\/\/)?(www.)?github.com\/([a-z]|[A-Z]|\\d|-)*\/([a-z]|[A-Z]|\\d|-|\\.|_)\S(\/)?/;
const ISSUE_PATTERN = /(https:\/\/)?(http:\/\/)?(www.)?github.com\/([a-z]|[A-Z]|\\d|-)*\/([a-z]|[A-Z]|\\d|-|\\.|_)*\/issues\/(\\d)*(\/)?/;
const RELEASES_PATTERN = /(https:\/\/)?(http:\/\/)?(www.)?github.com\/([a-z]|[A-Z]|\\d|-)*\/([a-z]|[A-Z]|\\d|-|\\.|_)*\/releases(\/latest)?(\/)?/;
const RELEASE_TAG_PATTERN = /(https:\/\/)?(http:\/\/)?(www.)?github.com\/([a-z]|[A-Z]|\\d|-)*\/([a-z]|[A-Z]|\\d|-|\\.|_)*\/releases\/tag\/([^\/])*(\/)?/;
const COMMIT_PATTERN = /(https:\/\/)?(http:\/\/)?(www.)?github.com\/([a-z]|[A-Z]|\\d|-)*\/([a-z]|[A-Z]|\\d|-|\\.|_)*\/commit(s)?\/([a-z]|\\d)*(\/)?/;
const GITHUB_URL_PATTERN = /(https:\/\/)?(http:\/\/)?(www.)?github.com(.)*/;


const isUserUrl = (url) => {
    return USER_PATTERN.exec(url) !== null;
};

const isRepoUrl = (url) => {
    return REPO_PATTERN.exec(url) !== null;
};

const isIssueUrl = (url) => {
    return ISSUE_PATTERN.exec(url) !== null;
};

const isGitHubUrl = (url) => {
    return GITHUB_URL_PATTERN.exec(url) !== null;
};

const isReleasesUrl = (url) => {
    return RELEASES_PATTERN.exec(url) !== null;
};

const isReleaseTagUrl = (url) => {
    return RELEASE_TAG_PATTERN.exec(url) !== null;
};

const isCommitUrl = (url) => {
    return COMMIT_PATTERN.exec(url) !== null;
};
