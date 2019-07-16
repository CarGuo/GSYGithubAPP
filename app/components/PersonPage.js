import BasePersonPage from "./widget/BasePersonPage";
import userAction from "../store/actions/user";
import {Actions} from "react-native-router-flux";
import store from "../store";

const {dispatch, getState} = store;

/**
 * 用户信息页面
 */
class PersonPage extends BasePersonPage {
    constructor(props) {
        super(props);
        this._onClose = this._onClose.bind(this);
        this._refreshInfo = this._refreshInfo.bind(this);
        this.state = {
            userInfo: {
                login: this.props.currentUser,
                followers: '---',
                star: '---',
                following: '---',
                public_repos: '---',
            },
            needFollow: false,
            hadFollowed: false,
        }
    }

    componentDidMount() {
        this._refreshInfo();
        super.componentDidMount();
    }

    componentWillUnmount() {
    }

    _onClose() {
        Actions.pop();
        return true;
    }

    getUserInfo() {
        return this.state.userInfo;
    }

    getNeedFollow() {
        let login = getState()['user'].userInfo.login;
        return this.state.needFollow && (this.props.currentUser !== login);
    }

    getHanFollow() {
        return this.state.hadFollowed;
    }

    _refreshInfo() {
        userAction.getPersonUserInfo(this.props.currentUser).then((res) => {
            if (res && res.result) {
                this.setState({
                    userInfo: res.data
                });
                if (res.data.type === "Organization") {
                    Actions.refresh({titleData: res.data, showType: "Organization"});
                } else {
                    Actions.refresh({titleData: res.data, showType: "user"});
                }
            }
            return res.next();
        }).then((res) => {
            if (res && res.result) {
                this.setState({
                    userInfo: res.data
                });
                if (res.data.type === "Organization") {
                    Actions.refresh({titleData: res.data, showType: "Organization"});
                } else {
                    Actions.refresh({titleData: res.data, showType: "user"});
                }
            }
        });
        userAction.checkFollow(this.props.currentUser).then((res) => {
            this.setState({
                hadFollowed: res.result,
                needFollow: true
            })
        });
    }

    doFollowLogic() {
        Actions.LoadingModal({backExit: false});
        userAction.doFollow(this.props.currentUser, !this.state.hadFollowed).then(() => {
            this._refreshInfo();
            setTimeout(() => {
                Actions.pop();
            }, 500);
        })
    }
}

export default PersonPage