import store from '../store'

const {dispatch, getState} = store;


export const isCommentOwner = (repositoryName, commentName) => {
    let login = getState()['user'].userInfo.login;
    return repositoryName === login || commentName === login
};

export const isRepositoryOwner = (repositoryName) => {
    let login = getState()['user'].userInfo.login;
    return repositoryName === login
};