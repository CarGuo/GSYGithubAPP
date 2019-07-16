import React, {Component} from 'react';
import {
    View, Linking,Clipboard
} from 'react-native';
import PropTypes from 'prop-types';
import styles from "../../style"
import I18n from '../../style/i18n'
import * as Constant from '../../style/constant'
import Icon from 'react-native-vector-icons/FontAwesome'
import Autolink from 'react-native-autolink';
import Toast from '../common/ToastProxy'
import {launchUrl} from '../../utils/htmlUtils'


class IconTextAutoLinkItem extends Component {
    componentDidMount() {
    }

    componentWillUnmount() {

    }

    render() {
        let smallIconTextStyle = [styles.flexDirectionRowNotFlex, styles.centerH,];
        let halfEdge = (this.props.icon) ? Constant.normalMarginEdge / 2 : 0;
        let iconView = (this.props.icon) ?
            <Icon name={this.props.icon} size={Constant.littleIconSize + 2} color={Constant.miWhite}/>
            : <View/>;
        return (
            <View
                style={[...smallIconTextStyle, ...this.props.viewstyle]}>
                {iconView}
                <Autolink
                    false={false}
                    text={this.props.text}
                    onPress={(link) => {
                        if (link && (link.indexOf("http") === 0 || link.indexOf("www") === 0)) {
                            launchUrl(link);
                        } else {
                            Linking.openURL(link)
                        }
                    }}
                    onLongPress={(link) => {
                        Clipboard.setString(link);
                        Toast(I18n("hadCopy"));
                    }}
                    style={[{marginLeft: halfEdge}, styles.miLightSmallText]}
                    linkStyle={[
                        ...this.props.textstyle]}>
                </Autolink>
            </View>
        )
    }
}


IconTextAutoLinkItem.propTypes = {
    text: PropTypes.string,
    icon: PropTypes.string,
    textstyle: PropTypes.any,
    viewstyle: PropTypes.any,
};


IconTextAutoLinkItem.defaultProps = {
    textstyle: [],
    viewstyle: [],
};

export default IconTextAutoLinkItem;