/**
 * Created by guoshuyu on 2017/11/11.
 */
import React, {
    Component,
} from 'react'
import {
    View, Text
} from 'react-native';
import PropTypes from 'prop-types';
import styles from '../../style'
import * as Constant from '../../style/constant'
import TimeText from './TimeText'
import UserImage from './UserImage'
import Icon from 'react-native-vector-icons/FontAwesome'
import IconC from 'react-native-vector-icons/Octicons'
import HTMLView from './CommonHtmlView';


/**
 * Issue详情Header
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
        let {actionTime, actionUser, actionUserPic, issueComment, issueDes, issueDesHtml, closed_by} = this.props;
        let stateText = (closed_by) ?
            <View>
                <Text style={[styles.subSmallText, {marginTop: 5}]}>{"Closed by " + closed_by.login}</Text>
            </View> : <View/>;
        return (
            <View
                style={[{
                    marginTop: Constant.normalMarginEdge,
                    marginLeft: Constant.normalMarginEdge,
                    marginRight: Constant.normalMarginEdge,
                    paddingHorizontal: Constant.normalMarginEdge,
                    paddingTop: Constant.normalMarginEdge,
                    borderRadius: 4,
                }, styles.shadowCard, {backgroundColor: Constant.primaryColor}]}
                onPress={() => {
                    this.props.onPressItem && this.props.onPressItem();
                }}>
                <View style={[styles.flexDirectionRowNotFlex,]}>
                    <UserImage uri={actionUserPic}
                               loginUser={actionUser}
                               resizeMethod="scale"
                               style={[{
                                   height: Constant.bigIconSize, width: Constant.bigIconSize,
                                   marginTop: 5,
                                   borderRadius: Constant.bigIconSize / 2
                               }]}/>
                    <View style={{flex: 1, marginLeft: Constant.normalMarginEdge}}>
                        <View style={[styles.flexDirectionRowNotFlex, styles.centerH]}>
                            <Text style={[styles.flex, styles.normalTextWhite, {fontWeight: "bold",}]}>
                                {actionUser}
                            </Text>
                            <TimeText style={[styles.miLightSmallText, {marginTop: -3}]}
                                      time={actionTime}/>
                        </View>
                        <View
                            style={[styles.flexDirectionRowNotFlex, styles.centerH, {marginVertical: Constant.normalMarginEdge / 2}]}>
                            <Text style={[styles.miLightSmallText, {marginRight: Constant.normalMarginEdge / 2}]}
                                  numberOfLines={Constant.normalNumberOfLine}>
                                {this.props.issueTag}
                            </Text>
                            <IconC name={this.props.state === 'open' ? "issue-opened" : "issue-closed"}
                                   backgroundColor={Constant.transparentColor}
                                   color={this.props.state === 'open' ? "green" : "red"} size={13}
                                   style={styles.centerH}>
                                <Text
                                    style={[styles.miLightSmallText, {color: this.props.state === 'open' ? "green" : "red"}]}>
                                    {" " + this.props.state + "  "}
                                </Text>
                            </IconC>
                            <Icon name="comment"
                                  iconStyle={{marginRight: 3}}
                                  backgroundColor={Constant.transparentColor}
                                  color={Constant.miWhite} size={11}
                                  style={styles.centerH}>
                                <Text style={[styles.miLightSmallText, {fontSize: Constant.minTextSize}]}>
                                    {"   " + this.props.commentCount}
                                </Text>
                            </Icon>
                        </View>
                        <View
                            style={[styles.flexDirectionRowNotFlex, {
                                marginBottom: Constant.normalMarginEdge
                            }]}>
                            <Text style={[styles.miLightSmallText,]}>{issueComment}</Text>
                        </View>
                    </View>
                </View>
                <View style={[styles.centerV, {marginBottom: issueDes ? Constant.normalMarginEdge : 0}]}>
                    <HTMLView
                        style={[{
                            marginTop: Constant.normalMarginEdge / 2,
                            backgroundColor: Constant.transparentColor
                        }]}
                        numberOfLines={100}
                        value={issueDesHtml ? issueDesHtml : ""}
                        stylesheet={{pre: styles.inCode, code: styles.pCode}}
                        textComponentProps={{
                            style: styles.miLightSmallText,
                            numberOfLines: 100,
                        }}
                        customRenderer={() => {

                        }}
                        textComponent={() => {
                            return (
                                <Text/>
                            )
                        }}
                    />
                    {stateText}
                </View>

            </View>
        )
    }
}

const propTypes = {
    actionTime: PropTypes.string,
    actionUser: PropTypes.string,
    issueDes: PropTypes.string,
    actionUserPic: PropTypes.string,
    issueComment: PropTypes.string,
    issueTag: PropTypes.string,
    onPressItem: PropTypes.func,
    commentCount: PropTypes.string,
};

IssueItem.propTypes = propTypes;

export default IssueItem