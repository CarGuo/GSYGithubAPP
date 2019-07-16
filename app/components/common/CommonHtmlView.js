import React, {Component} from 'react';
import {Clipboard, Linking, Image, TouchableWithoutFeedback, Platform, View, ImageBackground} from 'react-native';
import HTMLView from 'react-native-htmlview';
import Toast from './ToastProxy'
import {Actions} from "react-native-router-flux";
import I18n from '../../style/i18n'
import {launchUrl} from '../../utils/htmlUtils'
import styles, {screenWidth} from "../../style/index"
import Icon from 'react-native-vector-icons/Ionicons'
import * as Constant from "../../style/constant";

/**
 * 通用横Html解析显示item控件
 */
class CommonHtmlView extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
    }

    componentWillUnmount() {

    }

    hadImageChildren(node) {
        let hadImageNode = false;
        if (node.children && node.children.length > 0) {
            for (let i = 0; i < node.children.length; i++) {
                let item = node.children[i];
                hadImageNode = this.hadImageChildren(item);
                if (hadImageNode) {
                    break;
                }
            }
        }
        if (node.type === 'tag' && node.name === 'img') {
            return true;
        } else {
            return hadImageNode;
        }
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
                selectable={true}
                onLinkLongPress={(link) => {
                    Clipboard.setString(link);
                    Toast(I18n("hadCopy"));
                }}
                renderNode={
                    (node, index, list, parent, domToElement) => {
                            if (node.type === 'tag') {
                                if (node.name === 'img') {
                                    return (
                                        <TouchableWithoutFeedback
                                            key={index}
                                            onPress={() => {
                                                Actions.PhotoPage({uri: node.attribs.src})
                                            }}>
                                            <View style={{
                                                width: screenWidth - 105,
                                                height: 300
                                            }}>
                                                <View style={[styles.centered, styles.absoluteFull, {
                                                    zIndex: -888,
                                                    width: screenWidth - 105,
                                                    height: 300,
                                                }]}>
                                                    <Icon name={'ios-image'} size={80} color={Constant.miWhite}/>
                                                </View>
                                                <Image source={{uri: node.attribs.src}}
                                                       resizeMethod="scale"
                                                       style={[styles.centerH, {
                                                           width: screenWidth - 105,
                                                           height: 300,
                                                           marginTop: 5
                                                       }]}>
                                                </Image>
                                            </View>
                                        </TouchableWithoutFeedback>
                                    )
                                } else {
                                    let img = this.hadImageChildren(node);
                                    if (img) {
                                        return <View key={index}>
                                            {domToElement(node.children, node)}
                                        </View>
                                    }
                                }
                            }
                    }
                }
                {...this.props}/>
        )
    }
}

export default CommonHtmlView