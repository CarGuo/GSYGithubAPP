/**
 * Created by guoshuyu on 2017/11/11.
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

class NextRowItem extends Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
    }

    componentWillUnmount() {

    }

    render() {
        return (
            <View
                style={[styles.flexDirectionRow, {height: 50, marginLeft: Constant.normalMarginEdge, marginRight:Constant.normalMarginEdge}]}>
                <View style={styles.flex}>

                </View>
                <Icon name={iconPath} size={Constant.tabIconSize} color={color}/>
            </View>
        );
    }
}


export default NextRowItem;