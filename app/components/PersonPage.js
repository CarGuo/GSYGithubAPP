import {BackHandler} from "react-native"
import MyPage from "./MyPage";
import BasePersonPage from "./widget/BasePersonPage";
import userAction from "../store/actions/user";
import {Actions} from "react-native-router-flux";

class PersonPage extends BasePersonPage {
    constructor(props) {
        super(props);
        this._onClose = this._onClose.bind(this);
        this.state = {
            userInfo: {}
        }
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this._onClose);
        userAction.getOtherUserInfo(this.props.userName).then((res) => {
            if (res && res.result) {
                this.setState({
                    userInfo: res.data
                })
            }
        });
        super.componentDidMount();
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this._onClose)
    }

    _onClose() {
        Actions.pop();
        return true;
    }

    getUserInfo() {
        return this.state.userInfo;
    }
}

export default PersonPage