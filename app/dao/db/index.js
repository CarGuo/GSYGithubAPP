import Realm from 'realm';

const SearchHistory = {};

const ReadHistory = {};

const RepositoryUser = {};

const RepositoryStar = {};

const RepositoryDetail = {
    name: 'RepositoryDetail',
    properties: {
        branch: 'string',
        fullName: 'string',
        data: 'string',
    }
};

const RepositoryDetailReadme = {
    name: 'RepositoryDetailReadme',
    properties: {
        branch: 'string',
        fullName: 'string',
        data: 'string',
    }
};

const RepositoryEvent = {
    name: 'RepositoryEvent',
    properties: {
        fullName: 'string',
        data: 'string',
    }
};

const RepositoryIssue = {
    name: 'RepositoryIssue',
    properties: {
        fullName: 'string',
        state: "string",
        data: 'string',
    }
};

const TrendRepository = {
    name: 'TrendRepository',
    properties: {
        since: 'string?',
        languageType: 'string?',
        data: 'string',
    }
};

const UserInfo = {
    name: 'UserInfo',
    properties: {
        userName: 'string',
        data: 'string',
    }
};

const UserFollower = {};

const UserFollowed = {};

const ReceivedEvent = {
    name: 'ReceivedEvent',
    properties: {
        data: 'string?',
    }
};

const UserEvent = {
    name: 'UserEvent',
    properties: {
        userName: 'string',
        data: 'string',
    }
};

const PushEvent = {};

const PushCodeDetail = {};


let realm = new Realm({
    schema: [TrendRepository, ReceivedEvent, UserInfo,
        UserEvent, RepositoryDetail, RepositoryDetailReadme, RepositoryEvent, RepositoryIssue]
});

export default realm;