import React, {Component} from 'react';
import {
    View,
    Dimensions,
    WebView,
} from 'react-native';

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
    }


    render() {
        const _w = this.props.width || Dimensions.get('window').width;
        return (
            <WebView
                ref={(ref) => {
                    this.webview = ref;
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
                {...this.props}
                style={[{width: _w}, {flex:1}]}
            />
        )
    }
}