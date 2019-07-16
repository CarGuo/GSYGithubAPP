/**
 * Created by guoshuyu on 2017/11/11.
 */
import React, {
    Component,
} from 'react'
import {
    View, Text, Image, TouchableOpacity
} from 'react-native';
import PropTypes from 'prop-types';
import styles from '../../style'
import * as Constant from '../../style/constant'
import TimeText from './TimeText'
import HTMLView from '../common/CommonHtmlView';

/**
 * 发布列表Item
 */
class ReleaseItem extends Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
    }

    componentWillUnmount() {

    }

    render() {
        let {actionTime, actionTitle, actionUserPic, actionTargetHtml, actionTarget} = this.props;

        let body = (actionTargetHtml) ? <HTMLView
            style={[{
                marginTop: Constant.normalMarginEdge / 2,
                backgroundColor: Constant.transparentColor
            }]}
            selectable={true}
            numberOfLines={100}
            value={actionTarget}
            textComponentProps={{
                style: styles.subSmallText,
                numberOfLines: 100,
            }}
            stylesheet={{pre: styles.inCode, code: styles.pCode}}
            textComponent={() => {
                return (
                    <Text/>
                )
            }}
        /> : <Text style={[styles.subSmallText,]}>{actionTargetHtml}</Text>;
        return (
            <TouchableOpacity
                style={[{
                    marginVertical: Constant.normalMarginEdge / 2,
                    marginLeft: Constant.normalMarginEdge,
                    marginRight: Constant.normalMarginEdge,
                    padding: Constant.normalMarginEdge,
                    borderRadius: 4,
                }, styles.shadowCard]}
                onLongPress={()=>{
                    this.props.onLongPressItem && this.props.onLongPressItem();
                }}
                onPress={() => {
                    this.props.onPressItem && this.props.onPressItem();
                }}>
                <View style={[styles.flexDirectionRowNotFlex,]}>
                    <View style={[styles.flex, styles.centerH, styles.flexDirectionRowNotFlex]}>
                        <Text style={[styles.flex, styles.smallText, {
                            fontWeight: "bold",
                            marginLeft: Constant.normalMarginEdge / 2
                        }]}>
                            {actionTitle}
                        </Text>
                        <TimeText style={[styles.subSmallText,
                            {marginTop: -20}]}
                                  time={actionTime}/>
                    </View>
                </View>
                {body}
            </TouchableOpacity>
        )
    }
}

const propTypes = {
    actionTime: PropTypes.string,
    actionTitle: PropTypes.string,
    actionMode: PropTypes.string,
    actionTarget: PropTypes.string,
    onPressItem: PropTypes.func,
    onLongPressItem: PropTypes.func,
};

ReleaseItem.propTypes = propTypes;

export default ReleaseItem