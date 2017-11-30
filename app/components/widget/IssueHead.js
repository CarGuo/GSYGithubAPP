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
import MarkdownView from 'react-native-simple-markdown'


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
        let {actionTime, actionUser, actionUserPic, issueComment, issueDes} = this.props;
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
                                   color={Constant.miWhite} size={14}
                                   style={styles.centerH}>
                                <Text style={[styles.miLightSmallText]}>
                                    {"  " + this.props.state + "  "}
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
                    <MarkdownView
                        style={{
                            backgroundColor: Constant.transparentColor
                        }}>
                        {issueDes ? issueDes : ""}
                    </MarkdownView>
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