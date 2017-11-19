/**
 * Created by guoshuyu on 2017/11/10.
 */

import React, {Component} from 'react';
import {
    View, Text, StatusBar, Image
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import styles from "../style"
import PropTypes from 'prop-types';
import * as Constant from '../style/constant'
import loginActions from '../store/actions/login'
import userActions from '../store/actions/user'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import Icon from 'react-native-vector-icons/FontAwesome'
import UserHeadItem from './widget/UserHeadItem'

class UserPage extends Component {
    componentDidMount() {
    }

    componentWillUnmount() {

    }

    render() {
        let {userState} = this.props;
        let userInfo = (this.props.ownUser && userState.userInfo) ? userState.userInfo : {};
        return (
            <View style={styles.mainBox}>
                <StatusBar hidden={false} backgroundColor={'transparent'} translucent barStyle={'light-content'}/>
                <UserHeadItem
                    userDisPlayName={userInfo.login}
                    userName={userInfo.name}
                    userPic={userInfo.avatar_url}
                    groupName={userInfo.company}
                    location={userInfo.location}
                    link={userInfo.blog}
                    des={userInfo.bio}
                    star={(userInfo.starred) ? userInfo.starred : "---"}
                    repos={userInfo.public_repos + ""}
                    follower={userInfo.followers + ""}
                    followed={userInfo.following + ""}
                />
            </View>
        )
    }
}

UserPage.propTypes = {
    ownUser: PropTypes.bool,
};


UserPage.defaultProps = {
    ownUser: true,
};


export default connect(state => ({
    userState: state.user,
}), dispatch => ({
    loginAction: bindActionCreators(loginActions, dispatch),
    userAction: bindActionCreators(userActions, dispatch)
}))(UserPage)