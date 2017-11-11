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
            <View style={styles.mainBox}>
                <StatusBar hidden={false} backgroundColor={'transparent'} translucent barStyle={'light-content'}/>
                <View style={[styles.centered, {flex:1}]}>
                    <Text style={[styles.welcomeText]}>
                        {I18n('tabRecommended')}
                    </Text>
                    <EventItem
                        actionTime={1510369871000}
                        actionUser={'CarGuo'}
                        actionUserPic={'https://avatars0.githubusercontent.com/u/27534854?s=64&v=4'}
                        actionMode={"publish"}
                        actionTarget={"GSYGitHubApp"}/>
                </View>
            </View>
        )
    }
}


export default connect(state => ( {state}), dispatch => ({
        actions: bindActionCreators(loginActions, dispatch)
    })
)(RecommendPage)