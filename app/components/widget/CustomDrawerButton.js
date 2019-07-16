/**
 * Created by guoshuyu on 2017/11/10.
 */

import React, {Component} from 'react';
import {
    View, Text, TouchableOpacity
} from 'react-native';
import PropTypes from 'prop-types';
import {Router, Actions, Scene} from 'react-native-router-flux';
import styles from "../../style"
import I18n from '../../style/i18n'
import * as Constant from '../../style/constant'
import Icon from 'react-native-vector-icons/FontAwesome'

/**
 * 自定义搜索过滤按键
 */
class CustomDrawerButton extends Component {
    componentDidMount() {
    }

    componentWillUnmount() {

    }


    render() {
        return (
            <View style={[styles.centered, {
                marginRight: Constant.normalMarginEdge,
                marginTop: Constant.normalMarginEdge,
                paddingLeft: 20
            }]}>
                <Icon name={'filter'} size={20} color={Constant.miWhite}/>
            </View>
        )
    }
}

export default CustomDrawerButton