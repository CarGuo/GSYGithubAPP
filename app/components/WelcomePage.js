/**
 * Created by guoshuyu on 2017/11/7.
 */

import React, {Component} from 'react';
import {
    View, Text, StatusBar, TouchableHighlight
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import styles from "../style"
import I18n from '../style/i18n'
import loginActions from '../store/actions/login'
import userActions from '../store/actions/user'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import Api from '../net'
import address from '../net/address'

class WelcomePage extends Component {

    componentDidMount() {
        userActions.initUserInfo();

    }

    componentWillUnmount() {

    }

    render() {
        return (
            <View style={styles.mainBox}>
                <StatusBar hidden={true}/>
                <View style={[styles.centered, {flex:1}]}>
                    <TouchableHighlight onPress={
                        () => {Actions.mainTabPage()}
                    }>
                        <Text style={[styles.welcomeText]}>
                            {I18n('appName')}
                        </Text>
                    </TouchableHighlight>
                </View>
            </View>
        )
    }
}

export default connect(state => ({
    state
}), dispatch => ({
    actions: bindActionCreators(loginActions, dispatch),
    userActions: bindActionCreators(userActions, dispatch),
}))(WelcomePage)
