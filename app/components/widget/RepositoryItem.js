/**
 * Created by guoshuyu on 2017/11/12.
 */
import React, {
    Component,
} from 'react';
import PropTypes from 'prop-types';
import {
    Text,
    Image,
    View,
    TouchableOpacity,
    Dimensions,
    StyleSheet
} from 'react-native';

import * as Constant from '../../style/constant'
import styles from '../../style'
import Icon from 'react-native-vector-icons/FontAwesome'

/**
 * 仓库相关Item显示
 */
class RepositoryItem extends Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
    }

    componentWillUnmount() {

    }

    render() {
        let {
            ownerName,
            ownerPic,
            repositoryName,
            repositoryStar,
            repositoryFork,
            repositoryWatch,
            repositoryType,
            repositoryDes,
            repositoryStared,
            repositoryForked,
            repositoryWatched
        } = this.props;

        let bottomIconStyle = {
            backgroundColor: Constant.transparentColor,
            color: Constant.subTextColor, size: Constant.minIconSize
        };
        return (
            <View>
                <View style={[styles.flexDirectionRowNotFlex, {marginTop: Constant.normalMarginEdge}]}>
                    <Image source={{uri: ownerPic}}
                           resizeMethod="scale"
                           style={[{height: Constant.normalIconSize, width: Constant.normalIconSize,
                       marginLeft: Constant.normalMarginEdge,
                       marginRight: Constant.normalMarginEdge,
                       marginTop: 5,
                       }]}/>
                    <View style={styles.flex}>
                        <View style={[styles.flexDirectionRowNotFlex]}>
                            <Text style={[styles.smallText, {fontWeight: "bold"}]}>{ownerName}</Text>
                            <Text
                                style={[styles.subSmallText,]}>
                                {"/"}
                            </Text>
                            <Text style={[styles.smallText, {fontWeight: "bold"}]}>{repositoryName}</Text>
                            <View
                                style={[styles.flex, styles.alignItemsEnd, {marginRight: Constant.normalMarginEdge, marginTop: -5}]}>
                                <Text
                                    style={{ color: Constant.subTextColor, fontSize: Constant.minTextSize}}>{repositoryType}</Text>
                            </View>
                        </View>
                        <Text style={[styles.subSmallText,
                                {marginBottom:Constant.normalMarginEdge,}]}>
                            {repositoryDes}
                        </Text>
                    </View>
                </View>
                <View style={[styles.flexDirectionRowNotFlex,
                        {borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: Constant.lineColor},
                        {borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: Constant.lineColor},
                        ]}>
                    <View style={[styles.flex, styles.centered,]}>
                        <Icon.Button name="star-o" {...bottomIconStyle}>
                            <Text style={[styles.subSmallText]}>{repositoryStar}</Text>
                        </Icon.Button>
                    </View>
                    <View style={[styles.flex, styles.centered,
                        {borderLeftWidth: StyleSheet.hairlineWidth, borderLeftColor: Constant.lineColor},
                        {borderRightWidth: StyleSheet.hairlineWidth, borderRightColor: Constant.lineColor},
                    ]}>
                        <Icon.Button name="code-fork" {...bottomIconStyle}>
                            <Text style={[styles.subSmallText]}>{repositoryFork}</Text>
                        </Icon.Button>
                    </View>
                    <View style={[styles.flex, styles.centered,]}>
                        <Icon.Button name="eye" {...bottomIconStyle}>
                            <Text style={[styles.subSmallText]}>{repositoryWatch}</Text>
                        </Icon.Button>
                    </View>
                </View>
            </View>
        );
    }
}

const propTypes = {
    ownerName: PropTypes.string,
    ownerPic: PropTypes.string,
    repositoryName: PropTypes.string,
    repositoryStar: PropTypes.number,
    repositoryFork: PropTypes.number,
    repositoryWatch: PropTypes.number,
    repositoryType: PropTypes.string,
    repositoryDes: PropTypes.string,
    repositoryStared: PropTypes.bool,
    repositoryForked: PropTypes.bool,
    repositoryWatched: PropTypes.bool,
};

RepositoryItem.propTypes = propTypes;
RepositoryItem.defaultProps = {
    repositoryDes: '---',
    repositoryStared: false,
    repositoryForked: false,
    repositoryWatched: false,
};


export default RepositoryItem;