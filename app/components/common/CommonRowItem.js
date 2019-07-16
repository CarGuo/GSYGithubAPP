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
import styles from '../../style/index'
import Icon from 'react-native-vector-icons/EvilIcons'
import IconC from 'react-native-vector-icons/Octicons'


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
        let {onClickFun, itemText, showIconNext, textStyle, nameStyle, topLine, bottomLine, itemIcon, iconSize, nameText} = this.props;
        let IconComponent = (showIconNext) ?
            <Icon name={Constant.nextIcon} size={Constant.smallIconSize} color={Constant.primaryColor}/>
            : <View/>;
        let tl = (topLine) ? StyleSheet.hairlineWidth : 0;
        let bl = (bottomLine) ? StyleSheet.hairlineWidth : 0;
        let leftIcon = (itemIcon) ?
            <IconC name={itemIcon} size={iconSize ? iconSize : 13} color={Constant.primaryColor}/>
            : <View/>;
        let leftText = (nameText) ?
            <Text style={[...nameStyle]}>{nameText}</Text>
            : <View/>;
        return (
            <TouchableOpacity
                onPress={() => {
                    onClickFun && onClickFun()
                }}
                style={[{
                    minHeight: 50, marginLeft: Constant.normalMarginEdge, marginRight: Constant.normalMarginEdge,
                    marginVertical: Constant.normalMarginEdge / 2,
                }, ...this.props.viewStyle]}>
                <View style={[styles.flexDirectionRow, styles.centerH,
                    {borderTopWidth: tl, borderTopColor: Constant.lineColor},
                    {borderBottomWidth: bl, borderBottomColor: Constant.lineColor},]}>
                    {leftIcon}
                    {leftText}
                    <Text style={[{flex: 1}, ...textStyle]}>{itemText}</Text>
                    {IconComponent}
                </View>
            </TouchableOpacity>
        );
    }
}

const propTypes = {
    itemText: PropTypes.string,
    onClickFun: PropTypes.func,
    showIconNext: PropTypes.bool,
    topLine: PropTypes.bool,
    bottomLine: PropTypes.bool,
    itemIcon: PropTypes.string,
    iconSize: PropTypes.number,
    itemIconColor: PropTypes.string,
    nameText: PropTypes.string,
    itemIconSize: PropTypes.number,
    textStyle: PropTypes.any,
    viewStyle: PropTypes.array,
};
CommonRowItem.propTypes = propTypes;
CommonRowItem.defaultProps = {
    showIconNext: true,
    topLine: true,
    bottomLine: true,
    textStyle: styles.smallText,
    itemIconColor: Constant.primaryColor,
    itemIconSize: Constant.smallIconSize,
    viewStyle: [],
};

export default CommonRowItem;