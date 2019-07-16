/**
 * Created by guoshuyu on 2017/11/12.
 */
import React, {Component} from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    ScrollView
} from 'react-native';
import PropTypes from 'prop-types';
import styles, {screenWidth, screenHeight} from "../../style/index"
import * as Constant from "../../style/constant"
import Modal from 'react-native-modalbox';
import {Actions} from "react-native-router-flux";

const width = screenWidth - 100;
const itemHeight = 50;

/**
 * 通用配置item选择modal
 */
class CommonOptionModal extends Component {

    constructor(props) {
        super(props);
        this.onClose = this.onClose.bind(this);
        this._renderItem = this._renderItem.bind(this);
    }

    componentDidMount() {
        if (this.refs.modal)
            this.refs.modal.open();
    }

    componentWillUnmount() {
    }

    onClose() {
        Actions.pop();
        return true;
    }

    _renderItem(data) {
        return (
            <TouchableOpacity
                style={[styles.centered, {width: width, height: itemHeight}, styles.centerH, data.itemStyle]}
                onPress={() => {
                    Actions.pop();
                    data.itemClick && data.itemClick(data);
                }}
                key={data.itemName}>
                <Text style={[styles.normalText]}>{data.itemName}</Text>
            </TouchableOpacity>
        )
    }

    render() {
        let {dataList} = this.props;
        let items = [];
        dataList.forEach((data) => {
            items.push(this._renderItem(data))
        });
        let sumHeight = itemHeight * items.length + 2;
        let currentHeight = (sumHeight >= screenHeight) ? screenHeight : sumHeight;
        return (
            <Modal ref={"modal"}
                   style={[{height: screenHeight, width: screenWidth, backgroundColor: "#F0000000"}]}
                   position={"center"}
                   onClosed={this.onClose}
                   backdrop={true}
                   backButtonClose={false}
                   swipeToClose={true}
                   backdropOpacity={0.8}>
                <View style={[styles.centered, {height: screenHeight, width: screenWidth}]}>
                    <View style={[styles.centered, {height: currentHeight, width: screenWidth}]}>
                        <ScrollView style={[{
                            backgroundColor: Constant.white,
                            borderRadius: 4,
                            width: width,
                        }]}>
                            {items}
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        )
    }
}

CommonOptionModal.propTypes = {
    dataList: PropTypes.array,
};


CommonOptionModal.defaultProps = {
    dataList: [],
};

export default CommonOptionModal;