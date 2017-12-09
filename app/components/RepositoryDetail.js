/**
 * Created by guoshuyu on 2017/11/10.
 */

import React, {Component, PureComponent} from 'react';
import {
    View, InteractionManager, StatusBar, Dimensions, StyleSheet
} from 'react-native';
import {Actions, Tabs} from 'react-native-router-flux';
import styles, {screenHeight} from "../style"
import * as Constant from "../style/constant"
import I18n from '../style/i18n'
import repositoryActions from '../store/actions/repository'
import WebComponent from './widget/WebComponent'
import CommonBottomBar from './widget/CommonBottomBar'
import IssueListPage from './RepositoryIssueListPage'
import RepositoryDetailActivity from './RepositoryDetailActivity'
import RepositoryDetailFile from './RepositoryDetailFile'
import {TabViewAnimated, TabBar, SceneMap} from 'react-native-tab-view';
import Toast from './widget/ToastProxy'
import PopmenuItem from './widget/PopmenuItem'

/**
 * 详情
 */
class RepositoryDetail extends Component {

    constructor(props) {
        super(props);
        this.page = 2;
        this._getBottomItem = this._getBottomItem.bind(this);
        this._refresh = this._refresh.bind(this);
        this._refreshChangeBranch = this._refreshChangeBranch.bind(this);
        this._forked = this._forked.bind(this);
        this._renderScene = this._renderScene.bind(this);
        this.curBranch = null;
        this.state = {
            dataDetail: this.props.defaultProps,
            dataDetailReadme: '',
            index: 0,
            showBottom: false,
            routes: [
                {key: '1', title: I18n('reposReadme')},
                {key: '2', title: I18n('reposActivity')},
                {key: '3', title: I18n('reposFile')},
                {key: '4', title: I18n('reposIssue')},
            ],
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
                    }
                    return res.next();
                })
                .then((res) => {
                    if (res && res.result) {
                        this.setState({
                            dataDetail: res.data
                        });
                        Actions.refresh({titleData: res.data});
                    }
                });
            this._refresh();
            repositoryActions.getBranches(this.props.ownerName, this.props.repositoryName)
                .then((res)=>{
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
    }

    componentWillUnmount() {

    }

    componentWillReceiveProps(newProps) {
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
                    <WebComponent
                        source={{html: this.state.dataDetailReadme}}
                        userName={this.props.ownerName}
                        reposName={this.props.repositoryName}/>
                );
            case '2':
                return (
                    <RepositoryDetailActivity
                        dataDetail={this.state.dataDetail}
                        ownerName={this.props.ownerName}
                        repositoryName={this.props.repositoryName}
                    />
                );
            case '3':
                return (
                    <RepositoryDetailFile
                        ref={(ref) => {
                            this.detailFile = ref;
                        }}
                        curBranch={this.curBranch}
                        ownerName={this.props.ownerName}
                        repositoryName={this.props.repositoryName}
                    />
                );
            case '4':
                return (
                    <IssueListPage
                        userName={this.props.ownerName}
                        repositoryName={this.props.repositoryName}
                    />
                );
            default:
                return null;
        }
    };


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
                if (dataDetail.fork) {
                    Toast(I18n("reposForked"));
                    return
                }
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
                <TabViewAnimated
                    style={{
                        flex: 1,
                    }}
                    lazy={true}
                    swipeEnabled={false}
                    navigationState={this.state}
                    renderScene={this._renderScene.bind(this)}
                    renderHeader={this._renderHeader}
                    onIndexChange={this._handleIndexChange}
                    initialLayout={{
                        height: 0,
                        width: Dimensions.get('window').width,
                    }}
                />
                {bottom}
            </View>
        )
    }
}

RepositoryDetail.defaultProps = {
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


export default RepositoryDetail