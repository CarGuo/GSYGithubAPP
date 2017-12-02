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
 * 通用行Item
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
        let {onClickFun, itemText, titleStyle, textStyle, itemIcon, itemTextTitle} = this.props;
        let leftIcon = (itemIcon) ?
            <Icon name={itemIcon} size={14} color={Constant.miWhite}/>
            : <View/>;
        return (
            <TouchableOpacity
                onPress={() => {
                    onClickFun && onClickFun()
                }}
                style={[{
                    marginHorizontal: Constant.normalMarginEdge,
                }, ...this.props.viewStyle]}>
                <View style={[styles.flexDirectionRow, styles.centerH, {
                    marginTop: Constant.normalMarginEdge
                }]}>
                    <Text style={[{flex: 1}, ...titleStyle]}>{itemTextTitle}</Text>
                </View>
                <View
                    style={[styles.flexDirectionRow, styles.centerH, styles.shadowCard, {
                        padding: Constant.normalMarginEdge,
                        marginTop: Constant.normalMarginEdge,
                        borderRadius: 3,
                    }]}>
                    {leftIcon}
                    <Text style={[{flex: 1, marginLeft: Constant.normalMarginEdge}, ...textStyle]}>{itemText}</Text>
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
    textStyle: styles.smallText,
    itemIconColor: Constant.primaryColor,
    itemIconSize: Constant.smallIconSize,
    viewStyle: [],
};

export default CodeFileItem;