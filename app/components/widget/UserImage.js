import React, {
    Component,
} from 'react'
import {
    View, Text, Image, TouchableWithoutFeedback
} from 'react-native';
import PropTypes from 'prop-types';
import {Actions} from 'react-native-router-flux';

/**
 * 用户头像
 */
export default class UserImage extends Component {

    render() {
        return (
            <TouchableWithoutFeedback onPress={() => {
                Actions.PersonPage({currentUser: this.props.loginUser})
            }}>
                <Image source={{uri: this.props.uri}}
                       resizeMethod="scale"
                       style={[...this.props.style]}/>
            </TouchableWithoutFeedback>
        )
    }
}

UserImage.propTypes = {
    loginUser: PropTypes.string,
    uri: PropTypes.string,
};