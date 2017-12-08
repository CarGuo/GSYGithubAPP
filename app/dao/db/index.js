import Realm from 'realm';

const SearchHistory = {

};

const ReadHistory = {

};

const RepositoryUser = {

};

const RepositoryStar = {

};

const RepositoryDetail= {

};

const RepositoryDetailReadme = {

};

const RepositoryEvent = {
    name: 'RepositoryEvent',
};

const RepostoryIssue = {

};

const TrendRepository = {

};

const UserInfo = {

};

const UserFollower = {

};

const UserFollowed = {

};

const ReceivedEvent = {
    name: 'ReceivedEvent',
    properties: {
        data: 'string?',
    }
};

const UserEvent = {

};

const PushEvent = {

};

const PushCodeDetail = {

};



const testSchema = {
    name: 'testSchema',
    properties: {
        realName: 'string', // required property
        displayName: 'string?', // optional property
        birthday: {type: 'date', optional: true}, // optional property
    }
};

let realm = new Realm({schema: [testSchema, ReceivedEvent]});

export default realm;