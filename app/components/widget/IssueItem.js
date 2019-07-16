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
import Icon from 'react-native-vector-icons/FontAwesome'
import IconC from 'react-native-vector-icons/Octicons'
import HTMLView from '../common/CommonHtmlView';

/**
 * Issue列表Item
 */
class IssueItem extends Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
    }

    componentWillUnmount() {

    }

    render() {
        let {actionTime, actionUser, actionUserPic, issueComment, markdownBody, issueCommentHtml} = this.props;
        let bottom = (this.props.issueTag) ? <View style={[styles.flexDirectionRowNotFlex, styles.centerH]}>
            <IconC name={this.props.state === 'open' ? "issue-opened" : "issue-closed"}
                   backgroundColor={Constant.transparentColor}
                   color={this.props.state === 'open' ? "green" : "red"} size={13}>
                <Text style={[styles.subLightSmallText, {color: this.props.state === 'open' ? "green" : "red"}]}>
                    {this.props.state + " "}
                </Text>
            </IconC>
            <Text style={[styles.subLightSmallText, {flex: 1}]}
                  numberOfLines={Constant.normalNumberOfLine}>
                {this.props.issueTag}
            </Text>
            <Icon.Button name="comment"
                         iconStyle={{marginRight: 3}}
                         backgroundColor={Constant.transparentColor}
                         color={Constant.subLightTextColor} size={10}>
                <Text style={[styles.subLightSmallText, {fontSize: Constant.minTextSize}]}>
                    {this.props.commentCount}
                </Text>
            </Icon.Button>
        </View> : <View/>;
        let bottomMargin = (this.props.issueTag) ? 0 : Constant.normalMarginEdge;

        let body = (markdownBody) ? <HTMLView
            style={[{
                marginTop: Constant.normalMarginEdge / 2,
                backgroundColor: Constant.transparentColor
            }]}
            numberOfLines={9999}
            value={issueCommentHtml}
            textComponentProps={{
                style: styles.subSmallText,
                numberOfLines: 9999,
            }}
            selectable={true}
            stylesheet={{pre: styles.inCode, code: styles.pCode}}
            textComponent={() => {
                return (
                    <Text/>
                )
            }}
        /> : <Text selectable={true} style={[styles.subSmallText,]}>{issueComment}</Text>;


        return (
            <TouchableOpacity
                style={[{
                    marginVertical: Constant.normalMarginEdge / 2,
                    marginLeft: Constant.normalMarginEdge,
                    marginRight: Constant.normalMarginEdge,
                    paddingHorizontal: Constant.normalMarginEdge,
                    paddingTop: Constant.normalMarginEdge,
                    borderRadius: 3,
                }, styles.shadowCard]}
                onPress={() => {
                    this.props.onPressItem && this.props.onPressItem();
                }}
                onLongPress={() => {
                    this.props.onLongPressItem && this.props.onLongPressItem();
                }}>
                <View style={[styles.flexDirectionRowNotFlex,]}>
                    <UserImage uri={actionUserPic}
                               loginUser={actionUser}
                               resizeMethod="scale"
                               style={[{
                                   height: Constant.normalIconSize, width: Constant.normalIconSize,
                                   marginTop: 5,
                                   borderRadius: Constant.normalIconSize / 2
                               }]}/>
                    <View style={{
                        flex: 1,
                        marginLeft: Constant.normalMarginEdge,
                        marginBottom: bottomMargin
                    }}>
                        <View style={[styles.flexDirectionRowNotFlex, styles.centerH]}>
                            <Text selectable={true} style={[styles.flex, styles.normalText, {fontWeight: "bold",}]}>
                                {actionUser}
                            </Text>
                            <TimeText style={[styles.subSmallText, {marginTop: -3}]}
                                      time={actionTime}/>
                        </View>
                        <View
                            style={[styles.flexDirectionRowNotFlex, {marginTop: Constant.normalMarginEdge / 2}]}>
                            {body}
                        </View>
                        {bottom}
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
}

const propTypes = {
    actionTime: PropTypes.string,
    actionUser: PropTypes.string,
    actionUserPic: PropTypes.string,
    issueComment: PropTypes.string,
    issueTag: PropTypes.string,
    onPressItem: PropTypes.func,
    onLongPressItem: PropTypes.func,
    commentCount: PropTypes.string,
    markdownBody: PropTypes.bool,
};

IssueItem.propTypes = propTypes;

export default IssueItem