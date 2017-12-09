/**
 * Created by guoshuyu on 2017/11/10.
 */

import React, {Component} from 'react';
import {
    View, Text, StatusBar, ScrollView
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import styles from "../style"
import I18n from '../style/i18n'
import CommonRowItem from "./widget/CommonRowItem";
import * as Constant from "../style/constant";


/**
 * 关于
 */
class AboutPage extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
    }

    componentWillUnmount() {

    }

    render() {
        return (
            <View style={styles.mainBox}>
                <StatusBar hidden={false} backgroundColor={'transparent'} translucent barStyle={'light-content'}/>
                <ScrollView style={styles.flex}>
                    <CommonRowItem
                        showIconNext={true}
                        topLine={false}
                        bottomLine={false}
                        itemIcon={"octoface"}
                        textStyle={[styles.centered, styles.normalText, {
                            textAlignVertical: 'center',
                            marginHorizontal: Constant.normalMarginEdge
                        }]}
                        iconSize={20}
                        viewStyle={[{
                            borderRadius: 4, marginTop: Constant.normalMarginEdge,
                            paddingLeft: Constant.normalMarginEdge
                        }, styles.shadowCard]}
                        itemText={I18n('about')}
                        onClickFun={() => {
                            Actions.AboutPage();
                        }}/>
                    <CommonRowItem
                        showIconNext={true}
                        topLine={false}
                        bottomLine={false}
                        itemIcon={"octoface"}
                        textStyle={[styles.centered, styles.normalText, {
                            textAlignVertical: 'center',
                            marginHorizontal: Constant.normalMarginEdge
                        }]}
                        iconSize={20}
                        viewStyle={[{
                            borderRadius: 4, marginTop: Constant.normalMarginEdge,
                            paddingLeft: Constant.normalMarginEdge
                        }, styles.shadowCard]}
                        itemText={I18n('about')}
                        onClickFun={() => {
                            Actions.AboutPage();
                        }}/>
                    <CommonRowItem
                        showIconNext={true}
                        topLine={false}
                        bottomLine={false}
                        itemIcon={"octoface"}
                        textStyle={[styles.centered, styles.normalText, {
                            textAlignVertical: 'center',
                            marginHorizontal: Constant.normalMarginEdge
                        }]}
                        iconSize={20}
                        viewStyle={[{
                            borderRadius: 4, marginTop: Constant.normalMarginEdge,
                            paddingLeft: Constant.normalMarginEdge
                        }, styles.shadowCard]}
                        itemText={I18n('about')}
                        onClickFun={() => {
                            Actions.AboutPage();
                        }}/>
                    <CommonRowItem
                        showIconNext={true}
                        topLine={false}
                        bottomLine={false}
                        itemIcon={"octoface"}
                        textStyle={[styles.centered, styles.normalText, {
                            textAlignVertical: 'center',
                            marginHorizontal: Constant.normalMarginEdge
                        }]}
                        iconSize={20}
                        viewStyle={[{
                            borderRadius: 4, marginTop: Constant.normalMarginEdge,
                            paddingLeft: Constant.normalMarginEdge
                        }, styles.shadowCard]}
                        itemText={I18n('about')}
                        onClickFun={() => {
                            Actions.AboutPage();
                        }}/>
                    <CommonRowItem
                        showIconNext={true}
                        topLine={false}
                        bottomLine={false}
                        itemIcon={"octoface"}
                        textStyle={[styles.centered, styles.normalText, {
                            textAlignVertical: 'center',
                            marginHorizontal: Constant.normalMarginEdge
                        }]}
                        iconSize={20}
                        viewStyle={[{
                            borderRadius: 4, marginTop: Constant.normalMarginEdge,
                            paddingLeft: Constant.normalMarginEdge
                        }, styles.shadowCard]}
                        itemText={I18n('about')}
                        onClickFun={() => {
                            Actions.AboutPage();
                        }}/>

                </ScrollView>
            </View>
        )
    }
}

export default AboutPage
