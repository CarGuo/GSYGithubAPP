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
    state = {
        webViewHeight: Number
    };

    static defaultProps = {
        autoHeight: true,
    };

    constructor(props: Object) {
        super(props);
        this.state = {
            webViewHeight: this.props.defaultHeight
        };

        this._onMessage = this._onMessage.bind(this);
    }

    _onMessage(e) {
        this.setState({
            webViewHeight: parseInt(e.nativeEvent.data)
        });
    }

    stopLoading() {
        this.webview.stopLoading();
    }

    render() {
        const _w = this.props.width || Dimensions.get('window').width;
        const _h = this.props.autoHeight ? this.state.webViewHeight : this.props.defaultHeight;
        return (
            <WebView
                ref={(ref) => {
                    this.webview = ref;
                }}
                injectedJavaScript={'(' + String(injectedScript) + ')();'}
                scrollEnabled={this.props.scrollEnabled || false}
                onMessage={this._onMessage}
                javaScriptEnabled={true}
                automaticallyAdjustContentInsets={true}
                mixedContentMode={'always'}
                saveFormDataDisabled={true}
                {...this.props}
                style={[{width: _w}, this.props.style, {height: _h}]}
            />
        )
    }
}