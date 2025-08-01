/**
 * Created by guoshuyu on 2017/11/10.
 */

import React, {Component, PureComponent} from 'react';
import {
    View, InteractionManager, StatusBar, SafeAreaView, StyleSheet, BackHandler
} from 'react-native';
import {Actions, Tabs} from '../navigation/Actions';
import styles, {screenHeight} from "../style"
import * as Constant from "../style/constant"
import I18n from '../style/i18n'
import repositoryActions from '../store/actions/repository'
import WebComponent from './widget/CustomWebComponent'
import CommonBottomBar from './common/CommonBottomBar'
import IssueListPage from './RepositoryIssueListPage'
import RepositoryDetailActivity from './RepositoryDetailActivityPage'
import RepositoryDetailFile from './RepositoryDetailFilePage'
import Toast from './common/ToastProxy'
import PopmenuItem from './widget/BottomPopmenuItem'
import {launchUrl} from "../utils/htmlUtils";
import {logHoc} from "../components/common/LogHoc";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { NavigationContainer } from '@react-navigation/native';

const Tab = createMaterialTopTabNavigator();

/**
 * 仓库详情
 */

@logHoc
class RepositoryDetailPage extends Component {

    constructor(props) {
        super(props);
        this.page = 2;
        this._getBottomItem = this._getBottomItem.bind(this);
        this._refresh = this._refresh.bind(this);
        this._refreshChangeBranch = this._refreshChangeBranch.bind(this);
        this._forked = this._forked.bind(this);
        this._backHandler = this._backHandler.bind(this);
        this.curBranch = null;
        this.index = 0;
        this.state = {
            dataDetail: props.route.params.defaultProps,
            dataDetailReadme: '',
            showBottom: false,
        }
    }

    componentDidMount() {
        const { ownerName, repositoryName } = this.props.route.params;
        InteractionManager.runAfterInteractions(() => {
            repositoryActions.getRepositoryDetail(ownerName, repositoryName)
                .then((res) => {
                    if (res && res.result) {
                        this.setState({
                            dataDetail: res.data
                        });
                        Actions.refresh({titleData: res.data});
                        repositoryActions.addRepositoryLocalRead(ownerName, repositoryName, res.data);

                    }
                    return res.next();
                })
                .then((res) => {
                    if (res && res.result) {
                        this.setState({
                            dataDetail: res.data
                        });
                        Actions.refresh({titleData: res.data});
                        repositoryActions.addRepositoryLocalRead(ownerName, repositoryName, res.data);
                    }
                });
            this._refresh();
            repositoryActions.getBranches(ownerName, repositoryName)
                .then((res) => {
                    if (res && res.result) {
                        this.setState({
                            dataDetailBranches: this.resolveBranchesData(res.data),
                        })
                    }
                    return res.next();
                })
                .then((res) => {
                    if (res && res.result) {
                        this.setState({
                            dataDetailBranches: this.resolveBranchesData(res.data),
                        })
                    }
                });
        });
        this.handle = BackHandler.addEventListener('hardwareBackPress-RepositoryDetail', this._backHandler)
    }

    componentWillUnmount() {
        if (this.handle) {
            this.handle.remove();
        }
    }


    _backHandler() {
        if (this.index === 2) {
            if (!this.detailFile || !this.detailFile.backHandler()) {
                Actions.pop();
            }
            return true
        }
        return false
    }

    resolveBranchesData(data) {
        let branches = [];
        if (data && data.length > 0) {
            data.forEach((item) => {
                let addData = {
                    name: item.name,
                    value: item.name,
                    toString() {
                        return item.name
                    }
                };
                branches.push(addData);
            })
        }
        return branches;
    }

    getDetailData() {
        return this.state.dataDetail
    }

    _refresh() {
        const { ownerName, repositoryName } = this.props.route.params;
        repositoryActions.getRepositoryDetailReadmeHtml(ownerName, repositoryName, this.curBranch)
            .then((res) => {
                if (res && res.result) {
                    this.setState({
                        dataDetailReadme: res.data,
                    })
                }
                return res.next();
            })
            .then((res) => {
                if (res && res.result) {
                    this.setState({
                        dataDetailReadme: res.data,
                    })
                }
            });
        repositoryActions.getRepositoryStatus(ownerName, repositoryName).then((res) => {
            if (res && res.result) {
                this.setState({
                    showBottom: true,
                    stared: res.data.star,
                    watched: res.data.watch,
                });
            }
        })
    }


    _forked() {
        let {ownerName, repositoryName} = this.props.route.params;
        Actions.LoadingModal({backExit: false});
        repositoryActions.createRepositoryForks(ownerName, repositoryName).then((res) => {
            Toast((res && res.result) ? I18n('forkSuccess') : I18n('forkFail'));
            setTimeout(() => {
                Actions.pop();
                this._refresh();
            }, 500);
        })
    }

    _refreshChangeBranch(branch) {
        this.setState({
            dataDetailReadme: "</p>"
        });
        this._refresh();
        if (this.detailFile) {
            this.detailFile.changeBranch(branch);
        }
    }


    _getBottomItem() {
        let {stared, watched, dataDetail} = this.state;
        let {ownerName, repositoryName} = this.props.route.params;
        return [{
            itemName: stared ? I18n("reposUnStar") : I18n("reposStar"),
            icon: "star",
            iconColor: stared ? Constant.primaryColor : Constant.miWhite,
            itemClick: () => {
                Actions.LoadingModal({backExit: false});
                repositoryActions.doRepositoryStar(ownerName, repositoryName, !stared).then((res) => {
                    setTimeout(() => {
                        Actions.pop();
                        this._refresh();
                    }, 500);
                })
            }, itemStyle: {}
        }, {
            itemName: watched ? I18n("reposUnWatcher") : I18n("reposWatcher"),
            icon: "eye",
            iconColor: watched ? Constant.primaryColor : Constant.miWhite,
            itemClick: () => {
                Actions.LoadingModal({backExit: false});
                repositoryActions.doRepositoryWatch(ownerName, repositoryName, !watched).then((res) => {
                    setTimeout(() => {
                        Actions.pop();
                        this._refresh();
                    }, 500);
                })
            }, itemStyle: {
                borderLeftWidth: StyleSheet.hairlineWidth, borderLeftColor: Constant.lineColor,
                borderRightWidth: StyleSheet.hairlineWidth, borderRightColor: Constant.lineColor
            }
        }, {
            itemName: I18n("reposFork"),
            icon: 'repo-forked',
            itemClick: () => {
                /*if (dataDetail.fork) {
                    Toast(I18n("reposForked"));
                    return
                }*/
                Actions.ConfirmModal({
                    titleText: I18n('reposFork'),
                    text: I18n('reposForkedTip'),
                    textConfirm: this._forked
                })
            }, itemStyle: {}
        },]
    }

    render() {
        let itemHeight = 30;
        let popHeight = (this.state.dataDetailBranches) ? (itemHeight * this.state.dataDetailBranches.length + 20) : 100;
        let bottom = this.state.showBottom ?
            <SafeAreaView style={{backgroundColor:"#FFFFFF"}}>
                <View style={[styles.flexDirectionRowNotFlex, styles.centerH]}>
                    <CommonBottomBar dataList={this._getBottomItem()}
                                     rootStyles={{
                                         flex: 1,
                                         shadowOffset: {
                                             width: 0,
                                             height: 0
                                         },
                                         shadowOpacity: 0,
                                         shadowRadius: 0,
                                         elevation: 0,
                                     }}/>
                    <View style={{backgroundColor: Constant.primaryLightColor, width: 1, height: 20}}/>
                    <PopmenuItem
                        defaultIndex={0}
                        adjustFrame={(styless) => {
                            if (this.state.dataDetailBranches) {
                                let top = screenHeight - popHeight - 60;
                                if (top < 0) {
                                    top = 10;
                                }
                                styless.top = top
                            }
                        }}
                        onSelect={(id, rowData) => {
                            this.curBranch = rowData.value;
                            this._refreshChangeBranch(this.curBranch);
                        }}
                        itemHeight={itemHeight}
                        options={this.state.dataDetailBranches}
                        dropdownStyle={{height: popHeight}}
                        defaultValue={"master"}
                    />
                </View></SafeAreaView> :
            <View/>;
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
                            fontSize: 14,
                        },
                        tabBarIndicatorStyle: {
                            backgroundColor: Constant.white,
                            height: 3,
                        },
                    }}
                    screenListeners={{
                        tabPress: (e) => {
                            // Handle tab change
                        },
                    }}
                >
                    <Tab.Screen 
                        name="Activity" 
                        children={() => (
                            <RepositoryDetailActivity
                                dataDetail={this.state.dataDetail}
                                ownerName={this.props.route.params.ownerName}
                                repositoryName={this.props.route.params.repositoryName}
                            />
                        )}
                        options={{ tabBarLabel: I18n('reposActivity') }}
                    />
                    <Tab.Screen 
                        name="Readme" 
                        children={() => (
                            <WebComponent
                                source={{html: this.state.dataDetailReadme}}
                                userName={this.props.route.params.ownerName}
                                reposName={this.props.route.params.repositoryName}
                                gsygithubLink={(url) => {
                                    if (url) {
                                        let owner = this.props.route.params.ownerName;
                                        let repo = this.props.route.params.repositoryName;
                                        let branch = this.curBranch ? this.curBranch : "master";
                                        let currentPath = url.replace("gsygithub://.", "").replace("gsygithub://", "/");
                                        let fixedUrl = "https://github.com/" + owner + "/" + repo + "/blob/" + branch + currentPath;
                                        launchUrl(fixedUrl);
                                    }
                                }}
                            />
                        )}
                        options={{ tabBarLabel: I18n('reposReadme') }}
                    />
                    <Tab.Screen 
                        name="Files" 
                        children={() => (
                            <RepositoryDetailFile
                                ref={(ref) => {
                                    this.detailFile = ref;
                                }}
                                curBranch={this.curBranch}
                                ownerName={this.props.route.params.ownerName}
                                repositoryName={this.props.route.params.repositoryName}
                            />
                        )}
                        options={{ tabBarLabel: I18n('reposFile') }}
                    />
                    <Tab.Screen 
                        name="Issues" 
                        children={() => (
                            <IssueListPage
                                userName={this.props.route.params.ownerName}
                                repositoryName={this.props.route.params.repositoryName}
                            />
                        )}
                        options={{ tabBarLabel: I18n('reposIssue') }}
                    />
                </Tab.Navigator>
                {bottom}
            </View>
        )
    }
}

RepositoryDetailPage.defaultProps = {
    dataDetail: {
        forks_count: "---",
        fork: false,
        open_issues_count: "---",
        size: 0,
        watchers_count: "---",
        subscribers_count: "---",
        description: '---',
        language: '---',
    }
};


export default RepositoryDetailPage
