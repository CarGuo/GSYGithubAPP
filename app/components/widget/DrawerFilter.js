import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, Text, View, ViewPropTypes, TouchableOpacity, StatusBar} from 'react-native';
import {Router, Actions, Scene} from 'react-native-router-flux';
import styles, {statusHeight, drawerWidth} from "../../style"
import I18n from '../../style/i18n'
import * as Constant from '../../style/constant'
import Icon from 'react-native-vector-icons/Ionicons'

class DrawerFilter extends React.Component {
    static propTypes = {
        name: PropTypes.string,
        sceneStyle: ViewPropTypes.style,
        title: PropTypes.string,
    }

    static contextTypes = {
        drawer: PropTypes.object,
    }

    render() {
        return (
            <View style={[styles.flex, styles.centerH, {
                backgroundColor: 'transparent',
            }]}>
                <View style={{backgroundColor: "#F0000000", height: statusHeight, width: drawerWidth}}>
                    <View style={{backgroundColor: Constant.primaryDarkColor, height: statusHeight, width: drawerWidth}}/>
                </View>
                <Text>Drawer Content</Text>
                <TouchableOpacity onPress={() => Actions.closeDrawer}>
                    <Text>Back</Text>
                </TouchableOpacity>
                <Text>Title: {this.props.title}</Text>
                {this.props.name === 'tab1_1' &&
                <Text onPress={Actions.tab_1_2}>next screen for tab1_1</Text>
                }
                {this.props.name === 'tab2_1' &&
                <Text onPress={Actions.tab_2_2}>next screen for tab2_1</Text>
                }
                <Text onPress={Actions.pop}>Back</Text>
                <Text onPress={Actions.tab_1}>Switch to tab1</Text>
                <Text onPress={Actions.tab_2}>Switch to tab2</Text>
                <Text onPress={Actions.tab_3}>Switch to tab3</Text>
                <Text onPress={Actions.tab_4}>Switch to tab4</Text>
                <Text onPress={() => {
                    Actions.tab_5({data: 'test!'});
                }}>Switch to tab5 with data</Text>
                <Text onPress={Actions.echo}>Push Clone Scene (EchoView)</Text>
            </View>
        );
    }
}

export default DrawerFilter;