/**
 * Created by guoshuyu on 2017/11/8.
 */


let host = "https://api.github.com/";

export default AddressLocal = {
    /**
     * 获取授权  post
     */
    getAuthorization: () => {
        return `${host}authorization`
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
            page = 0
        }
        if (!pageSize) {
            pageSize = 20
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
     * 自己的star get
     */
    myStar: (sort) => {
        if (!sort) {
            sort = 'updated'
        }
        return `${host}user/starred?sort=${sort}`;
    },
    /**
     * 用户的star get
     */
    userStar: (userName, sort) => {
        if (!sort) {
            sort = 'updated'
        }
        return `${host}users/${userName}/starred=${sort}`
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
        return `${host}user/${userName}/following`;
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
        return `${host}user/${userName}/followers`;
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
     * 用户收到的事件信息
     */
    getEventReceived: (userName) => {
        return `${host}${userName}/received_events`
    },
    /**
     * 用户相关的事件信息
     */
    getEvent: (userName) => {
        return `${host}${userName}/events`
    },
    /**
     * 通知
     */
    getNotifation: (all) => {
        if (!all) {
            all = false
        }
        return `${host}notifications?all=${all}`
    }


};