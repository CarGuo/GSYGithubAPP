import I18n from '../style/i18n'

export const TrendTime = [
    {
        "name": I18n('trendDay'), "value": 'daily', toString() {
        return I18n('trendDay')
    }
    },
    {
        "name": I18n('trendWeek'), "value": 'weekly', toString() {
        return I18n('trendWeek')
    }
    },
    {
        "name": I18n('trendMonth'), "value": 'monthly', toString() {
        return I18n('trendMonth')
    }
    },
];

export const TrendType = [
    {
        "name": I18n('trendAll'), "value": null, toString() {
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
        "name": 'Objective-C', "value": 'Objective-C', toString() {
        return 'Objective-C'
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
        "name": 'C++', "value": 'C++', toString() {
        return 'C++'
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