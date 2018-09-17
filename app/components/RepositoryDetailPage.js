/**
 * Created by guoshuyu on 2017/11/10.
 */

import React, {Component, PureComponent} from 'react';
import {
    View, InteractionManager, StatusBar, Dimensions, StyleSheet, BackHandler
} from 'react-native';
import {Actions, Tabs} from 'react-native-router-flux';
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
import ScrollableTabView, {DefaultTabBar} from 'react-native-scrollable-tab-view-fix-guo';

/**
 * 仓库详情
 */
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
            dataDetail: this.props.defaultProps,
            dataDetailReadme: '',
            showBottom: false,
        }
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            repositoryActions.getRepositoryDetail(this.props.ownerName, this.props.repositoryName)
                .then((res) => {
                    if (res && res.result) {
                        this.setState({
                            dataDetail: res.data
                        });
                        Actions.refresh({titleData: res.data});
                        repositoryActions.addRepositoryLocalRead(this.props.ownerName, this.props.repositoryName, res.data);

                    }
                    return res.next();
                })
                .then((res) => {
                    if (res && res.result) {
                        this.setState({
                            dataDetail: res.data
                        });
                        Actions.refresh({titleData: res.data});
                        repositoryActions.addRepositoryLocalRead(this.props.ownerName, this.props.repositoryName, res.data);
                    }
                });
            this._refresh();
            repositoryActions.getBranches(this.props.ownerName, this.props.repositoryName)
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

    componentWillReceiveProps(newProps) {
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
        repositoryActions.getRepositoryDetailReadmeHtml(this.props.ownerName, this.props.repositoryName, this.curBranch)
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
        repositoryActions.getRepositoryStatus(this.props.ownerName, this.props.repositoryName).then((res) => {
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
        let {ownerName, repositoryName} = this.props;
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
        let {ownerName, repositoryName} = this.props;
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
            <View style={[styles.flexDirectionRowNotFlex, styles.centerH, styles.shadowCard]}>
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
            </View> :
            <View/>;
        return (
            <View style={styles.mainBox}>
                <StatusBar hidden={false} backgroundColor={'transparent'} translucent barStyle={'light-content'}/>
                <ScrollableTabView
                    onChangeTab={(params) => {
                        this.index = params.i;
                    }}
                    tabBarUnderlineStyle={{
                        backgroundColor: Constant.white,
                        height: 3
                    }}
                    renderTabBar={(props) => {
                        return <DefaultTabBar {...props} style={{paddingTop: 5}}/>;
                    }}
                    tabBarBackgroundColor={Constant.primaryColor}
                    tabBarActiveTextColor={Constant.white}
                    tabBarInactiveTextColor={Constant.subTextColor}
                    tabBarTextStyle={{fontSize: 16}}>
                    <WebComponent
                        tabLabel={I18n('reposReadme')}
                        source={{html: this.state.dataDetailReadme}}
                        userName={this.props.ownerName}
                        reposName={this.props.repositoryName}
                        gsygithubLink={(url) => {
                            if (url) {
                                let owner = this.props.ownerName;
                                let repo = this.props.repositoryName;
                                let branch = this.curBranch ? this.curBranch : "master";
                                let currentPath = url.replace("gsygithub://.", "").replace("gsygithub://", "/");
                                let fixedUrl = "https://github.com/" + owner + "/" + repo + "/blob/" + branch + currentPath;
                                launchUrl(fixedUrl);
                            }
                        }}
                    />
                    <RepositoryDetailActivity
                        tabLabel={I18n('reposActivity')}
                        dataDetail={this.state.dataDetail}
                        ownerName={this.props.ownerName}
                        repositoryName={this.props.repositoryName}
                    />

                    <RepositoryDetailFile
                        tabLabel={I18n('reposFile')}
                        ref={(ref) => {
                            this.detailFile = ref;
                        }}
                        curBranch={this.curBranch}
                        ownerName={this.props.ownerName}
                        repositoryName={this.props.repositoryName}
                    />

                    <IssueListPage
                        tabLabel={I18n('reposIssue')}
                        userName={this.props.ownerName}
                        repositoryName={this.props.repositoryName}
                    />
                </ScrollableTabView>
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