import React, { useState, useMemo, useCallback, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { Calendar, LocaleConfig, CalendarUtils } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MarkedDates } from 'react-native-calendars/src/types';

// --- 바텀시트 Import ---
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetFlatList, // FlatList 대신 사용
} from '@gorhom/bottom-sheet';
// --- 제스처 핸들러 Import ---
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// --- 언어 설정 (이전과 동일) ---
LocaleConfig.locales['kr'] = {
  monthNames: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
  monthNamesShort: ['1.','2.','3.','4.','5.','6.','7.','8.','9.','10.','11.','12.'],
  dayNames: ['일요일','월요일','화요일','수요일','목요일','금요일','토요일'],
  dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
  today: '오늘',
};
LocaleConfig.defaultLocale = 'kr';

// --- 오늘 날짜 ---
const TODAY_STR = CalendarUtils.getCalendarDateString(new Date());

// --- 일정 항목 타입 정의 (이전과 동일) ---
interface ScheduleItem {
  name: string;
  details: string;
  type: string;
  dotColor?: string;
}

const CalendarScreenContent = () => { // 컴포넌트를 분리하여 Provider 내부에 렌더링
  // --- 일정 데이터 (이전과 동일) ---
  const [items, setItems] = useState<{ [key: string]: ScheduleItem[] }>({
    '2025-06-07': [{ name: '모종', details: '파 심기', type: '심은날', dotColor: 'orange' }],
    '2025-06-17': [
      { name: '당근 🥕', details: '메모를 추가하세요', type: '비료주기', dotColor: 'orange' },
    ],
    '2025-06-19': [{ name: '상추', details: '수확하기', type: '수확', dotColor: 'blue' }],
    '2025-06-20': [
      { name: '감자 🥔', details: '어제 비 옴, 상태 보고 추가로 줄 것!', type: '물주기', dotColor: 'blue' },
      { name: '시금치 🥬', details: '메모를 추가하세요', type: '심은날', dotColor: 'green' },
    ],
    '2025-06-25': [{ name: '고구마', details: '순 정리하기', type: '관리', dotColor: 'red' }],
  });

  // --- 상태 (이전과 동일) ---
  const [selectedDate, setSelectedDate] = useState(TODAY_STR);
  const [currentMonth, setCurrentMonth] = useState(TODAY_STR);

  // --- 바텀시트 Ref 및 Snap Points ---
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  // 바텀시트 높이 (화면의 40%, 80% 지점)
  const snapPoints = useMemo(() => ['40%', '80%'], []);

  // --- 캘린더 마킹 로직 (이전과 동일) ---
  const memoizedMarkedDates = useMemo(() => {
    const marked: MarkedDates = {};
    Object.keys(items).forEach((date) => {
      const dots = items[date].map((item, index) => ({
        key: `${date}-${index}`,
        color: item.dotColor || '#FFD700',
      }));
      marked[date] = { ...marked[date], dots: dots };
    });
    marked[selectedDate] = {
      ...marked[selectedDate],
      selected: true,
      customStyles: {
        container: { backgroundColor: '#D3D3D3', borderRadius: 16 },
        text: { color: 'black' },
      },
    };
    marked[TODAY_STR] = {
      ...marked[TODAY_STR],
      customStyles: {
        container: { backgroundColor: '#8B4513', borderRadius: 16 },
        text: { color: 'white', fontWeight: 'bold' as 'bold' },
      },
    };
    return marked;
  }, [selectedDate, items]);

  // --- 날짜 포맷 함수 (이전과 동일) ---
  const formatMonthYear = useCallback((dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월`;
  }, []);

  // --- 캘린더 날짜 클릭 핸들러 (수정됨) ---
  const handleDayPress = useCallback((day: any) => {
    setSelectedDate(day.dateString);
    // 날짜를 누르면 바텀시트가 올라오도록 함
    bottomSheetModalRef.current?.present();
  }, []);

  // --- FlatList 항목 렌더링 (최적화를 위해 useCallback 추가) ---
  const renderItem = useCallback(({ item }: { item: ScheduleItem }) => {
    return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => Alert.alert(item.name)}
      >
        <View style={styles.itemTagContainer}>
          <Text style={styles.itemTag}>{item.name}</Text>
          <Text style={styles.itemTagLight}>{"꾸꿍이네 텃밭"}</Text>
          <Text style={styles.itemTagLight}>💧 {item.type}</Text>
        </View>
        <Text style={styles.itemDetails}>{item.details}</Text>
        <View style={styles.checkbox} />
      </TouchableOpacity>
    );
  }, []);

  // --- FlatList 빈 항목 (최적화를 위해 useCallback 추가) ---
  const renderEmptyDate = useCallback(() => (
    <View style={styles.emptyDateContainer}>
      <Text style={styles.emptyDateText}>선택한 날짜에 일정이 없습니다.</Text>
    </View>
  ), []);

  // --- FlatList 헤더 (디자인의 '6월 20일' 부분) ---
  const renderListHeader = useCallback(() => (
    <Text style={styles.listHeaderText}>
      {/* '2025년 6월'에서 '6월'만 추출 */}
      {formatMonthYear(selectedDate).split(' ')[1]}{' '}
      {/* '2025-06-20'에서 '20'일만 추출 */}
      {new Date(selectedDate).getDate()}일
    </Text>
  ), [selectedDate, formatMonthYear]);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* --- 1. 상단 헤더 (이전과 동일) --- */}
      <View style={styles.topHeader}>
        <TouchableOpacity style={styles.monthSelector}>
          <Text style={styles.monthText}>{formatMonthYear(currentMonth)}</Text>
          <Ionicons name="chevron-down-outline" size={16} color="black" style={{ marginLeft: 5 }} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="settings-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* --- 2. 토글 (이전과 동일) --- */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity style={[styles.toggleButton, styles.toggleActive]}>
          <Text style={[styles.toggleText, styles.toggleActiveText]}>작물</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.toggleButton}>
          <Text style={styles.toggleText}>일기</Text>
        </TouchableOpacity>
      </View>

      {/* --- 3. 캘린더 (onDayPress 수정됨) --- */}
      <Calendar
        initialDate={'2025-06-01'}
        onDayPress={handleDayPress} // 수정된 핸들러 연결
        onMonthChange={(month) => {
          setCurrentMonth(month.dateString);
        }}
        markingType={'custom'}
        markedDates={memoizedMarkedDates}
        hideExtraDays={true}
        enableSwipeMonths={true}
        theme={{
          textSectionTitleColor: 'black',
          textDayFontWeight: '400',
          textDayHeaderFontWeight: '500',
          textDayHeaderFontSize: 14,
          dayTextColor: 'black',
          textDisabledColor: '#d9e1e8',
          todayTextColor: '#8B4513',
          arrowColor: '#8B4513',
        }}
        dayComponent={({ date, state, marking, onPress }) => {
          let defaultDayTextColor = 'black';
          if (date) {
            const jsDate = new Date(date.year, date.month - 1, date.day);
            const dayOfWeek = jsDate.getDay(); // 0 = 일요일, 6 = 토요일
            if (dayOfWeek === 0) defaultDayTextColor = 'red';
            else if (dayOfWeek === 6) defaultDayTextColor = 'blue';
          }
          return (
            <TouchableOpacity onPress={() => onPress && onPress(date!)} style={styles.dayWrapper} disabled={state === 'disabled'}>
              <View style={[styles.dayContainer, marking?.customStyles?.container]}>
                <Text style={[
                  styles.dayText,
                  { color: defaultDayTextColor },
                  marking?.customStyles?.text,
                  state === 'disabled' && styles.disabledDayText,
                ]}>
                  {date?.day}
                </Text>
              </View>
              {marking?.dots && (
                <View style={styles.dotsContainer}>
                  {marking.dots.map((dot, index) => (
                    <View key={index} style={[styles.dot, { backgroundColor: dot.color }]} />
                  ))}
                </View>
              )}
            </TouchableOpacity>
          );
        }}
      />

      {/* --- 4. 바텀 시트 모달 --- */}
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0} // 처음 로드될 때 첫 번째 snapPoint (40%) 높이로 보임
        snapPoints={snapPoints}
        handleIndicatorStyle={styles.bottomSheetHandle} // 상단 손잡이 스타일
      >
        <View style={styles.bottomSheetContentContainer}>
          <BottomSheetFlatList
            data={items[selectedDate] || []}
            renderItem={renderItem}
            keyExtractor={(item, index) => `${item.name}-${index}`}
            ListHeaderComponent={renderListHeader} // '6월 20일' 헤더
            ListEmptyComponent={renderEmptyDate}
            contentContainerStyle={styles.listContentContainer} // 리스트 내부 패딩
          />
          {/* --- 5. FAB (바텀 시트 안으로 이동) --- */}
          <TouchableOpacity style={styles.fab}>
            <Ionicons name="add" size={30} color="white" />
          </TouchableOpacity>
        </View>
      </BottomSheetModal>
    </SafeAreaView>
  );
};

// --- 최종 내보내기 ---
// GestureHandlerRootView와 BottomSheetModalProvider로 전체 화면을 감싸야 합니다.
export default function CalendarScreen() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <CalendarScreenContent />
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  monthSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  monthText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  toggleContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: 'white',
  },
  toggleButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 10,
  },
  toggleActive: {
    backgroundColor: '#333',
  },
  toggleText: {
    color: '#555',
    fontWeight: 'bold',
  },
  toggleActiveText: {
    color: 'white',
  },
  // --- 캘린더 DayComponent 스타일 (이전과 동일) ---
  dayWrapper: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 2,
    marginVertical: 4,
    position: 'relative',
  },
  dayContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayText: {
    fontSize: 14,
    textAlign: 'center',
  },
  disabledDayText: {
    color: '#d9e1e8',
  },
  dotsContainer: {
    flexDirection: 'row',
    marginTop: 2,
    position: 'absolute',
    bottom: -6,
    left: 0,
    right: 0,
    justifyContent: 'center',
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginHorizontal: 1,
  },

  // --- 🎨 바텀시트 및 리스트 스타일 (수정됨) ---
  bottomSheetContentContainer: {
    flex: 1, // 바텀시트 내부를 꽉 채움
    position: 'relative', // FAB를 positioning하기 위함
  },
  bottomSheetHandle: {
    backgroundColor: '#D3D3D3', // 손잡이 색상
    width: 40,
  },
  listHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  listContentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 80, // FAB와 겹치지 않도록 하단 여백
  },
  itemContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#eee',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  itemTagContainer: {
    flexDirection: 'row',
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  itemTag: {
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginRight: 6,
    marginBottom: 4,
    fontSize: 12,
    fontWeight: 'bold',
  },
  itemTagLight: {
    backgroundColor: '#f9f9f9',
    color: '#777',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginRight: 6,
    marginBottom: 4,
    fontSize: 12,
  },
  itemDetails: {
    fontSize: 14,
    color: '#333',
  },
  checkbox: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  emptyDateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 20,
  },
  emptyDateText: {
    color: '#999',
    fontSize: 14,
  },
  // --- FAB (수정됨: 바텀시트 기준 absolute) ---
  fab: {
    position: 'absolute',
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    bottom: 20, // 바텀시트 하단 기준
    backgroundColor: 'green',
    borderRadius: 28,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});