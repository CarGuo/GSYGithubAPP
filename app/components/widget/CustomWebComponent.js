import React, {Component} from 'react';
import {
    Dimensions,
    Linking
} from 'react-native';
import PropTypes from 'prop-types';
import { WebView } from 'react-native-webview';
import {Actions} from '../../navigation/Actions'
import {launchUrl} from '../../utils/htmlUtils'

let WebCurrent = WebView;

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

    constructor(props) {
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
                dataDetectorTypes={null}
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
