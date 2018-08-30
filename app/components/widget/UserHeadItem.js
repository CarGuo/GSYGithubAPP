import React, {Component} from 'react';
import {
    View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, WebView, ActivityIndicator
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
import OrgItemBar from '../widget/OrgItemBar'
import {RepositoryFilter} from '../../utils/filterUtils'
import {graphicHost} from "../../net/address";
import userActions from "../../store/actions/user";

const hintNum = '---';

/**
 * 用户页面头部
 */
class UserHeadItem extends Component {

    constructor(props) {
        super(props);
        this.state = {
            chartWidth: screenWidth,
            chartLoading: true
        };
        this.hint = I18n('userInfoNoting');
        this.getActivity = this.getActivity.bind(this);
        this.getOrgItemBar = this.getOrgItemBar.bind(this);
        this.getBottomItem = this.getBottomItem.bind(this);
    }

    /**
     * 获取用户的组织列表
     */
    getOrgItemBar(dataList) {
        let {
            userDisPlayName,
        } = this.props;
        if (!dataList || dataList.length === 0) {
            return (<View/>)
        }
        return (
            <OrgItemBar
                ownerName={userDisPlayName}
                dataList={dataList}/>
        )
    }

    /**
     * 获取用户的提交统计动态
     */
    getActivity(isOrganizations, userDisPlayName) {
        let loadingChart = (this.state.chartLoading === true) ? <View style={[{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center'
        }, styles.absoluteFull]}>
            <ActivityIndicator
                color={Constant.primaryColor}
                animating={true}
                style={{height: 50}}
                size="large"/>
            <Text style={{fontSize: 15, color: 'black'}}>
                {I18n('loading')}
            </Text>
        </View> : <View/>;

        let errorChart = (this.state.chartError === true) ? <View style={[{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center'
        }, styles.absoluteFull]}>
            <TouchableOpacity style={[styles.centered]}
                              onPress={() => {
                                  this.setState({
                                      chartError: false,
                                      chartLoading: true
                                  });
                                  if (this.refs.activity) {
                                      this.refs.activity.reload();
                                  }
                              }}>
                <Image source={require("../../img/logo.png")}
                       resizeMode={"contain"}
                       style={{width: 30, height: 30}}/>
                <Text style={[styles.smallText]}>
                    {I18n("reloadClick")}
                </Text>
            </TouchableOpacity>
        </View> : <View/>;

        let item = !isOrganizations ? <View
            style={[styles.shadowCard, styles.centered, {
                height: 130,
                width: screenWidth - 2 * Constant.normalMarginEdge,
                marginHorizontal: Constant.normalMarginEdge,
                marginTop: Constant.normalMarginEdge,
                marginBottom: Constant.normalMarginEdge / 2,
                paddingHorizontal: Constant.normalMarginEdge,
                paddingTop: Constant.normalMarginEdge,
                borderRadius: 4,
            }]}>
            <ScrollView
                horizontal={true}
                style={[{
                    height: 130,
                    width: screenWidth - 4 * Constant.normalMarginEdge
                }]}>
                <WebView
                    ref={"activity"}
                    //source={{html: generateImageHtml(userDisPlayName, Constant.primaryColor.replace("#", ""))}}
                    source={{uri: graphicHost + "/" + Constant.primaryColor.replace("#", "") + "/" + userDisPlayName}}
                    javaScriptEnabled={true}
                    dataDetectorTypes={'none'}
                    domStorageEnabled={true}
                    scalesPageToFit={true}
                    onLoadEnd={() => {
                        this.setState({
                            chartLoading: false
                        })
                    }}
                    onError={() => {
                        this.setState({
                            chartError: true
                        });
                    }}
                    renderError={() => {
                        return (<View/>)
                    }}
                    scrollEnabled={false}
                    automaticallyAdjustContentInsets={true}
                    mixedContentMode={'always'}
                    style={[styles.centered, {
                        width: screenWidth * 2,
                        height: 130,
                    }]}>
                </WebView>
            </ScrollView>
            {loadingChart}
            {errorChart}
        </View> : <View/>;
        return (item);
    }

    /**
     * 底部item
     */
    getBottomItem() {
        let {
            userDisPlayName,
            follower, followed, repos, star, beStared,
            beStaredList
        } = this.props;
        return ( <View style={[styles.flexDirectionRowNotFlex,
            {borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: Constant.primaryLightColor},
            {borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: Constant.primaryLightColor},
        ]}>
            <NameValueItem
                itemStyle={[styles.flex, styles.centered,]}
                itemName={I18n("repositoryText")}
                itemValue={repos ? repos : hintNum}
                onItemPress={() => {
                    Actions.ListPage({
                        dataType: 'user_repos',
                        showType: 'repository',
                        currentUser: userDisPlayName,
                        title: userDisPlayName + " - " + I18n('repositoryText'),
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
                    {
                        borderLeftWidth: StyleSheet.hairlineWidth,
                        borderLeftColor: Constant.primaryLightColor
                    },
                    {
                        borderRightWidth: StyleSheet.hairlineWidth,
                        borderRightColor: Constant.primaryLightColor
                    },
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
                    {
                        borderLeftWidth: StyleSheet.hairlineWidth,
                        borderLeftColor: Constant.primaryLightColor
                    },]}
                itemName={I18n("staredText")}
                itemValue={star ? star : hintNum}
                onItemPress={() => {
                    Actions.ListPage({
                        dataType: 'user_star',
                        showType: 'repository',
                        currentUser: userDisPlayName,
                        title: userDisPlayName + " - " + I18n('repositoryText'),
                        needRightBtn: true,
                        rightBtn: 'filter',
                        filterSelect: RepositoryFilter()[1].itemValue,
                        rightBtnPress: () => {
                            Actions.OptionModal({dataList: RepositoryFilter()});
                        }
                    })
                }}/>
            <NameValueItem
                itemStyle={[styles.flex, styles.centered,
                    {
                        borderLeftWidth: StyleSheet.hairlineWidth,
                        borderLeftColor: Constant.primaryLightColor
                    },]}
                itemName={I18n("beStaredText")}
                itemValue={beStared ? beStared : hintNum}
                onItemPress={() => {
                    if (!beStaredList || beStaredList.length === 0) {
                        return
                    }
                    Actions.ListPage({
                        dataType: 'user_be_stared',
                        showType: 'repository',
                        localData: beStaredList,
                        currentUser: userDisPlayName,
                        title: userDisPlayName + I18n('beStared100Title'),
                    })
                }}/>
        </View>)
    }

    render() {
        let halfEdge = Constant.normalMarginEdge / 2;
        let {
            link, userPic, userName, userDisPlayName, des, location, groupName,
            setting, unRead, settingNeed, needFollow, hadFollowed,
            doFollowLogic, isOrganizations, userType, orgsList
        } = this.props;

        let followView = (needFollow && !isOrganizations) ? <TouchableOpacity
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


        let Organizations = this.getActivity(isOrganizations, userDisPlayName);

        let menuTitle = !userType ? "" : (userType === "Organization" ? I18n("Member") : I18n("personDynamic"));

        return (
            <View>
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
                                <Text selectable={true} style={[styles.largeTextWhite, {fontWeight: "bold",},
                                    {marginRight: setting ? Constant.normalMarginEdge / 2 : 150}]}>
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
                                                userActions.setAllNotificationAsRead().then((res) => {
                                                    Actions.pop();
                                                    setTimeout(() => {
                                                        if (res && res.result) {
                                                            Actions.pop();
                                                        }
                                                    }, 500);
                                                })
                                            }
                                        });
                                    }}>
                                    <IconF name={'bell'} size={setting ? 15 : 1}
                                           color={unRead ? Constant.actionBlue : Constant.miWhite}/>
                                </TouchableOpacity>
                            </View>
                            <Text selectable={true}
                                  style={[styles.subLightSmallText]}>{(userName) ? userName : hintNum}</Text>
                            <IconTextItem
                                text={(groupName) ? groupName : this.hint} icon={'group'}
                                viewstyle={[{marginTop: halfEdge}]}
                                textstyle={[{marginLeft: halfEdge}, styles.smallTextWhite,]}/>
                            <IconTextItem
                                text={(location) ? location : this.hint} icon={'map-marker'}
                                viewstyle={[{marginTop: halfEdge, marginLeft: 3, marginRight: 3}]}
                                textstyle={[{marginLeft: halfEdge}, styles.smallTextWhite,]}/>
                        </View>
                    </View>
                    <IconTextAutoLinkItem text={(link) ? link : this.hint} icon={'link'}
                                          textstyle={[{marginLeft: Constant.normalMarginEdge},
                                              {fontSize: Constant.smallTextSize},]}
                                          viewstyle={[{marginTop: halfEdge}]}/>
                    {this.getOrgItemBar(orgsList)}
                    <IconTextItem text={(des) ? des : this.hint}
                                  textstyle={[{marginVertical: Constant.normalMarginEdge},
                                      styles.subLightSmallText,]}/>
                    {this.getBottomItem()}
                </View>
                <View style={styles.flex}>
                    <Text style={[styles.normalText, {
                        fontWeight: "bold", marginTop: Constant.normalMarginEdge,
                        marginLeft: Constant.normalMarginEdge,
                    }]}>
                        {menuTitle}
                    </Text>
                </View>
                {Organizations}
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
    isOrganizations: PropTypes.bool,
};


UserHeadItem.defaultProps = {
    userDisPlayName: ' ',
    userName: ' ',
    star: hintNum,
    follower: hintNum,
    followed: hintNum,
    repos: hintNum,
    setting: false,
    isOrganizations: true
};


export default UserHeadItem;