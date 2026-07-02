import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CalendarScreen from '../app/(tabs)/calendar/index';

// Mocking react-native-calendars
jest.mock('react-native-calendars', () => {
  const { View, Text, TouchableOpacity } = require('react-native');
  const MockCalendar = (props) => {
    return (
      <View testID="mock-calendar">
        <TouchableOpacity onPress={() => props.onDayPress({ dateString: '2025-12-24' })}>
          <Text>24</Text>
        </TouchableOpacity>
      </View>
    );
  };
  return {
    Calendar: MockCalendar,
    LocaleConfig: {
      locales: { kr: {} },
      defaultLocale: '',
    },
  };
});

// expo-secure-store: 첫 진입 팝업(WelcomePopup)이 뜨지 않도록 이미 확인한 것으로 처리
jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn().mockResolvedValue('true'),
  setItemAsync: jest.fn().mockResolvedValue(undefined),
}));

describe('CalendarScreen', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2025-12-19T00:00:00'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('shows the current year/month as a picker button', () => {
    const { getByText } = render(<CalendarScreen />);

    // 캘린더 상단 왼쪽 연월 버튼 (CalendarView 내부)
    expect(getByText('2025년 12월')).toBeTruthy();
  });

  it('opens the date picker modal when the month button is pressed', () => {
    const { getByText, queryByText } = render(<CalendarScreen />);

    // 모달은 기본적으로 닫혀있음
    expect(queryByText('날짜 선택')).toBeNull();

    fireEvent.press(getByText('2025년 12월'));

    expect(getByText('날짜 선택')).toBeTruthy();
  });

  it('should select a new date when a day is pressed', () => {
    const { getByText } = render(<CalendarScreen />);

    // Initial date is 19 (2025-12-19, 금요일)
    expect(getByText('19. 금')).toBeTruthy();

    // Press a different day (mocked to be 2025-12-24)
    fireEvent.press(getByText('24'));

    // The schedule section should now show the new date
    expect(getByText('24. 수')).toBeTruthy();
  });
});
