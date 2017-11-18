import React, {Component} from 'react';
import {
    View, Text, Image
} from 'react-native';
import styles from "../../style"
import PropTypes from 'prop-types';
import * as Constant from '../../style/constant'
import IconTextItem from './IconTextItem'
import IconTextAutoLinkItem from './IconTextAutoLinkItem'
import I18n from '../../style/i18n'

class UserHeadItem extends Component {


    render() {
        let smallIconTextStyle = [styles.flexDirectionRowNotFlex, styles.centerH];
        let halfEdge = Constant.normalMarginEdge / 2;
        let hint = I18n('userInfoNoting');
        let {link, userPic, userName, userDisPlayName, des, location, groupName} = this.props;
        return (
            <View style={[{
                paddingHorizontal: Constant.normalMarginEdge,
                paddingTop: 3 * Constant.normalMarginEdge,
                backgroundColor: Constant.primaryColor,
                shadowColor: '#FFF',
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
                    <Image source={{uri: this.props.userPic}}
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
                            textstyle={[{marginLeft: halfEdge}, styles.smallTextWhite,]}/>
                        <IconTextItem
                            text={(location) ? location : hint} icon={'group'}
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
};


UserHeadItem.defaultProps = {};


export default UserHeadItem;