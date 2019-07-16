import React, {Component} from 'react';
import {
    View, Text, TouchableOpacity
} from 'react-native';
import styles from "../../style/index"
import PropTypes from 'prop-types';
import * as Constant from '../../style/constant'

/**
 * 垂直两行文本按键item
 */
class CommonNameValueItem extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        let halfEdge = Constant.normalMarginEdge / 2;
        let bottomTopTextStyle = [styles.subSmallText, {
            marginTop: halfEdge
        },];
        let bottomBottomTextStyle = [styles.subLightSmallText, {marginVertical: halfEdge}];
        return (
            <TouchableOpacity style={[...this.props.itemStyle]} onPress={() => {
                this.props.onItemPress && this.props.onItemPress();
            }}>
                <Text style={[...bottomTopTextStyle]}>{this.props.itemName}</Text>
                <Text style={[...bottomBottomTextStyle]}>{this.props.itemValue}</Text>
            </TouchableOpacity>
        )
    }
}

CommonNameValueItem.propTypes = {
    itemStyle: PropTypes.any,
    itemName: PropTypes.string,
    itemValue: PropTypes.string,
    onItemPress: PropTypes.func,
};

export default CommonNameValueItem;