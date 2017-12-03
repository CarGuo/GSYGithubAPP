import {Buffer} from 'buffer'
import marked from 'marked'
import {highlightAuto, configure} from 'highlight.js'
import * as Constant from '../style/constant'
import {screenHeight, screenWidth} from '../style'
import {Platform} from 'react-native'

/**
 * markdown to html parser
 */

export const generateMdSampleHtml = (mdData) => {
    let data = mdData.replace(/src=*[^>]*>/gi, function (match, capture) {
        let newStr = match.replace(new RegExp("/blob/", "gm"), "/raw/");
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
        out += ' width="' + screenWidth - 50 + '"';
        out += ' height="' + 200 + '"';
        out += '/>';
        return out;
    };
    renderer.paragraph = function (text) {
        if (text.indexOf("<img src=") === -1) {
            return '<p>' + text + '</p>\n'
        }
        return text;

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
    return marked(data);
};


export const generateMd2Html = (mdData, userName, reposName, branch = 'master', needMd = true) => {
    let dataPre = mdData.replace(/src=*[^>]*>/gi, function (match, capture) {
        let newStr = match.replace(new RegExp("/blob/", "gm"), "/raw/");
        return newStr;
    });
    let data = dataPre.replace(/<pre[^>]*>([^]+)<\/pre>/gi, function (match, capture) {
        let newStr = highlightAuto(capture).value;
        return "<pre><code>" + newStr + "</code></pre>";
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
        "img{display: " + "block" + ";max-width:100%;}" +
        "a {color:" + actionColor + " !important;}" +
        ".highlight pre, pre {" +
        " word-wrap: " + (wrap ? "break-word" : "normal") + "; " +
        " white-space: " + (wrap ? "pre-wrap" : "pre") + "; " +
        "}" +
        "code{overflow: scroll;}" +
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


export const getFullName = (repository_url) => {
    let fullName = '';
    if (repository_url) {
        let splicurl = repository_url.split("/");
        if (splicurl.length > 2) {
            fullName = splicurl[splicurl.length - 2] + "/" + splicurl[splicurl.length - 1];
        }
    }
    return fullName;
};