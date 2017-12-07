package com.gsygithubapp.module.download;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.database.Cursor;
import android.net.Uri;
import android.os.Environment;
import android.webkit.MimeTypeMap;


import android.app.DownloadManager;
import android.app.DownloadManager.Request;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.io.File;
import java.util.HashMap;
import java.util.Map;

public class DownloadFileModule extends ReactContextBaseJavaModule {
    // 定义常量
    private static final String STATUS_PAUSED = "STATUS_PAUSED";
    private static final String STATUS_PENDING = "STATUS_PENDING";
    private static final String STATUS_RUNNING = "STATUS_RUNNING";
    private static final String STATUS_SUCCESSFUL = "STATUS_SUCCESSFUL";
    private static final String STATUS_FAILED = "STATUS_FAILED";
    private static final String STATUS_BUSY = "STATUS_BUSY";

    private static final String EVENT_NAME = "DownloadStatus";

    private DownloadManager downloadManager;
    private Callback rctCallback = null;
    private ReadableMap rctParams;
    private ReactApplicationContext mApplicationContext;
    private long mTaskId;

    public DownloadFileModule(ReactApplicationContext reactContext) {
        super(reactContext);
        mApplicationContext = getReactApplicationContext();
        downloadManager = (DownloadManager) reactContext.getSystemService(reactContext.DOWNLOAD_SERVICE);
    }

    @Override
    public String getName() {
        return "DownloadFileModule";
    }

    public void sendMessage(Integer status, String description, String url) {
        if (rctCallback != null) {
            WritableMap map = Arguments.createMap();
            map.putInt("status", status);
            map.putString("description", description);
            map.putString("url", url);
            rctCallback.invoke(map);
            rctCallback = null;
        }
    }
    //广播接受者，接收下载状态
    private BroadcastReceiver receiver = new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
            checkDownloadStatus();//检查下载状态
        }
    };


    @Override
    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();
        constants.put(STATUS_PAUSED, DownloadManager.STATUS_PAUSED);
        constants.put(STATUS_PENDING, DownloadManager.STATUS_PENDING);
        constants.put(STATUS_RUNNING, DownloadManager.STATUS_RUNNING);
        constants.put(STATUS_SUCCESSFUL, DownloadManager.STATUS_SUCCESSFUL);
        constants.put(STATUS_FAILED, DownloadManager.STATUS_FAILED);
        constants.put(STATUS_BUSY, -2);
        return constants;
    }

    //检查下载状态
    private void checkDownloadStatus() {
        String url = rctParams.hasKey("url") ? rctParams.getString("url") : null;
        String description = rctParams.hasKey("description") ? rctParams.getString("description") : "downloading";
        DownloadManager.Query query = new DownloadManager.Query();
        query.setFilterById(mTaskId);//筛选下载任务，传入任务ID，可变参数
        Cursor c = downloadManager.query(query);
        if (c.moveToFirst()) {
            int status = c.getInt(c.getColumnIndex(DownloadManager.COLUMN_STATUS));
            String downloadPath = c.getString(c.getColumnIndex(DownloadManager.COLUMN_LOCAL_FILENAME));
            switch (status) {
                case DownloadManager.STATUS_PAUSED:
                case DownloadManager.STATUS_PENDING:
                case DownloadManager.STATUS_RUNNING:
                    WritableMap map = Arguments.createMap();
                    map.putInt("status", status);
                    map.putString("description", description);
                    map.putString("url", url);
                    sendEvent(mApplicationContext, EVENT_NAME, map);
                    break;
                case DownloadManager.STATUS_SUCCESSFUL:
                    // String downloadPath = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS).getAbsolutePath() + File.separator + description;
                    sendMessage(status, downloadPath, url);
                    break;
                case DownloadManager.STATUS_FAILED:
                    sendMessage(status, description, url);
                    break;
            }
        }
    }

    /**
     * 安装
     */
    @ReactMethod
    public void installAPK(String downloadPath) {
        File file = new File(downloadPath);
        if (!file.exists()) return;
        Intent intent = new Intent(Intent.ACTION_VIEW);
        Uri uri = Uri.parse("file://" + file.toString());
        intent.setDataAndType(uri, "application/vnd.android.package-archive");
        //在服务中开启activity必须设置flag,后面解释
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        mApplicationContext.startActivity(intent);
    }


    @ReactMethod
    public void download(final ReadableMap params, Callback callback) {
        // 获取参数
        String url = params.hasKey("url") ? params.getString("url") : null;
        String description = params.hasKey("description") ? params.getString("description") : "downloading";
        // 判断是否未回调继续调用
        if (rctCallback != null) {
            WritableMap map = Arguments.createMap();
            map.putInt("status", -2);
            map.putString("description", "busy");
            map.putString("url", url);
            callback.invoke(map);
            return;
        }
        rctCallback = callback;
        rctParams = params;
        // 设置参数
        DownloadManager.Request request = new Request(Uri.parse(url));
        request.setAllowedNetworkTypes(Request.NETWORK_WIFI);

        request.setNotificationVisibility(Request.VISIBILITY_VISIBLE); // 是否通知
        MimeTypeMap mimeTypeMap = MimeTypeMap.getSingleton();
        String mimeString = mimeTypeMap.getMimeTypeFromExtension(MimeTypeMap.getFileExtensionFromUrl(url));
        request.setMimeType(mimeString); // 下载的文件类型
        request.setTitle("下载"); // 通知栏的标题
        request.setDescription(description); // 通知栏描述
        request.setAllowedOverRoaming(true); //漫游网络是否可以下载
        request.setAllowedOverMetered(true);
        request.setVisibleInDownloadsUi(true);

        //设置文件存放目录
        request.setDestinationInExternalFilesDir(mApplicationContext, Environment.DIRECTORY_DOWNLOADS, description);
        mTaskId = downloadManager.enqueue(request);
        //注册广播接收者，监听下载状态
        mApplicationContext.registerReceiver(receiver, new IntentFilter(DownloadManager.ACTION_DOWNLOAD_COMPLETE));
    }

    /**
     * 打开文件
     *
     * @param downloadPath
     */
    @ReactMethod
    private void openFile(String downloadPath) {
        File file = new File(downloadPath);
        if (!file.exists()) return;
        Intent intent = new Intent(Intent.ACTION_VIEW);
        String url = "file://" + file.toString();
        MimeTypeMap mimeTypeMap = MimeTypeMap.getSingleton();
        String mimeString = mimeTypeMap.getMimeTypeFromExtension(MimeTypeMap.getFileExtensionFromUrl(url));
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        //设置intent的Action属性
        intent.setAction(Intent.ACTION_VIEW);
        //设置intent的data和Type属性。
        intent.setDataAndType(Uri.parse(url), mimeString);
        //跳转
        mApplicationContext.startActivity(intent);
        //这里最好try一下，有可能会报错。
        //比如说你的MIME类型是打开邮箱，但是你手机里面没装邮箱客户端，就会报错。
    }

    private void sendEvent(ReactApplicationContext reactContext, String eventName, WritableMap params) {
        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, params);
    }
};