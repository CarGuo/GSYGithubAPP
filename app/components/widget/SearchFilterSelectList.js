import React, {Component} from 'react';
import {
    View,
    Text,
    SectionList,
    TouchableOpacity
} from 'react-native';
import PropTypes from 'prop-types';
import * as Constant from '../../style/constant'
import styles from '../../style'
import I18n from '../../style/i18n'

class SearchFilterSelectList extends Component {
    state: { dataSource: any };

    constructor(props: any) {
        super(props);
        this.state = {
            dataSource: this.props.selectMap,
            selectIndex: this.props.selectIndex
        };

        this._renderRow = this._renderRow.bind(this);
        this._renderSectionHeader = this._renderSectionHeader.bind(this);
    }

    _renderRow({ item, index, section: { title, data } }) {
        return (
            <TouchableOpacity
                style={[{
                    height: 50,
                    flex: 1,
                    paddingHorizontal: Constant.normalMarginEdge,
                    marginTop: Constant.normalMarginEdge,
                    backgroundColor: (item.select) ? Constant.miWhite : Constant.transparentColor,
                    borderRadius: 4,
                    flexDirection: 'row',
                }, styles.centered]}
                onPress={() => {
                    let selectMap = this.props.selectMap;
                    let dataList = data;
                    dataList.forEach((data) => {
                        data.select = false;
                    });
                    dataList[data.indexOf(item)].select = true;

                    this.setState({
                        dataSource: selectMap,
                    });
                    this.props.onSelect && this.props.onSelect(title, dataList[index].value);
                }}
            >
                <Text style={[(item.select)
                    ? styles.normalText : styles.subSmallText, {textAlign: 'center'}]}>{I18n(item.name)}</Text>
            </TouchableOpacity>
        );
    }

    _renderSectionHeader({section: {title}}) {
        return (
            <View style={{
                marginTop: Constant.normalMarginEdge,
                paddingLeft: Constant.normalMarginEdge,
                flex: 1,
                height: 40,
                backgroundColor: Constant.primaryLightColor,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <Text style={styles.smallTextWhite}>{I18n(title)}</Text>
            </View>
        )
    }

    render() {
        return (
            <SectionList
                style={this.props.listStyle}
                sections={this.state.dataSource}
                renderItem={this._renderRow}
                renderSectionHeader={this._renderSectionHeader}
                keyExtractor={(item, index) => item + index}
            />
        );
    }
}


const propTypes = {
    selectMap: PropTypes.any,
    selectIndex: PropTypes.any,
    listStyle: PropTypes.any,
    onSelect: PropTypes.func,
};

SearchFilterSelectList.propTypes = propTypes;

SearchFilterSelectList.defaultProps = {
    selectMap: {},
    selectIndex: {},
    listStyle: {},
};

export default SearchFilterSelectList;