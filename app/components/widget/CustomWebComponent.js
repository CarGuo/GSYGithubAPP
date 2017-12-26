import React, {Component} from 'react';
import {
    Platform,
    Dimensions,
    WebView,
    ActivityIndicator,
    Linking
} from 'react-native';
import PropTypes from 'prop-types';
import {Actions} from 'react-native-router-flux'
import {launchUrl} from '../../utils/htmlUtils'
import CusWebView from './native/CustomWebView'

let WebCurrent = (Platform.OS === 'ios') ? WebView : CusWebView;

const injectedScript = function () {
    function waitForBridge() {
        if (window.postMessage.length !== 1) {
            setTimeout(waitForBridge, 200);
        }
        else {
            let height = 0;
            if (document.documentElement.clientHeight > document.body.clientHeight) {
                height = document.documentElement.clientHeight
            }
            else {
                height = document.body.clientHeight
            }
            postMessage(height)
        }
    }

    waitForBridge();
};

/**
 * web控件
 */
export default class WebComponent extends Component {

    constructor(props: Object) {
        super(props);
        this.state = {
            loading: true,
        }
    }

    reload() {
        if (this.webview) {
            this.webview.reload();
        }
    }

    static propTypes = {
        gsygithubLink: PropTypes.func,
    };

    render() {
        const _w = this.props.width || Dimensions.get('window').width;
        const _h = this.props.width || Dimensions.get('window').height;
        return (
            <WebCurrent
                ref={(ref) => {
                    this.webview = ref;
                }}
                onShouldStartLoadWithRequest={(event) => {
                    if (event.url.indexOf('gsygithub://') === 0 ) {
                        this.props.gsygithubLink && this.props.gsygithubLink(event.url);
                    } else if (event.url && event.url.indexOf("https://github.com/") === 0) {
                        launchUrl(event.url)
                    } else if (event.url && (event.url.indexOf('http') === 0 || event.url.indexOf('www') === 0)) {
                        Actions.WebPage({uri: event.url});
                    } else if (event.url !== 'about:blank') {
                        Linking.openURL(event.url)
                    }
                    return event.url === 'about:blank';
                }}
                injectedJavaScript={'(' + String(injectedScript) + ')();'}
                scrollEnabled={this.props.scrollEnabled || true}
                javaScriptEnabled={true}
                dataDetectorTypes={'none'}
                domStorageEnabled={true}
                automaticallyAdjustContentInsets={true}
                mixedContentMode={'always'}
                allowUniversalAccessFromFileURLs={true}
                mediaPlaybackRequiresUserAction={true}
                startInLoadingState={true}
                onLoadEnd={() => {
                    this.setState({
                        loading: false,
                    })
                }}
                {...this.props}
                style={[{width: _w}, {flex: 1},]}
            />
        )
    }
}