import React, {
    Component,
} from 'react'
import {
    View, Text, Image, TouchableWithoutFeedback
} from 'react-native';
import PropTypes from 'prop-types';
import userActions from '../../store/actions/user'


export default class UserImage extends Component {

    render() {
        return (
            <TouchableWithoutFeedback onPress={() => {
                alert(this.props.userName)
                userActions.getOtherUserInfo(this.props.userName).then((res) => {
                    console.log(res);
                })
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