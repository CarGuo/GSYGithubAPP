import React, {Component} from 'react';
import {
    View, Text, Image, StyleSheet, TouchableOpacity
} from 'react-native';
import styles, {screenWidth} from "../../style"
import PropTypes from 'prop-types';
import * as Constant from '../../style/constant'
import IconTextItem from './IconTextItem'
import IconTextAutoLinkItem from './IconTextAutoLinkItem'
import Icon from 'react-native-vector-icons/Ionicons'
import IconF from 'react-native-vector-icons/FontAwesome'
import {Actions} from "react-native-router-flux";
import I18n from '../../style/i18n'
import NameValueItem from '../common/CommonNameValueItem'
import {RepositoryFilter} from '../../utils/filterUtils'
import repositoryActions from "../../store/actions/repository";
import userActions from "../../store/actions/user";

const hintNum = '---';

class UserHeadItem extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        let halfEdge = Constant.normalMarginEdge / 2;
        let hint = I18n('userInfoNoting');
        let {
            link, userPic, userName, userDisPlayName, des, location, groupName,
            follower, followed, repos, star, setting, unRead, settingNeed, needFollow, hadFollowed,
            doFollowLogic
        } = this.props;
        let followView = needFollow ? <TouchableOpacity
            style={[styles.flexDirectionRowNotFlex, {
                marginTop: Constant.normalMarginEdge,
                borderColor: Constant.miWhite,
                borderWidth: 1,
                borderRadius: 4,
                paddingHorizontal: Constant.normalMarginEdge,
                paddingVertical: Constant.normalMarginEdge / 2,
            }]}
            onPress={() => {
                doFollowLogic && doFollowLogic()
            }}>
            <Text
                style={styles.smallTextWhite}>{hadFollowed ? I18n("unFollowed") : I18n("doFollowed")}</Text>
        </TouchableOpacity> : <View/>;
        return (
            <View style={[{
                paddingHorizontal: Constant.normalMarginEdge,
                paddingTop: 2 * Constant.normalMarginEdge,
                backgroundColor: Constant.primaryColor,
                shadowColor: '#000',
                shadowOffset: {
                    width: 1,
                    height: 2
                },
                shadowOpacity: 0.7,
                shadowRadius: 5,
                borderBottomRightRadius: 2,
                borderBottomLeftRadius: 2,
                elevation: 2,
            }]}>
                <View style={[{
                    position: "absolute",
                    left: screenWidth - 100,
                    right: Constant.normalMarginEdge,
                    top: Constant.normalMarginEdge,
                    bottom: 80,
                    zIndex: 12,
                }, styles.alignItemsEnd]}>
                    {followView}
                </View>
                <View style={[styles.flexDirectionRowNotFlex]}>
                    <View style={[{
                        height: Constant.largeIconSize, width: Constant.largeIconSize,
                    }]}>
                        <TouchableOpacity
                            onPress={() => {
                                if (settingNeed) {
                                    Actions.SettingPage();
                                } else {
                                    Actions.PhotoPage({uri: userPic});
                                }
                            }}>
                            <Image source={{uri: userPic}}
                                   resizeMethod="scale"
                                   style={[styles.centerH, {
                                       height: Constant.largeIconSize, width: Constant.largeIconSize,
                                       borderRadius: Constant.largeIconSize / 2,
                                       marginTop: 5
                                   }]}/>
                        </TouchableOpacity>
                    </View>
                    <View style={{marginLeft: Constant.normalMarginEdge}}>
                        <View style={[styles.centerH, styles.flexDirectionRowNotFlex]}>
                            <Text style={[styles.largeTextWhite, {fontWeight: "bold",}]}>
                                {(userDisPlayName) ? userDisPlayName : hintNum}
                            </Text>
                            <TouchableOpacity
                                style={[styles.flexDirectionRowNotFlex, {
                                    marginLeft: Constant.normalMarginEdge / 2,
                                    padding: Constant.normalMarginEdge
                                }]}
                                onPress={() => {
                                    Actions.NotifyPage({
                                        backNotifyCall: this.props.backNotifyCall,
                                        needRightBtn: true,
                                        rightBtn: 'read',
                                        iconType: 3,
                                        rightBtnPress: () => {
                                            Actions.LoadingModal({backExit: false});
                                            userActions.setAllNotificationAsRead().then(() => {
                                                setTimeout(() => {
                                                    Actions.pop();
                                                }, 500);
                                                Actions.refresh({type: "allRead"});
                                            })
                                        }
                                    });
                                }}>
                                <IconF name={'bell'} size={setting ? 15 : 1}
                                       color={unRead ? Constant.actionBlue : Constant.miWhite}/>
                            </TouchableOpacity>
                        </View>
                        <Text style={[styles.subLightSmallText,]}>{(userName) ? userName : hintNum}</Text>
                        <IconTextItem
                            text={(groupName) ? groupName : hint} icon={'group'}
                            viewstyle={[{marginTop: halfEdge}]}
                            textstyle={[{marginLeft: halfEdge}, styles.smallTextWhite,]}/>
                        <IconTextItem
                            text={(location) ? location : hint} icon={'map-marker'}
                            viewstyle={[{marginTop: halfEdge, marginLeft: 3, marginRight: 3}]}
                            textstyle={[{marginLeft: halfEdge}, styles.smallTextWhite,]}/>
                    </View>
                </View>
                <IconTextAutoLinkItem text={(link) ? link : hint} icon={'link'}
                                      textstyle={[{marginLeft: Constant.normalMarginEdge},
                                          {fontSize: Constant.smallTextSize},]}
                                      viewstyle={[{marginTop: halfEdge}]}/>
                <IconTextItem text={(des) ? des : hint}
                              textstyle={[{marginVertical: Constant.normalMarginEdge},
                                  styles.subLightSmallText,]}/>

                <View style={[styles.flexDirectionRowNotFlex,
                    {borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: Constant.primaryLightColor},
                    {borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: Constant.primaryLightColor},
                ]}>
                    <NameValueItem
                        itemStyle={[styles.flex, styles.centered,]}
                        itemName={I18n("repositoryText")}
                        itemValue={repos ? repos : hintNum}
                        onItemPress={() => {
                            Actions.ListPage({
                                dataType: 'user_repos', showType: 'repository',
                                currentUser: userDisPlayName, title: userDisPlayName + " - " + I18n('repositoryText'),
                                needRightBtn: true,
                                rightBtn: 'filter',
                                filterSelect: RepositoryFilter()[0].itemValue,
                                rightBtnPress: () => {
                                    Actions.OptionModal({dataList: RepositoryFilter()});
                                }
                            })
                        }}/>
                    <NameValueItem
                        itemStyle={[styles.flex, styles.centered,
                            {borderLeftWidth: StyleSheet.hairlineWidth, borderLeftColor: Constant.primaryLightColor},
                            {borderRightWidth: StyleSheet.hairlineWidth, borderRightColor: Constant.primaryLightColor},
                        ]}
                        itemName={I18n("FollowersText")}
                        itemValue={follower ? follower : hintNum}
                        onItemPress={() => {
                            Actions.ListPage({
                                dataType: 'follower', showType: 'user',
                                currentUser: userDisPlayName, title: userDisPlayName + " - " + I18n('FollowersText')
                            })
                        }}/>
                    <NameValueItem
                        itemStyle={[styles.flex, styles.centered,]}
                        itemName={I18n("FollowedText")}
                        itemValue={followed ? followed : hintNum}
                        onItemPress={() => {
                            Actions.ListPage({
                                dataType: 'followed', showType: 'user',
                                currentUser: userDisPlayName, title: userDisPlayName + " - " + I18n('FollowedText')
                            })
                        }}/>
                    <NameValueItem
                        itemStyle={[styles.flex, styles.centered,
                            {borderLeftWidth: StyleSheet.hairlineWidth, borderLeftColor: Constant.primaryLightColor},]}
                        itemName={I18n("staredText")}
                        itemValue={star ? star : hintNum}
                        onItemPress={() => {
                            Actions.ListPage({
                                dataType: 'user_star', showType: 'repository',
                                currentUser: userDisPlayName, title: userDisPlayName + " - " + I18n('repositoryText'),
                                needRightBtn: true,
                                rightBtn: 'filter',
                                filterSelect: RepositoryFilter()[0].itemValue,
                                rightBtnPress: () => {
                                    Actions.OptionModal({dataList: RepositoryFilter()});
                                }
                            })
                        }}/>
                </View>
            </View>
        )
    }
}


UserHeadItem.propTypes = {
    userDisPlayName: PropTypes.string,
    userName: PropTypes.string,
    userPic: PropTypes.string,
    groupName: PropTypes.string,
    location: PropTypes.string,
    link: PropTypes.string,
    des: PropTypes.string,
    star: PropTypes.string,
    follower: PropTypes.string,
    followed: PropTypes.string,
    repos: PropTypes.string,
    setting: PropTypes.bool,
};


UserHeadItem.defaultProps = {
    userDisPlayName: ' ',
    userName: ' ',
    star: hintNum,
    follower: hintNum,
    followed: hintNum,
    repos: hintNum,
    setting: false,
};


export default UserHeadItem;