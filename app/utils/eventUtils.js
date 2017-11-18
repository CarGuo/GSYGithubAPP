export const getActionAndDesc = (event) => {
    let actionStr;
    let des;
    switch (event.type) {
        case "CommitCommentEvent":
            actionStr = "Commit comment at " + event.repo.full_name;
            break;
        case "CreateEvent":
            if (event.payload.ref_type.equals("repository")) {
                actionStr = "Created repository " + event.repo.full_name;
            } else {
                actionStr = "Created " + model.payload.ref_type + " "
                    + model.payload.ref + " at "
                    + model.repo.full_name;
            }
            break;
        case "DeleteEvent":
            actionStr = "Delete " + model.payload.ref_type + " " + model.payload.ref
                + " at " + model.repo.full_name;
            break;
        case "ForkEvent":
            let oriRepo = model.repo.full_name;
            let newRepo = model.actor.login + "/" + model.repo.name;
            actionStr = "Forked " + oriRepo + " to " + newRepo;
            break;
        case "GollumEvent":
            actionStr = model.payload.action + " a wiki page ";
            break;

        case "InstallationEvent":
            actionStr = model.payload.action + " an GitHub App ";
            break;
        case "InstallationRepositoriesEvent":
            actionStr = model.payload.action + " repository from an installation ";
            break;
        case "IssueCommentEvent":
            actionStr = model.payload.action + " comment on issue "
                + model.payload.issue.number + " in " +
                model.repo.full_name;
            des = model.payload.comment.body;
            break;
        case "IssuesEvent":
            actionStr = model.payload.action + " issue "
                + model.payload.issue.number + " in " +
                model.repo.full_name;
            des = model.payload.issue.title;
            break;

        case "MarketplacePurchaseEvent":
            actionStr = model.payload.action + " marketplace plan ";
            break;
        case "MemberEvent":
            actionStr = model.payload.action + " member to " +
                model.repo.full_name;
            break;
        case "OrgBlockEvent":
            actionStr = model.payload.action + " a user ";
            break;
        case "ProjectCardEvent":
            actionStr = model.payload.action + " a project ";
            break;
        case "ProjectColumnEvent":
            actionStr = model.payload.action + " a project ";
            break;

        case "ProjectEvent":
            actionStr = model.payload.action + " a project ";
            break;
        case "PublicEvent":
            actionStr = "Made " + model.repo.full_name + "public";
            break;
        case "PullRequestEvent":
            actionStr = model.payload.action + " pull request " + model.repo.full_name;
            break;
        case "PullRequestReviewEvent":
            actionStr = model.payload.action + " pull request review at"
                + model.repo.full_name;
            break;
        case "PullRequestReviewCommentEvent":
            actionStr = model.payload.action + " pull request review comment at"
                + model.repo.full_name;
            break;

        case "PushEvent":
            let ref = model.payload.ref;
            ref = ref.substring(ref.lastIndexOf("/") + 1);
            actionStr = "Push to " + ref +
                " at " + model.repo.full_name;

            des = '';
            let count = model.payload.comment.size;
            let maxLines = 4;
            let max = count > maxLines ? maxLines - 1 : count;

            for (let i = 0; i < max; i++) {
                let commit = model.payload.comment.get(i);
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
            actionStr = model.payload.action + " release " +
                model.payload.release.tag_name + " at " +
                model.repo.full_name;
            break;
        case "WatchEvent":
            actionStr = model.payload.action + " " + model.repo.full_name;
            break;
    }

    return {
        actionStr: actionStr,
        des: des
    }

}