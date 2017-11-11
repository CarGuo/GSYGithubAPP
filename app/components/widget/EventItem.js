/**
 * Created by guoshuyu on 2017/11/11.
 */
import React, {
    Component,
} from 'react'
import {
    View, Text, Image
} from 'react-native';
import PropTypes from 'prop-types';
import styles from '../../style'
import * as Constant from '../../style/constant'
import {Actions} from 'react-native-router-flux';
import I18n from '../../style/i18n'
import loginActions from '../../store/actions/login'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import TimeText from './TimeText'

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
        return (
            <View style={[styles.flexDirectionRow, {height: 50}]}>
                <Image source={{uri: actionUserPic}}
                       resizeMethod="scale"
                       style={[{height: Constant.smallIconSize, width: Constant.smallIconSize,
                       marginLeft: Constant.normalMarginEdge,
                       marginRight: Constant.normalMarginEdge,
                       marginTop: 5,
                       }]}/>

                <View style={[styles.flexDirectionColumn,{height: 50}]}>
                    <View style={[styles.flexDirectionRowNotFlex]}>
                        <Text style={[styles.smallText, {fontWeight: "bold"}]}>{actionUser}</Text>
                        <Text
                            style={[styles.subSmallText, {marginLeft: Constant.normalMarginEdge, marginRight:Constant.normalMarginEdge,}]}>
                            {actionMode}
                        </Text>
                        <Text style={[styles.smallText, {fontWeight: "bold"}]}>{actionTarget}</Text>
                    </View>
                    <TimeText style={[styles.subSmallText]} time={actionTime}/>

                </View>
            </View>
        )
    }
}

const propTypes = {
    actionTime: PropTypes.number,
    actionUser: PropTypes.string,
    actionUserPic: PropTypes.string,
    actionMode: PropTypes.string,
    actionTarget: PropTypes.string,
};

EventItem.propTypes = propTypes;

export default connect(state => ({
    state
}), dispatch => ({
    actions: bindActionCreators(loginActions, dispatch)
}))(EventItem)