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
import Icon2 from 'react-native-vector-icons/Ionicons'


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
        let icon = <View/>;
        switch (this.props.data.iconType) {
            case 1:
                icon = <Icon name={this.props.data.rightBtn} size={20} color={Constant.miWhite}/>
                break;
            case 2:
                icon = <Icon2 name={this.props.data.rightBtn} size={20} color={Constant.miWhite}/>
                break;
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
                {icon}
            </TouchableOpacity>
        )
    }
}

CommonIconButton.propTypes = {
    rightBtn: PropTypes.string,
    iconType: PropTypes.number,
    needRightBtn: PropTypes.bool,
    rightBtnPress: PropTypes.func
};

CommonIconButton.defaultProps = {
    iconType: 1,
};

export default CommonIconButton