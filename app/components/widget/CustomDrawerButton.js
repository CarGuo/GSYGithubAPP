/**
 * Created by guoshuyu on 2017/11/10.
 */

import React, {Component} from 'react';
import {
    View, Text, TouchableOpacity
} from 'react-native';
import PropTypes from 'prop-types';
import {Router, Actions, Scene} from '../../navigation/Actions';
import styles from "../../style"
import I18n from '../../style/i18n'
import * as Constant from '../../style/constant'
import Icon from 'react-native-vector-icons/FontAwesome'
import { useNavigation } from '@react-navigation/native';

/**
 * 自定义搜索过滤按键
 */
function CustomDrawerButton() {
    const navigation = useNavigation();

    const handlePress = () => {
        if (navigation.openDrawer) {
            navigation.openDrawer();
        }
    };

    return (
        <TouchableOpacity 
            style={[styles.centered, {
                marginRight: Constant.normalMarginEdge,
                marginTop: Constant.normalMarginEdge,
                paddingLeft: 20
            }]}
            onPress={handlePress}
        >
            <Icon name={'filter'} size={20} color={Constant.miWhite}/>
        </TouchableOpacity>
    );
}

export default CustomDrawerButton