package com.hyeonggyu.beanspot.kakao

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.kakao.vectormap.KakaoMapSdk
import android.os.Build

class BeanSpotKakaoMapModule(
  reactContext: ReactApplicationContext,
) : ReactContextBaseJavaModule(reactContext) {
  override fun getName(): String = "BeanSpotKakaoMapModule"

  @ReactMethod
  fun initializeKakaoMapSDK(appKey: String, promise: Promise) {
    KakaoMapSdk.init(reactApplicationContext, appKey)
    promise.resolve(true)
  }

  @ReactMethod
  fun getPrimaryAbi(promise: Promise) {
    val abi = Build.SUPPORTED_ABIS.firstOrNull() ?: Build.CPU_ABI
    promise.resolve(abi)
  }
}
