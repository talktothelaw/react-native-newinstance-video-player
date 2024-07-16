package com.newinstancevideoplayer;

import android.app.Activity;

import androidx.annotation.NonNull;

import android.content.pm.ActivityInfo;
import android.view.WindowManager;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.module.annotations.ReactModule;

@ReactModule(name = NewinstanceVideoPlayerModule.NAME)
public class NewinstanceVideoPlayerModule extends ReactContextBaseJavaModule {
  public static final String NAME = "NewinstanceVideoPlayer";
    private static ReactApplicationContext reactContext;

  public NewinstanceVideoPlayerModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  @NonNull
  public String getName() {
    return NAME;
  }


  // Example method
  // See https://reactnative.dev/docs/native-modules-android
  @ReactMethod
  public void enterFullScreen() {
    Activity activity = getCurrentActivity();
    if (activity != null) {
      activity.runOnUiThread(() -> {
        activity.setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE);
        activity.getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN,
          WindowManager.LayoutParams.FLAG_FULLSCREEN);
      });
    }
  }

  @ReactMethod
  public void exitFullScreen() {
    Activity activity = getCurrentActivity();
    if (activity != null) {
      activity.runOnUiThread(() -> {
        activity.setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_UNSPECIFIED);
        activity.getWindow().clearFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN);
      });
    }
  }

}
