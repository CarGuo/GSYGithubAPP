/**
 * Created by guoshuyu on 2017/11/10.
 */

import React, {Component} from 'react';
import {
    View, Text, StatusBar
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import styles from "../style"
import loginActions from '../store/actions/login'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import EventItem from './widget/EventItem'
import CommonRowItem from './common/CommonRowItem'
import RepositoryItem from './widget/RepositoryItem'
import IssueItem from './widget/IssueHead'

/**
 * 推荐
 */
class RecommendPage extends Component {
    componentDidMount() {
    }

    componentWillUnmount() {

    }


    render() {
        let {loginActions} = this.props;
        return (
            <View style={styles.mainBox}>
                <StatusBar hidden={false} backgroundColor={'transparent'} translucent barStyle={'light-content'}/>

                <EventItem
                    actionTime={"2017-11-17T07:58:31Z"}
                    actionUser={'CarGuo'}
                    actionUserPic={'https://avatars0.githubusercontent.com/u/27534854?s=64&v=4'}
                    actionMode={"publish"}
                    des={"asdfafdas"}
                    actionTarget={"GSYGitHubApp"}/>

                <CommonRowItem
                    itemIcon={"sc-github"}
                    itemText={"介绍一下是什么"}
                    onClickFun={() => {
                    }}/>
                <RepositoryItem
                    ownerName={"CarGuo"}
                    ownerPic={"https://avatars0.githubusercontent.com/u/27534854?s=64&v=4"}
                    repositoryName={"GSYGitHubApp"}
                    repositoryStar={""}
                    repositoryFork={""}
                    repositoryWatch={""}
                    repositoryType={"java"}
                    repositoryDes={"这是很长很长的简介！这是很长很长的简介！这是很长很长的简介！这是很长很长的简介！这是很长很长的简介！这是很长很长的简介！"}
                />
                <IssueItem
                    actionTime={"2017-11-17T07:58:31Z"}
                    actionUser={'CarGuo'}
                    actionUserPic={'https://avatars0.githubusercontent.com/u/27534854?s=64&v=4'}
                    issueComment={"asdfafdas"}
                    commentCount={"222"}
                    issueTag={"GSYGitHubApp/ASDFASDFASDF"}/>
            </View>
        )
    }
}


export default connect(state => ( {state}), dispatch => ({
        loginActions: bindActionCreators(loginActions, dispatch)
    })
)(RecommendPage)