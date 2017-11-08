/**
 * Created by guoshuyu on 2017/11/7.
 */

import React, {Component} from 'react';
import {
    View, Text, StatusBar
} from 'react-native';
import styles from "../style"
import I18n from '../style/i18n'
import loginActions from '../store/actions/login'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import Api from '../funtion/net'
import address from '../funtion/net/address'

class WelcomePage extends Component {

    componentDidMount() {
        Api.getFetch(address.sreach("tetris")).then(()=>{

        })
    }

    componentWillUnmount() {

    }

    render() {
        return (
            <View style={styles.mainBox}>
                <StatusBar hidden={true}/>
                <View style={[styles.centered, {flex:1}]}>
                    <Text style={[styles.welcomeText]}>
                        {I18n('appName')}
                    </Text>
                </View>
            </View>
        )
    }
}

export default connect(state => ({
    state
}), dispatch => ({
    actions: bindActionCreators(loginActions, dispatch)
}))(WelcomePage)
