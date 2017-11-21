import React, {Component} from 'react';
import {
    View, Text, StatusBar, StyleSheet
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import styles, {screenWidth, navBarHeight} from "../style"
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
        let pickerViewStyle = [{flex: 1,}, styles.centerV];
        let pickerTextStyle = [{
            textAlign: 'center',
            textAlignVertical: 'center',
            color: Constant.selectedColor,
            fontSize: Constant.middleTextWhite
        },];
        let dropDownStyle = [{
            width: screenWidth,
            backgroundColor: "#FFF"
        }, styles.shadowCard];
        let filterItemHeight = 40;
        let adjustFrame = (style) => {
            style.left = 0;
            style.top = navBarHeight + StatusBar.currentHeight;
        };
        return (
            <View style={styles.mainBox}>
                <StatusBar hidden={false} backgroundColor={'transparent'} translucent barStyle={'light-content'}/>
                <View style={[styles.shadowCard, styles.flexDirectionRowNotFlex, {
                    height: filterItemHeight,
                    backgroundColor: Constant.white,
                }]}>
                    <PickerItem
                        defaultValue={TrendTime[0].toString()}
                        defaultIndex={0}
                        adjustFrame={adjustFrame}
                        itemHeight={filterItemHeight}
                        style={pickerViewStyle}
                        textStyle={pickerTextStyle}
                        dropdownStyle={[...dropDownStyle,
                            {height: filterItemHeight * TrendTime.length}]}
                        options={TrendTime}
                        onSelect={() => {

                        }}
                    />
                    <PickerItem
                        defaultValue={TrendType[0].toString()}
                        defaultIndex={0}
                        adjustFrame={adjustFrame}
                        itemHeight={filterItemHeight}
                        style={pickerViewStyle}
                        textStyle={pickerTextStyle}
                        dropdownStyle={[...dropDownStyle,
                            {height: filterItemHeight * TrendType.length}]}
                        options={TrendType}
                        onSelect={() => {

                        }}
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
