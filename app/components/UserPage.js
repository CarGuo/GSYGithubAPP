/**
 * Created by guoshuyu on 2017/11/10.
 */

import React, {Component} from 'react';
import {
    View, Text, StatusBar, Image
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import styles from "../style"
import * as Constant from '../style/constant'
import loginActions from '../store/actions/login'
import userActions from '../store/actions/user'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import Icon from 'react-native-vector-icons/FontAwesome'
import IconTextItem from './widget/IconTextItem'
import IconTextAutoLinkItem from './widget/IconTextAutoLinkItem'

class UserPage extends Component {
    componentDidMount() {
    }

    componentWillUnmount() {

    }

    render() {
        let {userState} = this.props;
        let smallIconTextStyle = [styles.flexDirectionRowNotFlex, styles.centerH];
        let halfEdge = Constant.normalMarginEdge / 2;
        return (
            <View style={styles.mainBox}>
                <StatusBar hidden={false} backgroundColor={'transparent'} translucent barStyle={'light-content'}/>
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
                    borderRadius: 2,
                    elevation: 2,
                }]}>
                    <View style={[styles.flexDirectionRowNotFlex]}>
                        <Image source={{uri: 'https://avatars0.githubusercontent.com/u/27534854?s=64&v=4'}}
                               resizeMethod="scale"
                               style={[styles.centerH, {
                                   height: Constant.largeIconSize, width: Constant.largeIconSize,
                                   borderRadius: Constant.largeIconSize / 2,
                                   marginTop: 5
                               }]}/>
                        <View style={{marginLeft: Constant.normalMarginEdge}}>
                            <Text style={[styles.largeTextWhite, {fontWeight: "bold",}]}>
                                {"CarGuo"}
                            </Text>
                            <Text style={[styles.subLightSmallText,]}>{"Shuyu Guo"}</Text>
                            <IconTextItem
                                text={'远光软件'} icon={'map-marker'}
                                textstyle={[{marginLeft: halfEdge}, styles.smallTextWhite,]}/>
                            <IconTextItem
                                text={'China'} icon={'group'}
                                textstyle={[{marginLeft: halfEdge}, styles.smallTextWhite,]}/>
                        </View>
                    </View>
                    <IconTextAutoLinkItem text={'https://www.github.com https://www.github.com'} icon={'link'}
                                          textstyle={[{marginLeft: Constant.normalMarginEdge},
                                              {fontSize: Constant.smallTextSize},]}
                                          viewstyle={[{marginTop: halfEdge}]}/>
                    <IconTextItem text={'描述！！！！'}
                                  textstyle={[{marginVertical: Constant.normalMarginEdge},
                                      styles.subLightSmallText,]}/>
                </View>
            </View>
        )
    }
}

export default connect(state => ({
    userState: state.user,
}), dispatch => ({
    loginAction: bindActionCreators(loginActions, dispatch),
    userAction: bindActionCreators(userActions, dispatch)
}))(UserPage)