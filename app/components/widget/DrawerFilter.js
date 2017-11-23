import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, Text, View, ViewPropTypes, TouchableOpacity, StatusBar} from 'react-native';
import {Router, Actions, Scene} from 'react-native-router-flux';
import styles, {statusHeight, drawerWidth} from "../../style"
import I18n from '../../style/i18n'
import * as Constant from '../../style/constant'
import {SortType, SearchFilterType} from '../../utils/FilterUtils'
import SelectList from './SelectList'
import Icon from 'react-native-vector-icons/Ionicons'

class DrawerFilter extends React.Component {
    static propTypes = {
        name: PropTypes.string,
        sceneStyle: ViewPropTypes.style,
        title: PropTypes.string,
    };

    static contextTypes = {
        drawer: PropTypes.object,
    };

    render() {
        return (
            <View style={[styles.flex, {
                backgroundColor: 'transparent',
            }]}>
                <View style={{backgroundColor: "#F0000000", height: statusHeight, width: drawerWidth}}>
                    <View
                        style={{backgroundColor: Constant.primaryDarkColor, height: statusHeight, width: drawerWidth}}/>
                </View>
                <SelectList
                    listStyle={{flex: 1, backgroundColor: Constant.white, marginTop: Constant.normalMarginEdge * 2}}
                    selectIndex={{'filerType': 0, 'filterSort': 0}}
                    selectMap={{
                        'filerType': SearchFilterType,
                        'filterSort': SortType,
                    }}
                    onSelect={(data)=>{
                        Actions.pop();
                    }}
                />
            </View>
        );
    }
}

export default DrawerFilter;