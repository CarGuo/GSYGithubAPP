import React, {Component} from 'react';
import {
    View,
    Dimensions,
    WebView,
    ActivityIndicator,
    Linking
} from 'react-native';
import {Actions} from 'react-native-router-flux'
import I18n from '../../style/i18n'
import * as Constant from '../../style/constant'
import {launchUrl} from '../../utils/htmlUtils'

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

export default class WebComponent extends Component {

    constructor(props: Object) {
        super(props);
        this.state = {
            loading: true,
        }
    }


    render() {
        const _w = this.props.width || Dimensions.get('window').width;
        const _h = this.props.width || Dimensions.get('window').height;
        return (
            <WebView
                ref={(ref) => {
                    this.webview = ref;
                }}
                onShouldStartLoadWithRequest={(event) => {
                    if (event.url && event.url.indexOf("https://github.com/") === 0) {
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