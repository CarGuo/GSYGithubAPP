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
import Icon from 'react-native-vector-icons/Ionicons'

/**
 * 自定义搜索按键
 */
class SearchButton extends Component {
    componentDidMount() {
    }

    componentWillUnmount() {

    }


    render() {
        return (
            <TouchableOpacity style={[styles.centered, {
                marginHorizontal: Constant.normalMarginEdge,
                paddingLeft: 20
            }]} onPress={() => {
                Actions.SearchPage();
            }}>
                <Icon name={'md-search'} size={25} color={Constant.miWhite}/>
            </TouchableOpacity>
        )
    }
}

export default SearchButton