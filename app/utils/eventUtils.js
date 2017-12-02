import {Actions} from 'react-native-router-flux'
import {getFullName} from './htmlUtils'

export const getActionAndDes = (event) => {
    let actionStr;
    let des;
    switch (event.type) {
        case "CommitCommentEvent":
            actionStr = "Commit comment at " + event.repo.name;
            break;
        case "CreateEvent":
            if (event.payload.ref_type = "repository") {
                actionStr = "Created repository " + event.repo.name;
            } else {
                actionStr = "Created " + event.payload.ref_type + " "
                    + event.payload.ref + " at "
                    + event.repo.name;
            }
            break;
        case "DeleteEvent":
            actionStr = "Delete " + event.payload.ref_type + " " + event.payload.ref
                + " at " + event.repo.name;
            break;
        case "ForkEvent":
            let oriRepo = event.repo.name;
            let newRepo = event.actor.login + "/" + event.repo.name;
            actionStr = "Forked " + oriRepo + " to " + newRepo;
            break;
        case "GollumEvent":
            actionStr = event.payload.action + " a wiki page ";
            break;

        case "InstallationEvent":
            actionStr = event.payload.action + " an GitHub App ";
            break;
        case "InstallationRepositoriesEvent":
            actionStr = event.payload.action + " repository from an installation ";
            break;
        case "IssueCommentEvent":
            actionStr = event.payload.action + " comment on issue "
                + event.payload.issue.number + " in " +
                event.repo.name;
            des = event.payload.comment.body;
            break;
        case "IssuesEvent":
            actionStr = event.payload.action + " issue "
                + event.payload.issue.number + " in " +
                event.repo.name;
            des = event.payload.issue.title;
            break;

        case "MarketplacePurchaseEvent":
            actionStr = event.payload.action + " marketplace plan ";
            break;
        case "MemberEvent":
            actionStr = event.payload.action + " member to " +
                event.repo.name;
            break;
        case "OrgBlockEvent":
            actionStr = event.payload.action + " a user ";
            break;
        case "ProjectCardEvent":
            actionStr = event.payload.action + " a project ";
            break;
        case "ProjectColumnEvent":
            actionStr = event.payload.action + " a project ";
            break;

        case "ProjectEvent":
            actionStr = event.payload.action + " a project ";
            break;
        case "PublicEvent":
            actionStr = "Made " + event.repo.name + "public";
            break;
        case "PullRequestEvent":
            actionStr = event.payload.action + " pull request " + event.repo.name;
            break;
        case "PullRequestReviewEvent":
            actionStr = event.payload.action + " pull request review at"
                + event.repo.name;
            break;
        case "PullRequestReviewCommentEvent":
            actionStr = event.payload.action + " pull request review comment at"
                + event.repo.name;
            break;

        case "PushEvent":
            let ref = event.payload.ref;
            ref = ref.substring(ref.lastIndexOf("/") + 1);
            actionStr = "Push to " + ref +
                " at " + event.repo.name;

            des = '';
            let descSpan = '';

            let count = event.comments;
            let maxLines = 4;
            let max = count > maxLines ? maxLines - 1 : count;

            for (let i = 0; i < max; i++) {
                let commit = event.payload.comment.get(i);
                if (i !== 0) {
                    descSpan += ("\n");
                }
                let sha = commit.sha.substring(0, 7);
                descSpan += sha;
                descSpan += " ";
                descSpan += commit.message;
            }
            if (count > maxLines) {
                descSpan = descSpan + "\n" + "...";
            }
            break;
        case "ReleaseEvent":
            actionStr = event.payload.action + " release " +
                event.payload.release.tag_name + " at " +
                event.repo.name;
            break;
        case "WatchEvent":
            actionStr = event.payload.action + " " + event.repo.name;
            break;
    }

    return {
        actionStr: actionStr,
        des: des
    }

};


export const ActionUtils = (event) => {
    if (!event.repo) {
        Actions.PersonPage({currentUser: event.actor.login})
        return;
    }
    let owner = event.repo.name.split("/")[0];
    let repositoryName = event.repo.name.split("/")[1];
    let fullName = owner + '/' + repositoryName;
    switch (event.type) {
        case 'ForkEvent':
            Actions.RepositoryDetail({
                repositoryName: repositoryName, ownerName: event.actor.login
                , title: repositoryName
            });
            break;
        case 'PushEvent':
            if (!event.payload.comments) {
                Actions.RepositoryDetail({
                    repositoryName: repositoryName, ownerName: owner
                    , title: repositoryName
                });
            } else if (event.payload.comments.length === 1) {
                //todo 去提交列表
            } else {

            }
            break;
        case 'ReleaseEvent':
            //todo release 相关
            break;
        case 'IssueCommentEvent':
        case 'IssuesEvent':
            // 去issue
            Actions.IssueDetail({
                issue: event.payload.issue,
                title: fullName,
                repositoryName: repositoryName,
                userName: owner,
                needRightBtn: true,
                rightBtn: 'home',
                rightBtnPress: () => {
                    Actions.RepositoryDetail({
                        repositoryName: repositoryName, ownerName: owner
                        , title: repositoryName
                    });
                }
            });
            break;
        default:
            Actions.RepositoryDetail({
                repositoryName: repositoryName, ownerName: owner
                , title: repositoryName
            });
            break;
    }
};