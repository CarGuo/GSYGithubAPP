import React, {Component} from 'react';
import {
    View, Text, TouchableHighlight, StyleSheet
} from 'react-native';
import styles from "../../style"
import * as Constant from "../../style/constant"
import * as Config from '../../config/'
import ModalDropdown from 'react-native-modal-dropdown';
import PropTypes from 'prop-types';



class PickerItem extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {

    }

    componentWillUnmount() {
    }

    render() {
        return (
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
                renderRow={this.renderRow.bind(this)}
                renderSeparator={(sectionID, rowID, adjacentRowHighlighted) => this.renderSeparator(sectionID, rowID, adjacentRowHighlighted)}
            />
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
                    }, {backgroundColor: Constant.white}]}>
                    <Text style={[styles.middleText, {
                        marginHorizontal: 4,
                        textAlignVertical: 'center',
                    }, highlighted && {color: Constant.selectedColor}, styles.centered]}>
                        {`${rowData.name}`}
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

PickerItem.propTypes = {
    itemHeight:PropTypes.number,
    defaultIndex:PropTypes.number,
    defaultValue:PropTypes.string,
    options:PropTypes.array,
    dropdownStyle:PropTypes.any,
    textStyle:PropTypes.any,
    adjustFrame:PropTypes.any,
    onSelect:PropTypes.func,
};


export default PickerItem