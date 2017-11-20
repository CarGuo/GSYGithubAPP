import I18n from '../style/i18n'

export const TrendTime = [
    {
        "name": I18n('trendDay'), "value": 30, toString() {
        return I18n('trendDay')
    }
    },
    {
        "name": I18n('trendWeek'), "value": 25, toString() {
        return I18n('trendWeek')
    }
    },
    {
        "name": I18n('trendMonth'), "value": 41, toString() {
        return I18n('trendMonth')
    }
    },
];

export const TrendType = [
    {
        "name": I18n('trendAll'), "value": 30, toString() {
        return I18n('trendAll')
    }
    },
    {
        "name": 'Android', "value": 30, toString() {
        return 'Android'
    }
    },
    {
        "name": 'IOS', "value": 30, toString() {
        return 'IOS'
    }
    },
    {
        "name": 'Python', "value": 30, toString() {
        return 'Python'
    }
    },
    {
        "name": 'JavaScript', "value": 30, toString() {
        return 'JavaScript'
    }
    },
    {
        "name": 'JAVA', "value": 30, toString() {
        return 'JAVA'
    }
    },
];