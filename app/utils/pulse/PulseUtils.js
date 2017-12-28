import {hostWeb} from '../../net/address'
import * as Code from '../../net/netwrokCode'
import I18n from '../../style/i18n'

const mergedPullRequestsStart = '<a href="#merged-pull-requests"';
const proposedPullRequestsStart = '<a href="#proposed-pull-requests"';
const closedIssue = '<a href="#closed-issues"';
const openIssue = '<a href="#new-issues"';

const desStart = '<div class="authors-and-code">';
const desEnd = '</div>';

const issueOpenStatusStart = '<h3 class="conversation-list-heading" id="new-issues">';
const issueClosedStatusStart = '<h3 class="conversation-list-heading" id="closed-issues">';
const issueStatusEnd = '</h3>';


const middleTag = '</svg>';
const middleLength = middleTag.length;
const endTag = "</span>";

export default function (owner, repositoryName) {
    return new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
            resolve({
                result: false,
                status: Code.NETWORK_TIMEOUT,
                message: I18n('netTimeout')
            })
        }, 15000);
        let url = `${hostWeb}${owner}/${repositoryName}/pulse`;
        if (__DEV__) {
            console.log("fetch url ", url)
        }
        fetch(url)
            .then((response) => {
                clearTimeout(timeoutId);
                return response.text()
            })
            .catch((error) => {
                clearTimeout(timeoutId);
                reject({result: false, data: error});
                console.log(error);
            }).then((responseData) => {
            let data = htmlToRepo(responseData);
            try {
                resolve({result: true, data: data});
            } catch (e) {
                console.log(e);
                reject({result: false, data: e});
            }
        }).done();
    });
}


const htmlToRepo = (responseData) => {
    let resultData = {};
    let start = responseData.indexOf('<li class="Box-row p-0"');
    let end = responseData.indexOf('</div>', start);
    let data = responseData.substring(start, end)
        .replace(/[\n]/g, '');

    start = data.indexOf(mergedPullRequestsStart);
    let middle = data.indexOf(middleTag, start);
    end = data.indexOf(endTag, start);
    resultData.mergedPull = data.substring(middle + middleLength, end).trim();

    start = data.indexOf(proposedPullRequestsStart);
    middle = data.indexOf(middleTag, start);
    end = data.indexOf(endTag, start);
    resultData.proposedPull = data.substring(middle + middleLength, end).trim();

    start = data.indexOf(closedIssue);
    middle = data.indexOf(middleTag, start);
    end = data.indexOf(endTag, start);
    resultData.closedIssue = data.substring(middle + middleLength, end).trim();


    start = data.indexOf(openIssue);
    middle = data.indexOf(middleTag, start);
    end = data.indexOf(endTag, start);
    resultData.openIssue = data.substring(middle + middleLength, end).trim();
    resultData.des = data.substring(middle + middleLength, end).trim();

    start = responseData.indexOf(desStart);
    end = responseData.indexOf(desEnd, start);
    data = responseData.substring(start, end).trim();
    resultData.des = data;

    start = responseData.indexOf(issueOpenStatusStart);
    end = responseData.indexOf(issueStatusEnd, start);
    if (start >= 0 && end >= 0) {
        data = responseData.substring(start + issueOpenStatusStart.length, end).trim();
        if (data && data.indexOf("</span>") >= 0)
            resultData.issueOpenStatus = data;
    }

    start = responseData.indexOf(issueClosedStatusStart);
    end = responseData.indexOf(issueStatusEnd, start);
    if (start >= 0 && end >= 0) {
        data = responseData.substring(start + issueClosedStatusStart.length, end).trim();
        if (data && data.indexOf("</span>") >= 0)
            resultData.issueClosedStatus = data;
    }

    return resultData;
};