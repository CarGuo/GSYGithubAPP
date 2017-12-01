import React, {Component} from 'react';
import {
    View, Text, TouchableOpacity
} from 'react-native';
import PropTypes from 'prop-types';
import styles from "../../style"
import * as Constant from "../../style/constant"

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
        return (
            <TouchableOpacity style={[styles.flex, styles.centerH, data.itemStyle]}
                              onPress={() => {
                                  data.itemClick && data.itemClick(data);
                              }}
                              key={data.itemName}
                              >
                <Text style={[styles.normalText]}>{data.itemName}</Text>
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