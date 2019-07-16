import React, {Component} from 'react';
import {
    View, Text, TouchableOpacity, StyleSheet
} from 'react-native';
import PropTypes from 'prop-types';
import styles from "../../style/index"
import * as Constant from "../../style/constant"
import IconC from 'react-native-vector-icons/Ionicons'
import UserImage from "./UserImage";
import {Actions} from 'react-native-router-flux';
import I18n from '../../style/i18n'

/**
 * 组织bar
 */

const itemSize = 35;

class OrgItemBar extends Component {

    constructor(props) {
        super(props);
        this.renderItem = this.renderItem.bind(this);
    }

    componentDidMount() {
    }

    componentWillUnmount() {

    }

    renderItem(data) {
        return (
            <TouchableOpacity style={[{height: itemSize, width: itemSize}, styles.centerH]}
                              onPress={() => {
                                  data.itemClick && data.itemClick(data);
                              }}
                              key={data.login}>
                <UserImage uri={data.avatar_url}
                           loginUser={data.login}
                           resizeMethod="scale"
                           style={[{
                               height: Constant.smallIconSize, width: Constant.smallIconSize,
                               borderRadius: Constant.smallIconSize / 2
                           }]}/>
            </TouchableOpacity>
        )
    }

    render() {
        let {dataList} = this.props;
        let items = [];
        if (dataList.length > 0) {
            let title =
                <View
                    key={"title"}
                    style={[styles.centered, {
                        height: itemSize,
                        width: itemSize,
                    },]}>
                    <Text style={[styles.miLightSmallText]}>
                        {I18n("userOrg")}
                    </Text>
                </View>;
            items.push(title)
        }
        dataList.forEach((data) => {
            items.push(this.renderItem(data));
        });
        let more =
            <TouchableOpacity
                style={[styles.shadowCard, {
                    shadowColor: Constant.subLightTextColor,
                    margin: 5,
                    padding: 5,
                    height: Constant.smallIconSize, width: Constant.smallIconSize,
                    borderRadius: (Constant.smallIconSize) / 2,
                }, styles.centered]}
                key={"more"}
                onPress={() => {
                    Actions.ListPage({
                        dataType: 'user_orgs', showType: 'org',
                        currentUser: this.props.ownerName,
                        title: this.props.ownerName + " - " + I18n("userOrg")
                    })
                }}>
                <IconC name={"ios-more"}
                       backgroundColor={Constant.transparentColor}
                       color={Constant.primaryColor}
                       size={16}/>
            </TouchableOpacity>;
        if (dataList.length > 5) {
            items = items.slice(0, 4);
            items.push(more)
        }
        return (
            <View style={[{height: itemSize, marginTop: Constant.normalMarginEdge / 2}, this.props.rootStyles]}>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                }}>
                    {items}
                </View>
            </View>
        )
    }
}


OrgItemBar.propTypes = {
    dataList: PropTypes.array,
    rootStyles: PropTypes.any,
    inputView: PropTypes.any,
    ownerName: PropTypes.string,
};


OrgItemBar.defaultProps = {
    dataList: [],
    rootStyles: {}
};

export default OrgItemBar