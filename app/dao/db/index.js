import Realm from 'realm';

/**
 * 仓库pulse表
 */
const RepositoryPulse = {
    name: 'RepositoryPulse',
    properties: {
        fullName: 'string',
        data: 'string',
    }
};

/**
 * 本地已读历史表
 */
const ReadHistory = {
    name: 'ReadHistory',
    properties: {
        fullName: 'string',
        readDate: 'date',
        data: 'string',
    }
};

/**
 * 仓库分支表
 */
const RepositoryBranch = {
    name: 'RepositoryBranch',
    properties: {
        fullName: 'string',
        data: 'string',
    }
};

/**
 * 仓库提交信息表
 */
const RepositoryCommits = {
    name: 'RepositoryCommits',
    properties: {
        fullName: 'string',
        data: 'string',
    }
};

/**
 * 仓库订阅用户表
 */
const RepositoryWatcher = {
    name: 'RepositoryWatcher',
    properties: {
        fullName: 'string',
        data: 'string',
    }
};

/**
 * 仓库收藏用户表
 */
const RepositoryStar = {
    name: 'RepositoryStar',
    properties: {
        fullName: 'string',
        data: 'string',
    }
};

/**
 * 仓库分支表
 */
const RepositoryFork = {
    name: 'RepositoryFork',
    properties: {
        fullName: 'string',
        data: 'string',
    }
};

/**
 * 仓库详情数据表
 */
const RepositoryDetail = {
    name: 'RepositoryDetail',
    properties: {
        branch: 'string',
        fullName: 'string',
        data: 'string',
    }
};

/**
 * 仓库readme文件表
 */
const RepositoryDetailReadme = {
    name: 'RepositoryDetailReadme',
    properties: {
        branch: 'string',
        fullName: 'string',
        data: 'string',
    }
};

/**
 * 仓库活跃事件表
 */
const RepositoryEvent = {
    name: 'RepositoryEvent',
    properties: {
        fullName: 'string',
        data: 'string',
    }
};

/**
 * 仓库issue表
 */
const RepositoryIssue = {
    name: 'RepositoryIssue',
    properties: {
        fullName: 'string',
        state: "string",
        data: 'string',
    }
};

/**
 * 仓库提交信息详情表
 */
const RepositoryCommitInfoDetail = {
    name: 'RepositoryCommitInfoDetail',
    properties: {
        fullName: 'string',
        sha: "string",
        data: 'string',
    }
};

/**
 * 趋势表
 */
const TrendRepository = {
    name: 'TrendRepository',
    properties: {
        since: 'string?',
        languageType: 'string?',
        data: 'string',
    }
};

/**
 * 用户表
 */
const UserInfo = {
    name: 'UserInfo',
    properties: {
        userName: 'string',
        data: 'string',
    }
};

/**
 * 用户粉丝表
 */
const UserFollower = {
    name: 'UserFollower',
    properties: {
        userName: 'string',
        data: 'string',
    }
};

/**
 * 用户关注表
 */
const UserFollowed = {
    name: 'UserFollowed',
    properties: {
        userName: 'string',
        data: 'string',
    }
};

/**
 * 用户关注表
 */
const OrgMember = {
    name: 'OrgMember',
    properties: {
        org: 'string',
        data: 'string',
    }
};


/**
 * 用户组织表
 */
const UserOrgs = {
    name: 'UserOrgs',
    properties: {
        userName: 'string',
        data: 'string',
    }
};


/**
 * 用户收藏表
 */
const UserStared = {
    name: 'UserStared',
    properties: {
        userName: 'string',
        sort: 'string',
        data: 'string',
    }
};

/**
 * 用户仓库表
 */
const UserRepos = {
    name: 'UserRepos',
    properties: {
        userName: 'string',
        sort: 'string',
        data: 'string',
    }
};

/**
 * 用户接受事件表
 */
const ReceivedEvent = {
    name: 'ReceivedEvent',
    properties: {
        data: 'string?',
    }
};

/**
 * 用户动态表
 */
const UserEvent = {
    name: 'UserEvent',
    properties: {
        userName: 'string',
        data: 'string',
    }
};

/**
 * issue详情表
 */
const IssueDetail = {
    name: 'IssueDetail',
    properties: {
        fullName: 'string',
        number: 'string',
        data: 'string',
    }
};

/**
 * issue评论表
 */
const IssueComment = {
    name: 'IssueComment',
    properties: {
        fullName: 'string',
        number: 'string',
        commentId: 'string',
        data: 'string',
    }
};


let realm = new Realm({
    schema: [TrendRepository, ReceivedEvent, UserInfo, UserEvent,
        RepositoryDetail, RepositoryDetailReadme, RepositoryEvent, RepositoryIssue,
        RepositoryBranch, RepositoryWatcher, RepositoryStar, RepositoryFork, RepositoryCommits,
        UserFollower, UserFollowed, UserStared, UserRepos, RepositoryCommitInfoDetail,
        IssueDetail, IssueComment, ReadHistory, RepositoryPulse, OrgMember, UserOrgs
    ]
});

export const clearCache = () => {
    realm.write(() => {
        realm.deleteAll()
    })
};

export default realm;