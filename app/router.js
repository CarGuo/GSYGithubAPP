/**
 * Created by guoshuyu on 2017/11/7.
 */
import React, {Component} from 'react';
import {
    Scene,
    Router,
    Lightbox, Drawer
} from 'react-native-router-flux';
import DynamicPage from './components/DynamicPage'
import LoginPage from './components/LoginPage'
import MyPage from './components/MyPage'
import PersonInfoPage from './components/PersonInfoPage'
import PhotoPage from './components/PhotoPage'
import AboutPage from './components/AboutPage'
import NotifyPage from './components/NotifyPage'
import IssueDetail from './components/IssueDetailPage'
import VersionPage from './components/ReleasePage'
import PersonPage from './components/PersonPage'
import CodeDetailPage from './components/CodeDetailPage'
import SettingPage from './components/SettingPage'
import RepositoryDetail from './components/RepositoryDetailPage'
import PushDetailPage from './components/PushDetailPage'
import TrendPage from './components/TrendPage'
import WebPage from './components/WebPage'
import SearchPage from './components/SearchPage'
import ListPage from './components/ListPage'
import TabIcon from './components/widget/TabIcon'
import TextInputModal from './components/common/CommonTextInputModal'
import CommentConfirmModal from './components/common/CommonConfirmModal'
import LoadingModal from './components/common/LoadingModal'
import CommonOptionModal from './components/common/CommonOptionModal'
import DrawerFilter from './components/widget/SearchDrawerFilter'
import CustomBackButton from './components/widget/CustomBackButton'
import CustomDrawerButton from './components/widget/CustomDrawerButton'
import SearchButton from './components/widget/CustomSearchButton'
import CommonIconButton from './components/common/CommonIconButton'
import styles from './style'
import I18n, {changeLocale} from './style/i18n'
import * as Constant from './style/constant'
import BackUtils from './utils/backUtils'
import {CommonMoreRightBtnPress, RepositoryDetailRightBtnPress} from './utils/actionUtils'

import WelcomePage from "./components/WelcomePage"
import {screenWidth, drawerWidth} from "./style/index";

/**
 * 全局路由
 */
const getRouter = () => {
    return (
        <Router
            getSceneStyle={() => {
                return styles.routerStyle
            }}
            backAndroidHandler={
                BackUtils()}>
            <Lightbox>
                <Scene key="main">
                    <Scene key="WelcomePage" component={WelcomePage} hideNavBar hideTabBar hide/>
                </Scene>
                <Scene key="LoginPage" component={LoginPage}
                       showLabel={false}
                       hideNavBar/>
                <Scene key="root"
                       navigationBarStyle={styles.navigationBar}
                       titleStyle={{color: Constant.titleTextColor}}>
                    <Scene key="mainTabPage"
                           tabs
                           lazy
                           wrap={false}
                           showLabel={false}
                           tabBarPosition={"bottom"}
                           title={I18n('appName')}
                           renderRightButton={
                               () => <SearchButton/>
                           }
                           tabBarStyle={{
                               height: Constant.tabBarHeight,
                               alignItems: 'center',
                               justifyContent: 'center',
                               backgroundColor: Constant.tabBackgroundColor
                           }}>
                        <Scene
                            key="DynamicPage"
                            component={DynamicPage}
                            icon={TabIcon}
                            title={I18n('tabDynamic')}
                            tabIconName={'tabDynamic'}
                        />
                        <Scene
                            key="TrendPage"
                            component={TrendPage}
                            icon={TabIcon}
                            title={I18n('tabRecommended')}
                            tabIconName={'tabRecommended'}
                        />
                        <Scene
                            key="MyPage"
                            component={MyPage}
                            icon={TabIcon}
                            title={I18n('tabMy')}
                            tabIconName={'tabMy'}
                        />
                    </Scene>
                    <Scene key="PersonPage" component={PersonPage}
                           needRightBtn={true}
                           rightBtn={'ios-more'}
                           iconType={2}
                           rightBtnPress={(params) => {
                               return CommonMoreRightBtnPress(params)
                           }}
                           renderRightButton={(params) => <CommonIconButton data={params}/>}
                           renderLeftButton={() => <CustomBackButton/>}/>
                    <Scene key="SettingPage" component={SettingPage} title={I18n('setting')}
                           renderLeftButton={() => <CustomBackButton/>}
                    />
                    <Scene key="ListPage" component={ListPage}
                           renderRightButton={(params) => <CommonIconButton data={params}/>}
                           renderLeftButton={() => <CustomBackButton/>}
                    />
                    <Drawer key="SearchPageDrawer"
                            contentComponent={DrawerFilter}
                            drawerPosition={'right'}
                            hideNavBar
                            drawerWidth={drawerWidth}
                            drawerIcon={<CustomDrawerButton/>}
                            renderLeftButton={() => <CustomBackButton/>}>
                        <Scene key="SearchPage" component={SearchPage} title={I18n('search')}/>
                    </Drawer>
                    <Scene key="RepositoryDetail" component={RepositoryDetail}
                           needRightBtn={true}
                           rightBtn={'ios-more'}
                           iconType={2}
                           rightBtnPress={(params) => {
                               return RepositoryDetailRightBtnPress(params)
                           }}
                           renderRightButton={(params) => <CommonIconButton data={params}/>}
                           renderLeftButton={() => <CustomBackButton/>}
                    />
                    <Scene key="IssueDetail" component={IssueDetail}
                           rightBtn={'ios-more'}
                           iconType={2}
                           rightBtnPress={(params) => {
                               return CommonMoreRightBtnPress(params)
                           }}
                           renderRightButton={(params) => <CommonIconButton data={params}/>}
                           renderLeftButton={() => <CustomBackButton/>}
                    />
                    <Scene key="PushDetailPage" component={PushDetailPage}
                           needRightBtn={true}
                           rightBtn={'ios-more'}
                           iconType={2}
                           rightBtnPress={(params) => {
                               return CommonMoreRightBtnPress(params)
                           }}
                           renderRightButton={(params) => <CommonIconButton data={params}/>}
                           renderLeftButton={() => <CustomBackButton/>}
                    />
                    <Scene key="VersionPage" component={VersionPage}
                           renderRightButton={(params) => <CommonIconButton data={params}/>}
                           renderLeftButton={() => <CustomBackButton/>}
                    />
                    <Scene key="NotifyPage" component={NotifyPage}
                           title={I18n('notify')}
                           renderRightButton={(params) => <CommonIconButton data={params}/>}
                           renderLeftButton={() => <CustomBackButton/>}
                    />
                    <Scene key="CodeDetailPage" component={CodeDetailPage}
                           title={I18n('notify')}
                           needRightBtn={true}
                           rightBtn={'ios-more'}
                           iconType={2}
                           rightBtnPress={(params) => {
                               return CommonMoreRightBtnPress(params)
                           }}
                           renderRightButton={(params) => <CommonIconButton data={params}/>}
                           renderLeftButton={() => <CustomBackButton/>}
                    />
                    <Scene key="AboutPage" component={AboutPage}
                           title={I18n('about')}
                           renderLeftButton={() => <CustomBackButton/>}
                    />
                    <Scene key="PersonInfoPage" component={PersonInfoPage}
                           title={I18n('about')}
                           renderLeftButton={() => <CustomBackButton/>}
                    />
                    <Scene key="WebPage" component={WebPage}
                           hideNavBar
                    />
                    <Scene key="PhotoPage" component={PhotoPage}
                           hideNavBar
                    />
                </Scene>
                <Scene key="LoadingModal" component={LoadingModal}/>
                <Scene key="TextInputModal" component={TextInputModal}/>
                <Scene key="ConfirmModal" component={CommentConfirmModal}/>
                <Scene key="OptionModal" component={CommonOptionModal}/>
                <Scene key="PhotoPage" component={PhotoPage}/>
            </Lightbox>
        </Router>
    )
};


export default getRouter;