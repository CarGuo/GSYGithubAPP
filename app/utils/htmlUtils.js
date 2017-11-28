import {Buffer} from 'buffer'
import marked from 'marked'
import {highlightAuto, configure} from 'highlight.js'
import * as Constant from '../style/constant'

/**
 * markdown to html parser
 */
export const generateMd2Html = (mdData, userName, reposName, branch = 'master') => {
    let data = mdData.replace(new RegExp("<img src=\"https://github.com", "gm"), "<img src=\"https://raw.githubusercontent.com")
        .replace(new RegExp("/blob/", "gm"), "/");
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
            /*if (newCode && newCode.indexOf("\n") !== -1) {
                return newCode.replace(/[\n]/g, '<br>');
            }*/
            return newCode;
        }
    });
    return generateCodeHtml(marked(data), false);
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
        "<link href=\"https:\/\/cdn.bootcss.com/highlight.js/9.12.0/styles/androidstudio.min.css\" rel=\"stylesheet\">\n" +
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
        "code{overflow: auto;}" +
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