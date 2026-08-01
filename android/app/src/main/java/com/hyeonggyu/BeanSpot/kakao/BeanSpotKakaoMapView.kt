package com.hyeonggyu.beanspot.kakao

import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.net.Uri
import android.widget.FrameLayout
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactContext
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.bridge.WritableMap
import com.facebook.react.uimanager.UIManagerHelper
import com.facebook.react.uimanager.events.Event
import com.kakao.vectormap.KakaoMap
import com.kakao.vectormap.KakaoMapReadyCallback
import com.kakao.vectormap.LatLng
import com.kakao.vectormap.MapLifeCycleCallback
import com.kakao.vectormap.MapView
import com.kakao.vectormap.camera.CameraUpdateFactory
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
        override fun onMapDestroy() {}
        override fun onMapError(error: Exception) {}
      },
      object : KakaoMapReadyCallback() {
        override fun onMapReady(map: KakaoMap) {
          kakaoMap = map
          bindLabelClickListener(map)
          bindCameraMoveEndListener(map)
          renderMarkers()
          emitEvent("onMapReady", Arguments.createMap())
          // 최초 표시 영역도 한 번 알려줘야 첫 화면의 공고 목록을 채울 수 있음
          emitCameraChange(map)
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

  fun moveCamera(lat: Double, lng: Double, zoomLevel: Int = 3) {
    val map = kakaoMap ?: run {
      // 맵이 아직 준비 안 됐으면 무시 (initialCamera로 처리됨)
      return
    }
    val position = LatLng.from(lat, lng)
    val update = CameraUpdateFactory.newCenterPosition(position, zoomLevel)
    map.moveCamera(update)
  }

  private fun bindLabelClickListener(map: KakaoMap) {
    map.setOnLabelClickListener { _: KakaoMap, _: LabelLayer, label: Label ->
      val markerId = labelIdToMarkerId[label.labelId]
      if (markerId != null) {
        val payload = Arguments.createMap()
        payload.putString("id", markerId)
        emitEvent("onMarkerPress", payload)
        true
      } else {
        false
      }
    }
  }

  /**
   * 카메라 이동이 끝나면 현재 보이는 영역을 JS 로 알려준다.
   * (지도에 보이는 범위의 공고만 목록에 표시하기 위함)
   */
  private fun bindCameraMoveEndListener(map: KakaoMap) {
    map.setOnCameraMoveEndListener { kakaoMap: KakaoMap, _, _ ->
      emitCameraChange(kakaoMap)
    }
  }

  /** 화면 네 모서리를 좌표로 변환해 보이는 영역(bounds)을 계산 */
  private fun emitCameraChange(map: KakaoMap) {
    val viewWidth = width
    val viewHeight = height
    if (viewWidth <= 0 || viewHeight <= 0) return

    val topLeft = map.fromScreenPoint(0, 0) ?: return
    val bottomRight = map.fromScreenPoint(viewWidth, viewHeight) ?: return

    val payload = Arguments.createMap()
    payload.putDouble("minLat", minOf(topLeft.latitude, bottomRight.latitude))
    payload.putDouble("maxLat", maxOf(topLeft.latitude, bottomRight.latitude))
    payload.putDouble("minLng", minOf(topLeft.longitude, bottomRight.longitude))
    payload.putDouble("maxLng", maxOf(topLeft.longitude, bottomRight.longitude))
    emitEvent("onCameraChange", payload)
  }

  // New Architecture 호환 이벤트 클래스 (Event<T : Event<T>> 셀프 바운드 충족)
  private inner class MapEvent(
    surfaceId: Int,
    viewTag: Int,
    private val name: String,
    private val data: WritableMap,
  ) : Event<MapEvent>(surfaceId, viewTag) {
    override fun getEventName(): String = name
    override fun getEventData(): WritableMap = data
    override fun canCoalesce(): Boolean = false
  }

  /**
   * New Architecture(Fabric) 호환 이벤트 발행.
   * UIManagerHelper를 우선 시도하고, 실패 시 레거시 RCTEventEmitter 로 폴백.
   */
  private fun emitEvent(eventName: String, payload: WritableMap) {
    val reactContext = context as? ReactContext ?: return

    try {
      val dispatcher = UIManagerHelper.getEventDispatcher(reactContext, id)
      val surfaceId = UIManagerHelper.getSurfaceId(this)
      if (dispatcher != null) {
        // Fabric 이벤트명 컨벤션: "top" + PascalCase (e.g. topMarkerPress)
        val fabricName = "top${eventName.replaceFirstChar { it.uppercase() }}"
        dispatcher.dispatchEvent(MapEvent(surfaceId, id, fabricName, payload))
        return
      }
    } catch (_: Exception) {}

    // Fallback: legacy bridge
    @Suppress("DEPRECATION")
    reactContext
      .getJSModule(com.facebook.react.uimanager.events.RCTEventEmitter::class.java)
      ?.receiveEvent(id, eventName, payload)
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
        scheme == "file"       -> BitmapFactory.decodeFile(uri.path)
        scheme == "content"    -> context.contentResolver.openInputStream(uri)?.use {
          BitmapFactory.decodeStream(it)
        }
        else -> null
      }
    } catch (_: Exception) {
      null
    }
  }

  private fun loadBitmapFromResourceName(resourceName: String): Bitmap? {
    val resId = context.resources.getIdentifier(resourceName, "drawable", context.packageName)
    if (resId == 0) return null
    return BitmapFactory.decodeResource(context.resources, resId)
  }
}
