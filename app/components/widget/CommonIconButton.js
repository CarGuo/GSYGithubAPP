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
 *
 */
class CommonIconButton extends Component {

    static propTypes = {
        rightBtn: PropTypes.string,
        needRightBtn: PropTypes.bool,
        rightBtnPress: PropTypes.func
    };

    componentDidMount() {
    }

    componentWillUnmount() {

    }

    render() {
        if (!this.props.data || !this.props.data.needRightBtn) {
            return <View/>
        }
        return (
            <TouchableOpacity
                style={[styles.centered, {
                    marginRight: Constant.normalMarginEdge,
                    paddingLeft: 20
                }]}
                onPress={() => {
                    this.props.data.rightBtnPress && this.props.data.rightBtnPress(this.props.data);
                }}>
                <Icon name={this.props.data.rightBtn} size={20} color={Constant.miWhite}/>
            </TouchableOpacity>
        )
    }
}
CommonIconButton.propTypes = {
    rightBtn: PropTypes.string,
    needRightBtn: PropTypes.bool,
    rightBtnPress: PropTypes.func
};
export default CommonIconButton