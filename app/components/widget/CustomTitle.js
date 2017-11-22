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
 * 推荐
 */
class CustomTitle extends Component {
    componentDidMount() {
    }

    componentWillUnmount() {

    }


    render() {
        let backButton = (Actions.state.routes[0].index === 0 || this.props.hideBackButton) ? <View/> :
            <TouchableOpacity style={[styles.centerV, {marginLeft: Constant.normalMarginEdge, marginTop: 5}]}
                              onPress={() => {
                                  Actions.pop();
                              }}>
                <Icon name={'md-arrow-round-back'} size={20} color={Constant.miWhite}/>
            </TouchableOpacity>;
        return (
            <View style={styles.flexDirectionRow}>
                {backButton}
                <Text style={[styles.titleTextStyle]}>{this.props.title}</Text>
            </View>
        )
    }
}

CustomTitle.propTypes = {
    hideBackButton: PropTypes.bool
};
CustomTitle.defaultProps = {
    hideBackButton: false
};

export default CustomTitle