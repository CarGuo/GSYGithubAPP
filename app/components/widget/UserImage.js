import React, {
    Component,
} from 'react'
import {
    View, Text, Image, TouchableWithoutFeedback
} from 'react-native';
import PropTypes from 'prop-types';
import {Actions} from 'react-native-router-flux';
import userActions from '../../store/actions/user'


export default class UserImage extends Component {

    render() {
        return (
            <TouchableWithoutFeedback onPress={() => {
                Actions.PersonPage({userName: this.props.userName})
            }}>
                <Image source={{uri: this.props.uri}}
                       resizeMethod="scale"
                       style={[...this.props.style]}/>
            </TouchableWithoutFeedback>
        )
    }
}

UserImage.propTypes = {
    userName: PropTypes.string,
    uri: PropTypes.string,
};