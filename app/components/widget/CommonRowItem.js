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
    TouchableOpacity,
    Dimensions,
    StyleSheet
} from 'react-native';

import * as Constant from '../../style/constant'
import styles from '../../style'
import Icon from 'react-native-vector-icons/EvilIcons'

const propTypes = {
    itemText: PropTypes.string,
    onClickFun: PropTypes.func,
    showIconNext: PropTypes.bool,
    topLine: PropTypes.bool,
    bottomLine: PropTypes.bool,
    itemIcon: PropTypes.string,
    itemIconColor: PropTypes.string,
    itemIconSize: PropTypes.number,
    textStyle: PropTypes.number,
};

/**
 * 通用行Item
 */
class CommonRowItem extends Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
    }

    componentWillUnmount() {

    }

    render() {
        return (
            <View/>
        )
    }

    render() {
        let {onClickFun, itemText, showIconNext, textStyle, topLine, bottomLine, itemIcon} = this.props;
        let IconComponent = (showIconNext) ?
            <Icon name={Constant.nextIcon} size={Constant.smallIconSize} color={Constant.primaryColor}/>
            : <View/>;
        let tl = (topLine) ? StyleSheet.hairlineWidth : 0;
        let bl = (bottomLine) ? StyleSheet.hairlineWidth : 0;
        let leftIcon = (itemIcon) ?
            <Icon name={itemIcon} size={Constant.smallIconSize} color={Constant.primaryColor}/>
            : <View/>;
        return (
            <TouchableOpacity
                onPress={()=>{onClickFun && onClickFun()}}
                style={[{height: 50, marginLeft: Constant.normalMarginEdge, marginRight:Constant.normalMarginEdge}]}>
                <View
                    style={[styles.flexDirectionRow, styles.centerH,
                    {borderTopWidth: tl, borderTopColor: Constant.lineColor},
                    {borderBottomWidth: bl, borderBottomColor: Constant.lineColor},]}>
                    {leftIcon}
                    <Text style={[{flex:1}, textStyle]}>{itemText}</Text>
                    {IconComponent}
                </View>
            </TouchableOpacity>
        );
    }
}

CommonRowItem.propTypes = propTypes;
CommonRowItem.defaultProps = {
    showIconNext: true,
    topLine: true,
    bottomLine: true,
    textStyle: styles.smallText,
    itemIconColor: Constant.primaryColor,
    itemIconSize: Constant.smallIconSize,
};

export default CommonRowItem;