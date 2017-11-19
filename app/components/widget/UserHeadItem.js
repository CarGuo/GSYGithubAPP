import React, {Component} from 'react';
import {
    View, Text, Image, StyleSheet
} from 'react-native';
import styles from "../../style"
import PropTypes from 'prop-types';
import * as Constant from '../../style/constant'
import IconTextItem from './IconTextItem'
import IconTextAutoLinkItem from './IconTextAutoLinkItem'
import Icon from 'react-native-vector-icons/FontAwesome'
import I18n from '../../style/i18n'

class UserHeadItem extends Component {


    render() {
        let halfEdge = Constant.normalMarginEdge / 2;
        let bottomTopTextStyle = [styles.subSmallText, {
            marginTop: halfEdge
        },];
        let bottomBottomTextStyle = [styles.subLightSmallText, {marginVertical: halfEdge}];
        let hint = I18n('userInfoNoting');
        let {
            link, userPic, userName, userDisPlayName, des, location, groupName,
            follower, followed, repos, star
        } = this.props;
        return (
            <View style={[{
                paddingHorizontal: Constant.normalMarginEdge,
                paddingTop: 3 * Constant.normalMarginEdge,
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
                <View style={[styles.flexDirectionRowNotFlex]}>
                    <Image source={{uri: userPic}}
                           resizeMethod="scale"
                           style={[styles.centerH, {
                               height: Constant.largeIconSize, width: Constant.largeIconSize,
                               borderRadius: Constant.largeIconSize / 2,
                               marginTop: 5
                           }]}/>
                    <View style={{marginLeft: Constant.normalMarginEdge}}>
                        <Text style={[styles.largeTextWhite, {fontWeight: "bold",}]}>
                            {userDisPlayName}
                        </Text>
                        <Text style={[styles.subLightSmallText,]}>{userName}</Text>
                        <IconTextItem
                            text={(groupName) ? groupName : hint} icon={'map-marker'}
                            viewstyle={[{marginTop: halfEdge}]}
                            textstyle={[{marginLeft: halfEdge}, styles.smallTextWhite,]}/>
                        <IconTextItem
                            text={(location) ? location : hint} icon={'group'}
                            viewstyle={[{marginTop: halfEdge}]}
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
                    <View style={[styles.flex, styles.centered,]}>
                        <Text style={[...bottomTopTextStyle]}>{I18n("repositoryText")}</Text>
                        <Text style={[...bottomBottomTextStyle]}>{repos}</Text>
                    </View>
                    <View style={[styles.flex, styles.centered,
                        {borderLeftWidth: StyleSheet.hairlineWidth, borderLeftColor: Constant.primaryLightColor},
                        {borderRightWidth: StyleSheet.hairlineWidth, borderRightColor: Constant.primaryLightColor},
                    ]}>
                        <Text style={[...bottomTopTextStyle]}>{I18n("FollowersText")}</Text>
                        <Text style={[...bottomBottomTextStyle]}>{follower}</Text>
                    </View>
                    <View style={[styles.flex, styles.centered,]}>
                        <Text style={[...bottomTopTextStyle]}>{I18n("FollowedText")}</Text>
                        <Text style={[...bottomBottomTextStyle]}>{followed}</Text>
                    </View>
                    <View style={[styles.flex, styles.centered,
                        {borderLeftWidth: StyleSheet.hairlineWidth, borderLeftColor: Constant.primaryLightColor},]}>
                        <Text style={[...bottomTopTextStyle]}>{I18n("staredText")}</Text>
                        <Text style={[...bottomBottomTextStyle]}>{star}</Text>
                    </View>
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
};


UserHeadItem.defaultProps = {
    star: '',
    follower: '',
    followed: '',
    repos: '',
};


export default UserHeadItem;