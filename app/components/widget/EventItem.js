/**
 * Created by guoshuyu on 2017/11/11.
 */
import React, {
    Component,
} from 'react'
import {
    View, Text, TouchableOpacity
} from 'react-native';
import PropTypes from 'prop-types';
import styles from '../../style'
import * as Constant from '../../style/constant'
import TimeText from './TimeText'
import UserImage from './UserImage'

/**
 * 事件列表Item
 */
class EventItem extends Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
    }

    componentWillUnmount() {

    }

    render() {
        let {actionTime, actionUser, actionUserPic, actionMode, actionTarget} = this.props;
        let bottomDes = (this.props.des) ?
            <Text style={[styles.subSmallText,
                {marginTop: Constant.normalMarginEdge,}]}
                  numberOfLines={Constant.normalNumberOfLine}>
                {this.props.des}
            </Text> : <View/>;
        let pic = (actionUserPic) ? <UserImage uri={actionUserPic}
                                               loginUser={actionUser}
                                               resizeMethod="scale"
                                               style={[{
                                                   height: Constant.smallIconSize, width: Constant.smallIconSize,
                                                   marginTop: 5,
                                                   marginRight: Constant.normalMarginEdge / 2,
                                                   borderRadius: Constant.smallIconSize / 2
                                               }]}/> : <View/>;
        return (
            <TouchableOpacity
                style={[{
                    marginTop: Constant.normalMarginEdge / 2,
                    marginLeft: Constant.normalMarginEdge,
                    marginRight: Constant.normalMarginEdge,
                    marginBottom: Constant.normalMarginEdge / 2,
                    padding: Constant.normalMarginEdge,
                    borderRadius: 4,
                }, styles.shadowCard]}
                onPress={() => {
                    this.props.onPressItem && this.props.onPressItem();
                }}
            >
                <View style={[styles.flexDirectionRowNotFlex,]}>
                    {pic}
                    <View style={[styles.flex, styles.centerH, styles.flexDirectionRowNotFlex]}>
                        <Text style={[styles.flex, styles.smallText, {
                            fontWeight: "bold",
                        }]}>
                            {actionUser}
                        </Text>
                        <TimeText style={[styles.subSmallText,
                            {marginTop: -20}]}
                                  time={actionTime}/>
                    </View>
                </View>
                <View style={[styles.flexDirectionRowNotFlex, {marginTop: Constant.normalMarginEdge}]}>
                    <Text style={[styles.smallText, {fontWeight: "bold"}]}>{actionTarget}</Text>
                </View>
                {bottomDes}
            </TouchableOpacity>
        )
    }
}

const propTypes = {
    actionTime: PropTypes.string,
    actionUser: PropTypes.string,
    actionUserPic: PropTypes.string,
    actionMode: PropTypes.string,
    actionTarget: PropTypes.string,
    des: PropTypes.string,
    onPressItem: PropTypes.func,
};

EventItem.propTypes = propTypes;

export default EventItem