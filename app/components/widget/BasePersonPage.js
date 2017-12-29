/**
 * Created by guoshuyu on 2017/11/10.
 */

import React, {Component} from 'react';
import {
    View, Text, StatusBar, Image, InteractionManager
} from 'react-native';
import styles from "../../style"
import * as Constant from '../../style/constant'
import eventActions from '../../store/actions/event'
import userActions from '../../store/actions/user'
import repositoryActions from '../../store/actions/repository'
import UserHeadItem from './UserHeadItem'
import PullListView from './PullLoadMoreListView'
import EventItem from './EventItem'
import {getActionAndDes, ActionUtils} from '../../utils/eventUtils'
import * as Config from '../../config'
import I18n from '../../style/i18n'
import resolveTime from '../../utils/timeUtil'
import UserItem from '../widget/UserItem'

/**
 * 用户显示基础控件
 */
class BasePersonPage extends Component {

    constructor(props) {
        super(props);
        this._refresh = this._refresh.bind(this);
        this._loadMore = this._loadMore.bind(this);
        this._getMoreInfo = this._getMoreInfo.bind(this);
        this.getBackNotifyCall = this.getBackNotifyCall.bind(this);
        this.doFollowLogic = this.doFollowLogic.bind(this);
        this.state = {
            dataSource: [],
            beStaredCount: "---",
            beStaredList: null
        };
        this.page = 2;
        this.showType = 0;
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            if (this.refs.pullList)
                this.refs.pullList.showRefreshState();
            this._refresh();
            this._getMoreInfo();
        })
    }

    componentWillUnmount() {

    }


    componentWillReceiveProps(newProps) {
        if (newProps.showType && newProps.showType !== this.props.showType && newProps.showType === "Organization") {
            this.showType = 1;
            newProps.showType = "";
            this._refresh();
        }
    }

    _renderRow(rowData, sectionID, rowID, highlightRow) {
        if (this.showType === 1) {
            return (<UserItem
                location={rowData.location}
                actionUser={rowData.login}
                actionUserPic={rowData.avatar_url}
                des={rowData.bio}/>);
        } else {
            let res = getActionAndDes(rowData);
            return (
                <EventItem
                    actionTime={rowData.created_at}
                    actionUser={rowData.actor.display_login}
                    actionUserPic={rowData.actor.avatar_url}
                    des={res.des}
                    onPressItem={() => {
                        ActionUtils(rowData)
                    }}
                    actionTarget={res.actionStr}/>
            )
        }
    }

    /**
     * 刷新
     * */
    _refresh() {
        let userInfo = this.getUserInfo();
        if (this.showType === 1) {
            userActions.getMember(1, userInfo.login).then((res) => {
                if (res && res.result) {
                    this.setState({
                        dataSource: res.data
                    });
                }
                return res.next();
            }).then((res) => {
                let size = 0;
                if (res && res.result) {
                    this.page = 2;
                    this.setState({
                        dataSource: res.data
                    });
                    size = res.data.length;
                }
                setTimeout(() => {
                    if (this.refs.pullList) {
                        this.refs.pullList.refreshComplete((size >= Config.PAGE_SIZE), false);
                    }
                }, 500);
            })
        } else {
            eventActions.getEvent(1, userInfo.login).then((res) => {
                if (res && res.result) {
                    this.setState({
                        dataSource: res.data
                    });
                }
                return res.next();
            }).then((res) => {
                let size = 0;
                if (res && res.result) {
                    this.page = 2;
                    this.setState({
                        dataSource: res.data
                    });
                    size = res.data.length;
                }
                setTimeout(() => {
                    if (this.refs.pullList) {
                        this.refs.pullList.refreshComplete((size >= Config.PAGE_SIZE), false);
                    }
                }, 500);
            })
        }
    }

    /**
     * 加载更多
     * */
    _loadMore() {
        let userInfo = this.getUserInfo();
        if (this.showType === 1) {
            userActions.getMember(this.page, userInfo.login).then((res) => {
                this.page++;
                let size = 0;
                if (res && res.result) {
                    let localData = this.state.dataSource.concat(res.data);
                    this.setState({
                        dataSource: localData
                    });
                    size = res.data.length;
                }
                setTimeout(() => {
                    if (this.refs.pullList) {
                        this.refs.pullList.loadMoreComplete((size >= Config.PAGE_SIZE));
                    }
                }, 500);
            });
        } else {
            eventActions.getEvent(this.page, userInfo.login).then((res) => {
                this.page++;
                let size = 0;
                if (res && res.result) {
                    let localData = this.state.dataSource.concat(res.data);
                    this.setState({
                        dataSource: localData
                    });
                    size = res.data.length;
                }
                setTimeout(() => {
                    if (this.refs.pullList) {
                        this.refs.pullList.loadMoreComplete((size >= Config.PAGE_SIZE));
                    }
                }, 500);
            });
        }
    }

    _getMoreInfo() {
        let userInfo = this.getUserInfo();
        repositoryActions.getUserRepository100Status(userInfo.login)
            .then((res) => {
                if (res.result) {
                    this.setState({
                        beStaredCount: res.data.stared + "",
                        beStaredList: res.data.list,
                    })
                }
            })
    }

    getUserInfo() {
        return {}
    }

    getSetting() {
        return false;
    }

    getBackNotifyCall() {

    }

    getSettingNeed() {
        return false
    }

    getNeedFollow() {
        return false
    }

    getHanFollow() {
        return false
    }

    doFollowLogic() {

    }

    render() {
        let userInfo = this.getUserInfo();
        return (
            <View style={styles.mainBox}>
                <StatusBar hidden={false} backgroundColor={'transparent'} translucent barStyle={'light-content'}/>
                <PullListView
                    style={{flex: 1}}
                    ref="pullList"
                    renderHeader={() => {
                        return (
                            <View>
                                <UserHeadItem
                                    needFollow={this.getNeedFollow()}
                                    doFollowLogic={this.doFollowLogic}
                                    hadFollowed={this.getHanFollow()}
                                    userDisPlayName={userInfo.login}
                                    userName={userInfo.name}
                                    userType={userInfo.type}
                                    isOrganizations={"Organization" === userInfo.type || !userInfo.type}
                                    userPic={userInfo.avatar_url}
                                    groupName={userInfo.company}
                                    location={userInfo.location}
                                    link={userInfo.blog}
                                    beStared={this.state.beStaredCount}
                                    beStaredList={this.state.beStaredList}
                                    settingNeed={this.getSettingNeed()}
                                    des={(userInfo.bio ? (userInfo.bio + "\n") : "") + I18n("userCreate") + resolveTime(userInfo.created_at)}
                                    backNotifyCall={this.getBackNotifyCall}
                                    unRead={this.state.unRead}
                                    star={(userInfo.starred) ? userInfo.starred : "---"}
                                    repos={userInfo.public_repos + ""}
                                    follower={userInfo.followers + ""}
                                    followed={userInfo.following + ""}
                                    setting={this.getSetting()}
                                />
                            </View>
                        );
                    }}
                    render
                    renderRow={(rowData, sectionID, rowID, highlightRow) =>
                        this._renderRow(rowData, sectionID, rowID, highlightRow)
                    }
                    refresh={this._refresh}
                    loadMore={this._loadMore}
                    dataSource={this.state.dataSource}
                />
            </View>
        )
    }
}

export default BasePersonPage