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
        this._searchTextTitleChange = this._searchTextTitleChange.bind(this);
        this.text = this.props.text;
        this.title = this.props.titleValue;
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

    _searchTextTitleChange(text) {
        this.title = text;
    }

    _searchTextChange(text) {
        this.text = text;
    }

    render() {
        let width = screenWidth - 100;
        let editTitle = this.props.needEditTitle ? <View style={[{
            borderBottomWidth: 1,
            borderColor: Constant.subLightTextColor,
            marginHorizontal: Constant.normalMarginEdge,
            marginBottom: Constant.normalMarginEdge,
        }]}>
            <TextInput
                onChangeText={(text) => {
                    this._searchTextTitleChange(text)
                }}
                placeholder={I18n('issueInputTipTitle')}
                underlineColorAndroid="transparent"
                clearButtonMode="always"
                multiline={true}
                value={this.title}
                style={[styles.smallText, {
                    padding: 0,
                    backgroundColor: Constant.white,
                    height: 30,
                    width: width,
                    textAlignVertical: 'top'
                }]}/></View> : <View/>;
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
                        <View style={[styles.flexDirectionRowNotFlex, {marginTop: 10, paddingBottom: 10},
                            {backgroundColor: Constant.white, width: width}, styles.centered]}>
                            <Text
                                style={[styles.normalText, {fontWeight: 'bold'}]}>{this.props.titleText}</Text>
                        </View>
                        {editTitle}
                        <View style={[{
                            borderRadius: 3,
                            borderWidth: 1,
                            borderColor: Constant.subLightTextColor,
                            marginHorizontal: Constant.normalMarginEdge,
                        }]}>
                            <TextInput
                                onChangeText={(text) => {
                                    this._searchTextChange(text)
                                }}
                                placeholder={this.props.text ? this.props.text : I18n('issueInputTip')}
                                underlineColorAndroid="transparent"
                                clearButtonMode="always"
                                multiline={true}
                                value={this.text}
                                style={[styles.smallText, {
                                    padding: Constant.normalMarginEdge,
                                    backgroundColor: Constant.white,
                                    height: screenWidth - 150,
                                    borderRadius: 3,
                                    width: width,
                                    textAlignVertical: 'top'
                                }]}/>
                        </View>
                        <View
                            style={[styles.flexDirectionRowNotFlex, {
                                paddingVertical: Constant.normalMarginEdge,
                                width: width
                            }]}>
                            <TouchableOpacity
                                style={[styles.flex, styles.centerH, {borderBottomLeftRadius: 3,}]}
                                onPress={() => {
                                    Actions.pop();
                                }}>
                                <Text style={[styles.subNormalText, {fontWeight: 'bold'}]}>{I18n("cancel")}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.flex, styles.centerH, {
                                    borderLeftWidth: 1,
                                    borderLeftColor: Constant.miWhite,
                                    borderBottomRightRadius: 3,
                                },]}
                                onPress={() => {
                                    if (this.text && this.text.trim().length > 0) {
                                        Actions.pop();
                                        this.props.textConfirm && this.props.textConfirm(this.text, this.title);
                                    }
                                }}>
                                <Text style={[styles.normalText, {fontWeight: 'bold'}]}>{I18n("ok")}</Text>
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
    titleValue: PropTypes.string,
    titleText: PropTypes.string,
    textConfirm: PropTypes.func,
    needEditTitle: PropTypes.bool,
};
CommonTextInputModal.defaultProps = {
    text: '',
    titleText: '',
    needEditTitle: false,
};


export default CommonTextInputModal;