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
    ImageBackground,
    StyleSheet,
    Platform
} from 'react-native';

import * as Constant from '../../style/constant'
import {Actions} from 'react-native-router-flux'
import styles from '../../style'
import Icon from 'react-native-vector-icons/FontAwesome'
import IconC from 'react-native-vector-icons/Octicons'
import UserImage from './UserImage'
import IconTextItem from './IconTextItem'
import HTMLView from '../common/CommonHtmlView';
import I18n from '../../style/i18n'
import TagGroup from "./TagGroup";

/**
 * 仓库PulseItem显示
 */
class RepositoryPulseItem extends Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
    }

    componentWillUnmount() {

    }

    render() {

        let bottomIconStyle = {
            backgroundColor: Constant.transparentColor,
            size: 22,
        };

        let {opened, closed, infoText, statusText} = this.props;

        return (
            <View style={[{
                backgroundColor: Constant.primaryColor,
                padding: Constant.normalMarginEdge,
                margin: Constant.normalMarginEdge,
                borderRadius: 4
            }, styles.shadowCard]}>
                <View style={[styles.flexDirectionRowNotFlex, {
                    borderColor: Constant.lineColor, borderBottomWidth: StyleSheet.hairlineWidth,
                    paddingBottom: Constant.normalMarginEdge * 2,
                    paddingTop: Constant.normalMarginEdge,
                }]}>
                    <View
                        style={[styles.flexDirectionRow, styles.centered,
                            {borderColor: Constant.lineColor, borderRightWidth: StyleSheet.hairlineWidth}
                        ]}>
                        <IconC name="issue-closed" {...bottomIconStyle} color={"red"}>
                        </IconC>
                        <Text
                            style={[styles.smallText, styles.shadowText, {marginLeft: 5}]}>{I18n("weekClosed") + closed}</Text>
                    </View>
                    <View
                        style={[styles.flexDirectionRow, styles.centered]}
                    >
                        <IconC name="issue-opened" {...bottomIconStyle} color={"green"}>
                        </IconC>
                        <Text
                            style={[styles.smallText, styles.shadowText, {marginLeft: 5}]}>{I18n("weekOpened") + opened}</Text>
                    </View>
                </View>
                <Text
                    style={[styles.normalText, styles.shadowText, {marginTop: Constant.normalMarginEdge}]}>{I18n("thisWeek")}</Text>
                <HTMLView
                    style={[{
                        backgroundColor: Constant.transparentColor,
                        marginBottom: Constant.normalMarginEdge * 2,
                        flex: 2,
                        paddingLeft: Constant.normalMarginEdge
                    }]}
                    numberOfLines={100}
                    value={statusText + infoText}
                    textComponentProps={{
                        style: styles.subSmallText,
                        numberOfLines: 100,
                    }}
                    selectable={true}
                    textComponent={() => {
                        return (
                            <Text/>
                        )
                    }}
                />
            </View>
        );
    }
}

const propTypes = {};

RepositoryPulseItem.propTypes = propTypes;

RepositoryPulseItem.defaultProps = {};


export default RepositoryPulseItem;