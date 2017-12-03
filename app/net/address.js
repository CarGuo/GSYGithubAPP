/**
 * Created by guoshuyu on 2017/11/8.
 */

import * as Config from '../config/'

let host = "https://api.github.com/";
let hostWeb = "https://github.com/";

export default AddressLocal = {
    /**
     * 获取授权  post
     */
    getAuthorization: () => {
        return `${host}authorizations`
    },
    /**
     * 搜索 get
     */
    sreach: (q, sort, order, page, pageSize) => {
        if (!sort) {
            sort = "best%20match"
        }
        if (!order) {
            order = "desc"
        }
        if (!page) {
            page = 1
        }
        if (!pageSize) {
            pageSize = Config.PAGE_SIZE
        }

        return `${host}search/repositories?q=${q}&sort=${sort}&order=${order}&page=${page}&per_page=${pageSize}`
    },
    /**
     * 我的仓库 get
     */
    myRepos: (sort, type) => {
        if (!sort) {
            sort = 'updated'
        }

        if (!type) {
            type = 'all'
        }
        return `${host}user/repos?sort=${sort}&type=${type}`;
    },
    /**
     * 用户的仓库 get
     */
    userRepos: (userName, sort) => {
        if (!sort) {
            sort = 'updated'
        }
        return `${host}users/${userName}/repos?sort=${sort}`;
    },
    /**
     * 仓库详情 get
     */
    getReposDetail: (reposOwner, reposName) => {
        return `${host}repos/${reposOwner}/${reposName}`
    },
    /**
     * 仓库活动 get
     */
    getReposEvent: (reposOwner, reposName) => {
        return `${host}networks/${reposOwner}/${reposName}/events`

    },
    /**
     * 仓库Fork get
     */
    getReposForks: (reposOwner, reposName) => {
        return `${host}repos/${reposOwner}/${reposName}/forks`

    },
    /**
     * 仓库Star get
     */
    getReposStar: (reposOwner, reposName) => {
        return `${host}repos/${reposOwner}/${reposName}/stargazers`

    },
    /**
     * 仓库Watch get
     */
    getReposWatcher: (reposOwner, reposName) => {
        return `${host}repos/${reposOwner}/${reposName}/subscribers`

    },
    /**
     * 仓库提交
     */
    getReposCommits: (reposOwner, reposName) => {
        return `${host}repos/${reposOwner}/${reposName}/commits`

    },
    /**
     * 仓库提交
     */
    getReposCommitsInfo: (reposOwner, reposName, sha) => {
        return `${host}repos/${reposOwner}/${reposName}/commits/${sha}`

    },

    /**
     * 仓库Issue get
     */
    getReposIssue: (reposOwner, reposName, state, sort, direction) => {
        if (!state) {
            state = 'all'
        }
        if (!sort) {
            sort = 'all'
        }
        if (!direction) {
            direction = 'desc'
        }
        return `${host}repos/${reposOwner}/${reposName}/issues?state=${state}&sort=${sort}&direction=${direction}`
    },
    /**
     * 仓release get
     */
    getReposRelease: (reposOwner, reposName) => {
        return `${host}repos/${reposOwner}/${reposName}/releases`
    },
    /**
     * 仓Tag get
     */
    getReposTag: (reposOwner, reposName) => {
        return `${host}repos/${reposOwner}/${reposName}/tags`
    },
    /**
     * 仓库Issue评论 get
     */
    getIssueComment: (reposOwner, reposName, issueNumber) => {
        return `${host}repos/${reposOwner}/${reposName}/issues/${issueNumber}/comments`;

    },
    /**
     * 仓库Issue get
     */
    getIssueInfo: (reposOwner, reposName, issueNumber) => {
        return `${host}repos/${reposOwner}/${reposName}/issues/${issueNumber}`;
    },
    /**
     * 增加issue评论 post
     */
    addIssueComment: (reposOwner, reposName, issueNumber) => {
        return `${host}repos/${reposOwner}/${reposName}/issues/${issueNumber}/comments`
    },
    /**
     * 编辑issue put
     */
    editIssue: (reposOwner, reposName, issueNumber) => {
        return `${host}repos/${reposOwner}/${reposName}/issues/${issueNumber}`
    },
    /**
     * 编辑评论 patch, delete
     */
    editComment: (reposOwner, reposName, commentId) => {
        return `${host}repos/${reposOwner}/${reposName}/issues/comments/${commentId}`
    },
    /**
     * 自己的star get
     */
    myStar: (sort) => {
        if (!sort) {
            sort = 'updated'
        }
        return `${host}users/starred?sort=${sort}`;
    },
    /**
     * 用户的star get
     */
    userStar: (userName, sort) => {
        if (!sort) {
            sort = 'updated'
        }
        return `${host}users/${userName}/starred?sort=${sort}`
    },
    /**
     * 关注仓库 put
     *
     * 取消关注 delete
     *
     * 是否关注 get
     */
    resolveStarRepos: (reposOwner, repos) => {
        return `${host}user/starred/${reposOwner}/${repos}`
    },

    /**
     * 订阅仓库 put
     *
     * 取消订阅 delete
     *
     * 是否订阅 get
     */
    resolveWatcherRepos: (reposOwner, repos) => {
        return `${host}user/subscriptions/${reposOwner}/${repos}`
    },
    /**
     * 仓库内容数据 get
     */
    reposData: (reposOwner, repos) => {
        return `${host}repos/${reposOwner}/{$repo}/contents`
    },
    /**
     * 仓库路径下的内容 get
     */
    reposDataDir: (reposOwner, repos, path) => {
        return `${host}repos/${reposOwner}/${repos}/contents/${path}`
    },
    /**
     * 我的用户信息 GET
     */
    getMyUserInfo: () => {
        return `${host}user`;
    },
    /**
     * 用户信息 get
     */
    getUserInfo: (userName) => {
        return `${host}users/${userName}`;
    },
    /**
     * 我的关注 get
     */
    getMyFollow: () => {
        return `${host}user/following`;
    },
    /**
     * 用户关注 get
     */
    getUserFollow: (userName) => {
        return `${host}users/${userName}/following`;
    },
    /**
     * 我的关注者 get
     */
    getMyFollower: () => {
        return `${host}user/followers`;
    },
    /**
     * 用户的关注者 get
     */
    getUserFollower: (userName) => {
        return `${host}users/${userName}/followers`;
    },
    /**
     * fork get
     */
    getForker: (reposOwner, reposName, sort) => {
        if (!sort) {
            sort = 'newest'
        }
        return `${host}repos/${reposOwner}/${reposName}/forks?sort=${sort}`
    },
    /**
     * readme get
     */
    getReadme: (reposOwner, reposName) => {
        return `${host}repos/${reposOwner}/${reposName}/readme`
    },
    /**
     * 用户收到的事件信息 get
     */
    getEventReceived: (userName) => {
        return `${host}users/${userName}/received_events`
    },
    /**
     * 用户相关的事件信息 get
     */
    getEvent: (userName) => {
        return `${host}users/${userName}/events`
    },
    /**
     * 通知 get
     */
    getNotifation: (all, participating) => {
        if (!all && !participating) {
            return `${host}notifications`
        }
        if (!all) {
            all = false
        }
        if (!participating) {
            participating = false
        }
        return `${host}notifications?all=${all}&participating=${participating}`
    },
    /**
     * patch
     */
    setNotificationAsRead: (threadId) => {
        return `${host}notifications/threads/${threadId}`
    },
    /**
     * 趋势 get
     * @param since daily，weekly， monthly
     */
    trending: (since, languageType) => {
        if (languageType) {
            return `https://github.com/trending/${languageType}?since=${since}`
        }
        return `https://github.com/trending?since=${since}`
    },
    /**
     * README 文件地址 get
     */
    readmeFile: (reposNameFullName, curBranch) => {
        return host + "repos/" + reposNameFullName + "/" + "readme" + ((!curBranch) ? "" : "?ref=" + curBranch);
    },
    /**
     * README web url地址
     */
    readmeWebUrl: (reposNameFullName, curBranch, defaultBranch) => {
        let branch = (!curBranch) ? defaultBranch : curBranch;
        return hostWeb + reposNameFullName + "/blob/" + branch + "/" + "README.md";
    },

    /**
     * 处理分页参数
     * @param tab 表示是 ? 或者 &
     * @param page 页数
     * @param pageSize 每页数量
     */
    getPageParams: (tab, page, pageSize = Config.PAGE_SIZE) => {
        if (page !== null) {
            if (pageSize !== null) {
                return `${tab}page=${page}&per_page=${pageSize}`
            } else {
                return `${tab}page=${page}`
            }
        } else {
            return ""
        }
    },

};