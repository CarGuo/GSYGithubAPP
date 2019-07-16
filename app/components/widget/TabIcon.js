/**
 * Created by guoshuyu on 2017/2/10.
 */

import React, {
    Component,
} from 'react';
import PropTypes from 'prop-types';
import {
    Text,
    Image,
    View,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
} from 'react-native';

import * as Constant from '../../style/constant'
import styles from '../../style'
import I18n from '../../style/i18n'
import Icon from 'react-native-vector-icons/Feather'


const config = {
    ["tabRecommended"]: 'activity',
    ["tabDynamic"]: 'aperture',
    ["tabMy"]: 'users',
};

const propTypes = {
    focused: PropTypes.bool,
    title: PropTypes.string,
    tabName: PropTypes.string,
    tabIconName: PropTypes.string,
};

/**
 * 底部Tab
 */
class TabIcon extends Component {

    constructor(props) {
        super(props)
    }

    render() {

        let iconPath = config[this.props.tabIconName];

        let color = this.props.focused ? Constant.tabSelectedColor : Constant.tabUnSelectColor;

        return (
            <View style={styles.centered}>
                <Icon name={iconPath} size={Constant.tabIconSize} color={color}/>
                <Text style={[{color: color}, {fontSize: Constant.smallTextSize}]}>{this.props.title}</Text>
            </View>
        );
    }
}

TabIcon.propTypes = propTypes;

export default TabIcon;