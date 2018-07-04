/**
 * Created by guoshuyu on 2017/11/10.
 */

import React, {Component, PureComponent} from 'react';
import {
    View, InteractionManager, StatusBar, Dimensions, StyleSheet
} from 'react-native';
import {Actions, Tabs} from 'react-native-router-flux';
import styles from "../style"
import * as Constant from "../style/constant"
import I18n from '../style/i18n'
import {TabView, TabBar, SceneMap} from 'react-native-tab-view';
import ListPage from "./ListPage";

/**
 * 仓库发布列表
 */
class ReleasePage extends Component {

    constructor(props) {
        super(props);
        this.page = 2;
        this._refresh = this._refresh.bind(this);
        this.state = {
            index: 0,
            routes: [
                {key: '1', title: I18n('reposRelease')},
                {key: '2', title: I18n('reposTag')},
            ],
        }
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this._refresh();
        });
    }

    componentWillUnmount() {

    }

    _refresh() {

    }

    _handleIndexChange = index => this.setState({index});

    _renderHeader = props =>
        <TabBar {...props}
                style={{backgroundColor: Constant.primaryColor}}
                labelStyle={{color: Constant.white}}
                indicatorStyle={{backgroundColor: Constant.miWhite}}
        />;

    _renderScene = ({route}) => {
        switch (route.key) {
            case '1':
                return (
                    <ListPage
                        dataType={'repo_release'}
                        showType={'release'}
                        currentUser={this.props.ownerName}
                        currentRepository={this.props.repositoryName}
                    />
                );
            case '2':
                return (
                    <ListPage
                        dataType={'repo_tag'}
                        showType={'release'}
                        currentUser={this.props.ownerName}
                        currentRepository={this.props.repositoryName}
                    />
                );
            default:
                return null;
        }
    };


    render() {
        return (
            <View style={styles.mainBox}>
                <StatusBar hidden={false} backgroundColor={'transparent'} translucent barStyle={'light-content'}/>
                <TabView
                    style={{
                        flex: 1,
                    }}
                    lazy={true}
                    swipeEnabled={false}
                    navigationState={this.state}
                    renderScene={this._renderScene.bind(this)}
                    renderTabBar={this._renderHeader}
                    onIndexChange={this._handleIndexChange}
                    initialLayout={{
                        height: 0,
                        width: Dimensions.get('window').width,
                    }}
                />
            </View>
        )
    }
}

ReleasePage.defaultProps = {};


export default ReleasePage