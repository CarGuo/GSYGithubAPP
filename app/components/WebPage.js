import React, {Component} from 'react';
import {
    View,
    BackHandler,
    WebView,
    TextInput,
    Text,
    TouchableOpacity
} from 'react-native';
import I18n from '../style/i18n'
import Icon from 'react-native-vector-icons/Ionicons'
import * as Constant from '../style/constant'
import {screenWidth} from '../style'
import {Actions} from "react-native-router-flux";
import styles from "../style"

/**
 * Web浏览页面
 */
export default class WebPage extends Component {

    constructor(props: Object) {
        super(props);
        this.canGoBack = false;
        this.state = {
            uri: this.resolveUrl(this.props.uri),
            showCurUri: this.resolveUrl(this.props.uri)
        };
        this.inputText = this.resolveUrl(this.props.uri);
        this.onNavigationStateChange = this.onNavigationStateChange.bind(this);
        this.handleTextInputChange = this.handleTextInputChange.bind(this);
        this.reload = this.reload.bind(this);
        this.goBack = this.goBack.bind(this);
        this.onSubmitEditing = this.onSubmitEditing.bind(this);
        this.back = this.back.bind(this);
        this.pressGoButton = this.pressGoButton.bind(this);
        this.resolveUrl = this.resolveUrl.bind(this);
    }

    componentDidMount() {
        this.handle = BackHandler.addEventListener('hardwareBackPress-WebPage', this.back)

    }

    componentWillUnmount() {
        if (this.handle) {
            this.handle.remove();
        }
    }

    handleTextInputChange = (event) => {
        let url = event.nativeEvent.text;
        this.inputText = this.resolveUrl(url);
    };

    resolveUrl(url) {
        if (!/^[a-zA-Z-_]+:/.test(url)) {
            url = 'http://' + url;
        }
        return url;
    }

    onNavigationStateChange = (navState) => {
        this.canGoBack = navState.canGoBack;
        this.setState({
            backButtonEnabled: navState.canGoBack,
            status: navState.title,
            showCurUri: navState.url,
            loading: navState.loading,
        });
    };


    reload() {
        if (this.webview) {
            this.webview.reload()
        }
    }

    goBack = () => {
        if (this.canGoBack) {
            this.webview.goBack();
        } else {
            Actions.pop();
        }
    };

    back() {
        if (this.canGoBack) {
            this.goBack();
        } else {
            Actions.pop();
        }
        return true;
    }

    onSubmitEditing = () => {
        this.pressGoButton();
    };

    pressGoButton = () => {
        let url = this.inputText.toLowerCase();
        if (url === this.state.url) {
            this.reload();
        } else {
            this.setState({
                uri: url,
            });
        }
        this.refs['textInput'].blur();
    };

    render() {
        return (
            <View style={styles.mainBox}>
                <View style={[styles.flexDirectionRowNotFlex, {
                    width: screenWidth,
                    padding: Constant.normalMarginEdge,
                    backgroundColor: Constant.primaryColor,
                    paddingTop: Constant.normalMarginEdge + 30
                }]}>
                    <TouchableOpacity
                        style={[styles.centered, {
                            marginRight: Constant.normalMarginEdge,
                            marginLeft: Constant.normalMarginEdge - 3
                        }]}
                        onPress={this.goBack}>
                        <Icon name={'md-arrow-round-back'} size={18} color={Constant.miWhite}/>
                    </TouchableOpacity>
                    <TextInput
                        ref='textInput'
                        autoCapitalize="none"
                        defaultValue={this.state.showCurUri}
                        onSubmitEditing={this.onSubmitEditing}
                        onChange={this.handleTextInputChange}
                        clearButtonMode="always"
                        underlineColorAndroid="transparent"
                        style={[styles.smallText, {
                            padding: 0,
                            paddingLeft: Constant.normalMarginEdge / 2,
                            marginHorizontal: Constant.normalMarginEdge / 2,
                            borderRadius: 3,
                            backgroundColor: Constant.subLightTextColor,
                        }, styles.flex]}/>
                    <TouchableOpacity
                        style={[styles.centered, {
                            marginRight: Constant.normalMarginEdge,
                            paddingLeft: 20
                        }]}
                        onPress={this.pressGoButton}>
                        <Icon name={'md-search'} size={19} color={Constant.miWhite}/>
                    </TouchableOpacity>
                </View>
                <WebView
                    ref={(ref) => {
                        this.webview = ref;
                    }}
                    {...this.props}
                    source={{uri: this.state.uri}}
                    onNavigationStateChange={this.onNavigationStateChange}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    scalesPageToFit={true}
                    mixedContentMode={'always'}
                    automaticallyAdjustContentInsets={true}
                    allowUniversalAccessFromFileURLs={true}
                    mediaPlaybackRequiresUserAction={true}
                    startInLoadingState={true}
                    style={[{width: screenWidth}, {flex: 1},]}
                />
            </View>
        )
    }
}

