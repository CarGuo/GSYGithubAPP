/**
 * Created by guoshuyu on 2017/11/12.
 */
import React, {Component} from 'react';
import {
    Text,
    View,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    TouchableHighlight
} from 'react-native';
import PropTypes from 'prop-types';
import styles, {screenWidth, screenHeight} from "../../style/index"
import * as Constant from "../../style/constant"
import I18n from '../../style/i18n'
import {uploadQiNiu} from '../../net/qiniu'
import Modal from 'react-native-modalbox';
import Spinner from 'react-native-spinkit';
import {Actions} from "react-native-router-flux";
import CommonInputBar from "./CommonInputBar";
import ImagePicker from 'react-native-image-crop-picker';

const iconSize = 16;

/**
 * 通用输入框modal
 */
class CommonTextInputModal extends Component {

    constructor(props) {
        super(props);
        this.onClose = this.onClose.bind(this);
        this._onOpened = this._onOpened.bind(this);
        this._searchTextChange = this._searchTextChange.bind(this);
        this._searchTextTitleChange = this._searchTextTitleChange.bind(this);
        this._getOptionItem = this._getOptionItem.bind(this);
        this.getDataList = this.getDataList.bind(this);
        this.getUserList = this.getUserList.bind(this);
        this.openImagePicker = this.openImagePicker.bind(this);
        this.getLoading = this.getLoading.bind(this);
        this.text = this.props.text;
        this.title = this.props.titleValue;
        this.state = {
            showList: false,
            showLoading: false,
        }
    }

    componentDidMount() {
        if (this.refs.loginModal)
            this.refs.loginModal.open();

    }

    componentWillUnmount() {
    }

    onClose() {
        Actions.pop();
        return true;
    }

    _onOpened() {
        if (this.refs.titleInput) {
            this.refs.titleInput.setNativeProps({text: this.title});
        }
        if (this.refs.contentInput) {
            this.refs.contentInput.setNativeProps({text: this.text});
        }
    };

    _searchTextTitleChange(text) {
        this.title = text;
    }

    _searchTextChange(text) {
        this.text = text;
    }


    getDataList() {
        return [{
            icon: "format-header-1",
            iconType: 2,
            iconSize: iconSize,
            itemClick: () => {
                let curText = this.text + "\n# ";
                if (this.refs.contentInput) {
                    this.refs.contentInput.setNativeProps({text: curText});
                }
            }
        }, {
            icon: "format-header-2",
            iconType: 2,
            iconSize: iconSize,
            itemClick: () => {
                let curText = this.text + "\n## ";
                this._searchTextChange(curText);
                if (this.refs.contentInput) {
                    this.refs.contentInput.setNativeProps({text: curText});
                }
            }
        }, {
            icon: "format-header-3",
            iconType: 2,
            iconSize: iconSize,
            itemClick: () => {
                let curText = this.text + "\n### ";
                this._searchTextChange(curText);
                if (this.refs.contentInput) {
                    this.refs.contentInput.setNativeProps({text: curText});
                }
            }
        }, {
            icon: "format-bold",
            iconType: 2,
            iconSize: iconSize,
            itemClick: () => {
                let curText = this.text + "****";
                this._searchTextChange(curText);
                if (this.refs.contentInput) {
                    this.refs.contentInput.setNativeProps({text: curText});
                }
            }
        }, {
            icon: "format-italic",
            iconType: 2,
            iconSize: iconSize,
            itemClick: () => {
                let curText = this.text + "__";
                this._searchTextChange(curText);
                if (this.refs.contentInput) {
                    this.refs.contentInput.setNativeProps({text: curText});
                }
            }
        }, {
            icon: "format-quote-close",
            iconType: 2,
            iconSize: iconSize,
            itemClick: () => {
                let curText = this.text + "``";
                this._searchTextChange(curText);
                if (this.refs.contentInput) {
                    this.refs.contentInput.setNativeProps({text: curText});
                }
            }
        }, {
            icon: "code-tags",
            iconType: 2,
            iconSize: iconSize,
            itemClick: () => {
                let curText = this.text + " \n``` \n\n``` \n";
                this._searchTextChange(curText);
                if (this.refs.contentInput) {
                    this.refs.contentInput.setNativeProps({text: curText});
                }
            }
        }, {
            icon: "link",
            iconType: 2,
            iconSize: iconSize,
            itemClick: () => {
                let curText = this.text + "[](url)";
                this._searchTextChange(curText);
                if (this.refs.contentInput) {
                    this.refs.contentInput.setNativeProps({text: curText});
                }
            }
        }, {
            icon: "format-list-bulleted",
            iconType: 2,
            iconSize: iconSize,
            itemClick: () => {
                let curText = this.text + "\n- ";
                this._searchTextChange(curText);
                if (this.refs.contentInput) {
                    this.refs.contentInput.setNativeProps({text: curText});
                }
            }
        }, {
            icon: "at",
            iconType: 2,
            iconSize: iconSize,
            itemClick: () => {
                let {userList} = this.props;
                if (userList && userList.length > 0) {
                    this.setState({
                        showList: true
                    })
                } else {
                    let curText = this.text + " @";
                    this._searchTextChange(curText);
                    if (this.refs.contentInput) {
                        this.refs.contentInput.setNativeProps({text: curText});
                    }
                }
            }
        }, {
            icon: "file-image",
            iconType: 2,
            iconSize: iconSize,
            itemClick: () => {
                this.openImagePicker();
            }
        },]
    }


    _getOptionItem() {
        let {userList} = this.props;
        let optionList = [];
        userList.forEach((item) => {
            let optionItem = {
                itemName: item,
                itemClick: () => {
                    this.setState({
                        showList: false
                    });
                    let curText = this.text + " @" + item + " ";
                    this._searchTextChange(curText);
                    if (this.refs.contentInput) {
                        this.refs.contentInput.setNativeProps({text: curText});
                    }
                }, itemStyle: {
                    borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: Constant.lineColor,
                }
            };
            optionList.push(optionItem)
        });
        return optionList;
    }


    getUserList() {
        let {showList} = this.state;
        if (!showList) {
            return (<View/>)
        }
        let _renderListItem = (data) => {
            let width = screenWidth - 170;
            return (
                <TouchableOpacity style={[styles.centered, {width: width, height: 50}, styles.centerH, data.itemStyle]}
                                  onPress={() => {
                                      data.itemClick && data.itemClick(data);
                                  }}
                                  key={data.itemName}>
                    <Text style={[styles.normalText]}>{data.itemName}</Text>
                </TouchableOpacity>
            )
        };
        let dataList = this._getOptionItem();
        let items = [];
        dataList.forEach((data) => {
            items.push(_renderListItem(data))
        });
        return (
            <TouchableOpacity
                style={[styles.absoluteFull,]}
                onPress={() => {
                    this.setState({
                        showList: false
                    });
                }}>
                <View style={[styles.centered, {padding: 40, backgroundColor: "#000000", opacity: 0.8}]}>
                    <View style={[styles.centered, {backgroundColor: Constant.white, borderRadius: 4}]}>
                        <ScrollView>
                            {items}
                        </ScrollView>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    getLoading() {
        let {showLoading} = this.state;
        if (!showLoading) {
            return (<View/>)
        }
        return (
            <TouchableOpacity
                style={[styles.absoluteFull, styles.centered, {backgroundColor: "#000000", opacity: 0.8}]}>
                <View style={[styles.centered]}>
                    <View>
                        <Spinner style={[styles.centered]}
                                 isVisible={true}
                                 size={50} type="9CubeGrid"
                                 color="#FFFFFF"/>
                        <Text style={styles.normalTextWhite}>{I18n('loading')}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    openImagePicker() {
        ImagePicker.openPicker({
            includeBase64: true,
            cropping: true,
            width: 600,
            height: 600

        }).then(image => {
            if (image && image.data) {
                this.setState({
                    showLoading: true
                });
                uploadQiNiu(image.data).then((res) => {
                    if (res) {
                        let curText = this.text + ` ![](${res.data}) `;
                        this._searchTextChange(curText);
                        if (this.refs.contentInput) {
                            this.refs.contentInput.setNativeProps({text: curText});
                        }
                    }
                    this.setState({
                        showLoading: false
                    });
                });
            }
        });
    }

    render() {
        let width = screenWidth - 100;
        let {bottomBar} = this.props;
        let editTitle = this.props.needEditTitle ? <View style={[{
            borderBottomWidth: 1,
            borderColor: Constant.subLightTextColor,
            marginHorizontal: Constant.normalMarginEdge,
            marginBottom: Constant.normalMarginEdge,
        }]}>
            <TextInput
                ref={"titleInput"}
                onChangeText={(text) => {
                    this._searchTextTitleChange(text)
                }}
                placeholder={this.props.placeHolderTitle ? this.props.placeHolderTitle : I18n('issueInputTipTitle')}
                underlineColorAndroid="transparent"
                clearButtonMode="always"
                multiline={true}
                style={[styles.smallText, {
                    padding: 0,
                    backgroundColor: Constant.white,
                    height: 30,
                    width: width,
                    textAlignVertical: 'top'
                }]}/></View> : <View/>;
        return (
            <Modal ref={"loginModal"}
                   onOpened={this._onOpened}
                   onClosed={this.onClose}
                   style={[{height: screenHeight, width: screenWidth, backgroundColor: "#F0000000"}]}
                   position={"center"}
                   backdrop={this.props.backExit}
                   backButtonClose={false}
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
                                ref={"contentInput"}
                                onChangeText={(text) => {
                                    this._searchTextChange(text)
                                }}
                                onSelectionChange={(event) => {
                                    if (event && event.nativeEvent) {
                                        this.selection = event.nativeEvent.selection.end;
                                    }
                                }}
                                placeholder={this.props.placeHolder ? this.props.placeHolder : I18n('issueInputTip')}
                                underlineColorAndroid="transparent"
                                clearButtonMode="always"
                                multiline={true}
                                style={[styles.smallText, {
                                    padding: Constant.normalMarginEdge,
                                    backgroundColor: Constant.white,
                                    height: screenWidth - 150,
                                    borderRadius: 3,
                                    width: width,
                                    textAlignVertical: 'top'
                                }]}/>
                            <CommonInputBar
                                rootStyles={{width: (bottomBar ? width : 0)}}
                                dataList={this.getDataList()}/>
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
                        {this.getUserList()}
                    </View>
                </View>
                {this.getLoading()}
            </Modal>
        )
    }
}

CommonTextInputModal.propTypes = {
    text: PropTypes.string,
    placeHolder: PropTypes.string,
    placeHolderTitle: PropTypes.string,
    titleValue: PropTypes.string,
    titleText: PropTypes.string,
    textConfirm: PropTypes.func,
    needEditTitle: PropTypes.bool,
    bottomBar: PropTypes.bool,
    userList: PropTypes.array
};
CommonTextInputModal.defaultProps = {
    text: '',
    titleText: '',
    needEditTitle: false,
    bottomBar: true,
    userList: [],
};


export default CommonTextInputModal;