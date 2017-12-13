import I18n from '../style/i18n'
import {StyleSheet} from 'react-native'
import {Actions} from 'react-native-router-flux'
import styles, {navBarHeight, screenWidth} from "../style"
import * as Constant from '../style/constant'
import {
    Platform, StatusBar
} from 'react-native';

export const filterItemHeight = 40;

export const pickerViewStyle = [{flex: 1}, styles.centerV];

export const pickerTextStyle = [{
    textAlign: 'center',
    textAlignVertical: 'center',
    color: Constant.selectedColor,
    fontSize: Constant.middleTextWhite,
    paddingRight: 45
},];

export const dropDownStyle = [{
    width: screenWidth,
    backgroundColor: "#FFF"
}, styles.shadowCard];

export const adjustFrame = (style) => {
    style.left = 0;
    style.top = Platform.OS === 'android' ? navBarHeight + StatusBar.currentHeight :
        navBarHeight + filterItemHeight + 25;
};

export const TrendTime = [
    {
        "name": 'trendDay', "value": 'daily', toString() {
            return I18n('trendDay')
        }
    },
    {
        "name": 'trendWeek', "value": 'weekly', toString() {
            return I18n('trendWeek')
        }
    },
    {
        "name": 'trendMonth', "value": 'monthly', toString() {
            return I18n('trendMonth')
        }
    },
];

export const TrendType = [
    {
        "name": 'trendAll', "value": null, toString() {
            return I18n('trendAll')
        }
    },
    {
        "name": 'Java', "value": 'Java', toString() {
            return 'Java'
        }
    },
    {
        "name": 'Kotlin', "value": 'Kotlin', toString() {
            return 'Kotlin'
        }
    },
    {
        "name": 'Objective_C', "value": 'Objective-C', toString() {
            return 'Objective_C'
        }
    },
    {
        "name": 'Swift', "value": 'Swift', toString() {
            return 'Swift'
        }
    },
    {
        "name": 'JavaScript', "value": 'JavaScript', toString() {
            return 'JavaScript'
        }
    },
    {
        "name": 'PHP', "value": 'PHP', toString() {
            return 'PHP'
        }
    },
    {
        "name": 'Go', "value": 'Go', toString() {
            return 'Go'
        }
    },
    {
        "name": 'C__', "value": 'C++', toString() {
            return 'C__'
        }
    },
    {
        "name": 'C', "value": 'C', toString() {
            return 'C'
        }
    },
    {
        "name": 'HTML', "value": 'HTML', toString() {
            return 'HTML'
        }
    },
    {
        "name": 'CSS', "value": 'CSS', toString() {
            return 'CSS'
        }
    },
    {
        "name": 'unknown', "value": 'unknown', toString() {
            return 'unknown'
        }
    },

];

export const SortType = [
    {name: 'desc', value: 'desc', select: true},
    {name: 'asc', value: 'asc', select: false},
];

export const SearchFilterType = [
    {name: "best_match", value: 'best%20match', select: true},
    {name: "stars", value: 'stars', select: false},
    {name: "forks", value: 'forks', select: false},
    {name: "updated", value: 'updated', select: false},
];

export const SearchLanguageType = [
    {name: "trendAll", value: null, select: true},
    {name: "Java", value: 'Java', select: false},
    {name: "Objective_C", value: 'Objective-C', select: false},
    {name: "Swift", value: 'Swift', select: false},
    {name: "JavaScript", value: 'JavaScript', select: false},
    {name: "PHP", value: 'PHP', select: false},
    {name: "C__", value: 'C__', select: false},
    {name: "C", value: 'C', select: false},
    {name: "HTML", value: 'HTML', select: false},
    {name: "CSS", value: 'CSS', select: false},
];

export const IssueState = [
    {name: "issue_open", value: 'open', select: true},
    {name: "issue_closed", value: 'closed', select: false},
];

export const IssueFilterType = [
    {name: "issue_all", value: 'all', select: true},
    {name: "issue_created", value: 'created', select: false},
    {name: "issue_assigned", value: 'assigned', select: false},
    {name: "issue_mentioned", value: 'mentioned', select: false},
];

export const IssueSortType = [
    {name: "issue_created", value: 'created', select: true},
    {name: "issue_updated", value: 'updated', select: false},
    {name: "issue_comments", value: 'comments', select: false},
];

export const RepositoryFilter = () => {
    return [{
        itemName: I18n("filterPushed"),
        itemValue: 'pushed',
        itemClick: () => {
            Actions.refresh({filterSelect: 'pushed'});
        }, itemStyle: {
            borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: Constant.lineColor,
        }
    }, {
        itemName: I18n("filterCreated"),
        itemValue: 'created',
        itemClick: () => {
            Actions.refresh({filterSelect: 'created'});
        }, itemStyle: {}
    }, {
        itemName: I18n("filterUpdated"),
        itemValue: 'updated',
        itemClick: () => {
            Actions.refresh({filterSelect: 'updated'});
        }, itemStyle: {
            borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: Constant.lineColor,
        }
    }, {
        itemName: I18n("filterFullName"),
        itemValue: 'full_name',
        itemClick: () => {
            Actions.refresh({filterSelect: 'full_name'});
        }, itemStyle: {
            borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: Constant.lineColor,
        }
    },]
};