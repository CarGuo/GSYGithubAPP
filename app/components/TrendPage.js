import React, {Component} from 'react';
import {
    View, Text, StatusBar, StyleSheet
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import styles, {screenWidth} from "../style"
import * as Constant from "../style/constant"
import I18n from '../style/i18n'
import loginActions from '../store/actions/login'
import userActions from '../store/actions/user'
import reposAction from '../store/actions/repository'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {getActionAndDes} from '../utils/eventUtils'
import EventItem from './widget/EventItem'
import PullListView from './widget/PullLoadMoreListView'
import * as Config from '../config/'
import PickerItem from './widget/PickerItem';
import {TrendTime, TrendType} from '../utils/FilterUtils';

class TrendPage extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {

    }

    componentWillUnmount() {
    }

    render() {
        return (
            <View style={styles.mainBox}>
                <StatusBar hidden={false} backgroundColor={'transparent'} translucent barStyle={'light-content'}/>
                <View style={[styles.flexDirectionRowNotFlex, {height: Constant.tabBarHeight}]}>
                    <PickerItem
                        defaultValue={TrendTime[0].toString()}
                        defaultIndex={0}
                        style={{
                            flex: 1,
                            marginHorizontal: Constant.normalMarginEdge,
                            backgroundColor: Constant.transparentColor,
                            borderRightColor: Constant.lineColor,
                            borderRightWidth: StyleSheet.hairlineWidth
                        }}
                        textStyle={{
                            marginVertical: 10,
                            marginHorizontal: 6,
                            fontSize: 18,
                            color: Constant.mainTextColor,
                            textAlign: 'center',
                            textAlignVertical: 'center',
                        }}
                        dropdownStyle={{
                            width: screenWidth / 2,
                            height: 300,
                            borderColor: 'cornflowerblue',
                            borderWidth: 2,
                            borderRadius: 3,
                        }}
                        options={TrendTime}
                    />
                    <PickerItem
                        defaultValue={TrendType[0].toString()}
                        defaultIndex={0}
                        style={{
                            flex: 1,
                            marginHorizontal: Constant.normalMarginEdge,
                            backgroundColor: Constant.transparentColor,
                        }}
                        textStyle={{
                            marginVertical: 10,
                            marginHorizontal: 6,
                            fontSize: 18,
                            color: Constant.mainTextColor,
                            textAlign: 'center',
                            textAlignVertical: 'center',
                        }}
                        dropdownStyle={{
                            width: screenWidth / 2,
                            height: 300,
                            borderColor: 'cornflowerblue',
                            borderWidth: 2,
                            borderRadius: 3,
                        }}
                        options={TrendType}
                    />
                </View>
            </View>
        );
    }

}


export default connect(state => ({
    userState: state.user,
    loginState: state.login,
    reposState: state.repos,
}), dispatch => ({
    loginAction: bindActionCreators(loginActions, dispatch),
    userAction: bindActionCreators(userActions, dispatch),
    reposAction: bindActionCreators(reposAction, dispatch)
}))(TrendPage)
