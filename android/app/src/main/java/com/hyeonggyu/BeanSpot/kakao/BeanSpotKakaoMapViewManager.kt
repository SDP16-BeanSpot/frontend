package com.hyeonggyu.beanspot.kakao

import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp
import kotlin.math.roundToInt

class BeanSpotKakaoMapViewManager : SimpleViewManager<BeanSpotKakaoMapView>() {
  override fun getName(): String = "BeanSpotKakaoMapView"

  override fun createViewInstance(reactContext: ThemedReactContext): BeanSpotKakaoMapView {
    return BeanSpotKakaoMapView(reactContext)
  }

  @ReactProp(name = "markers")
  fun setMarkers(view: BeanSpotKakaoMapView, markers: ReadableArray?) {
    if (markers == null) {
      view.setMarkers(emptyList())
      return
    }

    val parsed = mutableListOf<MarkerData>()
    for (i in 0 until markers.size()) {
      val marker = markers.getMap(i) ?: continue
      parseMarker(marker)?.let(parsed::add)
    }
    view.setMarkers(parsed)
  }

  @ReactProp(name = "markerImage")
  fun setMarkerImage(view: BeanSpotKakaoMapView, markerImage: String?) {
    view.setMarkerImageUri(markerImage)
  }

  @ReactProp(name = "camera")
  fun setCamera(view: BeanSpotKakaoMapView, camera: ReadableMap?) {
    if (camera == null) return
    val lat = if (camera.hasKey("lat")) camera.getDouble("lat") else return
    val lng = if (camera.hasKey("lng")) camera.getDouble("lng") else return
    val zoom = if (camera.hasKey("zoomLevel")) camera.getDouble("zoomLevel").roundToInt() else 3
    view.moveCamera(lat, lng, zoom)
  }

  override fun getExportedCustomDirectEventTypeConstants(): Map<String, Any> {
    return mapOf(
      "onMarkerPress" to mapOf("registrationName" to "onMarkerPress"),
      "onMapReady" to mapOf("registrationName" to "onMapReady"),
    )
  }

  private fun parseMarker(marker: ReadableMap): MarkerData? {
    val id = marker.getString("id") ?: return null
    val latitude = marker.getDouble("latitude")
    val longitude = marker.getDouble("longitude")
    val title = if (marker.hasKey("title")) marker.getString("title") else null
    val category = if (marker.hasKey("category")) marker.getString("category") else null

    return MarkerData(
      id = id,
      title = title,
      latitude = latitude,
      longitude = longitude,
      category = category,
    )
  }
}
