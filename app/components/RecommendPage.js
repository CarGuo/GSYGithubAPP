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

/**
 * 推荐
 */
class RecommendPage extends Component {
    componentDidMount() {
    }

    componentWillUnmount() {

    }

    render() {
        return (
            <View style={{flex:1, backgroundColor:"#00FFF0"}}>
                <StatusBar hidden={false} backgroundColor={'transparent'} translucent barStyle={'light-content'} />
                <View style={[styles.centered, {flex:1}]}>
                    <Text style={[styles.welcomeText]}>
                        {I18n('tabRecommended')}
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
}))(RecommendPage)