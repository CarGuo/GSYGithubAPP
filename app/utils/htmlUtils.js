import marked from 'marked'
import {highlightAuto, configure} from 'highlight.js'
import * as Constant from '../style/constant'
import {Platform} from 'react-native'
import {Actions} from 'react-native-router-flux'
import URL from 'url-parse';
import {graphicHost} from "../net/address";

/**
 * markdown to html parser
 */



export const changeServiceResult = (data) => {
    let dataPre = data.replace(/src=*[^>]*>/gi, function (match, capture) {
        let newStr = match;
        if (match) {
            newStr = match.replace(new RegExp("/blob/", "gm"), "/raw/");
        }
        return newStr;
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
    marked.setOptions({
        renderer: renderer,
        gfm: true,
        tables: true,
        breaks: true,
        pedantic: false,
        sanitize: false,
        smartLists: true,
        smartypants: false,

    });
    return marked(dataPre);
};


export const generateCode2HTml = (mdData, backgroundColor = Constant.white, lang = 'java', userBR = true) => {
    let currentData = (mdData && mdData.indexOf("<code>") === -1) ?
        "<body>\n" +
        "<pre class=\"pre\">\n" +
        `<code lang='${lang}'>\n` +
        mdData +
        "</code>\n" +
        "</pre>\n" +
        "</body>\n" :

        "<body>\n" +
        "<pre class=\"pre\">\n" +
        mdData +
        "</pre>\n" +
        "</body>\n";
    return generateHtml(currentData, backgroundColor, userBR)
};

export const generateHtml = (mdData, backgroundColor = Constant.white, userBR = true) => {
    if (!mdData) {
        return "";
    }
    let mdDataCode = mdData.replace(/<code(([\s\S])*?)<\/code>/gi, function (match, capture) {
        if (match) {
            if (match && match.indexOf("\n") !== -1) {
                match = match.replace(/[\n]/g, '\n\r<br>');
            }
            return match;
        } else {
            return match;
        }
    });
    mdDataCode = mdDataCode.replace(/<pre(([\s\S])*?)<\/pre>/gi, function (match, capture) {
        if (match) {
            if (match.indexOf("<code>") < 0) {
                if (match && match.indexOf("\n") !== -1) {
                    match = match.replace(/[\n]/g, '\n\r<br>');
                }
            }
            return match;
        } else {
            return match;
        }
    });

    mdDataCode = mdDataCode.replace(/<pre>(([\s\S])*?)<\/pre>/gi, function (match, capture) {
        if (match && capture) {
            if (match.indexOf("<code>") < 0) {
                let code = `<pre><code>${capture}</code></pre>`;
                if (code.indexOf("\n") !== -1) {
                    code = code.replace(/[\n]/g, '\n\r<br>');
                }
                return code
            }
            return match;
        } else {
            return match;
        }
    });

    let data = mdDataCode.replace(/href="(.*?)"/gi, function (match, capture) {
        if (match && capture) {
            if (capture.indexOf("http://") < 0 && capture.indexOf("https://") < 0 && capture.indexOf("#") !== 0) {
                let fixedUrl = "gsygithub://" + capture;
                let href = `href="${fixedUrl}"`;
                return href;
            }
            return match;
        } else {
            return match;
        }
    });
    return generateCodeHtml(data, false, backgroundColor, Constant.actionBlue, userBR);
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
                    newStr = newStr.replace(/[\n]/g, "\n\r<br>");
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
                    return newCode.replace(/[\n]/g, '\n\r<br>');
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
const generateCodeHtml = (mdHTML, wrap, backgroundColor = Constant.white, actionColor = Constant.actionBlue, userBR = true) => {
    return "<html>\n" +
        "<head>\n" +
        "<meta charset=\"utf-8\" />\n" +
        "<title></title>\n" +
        "<meta name=\"viewport\" content=\"width=device-width; initial-scale=1.0; maximum-scale=1.0; user-scalable=0;\"/>" +
        "<link href=\"https:\/\/cdn.bootcss.com/highlight.js/9.12.0/styles/dracula.min.css\" rel=\"stylesheet\">\n" +
        "<script src=\"https:\/\/cdn.bootcss.com/highlight.js/9.12.0/highlight.min.js\"></script>  " +
        "<script>hljs.configure({'useBR': " + userBR + "});hljs.initHighlightingOnLoad();</script> " +
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
        ".highlight {overflow: scroll; background: " + Constant.webDraculaBackgroundColor + "}" +
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

export const parseDiffSource = (diffSource, wrap) => {
    //let diffSource = formatCode(currentSource);
    if (!diffSource) {
        return ""
    }
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

export const formName = (name) => {
    switch (name) {
        case 'sh':
            return 'shell';
        case 'js':
            return 'javascript';
        case 'kt':
            return 'kotlin';
        case 'c':
        case 'cpp':
            return 'cpp';
        case 'md':
            return 'markdown';
        case 'html':
            return 'xml';


    }
    return name
};


export function launchUrl(url) {
    if (__DEV__) {
        console.log("launchUrl", url)
    }
    if (!url && url.length === 0) return;
    let parseUrl = URL(url);
    if (__DEV__) {
        console.log("parseUrl", parseUrl);
    }

    let image = false;
    IMAGE_END.forEach((item) => {
        if (url.indexOf(item) + item.length === url.length) {
            image = true;
            if (url.indexOf('https://github.com/') === 0) {
                url = url.replace(new RegExp("/blob/", "gm"), "/raw/");
            }
            Actions.PhotoPage({uri: url});
        }
    });

    if (image) {
        return
    }

    if (parseUrl && parseUrl.hostname === "github.com" && parseUrl.pathname.length > 0) {
        let pathnames = parseUrl.pathname.split("/");
        if (pathnames.length === 2) {
            //解析人
            let userName = pathnames[1];
            Actions.PersonPage({currentUser: userName});
        } else if (pathnames.length >= 3) {
            let userName = pathnames[1];
            let repoName = pathnames[2];
            let fullName = userName + "/" + repoName;
            //解析仓库
            if (pathnames.length === 3) {
                Actions.RepositoryDetail({
                    repositoryName: repoName,
                    ownerName: userName,
                    title: fullName,
                });
            } else {
                //TODO 其他
                Actions.WebPage({uri: url});
            }
        }
    } else {
        Actions.WebPage({uri: url});
    }
}

export const isImageEnd = (path) => {
    let image = false;
    IMAGE_END.forEach((item) => {
        if (path.indexOf(item) + item.length === path.length) {
            image = true;
        }
    });
    return image

};

const IMAGE_END = [".png", ".jpg", ".jpeg", ".gif", ".svg"];


export const generateImageHtml = (user, color) => {
    let source = "<html>\n" +
        "<head>\n" +
        "<meta charset=\"utf-8\" />\n" +
        "<title></title>\n" +
        "<meta name=\"viewport\" content=\"width=device-width; initial-scale=1.0; maximum-scale=1.0; user-scalable=0;\"/>" +
        "<style>" +
        "body{background: " + "#FFFFFF" + ";}" +
        "</style>" +
        "</head>\n" +
        "<body>\n" +
        `<img src="${graphicHost}${color}/${user}" alt="${user}'s Blue Github Chart" />\n` +
        "</body>\n" +
        "</html>";

    console.log(source)

    return source
};