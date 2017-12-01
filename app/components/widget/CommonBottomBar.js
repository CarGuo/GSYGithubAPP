import React, {Component} from 'react';
import {
    View, Text, TouchableOpacity
} from 'react-native';
import PropTypes from 'prop-types';
import styles from "../../style"
import * as Constant from "../../style/constant"
import IconC from 'react-native-vector-icons/Octicons'

class CommonBottomBar extends Component {

    constructor(props) {
        super(props);
        this.renderItem = this.renderItem.bind(this);
    }

    componentDidMount() {
    }

    componentWillUnmount() {

    }

    renderItem(data) {
        let iconColor = data.iconColor ? data.iconColor : Constant.primaryColor;
        return (
            <TouchableOpacity style={[styles.flex, styles.centerH, data.itemStyle]}
                              onPress={() => {
                                  data.itemClick && data.itemClick(data);
                              }}
                              key={data.itemName}>
                <View style={[styles.flexDirectionRowNotFlex, styles.centerH]}>
                    <IconC name={(data.icon) ? data.icon : "bell"}
                           backgroundColor={Constant.transparentColor}
                           color={(data.icon) ? iconColor : Constant.transparentColor}
                           size={(data.icon) ? 14 : 1}/>
                    <Text style={[{marginLeft: 10}, styles.smallText]}>{data.itemName}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    render() {
        let {dataList} = this.props;
        let items = [];
        dataList.forEach((data) => {
            items.push(this.renderItem(data))
        });
        return (
            <View
                style={[styles.flexDirectionRowNotFlex, {paddingVertical: Constant.normalMarginEdge}, styles.shadowCard]}>
                {items}
            </View>
        )
    }
}


CommonBottomBar.propTypes = {
    dataList: PropTypes.array,
};


CommonBottomBar.defaultProps = {
    dataList: [],
};

export default CommonBottomBar