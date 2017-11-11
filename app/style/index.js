/**
 * Created by guoshuyu on 2017/11/7.
 */
import React, {StyleSheet, Dimensions, PixelRatio, Platform, StatusBar} from "react-native";
import * as constant from "./constant"

export const {screenWidth, screenHeight} = Dimensions.get("window");
export const navBarHeight = Platform.OS == 'ios' ? constant.iosnavHeaderHeight : constant.andrnavHeaderHeight

export default StyleSheet.create({
    routerStyle: {
        //设置router的样式
        flex: 1,
        backgroundColor: '#fff',
        shadowColor: null,
        shadowOffset: null,
        shadowOpacity: null,
        shadowRadius: null,

    },
    navigationBar: {
        backgroundColor: constant.primaryColor,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: constant.lineColor,
        paddingTop: StatusBar.currentHeight,
    },
    mainBgColor: {
        backgroundColor: constant.mainBackgroundColor
    },
    mainBox: {
        backgroundColor: constant.mainBackgroundColor,
        flex: 1
    },
    flex: {
        flex: 1,
    },
    flexDirectionRow: {
        flexDirection: 'row',
        flex: 1,
    },
    flexDirectionColumn: {
        flexDirection: "column",
        flex: 1,
    },
    flexDirectionRowNotFlex: {
        flexDirection: 'row',
    },
    flexDirectionColumnNotFlex: {
        flexDirection: "column",
    },
    justifyCenter: {
        justifyContent: "center"
    },
    centered: {
        justifyContent: "center",
        alignItems: "center"
    },
    centerV: {
        justifyContent: "center",
    },

    centerH: {
        alignItems: "center"
    },
    welcomeText: {
        color: constant.primaryColor,
        fontSize: constant.largetTextSize,
        fontWeight: "bold",
        textAlign: "center"
    },
    smallText: {
        color: constant.mainTextColor,
        fontSize: constant.smallTextSize
    },
    subSmallText: {
        color: constant.subTextColor,
        fontSize: constant.smallTextSize
    },
    normalText: {
        color: constant.mainTextColor,
        fontSize: constant.normalTextSize
    },
    subNormalText: {
        color: constant.subTextColor,
        fontSize: constant.normalTextSize
    },


});