/**
 * Created by guoshuyu on 2017/11/10.
 */

import React, {Component} from 'react';
import {
    View, Text, TouchableOpacity
} from 'react-native';
import PropTypes from 'prop-types';
import {Router, Actions, Scene} from 'react-native-router-flux';
import styles from "../../style/index"
import I18n from '../../style/i18n'
import * as Constant from '../../style/constant'
import Icon from 'react-native-vector-icons/FontAwesome'
import Icon2 from 'react-native-vector-icons/Ionicons'
import Icon3 from 'react-native-vector-icons/MaterialCommunityIcons'


/**
 * 通用icon按键
 */
class CommonIconButton extends Component {

    static propTypes = {
        rightBtn: PropTypes.string,
        needRightBtn: PropTypes.bool,
        rightBtnPress: PropTypes.func
    };

    constructor(props) {
        super(props);
    }


    componentDidMount() {
    }

    componentWillUnmount() {

    }

    componentWillReceiveProps(newProps) {

    }

    render() {
        this.local = this.props;
        if (this.props.data) {
            this.local = this.props.data;
        }
        if (!this.local || !this.local.needRightBtn) {
            return <View/>
        }
        let icon = <View/>;
        switch (this.local.iconType) {
            case 3:
                icon = <Icon3 name={this.local.rightBtn} size={20} color={Constant.miWhite}/>
                break;
            case 2:
                icon = <Icon2 name={this.local.rightBtn} size={20} color={Constant.miWhite}/>
                break;
            case 1:
            default:
                icon = <Icon name={this.local.rightBtn} size={20} color={Constant.miWhite}/>
                break;
        }
        return (
            <TouchableOpacity
                style={[styles.centered, {
                    marginRight: Constant.normalMarginEdge,
                    paddingLeft: 20
                }]}
                onPress={() => {
                    this.local.rightBtnPress && this.local.rightBtnPress(this.local);
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