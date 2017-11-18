/**
 * Created by guoshuyu on 2017/11/11.
 */

import React, {Component} from 'react';
import {View, Image, Text, StyleSheet} from 'react-native'
import PropTypes from 'prop-types';
import resolveTime from '../../utils/timeUtil'

const propTypes = {
    time: PropTypes.any,
};

/**
 * 时间显示控件
 */
class Time extends Component {

    getTimeText() {
        let {time} = this.props;
        return resolveTime(time)
    }

    render() {
        let time = this.getTimeText();
        return (
            <Text {...this.props}>{time}</Text>
        )
    }
}


Time.propTypes = propTypes;

export default Time;
