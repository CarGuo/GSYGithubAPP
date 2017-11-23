import I18n from '../style/i18n'

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
    {name: "fewest_stars", value: 'most%20stars', select: false},
    {name: "most_forks", value: 'most%20forks', select: false},
    {name: "fewest_forks", value: 'fewest%20forks', select: false},
    {name: "recently_updated", value: 'recently%20updated', select: false},
    {name: "least_recently_updated", value: 'least%20recently%20updated', select: false},
];