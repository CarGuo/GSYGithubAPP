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
import Icon from 'react-native-vector-icons/FontAwesome'


/**
 * 代码通用Item
 */
class CodeFileItem extends Component {
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
        let {onClickFun, itemText, titleStyle, itemIcon, itemTextTitle, needTitle} = this.props;
        let leftIcon = (itemIcon) ?
            <Icon name={itemIcon} size={14} color={Constant.subTextColor}/>
            : <View/>;
        let title = (needTitle) ?
            <View style={[styles.flexDirectionRow, styles.centerH, {
                marginTop: Constant.normalMarginEdge,
                marginHorizontal: Constant.normalMarginEdge,
            }]}>
                <Text style={[{flex: 1}, ...titleStyle]}>{itemTextTitle}</Text>
            </View> : <View/>;
        return (
            <TouchableOpacity
                onPress={() => {
                    onClickFun && onClickFun()
                }}
                style={[{
                }, ...this.props.viewStyle]}>
                {title}
                <View
                    style={[styles.flexDirectionRow, styles.centerH, styles.shadowCard, {
                        padding: Constant.normalMarginEdge,
                        marginVertical: Constant.normalMarginEdge / 2,
                        marginHorizontal: Constant.normalMarginEdge,
                        borderRadius: 3,
                    }]}>
                    {leftIcon}
                    <Text style={[{flex: 1, marginLeft: Constant.normalMarginEdge}]}>{itemText}</Text>
                </View>
            </TouchableOpacity>
        );
    }
}

const propTypes = {
    itemText: PropTypes.string,
    needTitle: PropTypes.bool,
    onClickFun: PropTypes.func,
    showIconNext: PropTypes.bool,
    topLine: PropTypes.bool,
    bottomLine: PropTypes.bool,
    itemIcon: PropTypes.string,
    itemIconColor: PropTypes.string,
    itemIconSize: PropTypes.number,
    textStyle: PropTypes.any,
    viewStyle: PropTypes.array,
};
CodeFileItem.propTypes = propTypes;
CodeFileItem.defaultProps = {
    showIconNext: true,
    topLine: true,
    bottomLine: true,
    needTitle: true,
    textStyle: styles.smallText,
    itemIconColor: Constant.primaryColor,
    itemIconSize: Constant.smallIconSize,
    viewStyle: [],
};

export default CodeFileItem;