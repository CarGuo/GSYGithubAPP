/**
 * Created by guoshuyu on 2017/11/10.
 */

import React, {Component} from 'react';
import {
    View, Text, StatusBar
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import styles from "../style"
import I18n from '../style/i18n'
import loginActions from '../store/actions/login'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import EventItem from './widget/EventItem'
import CommonRowItem from './widget/CommonRowItem'
import RepositoryItem from './widget/RepositoryItem'

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
                    actionTime={1510369871000}
                    actionUser={'CarGuo'}
                    actionUserPic={'https://avatars0.githubusercontent.com/u/27534854?s=64&v=4'}
                    actionMode={"publish"}
                    des={"asdfafdas"}
                    actionTarget={"GSYGitHubApp"}/>

                <CommonRowItem
                    itemIcon={"sc-github"}
                    itemText={"介绍一下是什么"}
                    onClickFun={() => {
                        Actions.LoginPage();
                    }}/>
                <CommonRowItem
                    itemIcon={"sc-github"}
                    itemText={"退出登陆"}
                    onClickFun={() => {
                        Actions.reset("LoginPage")
                        loginActions.loginOut();
                    }}/>
                <RepositoryItem
                    ownerName={"CarGuo"}
                    ownerPic={"https://avatars0.githubusercontent.com/u/27534854?s=64&v=4"}
                    repositoryName={"GSYGitHubApp"}
                    repositoryStar={111}
                    repositoryFork={222}
                    repositoryWatch={333}
                    repositoryType={"java"}
                    repositoryDes={"这是很长很长的简介！这是很长很长的简介！这是很长很长的简介！这是很长很长的简介！这是很长很长的简介！这是很长很长的简介！"}
                />
            </View>
        )
    }
}


export default connect(state => ( {state}), dispatch => ({
        loginActions: bindActionCreators(loginActions, dispatch)
    })
)(RecommendPage)