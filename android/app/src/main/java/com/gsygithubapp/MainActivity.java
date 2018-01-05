package com.gsygithubapp;

import android.content.Intent;
import android.os.Bundle;

import com.facebook.react.ReactActivity;
import com.gsygithubapp.module.splash.SplashScreen;

public class MainActivity extends ReactActivity {


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        SplashScreen.show(this,true);
        super.onCreate(savedInstanceState);
		if((getIntent().getFlags() & Intent.FLAG_ACTIVITY_BROUGHT_TO_FRONT) != 0){
		   finish();
		   return;
		}
    }

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "GSYGithubAPP";
    }
}
