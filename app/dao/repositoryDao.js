import Api from '../net'
import Address from '../net/address'
import GitHubTrending from '../utils/trending/GitHubTrending'
import realm from './db'
import {generateHtml} from "../utils/htmlUtils";
import * as Config from '../config'
import getPulse from "../utils/pulse/PulseUtils";

/**
 * 趋势数据
 * @param page 分页，趋势数据其实没有分页
 * @param since 数据时长， 本日，本周，本月
 * @param languageType 语言
 */
const getTrendDao = async (page = 0, since, languageType) => {
    let localLanguage = (languageType) ? languageType : "*";
    let nextStep = async () => {
        let url = Address.trending(since, languageType);
        let res = await GitHubTrending.fetchTrending(url);
        if (res && res.result && res.data.length > 0 && page <= 1) {
            realm.write(() => {
                let allData = realm.objects('TrendRepository').filtered(`since="${since}" AND languageType="${localLanguage}"`);
                realm.delete(allData);
                res.data.forEach((item) => {
                    realm.create('TrendRepository', {
                        since: since,
                        languageType: localLanguage,
                        data: JSON.stringify(item)
                    });
                })
            });
        }
        return {
            data: res.data,
            result: res.result
        };
    };
    let allData = realm.objects('TrendRepository').filtered(`since="${since}" AND languageType="${localLanguage}"`);
    if (allData) {
        let data = [];
        allData.forEach((item) => {
            data.push(JSON.parse(item.data));
        });
        return {
            data: data,
            next: nextStep,
            result: true
        };
    } else {
        return {
            data: [],
            next: nextStep,
            result: false
        };
    }

};


/**
 * Pulse
 */
const getPulseDao = async (owner, repositoryName) => {
    let fullName = owner + "/" + repositoryName;
    let nextStep = async () => {
        let res = await getPulse(owner, repositoryName);
        if (res && res.result && res.data) {
            realm.write(() => {
                let allData = realm.objects('RepositoryPulse').filtered(`fullName="${fullName}"`);
                realm.delete(allData);
                realm.create('RepositoryPulse', {
                    fullName: fullName,
                    data: JSON.stringify(res.data)
                });

            });
        }
        return {
            data: res.data,
            result: res.result
        };
    };
    let allData = realm.objects('RepositoryPulse').filtered(`fullName="${fullName}"`);
    if (allData && allData.length > 0) {
        return {
            data: JSON.parse(allData[0].data),
            next: nextStep,
            result: true
        };
    } else {
        return {
            data: [],
            next: nextStep,
            result: false
        };
    }

};

/**
 * 搜索仓库
 * @param q 搜索关键字
 * @param sort 分类排序，beat match、most star等
 * @param order 倒序或者正序
 * @param type 搜索类型，人或者仓库
 * @param page
 * @param pageSize
 * @returns {Promise.<{result, data}>}
 */
const searchRepositoryDao = async (q, sort, order, type, page, pageSize) => {
    let url = Address.search(q, sort, order, type, page, pageSize);
    let res = await Api.netFetch(url);
    return {
        data: res.data ? res.data.items : res.data,
        result: res.result
    };
};

/**
 * 搜索仓库issue
 * @param q 搜索关键字
 * @param page
 * @returns {Promise.<{result, data}>}
 */
const searchRepositoryIssueDao = async (q, page) => {
    let url = Address.repositoryIssueSearch(q) + Address.getPageParams("&", page);
    let res = await Api.netFetch(url);
    return {
        data: res.data ? res.data.items : res.data,
        result: res.result
    };
};

/**
 * 用户的仓库
 */
const getUserRepositoryDao = async (userName, page, sort, localNeed) => {
    let sortText = sort ? sort : "pushed";
    let nextStep = async () => {
        let url = Address.userRepos(userName, sort) + Address.getPageParams("&", page);
        let res = await Api.netFetch(url);
        if (res && res.result && res.data.length > 0 && page <= 1) {
            realm.write(() => {
                let allEvent = realm.objects('UserRepos').filtered(`userName="${userName}" AND sort="${sortText}"`);
                realm.delete(allEvent);
                res.data.forEach((item) => {
                    realm.create('UserRepos', {
                        sort: sortText,
                        userName: userName,
                        data: JSON.stringify(item)
                    });
                })
            });
        }
        return {
            data: res.data,
            result: res.result
        };
    };
    let local = async () => {
        let allData = realm.objects('UserRepos').filtered(`userName="${userName}" AND sort="${sortText}"`);
        if (allData && allData.length > 0) {
            let data = [];
            allData.forEach((item) => {
                data.push(JSON.parse(item.data));
            });
            return {
                data: data,
                next: nextStep,
                result: true
            };
        } else {
            return {
                data: [],
                next: nextStep,
                result: false
            };
        }
    };
    return localNeed ? local() : nextStep();
};

/**
 * 获取当前仓库所有star用户
 */
const getStarRepositoryDao = async (userName, page, sort, localNeed) => {
    let sortText = sort ? sort : "created";
    let nextStep = async () => {
        let url = Address.userStar(userName, sort) + Address.getPageParams("&", page);
        let res = await Api.netFetch(url);
        if (res && res.result && res.data.length > 0 && page <= 1) {
            realm.write(() => {
                let allEvent = realm.objects('UserStared').filtered(`userName="${userName}" AND sort="${sortText}"`);
                realm.delete(allEvent);
                res.data.forEach((item) => {
                    realm.create('UserStared', {
                        sort: sortText,
                        userName: userName,
                        data: JSON.stringify(item)
                    });
                })
            });
        }
        return {
            data: res.data,
            result: res.result
        };
    };
    let local = async () => {
        let allData = realm.objects('UserStared').filtered(`userName="${userName}" AND sort="${sortText}"`);
        if (allData && allData.length > 0) {
            let data = [];
            allData.forEach((item) => {
                data.push(JSON.parse(item.data));
            });
            return {
                data: data,
                next: nextStep,
                result: true
            };
        } else {
            return {
                data: [],
                next: nextStep,
                result: false
            };
        }
    };
    return localNeed ? local() : nextStep();
};

/**
 * 仓库的详情数据
 */
const getRepositoryDetailDao = (userName, reposName) => {
    let fullName = userName + "/" + reposName;
    let nextStep = async () => {
        let url = Address.getReposDetail(userName, reposName);
        let res = await Api.netFetch(url, 'GET', null, false, {Accept: 'application/vnd.github.mercy-preview+json'});
        if (res && res.result && res.data) {
            let issueRes = await getRepositoryIssueStatusDao(userName, reposName);
            let netData = res.data;
            try {
                if (issueRes && issueRes.result && issueRes.data) {
                    netData.all_issues_count = parseInt(issueRes.data);
                    netData.closed_issues_count = netData.all_issues_count - netData.open_issues_count;
                }
            } catch (e) {
                console.log(e)
            }
            realm.write(() => {
                let data = realm.objects('RepositoryDetail').filtered(`fullName="${fullName}" AND branch="master"`);
                realm.delete(data);
                realm.create('RepositoryDetail', {
                    branch: "master",
                    fullName: fullName,
                    data: JSON.stringify(netData)
                });
            });
        }
        return {
            data: res.data,
            result: res.result
        };
    };

    let AllData = realm.objects('RepositoryDetail').filtered(`fullName="${fullName}" AND branch="master"`);
    if (AllData && AllData.length > 0) {
        return {
            data: JSON.parse(AllData[0].data),
            result: true,
            next: nextStep
        };
    } else {
        return {
            data: {},
            result: false,
            next: nextStep
        };
    }

};

/**
 * 详情的remde数据Html模式数据
 */
const getRepositoryDetailReadmeHtmlDao = (userName, reposName, branch) => {
    let fullName = userName + "/" + reposName;
    let curBranch = (branch) ? branch : "master";
    let nextStep = async () => {
        let url = Address.readmeFile(userName + '/' + reposName, branch);
        let res = await Api.netFetch(url, 'GET', null, false, {Accept: 'application/vnd.github.html'}, true);
        if (res && res.result && res.data.length > 0) {
            let curData = generateHtml(res.data);
            realm.write(() => {
                let data = realm.objects('RepositoryDetailReadme').filtered(`fullName="${fullName}" AND branch="${curBranch}"`);
                realm.delete(data);
                realm.create('RepositoryDetailReadme', {
                    branch: "master",
                    fullName: fullName,
                    data: curData,
                });
            });
            return {
                data: curData,
                result: true
            };
        } else {
            return {
                data: "",
                result: false
            };
        }
    };
    let AllData = realm.objects('RepositoryDetailReadme').filtered(`fullName="${fullName}" AND branch="${curBranch}"`);
    if (AllData && AllData.length > 0) {
        return {
            data: AllData[0].data,
            result: true,
            next: nextStep
        };
    } else {
        return {
            data: {},
            result: false,
            next: nextStep
        };
    }
};

/**
 * 添加到本地已读数据列表
 */
const addRepositoryLocalReadDao = (userName, reposName, data) => {
    let fullName = userName + "/" + reposName;
    let allEvent = realm.objects('ReadHistory').filtered(`fullName="${fullName}"`);
    realm.write(() => {
        realm.delete(allEvent);
        realm.create('ReadHistory', {
            fullName: fullName,
            readDate: new Date(),
            data: JSON.stringify(data)
        });
    })
};


/**
 * 获取本地已读数据列表
 */
const getRepositoryLocalReadDao = (page = 1) => {
    let size = (page - 1) * Config.PAGE_SIZE;
    let allEvent = realm.objects('ReadHistory').sorted("readDate", true).slice(size, size + Config.PAGE_SIZE);
    let data = [];
    allEvent.forEach((item) => {
        let showItem = {
            data: JSON.parse(item.data)
        };
        data.push(showItem);
    });
    return {
        data: data,
        result: true
    }

};


/**
 * 创建仓库的fork分支
 */
const createForkDao = async (userName, reposName) => {
    let url = Address.createFork(userName, reposName);
    let res =  await Api.netFetch(url, 'POST');
    return {
        data: res.data,
        result: res.result
    };
};

/**
 * 获取当前仓库所有分支
 */
const getBranchesDao = (userName, reposName) => {
    let fullName = userName + "/" + reposName;
    let nextStep = async () => {
        let url = Address.getbranches(userName, reposName);
        let res = await Api.netFetch(url);
        if (res && res.result && res.data.length > 0) {
            realm.write(() => {
                let allEvent = realm.objects('RepositoryBranch').filtered(`fullName="${fullName}"`);
                realm.delete(allEvent);
                res.data.forEach((item) => {
                    realm.create('RepositoryBranch', {
                        fullName: fullName,
                        data: JSON.stringify(item)
                    });
                })
            });
        }
        return {
            data: res.data,
            result: res.result
        };
    };
    let allData = realm.objects('RepositoryBranch').filtered(`fullName="${fullName}"`);
    if (allData && allData.length > 0) {
        let data = [];
        allData.forEach((item) => {
            data.push(JSON.parse(item.data));
        });
        return {
            data: data,
            next: nextStep,
            result: true
        };
    } else {
        return {
            data: [],
            next: nextStep,
            result: false
        };
    }

};


/**
 * 获取仓库的fork分支
 */
const getRepositoryForksDao = (userName, reposName, page, localNeed) => {
    let fullName = userName + "/" + reposName;
    let nextStep = async () => {
        let url = Address.getReposForks(userName, reposName) + Address.getPageParams("?", page);
        let res = await Api.netFetch(url);
        if (res && res.result && res.data.length > 0 && page <= 1) {
            realm.write(() => {
                let allEvent = realm.objects('RepositoryFork').filtered(`fullName="${fullName}"`);
                realm.delete(allEvent);
                res.data.forEach((item) => {
                    realm.create('RepositoryFork', {
                        fullName: fullName,
                        data: JSON.stringify(item)
                    });
                })
            });
        }
        return {
            data: res.data,
            result: res.result
        };
    };
    let local = async () => {
        let allData = realm.objects('RepositoryFork').filtered(`fullName="${fullName}"`);
        if (allData && allData.length > 0) {
            let data = [];
            allData.forEach((item) => {
                data.push(JSON.parse(item.data));
            });
            return {
                data: data,
                next: nextStep,
                result: true
            };
        } else {
            return {
                data: [],
                next: nextStep,
                result: false
            };
        }
    };
    return localNeed ? local() : nextStep();
};


/**
 * 获取当前仓库所有star用户
 */
const getRepositoryStarDao = (userName, reposName, page, localNeed) => {
    let fullName = userName + "/" + reposName;
    let nextStep = async () => {
        let url = Address.getReposStar(userName, reposName) + Address.getPageParams("?", page);
        let res = await Api.netFetch(url);
        if (res && res.result && res.data.length > 0 && page <= 1) {
            realm.write(() => {
                let allEvent = realm.objects('RepositoryStar').filtered(`fullName="${fullName}"`);
                realm.delete(allEvent);
                res.data.forEach((item) => {
                    realm.create('RepositoryStar', {
                        fullName: fullName,
                        data: JSON.stringify(item)
                    });
                })
            });
        }
        return {
            data: res.data,
            result: res.result
        };
    };
    let local = async () => {
        let allData = realm.objects('RepositoryStar').filtered(`fullName="${fullName}"`);
        if (allData && allData.length > 0) {
            let data = [];
            allData.forEach((item) => {
                data.push(JSON.parse(item.data));
            });
            return {
                data: data,
                next: nextStep,
                result: true
            };
        } else {
            return {
                data: [],
                next: nextStep,
                result: false
            };
        }
    };
    return localNeed ? local() : nextStep();
};

/**
 * 获取当前仓库所有订阅用户
 */
const getRepositoryWatcherDao = (userName, reposName, page, localNeed) => {
    let fullName = userName + "/" + reposName;
    let nextStep = async () => {
        let url = Address.getReposWatcher(userName, reposName) + Address.getPageParams("?", page);
        let res = await Api.netFetch(url);
        if (res && res.result && res.data.length > 0 && page <= 1) {
            realm.write(() => {
                let allEvent = realm.objects('RepositoryWatcher').filtered(`fullName="${fullName}"`);
                realm.delete(allEvent);
                res.data.forEach((item) => {
                    realm.create('RepositoryWatcher', {
                        fullName: fullName,
                        data: JSON.stringify(item)
                    });
                })
            });
        }
        return {
            data: res.data,
            result: res.result
        };
    };
    let local = async () => {
        let allData = realm.objects('RepositoryWatcher').filtered(`fullName="${fullName}"`);
        if (allData && allData.length > 0) {
            let data = [];
            allData.forEach((item) => {
                data.push(JSON.parse(item.data));
            });
            return {
                data: data,
                next: nextStep,
                result: true
            };
        } else {
            return {
                data: [],
                next: nextStep,
                result: false
            };
        }
    };
    return localNeed ? local() : nextStep();
};

/**
 * 获取用户对当前仓库的star、watcher状态
 */
const getRepositoryStatusDao = async (userName, reposName) => {
    let urls = Address.resolveStarRepos(userName, reposName);
    let urlw = Address.resolveWatcherRepos(userName, reposName);
    let ress = await Api.netFetch(urls);
    let resw = await Api.netFetch(urlw);
    return {
        data: {star: ress.result, watch: resw.result},
        result: true
    };
};


/**
 * star仓库
 */
const doRepositoryStarDao = async (userName, reposName, star) => {
    let url = Address.resolveStarRepos(userName, reposName);
    let res = await Api.netFetch(url, star ? 'PUT' : 'DELETE');
    return {
        data: res.result,
        result: res.result
    };
};

/**
 * watcher仓库
 */
const doRepositoryWatchDao = async (userName, reposName, watch) => {
    let url = Address.resolveWatcherRepos(userName, reposName);
    let res = await Api.netFetch(url, watch ? 'PUT' : 'DELETE');
    return {
        data: res.result,
        result: res.result
    };
};

/**
 * 获取仓库的release列表
 */
const getRepositoryReleaseDao = async (userName, reposName, page, needHtml = true) => {
    let url = Address.getReposRelease(userName, reposName) + Address.getPageParams("?", page);
    let res = await Api.netFetch(url, 'GET', null, false, {Accept: (needHtml ? 'application/vnd.github.html,application/vnd.github.VERSION.raw' : "")});
    return {
        data: res.data,
        result: res.result
    };
};

/**
 * 获取仓库的tag列表
 */
const getRepositoryTagDao = async (userName, reposName, page) => {
    let url = Address.getReposTag(userName, reposName) + Address.getPageParams("?", page);
    let res = await Api.netFetch(url, 'GET', null, false, {Accept: 'application/vnd.github.html,application/vnd.github.VERSION.raw'});
    return {
        data: res.data,
        result: res.result
    };
};

/**
 * 获取仓库的提交列表
 */
const getReposCommitsDao = (userName, reposName, page, localNeed) => {
    let fullName = userName + "/" + reposName;
    let nextStep = async () => {
        let url = Address.getReposCommits(userName, reposName) + Address.getPageParams("?", page);
        let res = await Api.netFetch(url);
        if (res && res.result && res.data.length > 0 && page <= 1) {
            realm.write(() => {
                let allEvent = realm.objects('RepositoryCommits').filtered(`fullName="${fullName}"`);
                realm.delete(allEvent);
                res.data.forEach((item) => {
                    realm.create('RepositoryCommits', {
                        fullName: fullName,
                        data: JSON.stringify(item)
                    });
                })
            });
        }
        return {
            data: res.data,
            result: res.result
        };
    };
    let local = async () => {
        let allData = realm.objects('RepositoryCommits').filtered(`fullName="${fullName}"`);
        if (allData && allData.length > 0) {
            let data = [];
            allData.forEach((item) => {
                data.push(JSON.parse(item.data));
            });
            return {
                data: data,
                next: nextStep,
                result: true
            };
        } else {
            return {
                data: [],
                next: nextStep,
                result: false
            };
        }
    };
    return localNeed ? local() : nextStep();


};

/**
 * 获取仓库的单个提交详情
 */
const getReposCommitsInfoDao = (userName, reposName, sha) => {
    let fullName = userName + "/" + reposName;
    let nextStep = async () => {
        let url = Address.getReposCommitsInfo(userName, reposName, sha);
        let res = await Api.netFetch(url);
        if (res && res.result && res.data) {
            realm.write(() => {
                let data = realm.objects('RepositoryCommitInfoDetail').filtered(`fullName="${fullName}" AND sha ="${sha}"`);
                realm.delete(data);
                realm.create('RepositoryCommitInfoDetail', {
                    sha: sha,
                    fullName: fullName,
                    data: JSON.stringify(res.data)
                });
            });
        }
        return {
            data: res.data,
            result: res.result
        };
    };
    let AllData = realm.objects('RepositoryCommitInfoDetail').filtered(`fullName="${fullName}" AND sha ="${sha}"`);
    if (AllData && AllData.length > 0) {
        return {
            data: JSON.parse(AllData[0].data),
            result: true,
            next: nextStep
        };
    } else {
        return {
            data: {},
            result: false,
            next: nextStep
        };
    }

};

/***
 * 获取仓库的文件列表
 */
const getReposFileDirDao = async (userName, reposName, path = '', branch, text) => {
    let url = Address.reposDataDir(userName, reposName, path, branch);
    let res = await Api.netFetch(url, 'GET', null, false, {Accept: 'application/vnd.github.html'}, text);
    return {
        data: res.data,
        result: res.result
    };
};

/**
 * 详情的remde数据
 */
const getRepositoryDetailReadmeDao = async (userName, reposName, branch) => {
    let url = Address.readmeFile(userName + '/' + reposName, branch);
    let res = await Api.netFetch(url);
    return {
        data: res.data,
        result: res.result
    };
};

/**
 * 搜索话题
 */
const searchTopicRepositoryDao = async (searchTopic, page = 0) => {
    let url = Address.searchTopic(searchTopic) + Address.getPageParams("&", page);
    let res = await Api.netFetch(url);
    return {
        data: res.data ? res.data.items : res.data,
        result: res.result
    };
};


/**
 * 获取issue总数
 */
const getRepositoryIssueStatusDao = async (userName, repository) => {
    let url = Address.getReposIssue(userName, repository) + "&per_page=1";
    let res = await Api.netFetch(url, 'GET', null, false, {Accept: 'application/vnd.github.html,application/vnd.github.VERSION.raw'});
    if (res && res.result && res.headers && res.headers.map) {
        try {
            let link = res.headers.map['link'];
            if (link && (typeof link) === 'object') {
                let indexStart = link[0].lastIndexOf("page=") + 5;
                let indexEnd = link[0].lastIndexOf(">");
                if (indexStart >= 0 && indexEnd >= 0) {
                    let count = link[0].substring(indexStart, indexEnd);
                    return {
                        result: true,
                        data: count
                    }
                }
            }
            return {
                result: true,
            }
        } catch (e) {
            console.log(e)
        }
        return {
            result: false,
        }
    } else {
        return {
            result: false,
        }
    }
};

/**
 * 用户的前100仓库
 */
const getUserRepository100StatusDao = async (userName) => {
    let url = Address.userRepos(userName, 'pushed') + "&page=1&per_page=100";
    let res = await Api.netFetch(url);
    if (res && res.result && res.data.length > 0) {
        let stared = 0;
        res.data.forEach((item) => {
            stared += item.watchers_count
        });

        function sortNumber(a, b) {
            return b.watchers_count - a.watchers_count
        }

        res.data.sort(sortNumber);
        return {
            data: {
                list: res.data,
                stared: stared,
            },
            result: true
        };
    } else {
        return {
            data: 0,
            result: false
        };
    }
};

export default {
    getTrendDao,
    searchRepositoryDao,
    getUserRepositoryDao,
    getStarRepositoryDao,
    getRepositoryDetailDao,
    getRepositoryDetailReadmeDao,
    getRepositoryDetailReadmeHtmlDao,
    getRepositoryForksDao,
    getRepositoryStarDao,
    getRepositoryWatcherDao,
    getRepositoryStatusDao,
    doRepositoryStarDao,
    doRepositoryWatchDao,
    getRepositoryReleaseDao,
    getReposCommitsDao,
    getReposCommitsInfoDao,
    getRepositoryTagDao,
    getReposFileDirDao,
    searchRepositoryIssueDao,
    createForkDao,
    getBranchesDao,
    getRepositoryLocalReadDao,
    addRepositoryLocalReadDao,
    searchTopicRepositoryDao,
    getRepositoryIssueStatusDao,
    getUserRepository100StatusDao,
    getPulseDao
}