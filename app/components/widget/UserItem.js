import React, {
    Component,
} from 'react'
import {
    View, Text, Image, TouchableOpacity
} from 'react-native';
import PropTypes from 'prop-types';
import styles from '../../style'
import * as Constant from '../../style/constant'
import {Actions} from 'react-native-router-flux';
import UserImage from './UserImage'

/**
 * 用户列表Item
 */
class UserItem extends Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
    }

    componentWillUnmount() {

    }

    render() {
        let {location, actionUser, actionUserPic} = this.props;
        let bottomDes = (this.props.des) ?
            <Text style={[styles.subSmallText,
                {marginTop: Constant.normalMarginEdge,}]}
                  numberOfLines={Constant.normalNumberOfLine}>
                {this.props.des}
            </Text> : <View/>;
        return (
            <TouchableOpacity
                style={[{
                    marginVertical: Constant.normalMarginEdge / 2,
                    marginLeft: Constant.normalMarginEdge,
                    marginRight: Constant.normalMarginEdge,
                    padding: Constant.normalMarginEdge,
                    borderRadius: 4,
                }, styles.shadowCard]}
                onPress={() => {
                    Actions.PersonPage({currentUser: actionUser})
                }}>
                <View style={[styles.flexDirectionRowNotFlex,]}>
                    <UserImage uri={actionUserPic}
                               loginUser={actionUser}
                               resizeMethod="scale"
                               style={[{
                                   height: Constant.smallIconSize, width: Constant.smallIconSize,
                                   marginTop: 5,
                                   borderRadius: Constant.smallIconSize / 2
                               }]}/>
                    <View style={[styles.flex, styles.centerH, styles.flexDirectionRowNotFlex]}>
                        <Text style={[styles.flex, styles.smallText, {
                            fontWeight: "bold",
                            marginLeft: Constant.normalMarginEdge / 2
                        }]}>
                            {actionUser}
                        </Text>
                        <Text style={[styles.subSmallText,
                            {marginTop: -20}]}>
                            {location}
                        </Text>
                    </View>
                </View>
                {bottomDes}
            </TouchableOpacity>
        )
    }
}

const propTypes = {
    location: PropTypes.string,
    actionUser: PropTypes.string,
    actionUserPic: PropTypes.string,
    des: PropTypes.string,
};

UserItem.propTypes = propTypes;

export default UserItem