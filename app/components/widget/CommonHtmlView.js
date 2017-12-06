import React, {Component} from 'react';
import {Clipboard, Linking} from 'react-native';
import HTMLView from 'react-native-htmlview';
import Toast from './ToastProxy'
import {Actions} from "react-native-router-flux";
import I18n from '../../style/i18n'
import {launchUrl} from '../../utils/htmlUtils'

class CommonHtmlView extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
    }

    componentWillUnmount() {

    }

    render() {
        return (
            <HTMLView
                onLinkPress={(link) => {
                    if (link && (link.indexOf("http") === 0 || link.indexOf("www") === 0)) {
                        launchUrl(link);
                    } else {
                        Linking.openURL(link)
                    }
                }}
                onLinkLongPress={(link) => {
                    Clipboard.setString(link);
                    Toast(I18n("hadCopy"));
                }}
                {...this.props}
            />
        )
    }
}


export default CommonHtmlView