import React, {Component} from 'react';
import {
    View, Text, TouchableOpacity, ScrollView
} from 'react-native';
import PropTypes from 'prop-types';
import styles from "../../style/index"
import * as Constant from "../../style/constant"
import IconC from 'react-native-vector-icons/Octicons'
import IconC2 from 'react-native-vector-icons/MaterialCommunityIcons'

/**
 * 通用输入框的快捷按键
 */
class CommonInputBar extends Component {

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

        let icon = <View/>;
        switch (data.iconType) {
            case 1:
                icon = <IconC name={(data.icon) ? data.icon : "bell"}
                              backgroundColor={Constant.transparentColor}
                              color={(data.icon) ? iconColor : Constant.transparentColor}
                              size={data.iconSize}/>;
                break;
            case 2:
                icon = <IconC2 name={(data.icon) ? data.icon : "bell"}
                               backgroundColor={Constant.transparentColor}
                               color={(data.icon) ? iconColor : Constant.transparentColor}
                               size={data.iconSize}/>;
                break;
        }
        return (
            <TouchableOpacity style={[{height: 40, width: 40}, styles.centerH, data.itemStyle]}
                              onPress={() => {
                                  data.itemClick && data.itemClick(data);
                              }}
                              key={data.icon}>
                {icon}
            </TouchableOpacity>
        )
    }

    render() {
        let {dataList, rootStyles} = this.props;
        let items = [];
        dataList.forEach((data) => {
            items.push(this.renderItem(data))
        });
        return (
            <View style={[{height: 40}, this.props.rootStyles]}>
                <ScrollView
                    horizontal={true}>
                    {items}
                </ScrollView>
            </View>
        )
    }
}


CommonInputBar.propTypes = {
    dataList: PropTypes.array,
    rootStyles: PropTypes.any,
    inputView: PropTypes.any,
};


CommonInputBar.defaultProps = {
    dataList: [],
    rootStyles: {}
};

export default CommonInputBar