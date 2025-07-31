/**
 * Created by guoshuyu on 2017/11/10.
 */

import React, {Component, PureComponent} from 'react';
import {
    View, InteractionManager, StatusBar, Dimensions, StyleSheet, DeviceEventEmitter,
} from 'react-native';
import {Actions, Tabs} from '../navigation/Actions';
import styles from "../style"
import * as Constant from "../style/constant"
import I18n from '../style/i18n'
import userActions from '../store/actions/user'
import ListPage from "./ListPage";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { NavigationContainer } from '@react-navigation/native';
import {launchUrl} from "../utils/htmlUtils";

const Tab = createMaterialTopTabNavigator();

/**
 * 通知页面
 */
class NotifyPage extends Component {

    constructor(props) {
        super(props);
        this.page = 2;
        this._refresh = this._refresh.bind(this);
        this._asRead = this._asRead.bind(this);
        this.index = 0;
    }

    componentDidMount() {
        this.subscription = DeviceEventEmitter.addListener(
            `NotifyPage`,
            (params) => {
                if (params && params.type === "allRead") {
                    params.type = "";
                    this._refresh();
                }
            });
    }

    componentWillUnmount() {
        this.subscription.remove();
        this.props.route.params.backNotifyCall && this.props.route.params.backNotifyCall()
    }

    _refresh() {
        if (this.unReadList)
            this.unReadList._refresh();
        if (this.partList)
            this.partList._refresh();
        if (this.allList)
            this.allList._refresh();
    }

    _handleIndexChange = index => this.setState({index});


    _asRead(id) {
        userActions.setNotificationAsRead(id).then(() => {
            this._refresh();
        })
    }


    render() {
        return (
            <View style={styles.mainBox}>
                <StatusBar hidden={false} backgroundColor={'transparent'} translucent barStyle={'light-content'}/>
                <Tab.Navigator
                    screenOptions={{
                        tabBarActiveTintColor: Constant.white,
                        tabBarInactiveTintColor: Constant.subTextColor,
                        tabBarStyle: {
                            backgroundColor: Constant.primaryColor,
                            paddingTop: 5,
                        },
                        tabBarLabelStyle: {
                            fontSize: 16,
                        },
                        tabBarIndicatorStyle: {
                            backgroundColor: Constant.white,
                            height: 3,
                        },
                    }}
                    screenListeners={{
                        tabPress: (e) => {
                            // Handle tab change if needed
                        },
                    }}
                >
                    <Tab.Screen 
                        name="Unread" 
                        children={() => (
                            <ListPage
                                ref={(ref) => {
                                    this.unReadList = ref;
                                }}
                                dataType={'notify'}
                                showType={'notify'}
                                onItemClickEx={this._asRead}
                                currentUser={this.props.route.params.ownerName}
                                currentRepository={this.props.route.params.repositoryName}
                            />
                        )}
                        options={{ tabBarLabel: I18n('notifyUnread') }}
                    />
                    <Tab.Screen 
                        name="Participating" 
                        children={() => (
                            <ListPage
                                ref={(ref) => {
                                    this.partList = ref;
                                }}
                                dataType={'notify'}
                                showType={'notify'}
                                onItemClickEx={this._asRead}
                                currentUser={this.props.route.params.ownerName}
                                currentRepository={this.props.route.params.repositoryName}
                            />
                        )}
                        options={{ tabBarLabel: I18n('notifyParticipating') }}
                    />
                    <Tab.Screen 
                        name="All" 
                        children={() => (
                            <ListPage
                                ref={(ref) => {
                                    this.allList = ref;
                                }}
                                dataType={'notify'}
                                showType={'notify'}
                                onItemClickEx={this._asRead}
                                all={true}
                                currentUser={this.props.route.params.ownerName}
                                currentRepository={this.props.route.params.repositoryName}
                            />
                        )}
                        options={{ tabBarLabel: I18n('notifyAll') }}
                    />
                </Tab.Navigator>
            </View>
        )
    }
}

NotifyPage.defaultProps = {};


export default NotifyPage
