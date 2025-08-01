import React from 'react';
import PropTypes from 'prop-types';
import {DeviceEventEmitter, Text, View} from 'react-native';
import {ViewPropTypes} from 'deprecated-react-native-prop-types';
import {Router, Actions, Scene} from '../../navigation/Actions';
import styles, {statusHeight, drawerWidth} from "../../style"
import * as Constant from '../../style/constant'
import {SortType, SearchFilterType, SearchLanguageType} from '../../utils/filterUtils'
import SelectList from './SearchFilterSelectList'

class SearchDrawerFilter extends React.Component {
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
                    selectIndex={{'filerType': 0, 'filterSort': 0, "filterLanguage": 0}}
                    selectMap={[
                        {title: 'filerType', data: SearchFilterType},
                        {title: 'filterSort', data: SortType},
                        {title: 'filterLanguage', data: SearchLanguageType},
                    ]}
                    onSelect={(selection, data) => {
                        switch (selection) {
                            case "filerType":
                                Actions.pop({refresh: {selectTypeData: data}});
                                DeviceEventEmitter.emit("SearchPage", {selectTypeData: data})
                                break;
                            case "filterLanguage":
                                Actions.pop({refresh: {selectLanguageData: data}});
                                DeviceEventEmitter.emit("SearchPage", {selectLanguageData: data})
                                break;
                            case "filterSort":
                                Actions.pop({refresh: {selectSortData: data}});
                                DeviceEventEmitter.emit("SearchPage", {selectSortData: data})
                                break;
                        }

                    }}
                />
            </View>
        );
    }
}

export default SearchDrawerFilter;
