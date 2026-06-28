package com.hyeonggyu.beanspot.kakao

import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.net.Uri
import android.widget.FrameLayout
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactContext
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.events.RCTEventEmitter
import com.kakao.vectormap.KakaoMap
import com.kakao.vectormap.KakaoMapReadyCallback
import com.kakao.vectormap.LatLng
import com.kakao.vectormap.MapLifeCycleCallback
import com.kakao.vectormap.MapView
import com.kakao.vectormap.label.Label
import com.kakao.vectormap.label.LabelLayer
import com.kakao.vectormap.label.LabelOptions
import com.kakao.vectormap.label.LabelStyle
import com.kakao.vectormap.label.LabelStyles

data class MarkerData(
  val id: String,
  val title: String?,
  val latitude: Double,
  val longitude: Double,
  val category: String?,
)

class BeanSpotKakaoMapView(context: ThemedReactContext) : FrameLayout(context) {
  private val mapView = MapView(context)
  private var kakaoMap: KakaoMap? = null
  private var pendingMarkers: List<MarkerData> = emptyList()
  private var markerImageUri: String? = null
  private val labelIdToMarkerId = mutableMapOf<String, String>()

  init {
    addView(
      mapView,
      LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT),
    )

    mapView.start(
      object : MapLifeCycleCallback() {
        override fun onMapDestroy() {
          // no-op
        }

        override fun onMapError(error: Exception) {
          // no-op
        }
      },
      object : KakaoMapReadyCallback() {
        override fun onMapReady(map: KakaoMap) {
          kakaoMap = map
          bindLabelClickListener(map)
          renderMarkers()
          emitMapReady()
        }
      },
    )
  }

  fun setMarkers(markers: List<MarkerData>) {
    pendingMarkers = markers
    renderMarkers()
  }

  fun setMarkerImageUri(uri: String?) {
    markerImageUri = uri
    renderMarkers()
  }

  private fun bindLabelClickListener(map: KakaoMap) {
    map.setOnLabelClickListener { _: KakaoMap, _: LabelLayer, label: Label ->
      val markerId = labelIdToMarkerId[label.labelId]
      if (markerId != null) {
        emitMarkerPress(markerId)
        true
      } else {
        false
      }
    }
  }

  private fun emitMarkerPress(markerId: String) {
    val event = Arguments.createMap()
    event.putString("id", markerId)
    val reactContext = context as? ReactContext ?: return
    reactContext
      .getJSModule(RCTEventEmitter::class.java)
      .receiveEvent(id, "onMarkerPress", event)
  }

  private fun emitMapReady() {
    val reactContext = context as? ReactContext ?: return
    reactContext
      .getJSModule(RCTEventEmitter::class.java)
      .receiveEvent(id, "onMapReady", Arguments.createMap())
  }

  private fun renderMarkers() {
    val map = kakaoMap ?: return
    val labelLayer = map.labelManager?.layer ?: return

    labelLayer.removeAll()
    labelIdToMarkerId.clear()

    val labelStyles = buildLabelStyles()

    pendingMarkers.forEach { marker ->
      val position = LatLng.from(marker.latitude, marker.longitude)
      val options = LabelOptions.from(position)
      if (labelStyles != null) {
        options.setStyles(labelStyles)
      }

      val label = labelLayer.addLabel(options)
      labelIdToMarkerId[label.labelId] = marker.id
    }
  }

  private fun buildLabelStyles(): LabelStyles? {
    val uri = markerImageUri ?: return null
    val bitmap = loadBitmap(uri) ?: return null
    val style = LabelStyle.from(bitmap)
    return LabelStyles.from(style)
  }

  private fun loadBitmap(uriString: String): Bitmap? {
    return try {
      val uri = Uri.parse(uriString)
      val scheme = uri.scheme
      when {
        scheme.isNullOrBlank() -> loadBitmapFromResourceName(uriString)
        scheme == "file" -> BitmapFactory.decodeFile(uri.path)
        scheme == "content" -> context.contentResolver.openInputStream(uri)?.use {
          BitmapFactory.decodeStream(it)
        }
        else -> null
      }
    } catch (_: Exception) {
      null
    }
  }

  private fun loadBitmapFromResourceName(resourceName: String): Bitmap? {
    val resId = context.resources.getIdentifier(
      resourceName,
      "drawable",
      context.packageName,
    )
    if (resId == 0) {
      return null
    }
    return BitmapFactory.decodeResource(context.resources, resId)
  }
}
