/**
 * Created by guoshuyu on 2017/11/7.
 */
import React, {StyleSheet, Dimensions, PixelRatio} from "react-native";
import * as constant from "./constant"

export const {screenWidth, screenHeight} = Dimensions.get("window");

export default StyleSheet.create({
    mainBgColor: {
        backgroundColor: constant.mainBackgroundColor
    },
    mainBox: {
        backgroundColor: constant.mainBackgroundColor,
        flex: 1
    },
    justifyCenter: {
        justifyContent: "center"
    },
    centered: {
        justifyContent: "center",
        alignItems: "center"
    },
    welcomeText: {
        color: constant.primaryColor,
        fontSize: constant.largetTextSize,
        fontWeight: "bold",
        textAlign: "center"
    }

});