import React, {Component} from 'react';
import {
    View, Text
} from 'react-native';
import PropTypes from 'prop-types';
import styles from "../../style"
import * as Constant from '../../style/constant'
import Icon from 'react-native-vector-icons/FontAwesome'

class IconTextItem extends Component {
    componentDidMount() {
    }

    componentWillUnmount() {

    }

    render() {
        let smallIconTextStyle = [styles.flexDirectionRowNotFlex, styles.centerH];
        let halfEdge = (this.props.icon) ? Constant.normalMarginEdge / 2 : 0;
        let iconView = (this.props.icon) ?
            <Icon name={this.props.icon} size={this.props.iconSize} color={this.props.iconColor}/>
            : <View/>;
        return (
            <View
                style={[...smallIconTextStyle, ...this.props.viewstyle]}>
                {iconView}
                <Text style={[{marginLeft: halfEdge},
                    ...this.props.textstyle,]}
                      selectable={true}>
                    {this.props.text}
                </Text>
            </View>
        )
    }
}


IconTextItem.propTypes = {
    text: PropTypes.string,
    icon: PropTypes.string,
    iconColor: PropTypes.string,
    iconSize: PropTypes.number,
    textstyle: PropTypes.any,
    viewstyle: PropTypes.any,
};


IconTextItem.defaultProps = {
    textstyle: [],
    viewstyle: [],
    iconColor: Constant.miWhite,
    iconSize: Constant.littleIconSize,
};

export default IconTextItem;