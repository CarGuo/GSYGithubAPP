/**
 * Created by guoshuyu on 2017/11/8.
 */


import {NetInfo, Platform, AsyncStorage} from 'react-native';
import I18n from '../style/i18n'
import * as Constant from '../style/constant'
import * as Code from './netwrokCode'
import handlerError from './netwrokCode'
import {NativeModules, DeviceEventEmitter} from 'react-native';


export const CONTENT_TYPE_JSON = "application/json";
export const CONTENT_TYPE_FORM = "application/x-www-form-urlencoded";

class HttpManager {

    constructor() {
        this.optionParams = {
            timeoutMs: 15000,
            token: null,
            authorizationCode: null,
        };
    };

    /**
     * get请求
     *
     * @param url 请求url
     * @param header 外加头
     * @return {Promise.<*>}
     */
    async getFetch(url, header) {
        return this.netFetch(url, 'GET', null, null, header)
    }

    /**
     * 发起网络请求
     * @param url 请求url
     * @param method 请求方式
     * @param params 请求参数
     * @param json 是否需要json格式的参数请求
     * @param header 外加头
     * @param text 是否text返回
     * @return {Promise.<*>}
     */
    async netFetch(url, method = 'GET', params, json, header, text) {
        let isConnected = await NetInfo.isConnected.fetch().done;

        if (!isConnected) {
            return {
                result: false,
                code: Code.NETWORK_ERROR,
                msg: I18n('netError')
            }
        }

        let headers = {};
        if (header) {
            headers = Object.assign({}, headers, header)
        }

        //授权码
        if (!this.optionParams.authorizationCode) {
            let authorizationCode = await this.getAuthorization();
            if (authorizationCode)
                this.optionParams.authorizationCode = authorizationCode;
        }

        let requestParams;

        headers.Authorization = this.optionParams.authorizationCode;

        if (method !== 'GET') {
            if (json) {
                requestParams = this.formParamsJson(method, params, headers)
            } else {
                requestParams = this.formParams(method, params, headers)
            }
        } else {
            requestParams = this.formParams(method, params, headers)
        }

        let response = await this.requestWithTimeout(this.optionParams.timeoutMs, fetch(url, requestParams), text);

        if (__DEV__) {
            console.log('请求url: ', url);
            console.log('请求参数: ', requestParams);
            console.log('返回参数: ', response);
        }

        if (response && response.status === Code.NETWORK_TIMEOUT) {
            return {
                result: false,
                code: response.status,
                data: handlerError(response.status, response.statusText),
            }
        }
        try {
            if (text) {
                return {
                    data: response,
                    result: true,
                    code: Code.SUCCESS
                }
            } else {
                let responseJson = await response.json();
                if (response.status === 201 && responseJson.token) {
                    this.optionParams.authorizationCode = 'token ' + responseJson.token;
                    AsyncStorage.setItem(Constant.TOKEN_KEY, this.optionParams.authorizationCode);
                }

                if (response.status === 200 || response.status === 201) {
                    return {
                        result: true,
                        code: Code.SUCCESS,
                        data: responseJson,
                        headers: response.headers
                    }
                }
            }
        } catch (e) {
            console.log(e, url);
            return {
                data: response._bodyText,
                result: response.ok,
                code: response.status ? response.status : Code.NETWORK_JSON_EXCEPTION,
                response
            }
        }

        return {
            result: false,
            code: response.status,
            data: handlerError(response.status, response.statusText),
        }
    }

    /**
     * 清除授权
     */
    clearAuthorization() {
        this.optionParams.authorizationCode = null;
        AsyncStorage.removeItem(Constant.TOKEN_KEY);
    }


    /**
     * 获取授权token
     */
    async getAuthorization() {
        let token = await AsyncStorage.getItem(Constant.TOKEN_KEY);
        if (!token) {
            let basic = await AsyncStorage.getItem(Constant.USER_BASIC_CODE);
            if (!basic) {
                //提示输入账号密码
            } else {
                //通过 basic 去获取token，获取到设置，返回token
                return `Basic ${basic}`;
            }
        } else {
            this.optionParams.authorizationCode = token;
            return token;
        }

    }

    /**
     * 格式化json请求参数
     */
    formParamsJson(method, params, headers) {
        const body = JSON.stringify(params);
        const req = {
            method: method,
            headers: new Headers({
                'Content-Type': CONTENT_TYPE_JSON,
                ...(headers || {})
            }),
            body
        };
        return req
    }

    /**
     * 格式化表单请求参数
     */
    formParams(method, params, headers) {
        const str = [];
        for (let p in params) {
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(params[p]));
        }
        let body = null;
        if (str.length > 0) {
            body = str.join("&");
        }
        const req = {
            method: method,
            headers: new Headers({
                    'Content-Type': CONTENT_TYPE_FORM,
                    ...(headers || {})
                }
            ),
            body
        };
        return req
    }

    /**
     * 超时管理
     */
    requestWithTimeout(ms, promise, text) {
        return new Promise((resolve, reject) => {
            const timeoutId = setTimeout(() => {
                resolve({
                    status: Code.NETWORK_TIMEOUT,
                    message: I18n('netTimeout')
                })
            }, ms);
            promise.then(
                (res) => {
                    clearTimeout(timeoutId);
                    if(text) {
                        resolve(res.text());
                    } else {
                        resolve(res);
                    }
                },
                (err) => {
                    clearTimeout(timeoutId);
                    resolve(err);
                }
            );
        })
    }

}

export default new HttpManager();


export const FSModule = {
    download: (opt, callback) => NativeModules.DownloadFileModule.download(opt, callback),
    onProgress: (callback) => DeviceEventEmitter.addListener('DownloadStatus', callback),
    installAPK: (filePath) => NativeModules.DownloadFileModule.installAPK(filePath),
    openFile: (filePath) => NativeModules.DownloadFileModule.openFile(filePath),
    STATUS_PAUSED: () => NativeModules.DownloadFileModule.STATUS_PAUSED,
    STATUS_PENDING: () => NativeModules.DownloadFileModule.STATUS_PENDING,
    STATUS_RUNNING: () => NativeModules.DownloadFileModule.STATUS_RUNNING,
    STATUS_SUCCESSFUL: () => NativeModules.DownloadFileModule.STATUS_SUCCESSFUL,
    STATUS_FAILED: () => NativeModules.DownloadFileModule.STATUS_FAILED,
    STATUS_BUSY: () => NativeModules.DownloadFileModule.STATUS_BUSY,
};