import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';

const ITEM_HEIGHT = 44;
const VISIBLE_ITEMS = 3;
const PICKER_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS;

const YEARS  = Array.from({ length: 11 }, (_, i) => 2020 + i);
const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);

function daysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate();
}

// ─── WheelPicker ──────────────────────────────────────────────────────────────

interface WheelPickerProps {
  items: number[];
  selectedValue: number;
  onValueChange: (value: number) => void;
  formatter?: (v: number) => string;
}

const WheelPicker: React.FC<WheelPickerProps> = ({
  items,
  selectedValue,
  onValueChange,
  formatter,
}) => {
  const scrollRef = useRef<ScrollView>(null);

  // selectedValue 또는 items 변경 시 스크롤 위치 동기화
  useEffect(() => {
    const idx = items.indexOf(selectedValue);
    if (scrollRef.current && idx >= 0) {
      scrollRef.current.scrollTo({ y: idx * ITEM_HEIGHT, animated: false });
    }
  }, [selectedValue, items]);

  const handleMomentumEnd = (e: any) => {
    const idx = Math.round(e.nativeEvent.contentOffset.y / ITEM_HEIGHT);
    const clamped = Math.max(0, Math.min(idx, items.length - 1));
    onValueChange(items[clamped]);
  };

  return (
    <View style={picker.wrap}>
      <View style={picker.highlight} pointerEvents="none" />
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        onMomentumScrollEnd={handleMomentumEnd}
        contentContainerStyle={{ paddingVertical: ITEM_HEIGHT }}
        style={{ height: PICKER_HEIGHT }}
      >
        {items.map((item) => (
          <View key={item} style={picker.item}>
            <Text style={[picker.itemText, item === selectedValue && picker.selectedText]}>
              {formatter ? formatter(item) : String(item)}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const picker = StyleSheet.create({
  wrap: { flex: 1, overflow: 'hidden' },
  highlight: {
    position: 'absolute',
    top: ITEM_HEIGHT,
    left: 0,
    right: 0,
    height: ITEM_HEIGHT,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E0E0E0',
    zIndex: 1,
  },
  item: { height: ITEM_HEIGHT, justifyContent: 'center', alignItems: 'center' },
  itemText: { fontSize: 17, color: '#AAAAAA' },
  selectedText: { fontSize: 20, fontWeight: '700', color: '#222' },
});

// ─── MonthPicker (연/월/일 3컬럼) ──────────────────────────────────────────────

export interface DatePickerResult {
  year: number;
  month: number;
  day: number;
}

interface MonthPickerProps {
  visible: boolean;
  selectedDate: Date;
  onConfirm: (result: DatePickerResult) => void;
  onCancel: () => void;
}

const MonthPicker: React.FC<MonthPickerProps> = ({
  visible,
  selectedDate,
  onConfirm,
  onCancel,
}) => {
  const [year,  setYear]  = useState(selectedDate.getFullYear());
  const [month, setMonth] = useState(selectedDate.getMonth() + 1);
  const [day,   setDay]   = useState(selectedDate.getDate());

  // 모달 열릴 때 현재 날짜로 초기화
  useEffect(() => {
    if (visible) {
      setYear(selectedDate.getFullYear());
      setMonth(selectedDate.getMonth() + 1);
      setDay(selectedDate.getDate());
    }
  }, [visible, selectedDate]);

  // 연/월이 바뀌면 day가 유효 범위를 벗어날 수 있으므로 보정
  const maxDay = daysInMonth(year, month);
  const days   = Array.from({ length: maxDay }, (_, i) => i + 1);
  const safeDay = day > maxDay ? maxDay : day;

  const handleYearChange = (v: number) => {
    setYear(v);
    const max = daysInMonth(v, month);
    if (day > max) setDay(max);
  };

  const handleMonthChange = (v: number) => {
    setMonth(v);
    const max = daysInMonth(year, v);
    if (day > max) setDay(max);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onCancel} />
      <View style={styles.sheet}>
        <Text style={styles.title}>날짜 선택</Text>

        <View style={styles.pickers}>
          <WheelPicker
            items={YEARS}
            selectedValue={year}
            onValueChange={handleYearChange}
            formatter={(v) => `${v}년`}
          />
          <WheelPicker
            items={MONTHS}
            selectedValue={month}
            onValueChange={handleMonthChange}
            formatter={(v) => `${v}월`}
          />
          <WheelPicker
            items={days}
            selectedValue={safeDay}
            onValueChange={setDay}
            formatter={(v) => `${v}일`}
          />
        </View>

        <View style={styles.buttons}>
          <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
            <Text style={styles.cancelText}>취소</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.confirmBtn}
            onPress={() => onConfirm({ year, month, day: safeDay })}
          >
            <Text style={styles.confirmText}>확인</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 36,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    marginBottom: 16,
  },
  pickers: {
    flexDirection: 'row',
    height: PICKER_HEIGHT + ITEM_HEIGHT * 2,
    marginBottom: 24,
  },
  buttons: { flexDirection: 'row', gap: 12 },
  cancelBtn: {
    flex: 1,
    height: 52,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelText: { fontSize: 16, color: '#555', fontWeight: '600' },
  confirmBtn: {
    flex: 2,
    height: 52,
    borderRadius: 14,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmText: { fontSize: 16, color: '#fff', fontWeight: '700' },
});

export default MonthPicker;
