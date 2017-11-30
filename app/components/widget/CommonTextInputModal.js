/**
 * Created by guoshuyu on 2017/11/12.
 */
import React, {Component} from 'react';
import {
    Text,
    View,
    BackHandler,
    TextInput,
    TouchableOpacity,
    StyleSheet
} from 'react-native';
import PropTypes from 'prop-types';
import styles, {screenWidth, screenHeight} from "../../style"
import * as Constant from "../../style/constant"
import I18n from '../../style/i18n'
import Modal from 'react-native-modalbox';
import Spinner from 'react-native-spinkit';
import {Actions} from "react-native-router-flux";


/**
 * 登陆Modal
 */
class CommonTextInputModal extends Component {

    constructor(props) {
        super(props);
        this.onClose = this.onClose.bind(this);
        this._searchTextChange = this._searchTextChange.bind(this);
    }

    componentDidMount() {
        this.refs.loginModal.open();
        BackHandler.addEventListener('hardwareBackPress', this.onClose)
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.onClose)
    }

    onClose() {
        Actions.pop();
        return true;
    }

    _searchTextChange(text) {

    }

    render() {
        let width = screenWidth - 100;
        return (
            <Modal ref={"loginModal"}
                   style={[{height: screenHeight, width: screenWidth, backgroundColor: "#F0000000"}]}
                   position={"center"}
                   backdrop={this.props.backExit}
                   backButtonClose={this.props.backExit}
                   swipeToClose={this.props.backExit}
                   backdropOpacity={0.8}>
                <View style={[styles.centered, {flex: 1,}]}>
                    <View style={[{borderRadius: 3, backgroundColor: Constant.white}, styles.centered]}>
                        <View style={[styles.flexDirectionRowNotFlex, {marginTop: 5, paddingBottom: 10}
                            , {borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: Constant.lineColor},
                            {backgroundColor: Constant.white, width: width}, styles.centered]}>
                            <Text
                                style={[styles.normalText, {fontWeight: 'bold'}]}>{"Title"}</Text>
                        </View>
                        <TextInput
                            onChangeText={(text) => {
                                this._searchTextChange(text)
                            }}
                            placeholder={this.props.text}
                            underlineColorAndroid="transparent"
                            clearButtonMode="always"
                            multiline={true}
                            style={[styles.smallText, {
                                borderRadius: 3,
                                borderWidth: 0,
                                borderColor: Constant.white,
                                paddingVertical: Constant.normalMarginEdge,
                                paddingRight: Constant.normalMarginEdge,
                                backgroundColor: Constant.miWhite,
                                height: screenWidth - 150,
                                width: width,
                                textAlignVertical: 'top'
                            }]}/>
                        <View
                            style={[styles.flexDirectionRowNotFlex, {
                                paddingTop: Constant.normalMarginEdge,
                                paddingBottom: Constant.normalMarginEdge,
                                borderBottomLeftRadius: 3,
                                borderBottomRadiusRadius: 3,
                                backgroundColor: Constant.primaryColor,
                                width: width
                            }, {borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: Constant.lineColor},]}>
                            <TouchableOpacity style={[styles.flex, styles.centerH]}>
                                <Text style={[styles.normalTextWhite, {fontWeight: 'bold'}]}>{I18n("cancel")}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.flex, styles.centerH,
                                {borderLeftWidth: StyleSheet.hairlineWidth, borderLeftColor: Constant.lineColor},
                            ]}>
                                <Text style={[styles.normalTextWhite, {fontWeight: 'bold'}]}>{I18n("ok")}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        )
    }
}

CommonTextInputModal.propTypes = {
    text: PropTypes.string,
};
CommonTextInputModal.defaultProps = {
    text: '',
};


export default CommonTextInputModal;