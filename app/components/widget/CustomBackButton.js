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
 * 自定义返回按键
 */
class BackButton extends Component {
    componentDidMount() {
    }

    componentWillUnmount() {

    }


    render() {
        if (this.props.hideBackButton) {
            return <View/>;
        }
        return (
            <TouchableOpacity style={[styles.centered, {marginHorizontal: 2 * Constant.normalMarginEdge, marginTop:5}]} onPress={() => {
                Actions.pop();
            }}>
                <Icon name={'md-arrow-round-back'} size={20} color={Constant.miWhite}/>
            </TouchableOpacity>
        )
    }
}

BackButton.propTypes = {
    hideBackButton: PropTypes.bool
};
BackButton.defaultProps = {
    hideBackButton: false
};

export default BackButton