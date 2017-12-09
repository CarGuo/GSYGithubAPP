import React, {Component} from 'react';
import {
    View, Text, TouchableHighlight, StyleSheet
} from 'react-native';
import styles, {screenWidth} from "../../style"
import * as Constant from "../../style/constant"
import I18n from '../../style/i18n'
import ModalDropdown from 'react-native-modal-dropdown';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/Ionicons'

/**
 * 趋势数据过滤Item
 */
class TrendPickerItem extends Component {

    constructor(props) {
        super(props);
        this.state = {
            icon:'md-arrow-dropdown'
        }
    }

    componentDidMount() {

    }

    componentWillUnmount() {
    }

    render() {
        return (
            <View style={styles.flexDirectionRow}>
                <ModalDropdown
                    style={this.props.style}
                    adjustFrame={this.props.adjustFrame}
                    textStyle={this.props.textStyle}
                    dropdownStyle={this.props.dropdownStyle}
                    options={this.props.options}
                    onSelect={(rowID, rowData) => {
                        this.props.onSelect && this.props.onSelect(rowID, rowData);
                        return true
                    }}
                    defaultIndex={this.props.defaultIndex}
                    defaultValue={this.props.defaultValue}
                    onDropdownWillShow={()=>{
                        this.setState({
                            icon:'md-arrow-dropup'
                        })
                    }}
                    onDropdownWillHide={()=>{
                        this.setState({
                            icon:'md-arrow-dropdown'
                        })
                    }}
                    renderRow={this.renderRow.bind(this)}
                    renderSeparator={(sectionID, rowID, adjacentRowHighlighted) => this.renderSeparator(sectionID, rowID, adjacentRowHighlighted)}
                />
                <View style={[{
                    backgroundColor: Constant.transparentColor,
                    position: "absolute",
                    left: screenWidth / 3,
                    right: 0,
                    top: 0,
                    bottom: 0,
                }, styles.centerV]}>
                    <Icon name={this.state.icon} size={20} color={Constant.mainTextColor}/>
                </View>
            </View>
        );
    }

    renderRow(rowData, rowID, highlighted) {
        let evenRow = rowID % 2;
        return (
            <TouchableHighlight underlayColor='cornflowerblue'>
                <View
                    style={[{
                        flexDirection: 'row',
                        flex: 1,
                        paddingHorizontal: Constant.normalMarginEdge,
                        height: this.props.itemHeight,
                    }, {backgroundColor: Constant.white}, styles.centerH]}>
                    <Text style={[styles.middleText, {
                        marginHorizontal: 4,
                        textAlignVertical: 'center',
                    }, highlighted && {color: Constant.selectedColor}, styles.centered]}>
                        {I18n(rowData.name)}
                    </Text>
                </View>
            </TouchableHighlight>
        );
    }

    renderSeparator(sectionID, rowID, adjacentRowHighlighted) {
        if (rowID === this.props.options.length - 1) return;
        let key = `spr_${rowID}`;
        return (
            <View style={{height: StyleSheet.hairlineWidth, backgroundColor: Constant.lineColor,}}
                  key={key}/>
        );
    }
}

TrendPickerItem.propTypes = {
    itemHeight: PropTypes.number,
    defaultIndex: PropTypes.number,
    defaultValue: PropTypes.string,
    options: PropTypes.array,
    dropdownStyle: PropTypes.any,
    textStyle: PropTypes.any,
    adjustFrame: PropTypes.any,
    onSelect: PropTypes.func,
};


export default TrendPickerItem