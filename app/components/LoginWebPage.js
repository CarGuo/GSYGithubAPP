import React, {Component} from 'react';
import {
    View,
    BackHandler,
    TextInput,
    Text,
    TouchableOpacity, Linking, DeviceEventEmitter,
} from 'react-native';
import { WebView } from 'react-native-webview';
import {screenWidth} from '../style'
import {Actions} from '../navigation/Actions';
import styles from "../style"
import URL from 'url-parse';

/**
 * Web浏览页面
 */
export default class LoginWebPage extends Component {

    constructor(props) {
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
                <WebView
                    ref={(ref) => {
                        this.webview = ref;
                    }}
                    {...this.props}
                    cacheEnabled={false}
                    source={{uri: this.state.uri}}
                    onNavigationStateChange={this.onNavigationStateChange}
                    onShouldStartLoadWithRequest={event => {
                        if (event.url.indexOf('gsygithubapp://authed') === 0) {
                            let parseUrl = URL(event.url)
                            let code = parseUrl.query.substring((parseUrl.query.indexOf("code=") + 5), parseUrl.query.indexOf("&"))
                            Actions.pop()
                            DeviceEventEmitter.emit("LoginPage", {"code": code})
                            return false;
                        }
                        return true;
                    }}
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

