

import * as Constant from "../style/constant"
import {StyleSheet} from "react-native";
import {Actions} from 'react-native-router-flux';
import I18n from '../style/i18n'

export const RepositoryDetailRightBtnPress = (props)=>{
    Actions.OptionModal({dataList: RepositoryMore(props)});
};


export const RepositoryMore = (props) => {
    return [{
        itemName: I18n("reposRelease"),
        itemValue: 'reposRelease',
        itemClick: () => {
            Actions.VersionPage({
                ownerName: props.ownerName,
                repositoryName: props.repositoryName,
                title: props.ownerName + "/" + props.repositoryName
            })
        }, itemStyle: {}
    },]
};