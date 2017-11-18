import React, {Component} from 'react';
import {
    View, Text
} from 'react-native';
import PropTypes from 'prop-types';
import styles from "../../style"
import * as Constant from '../../style/constant'
import Icon from 'react-native-vector-icons/FontAwesome'
import Autolink from 'react-native-autolink';


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
                    style={[{marginLeft: halfEdge},]}
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