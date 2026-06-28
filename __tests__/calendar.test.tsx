import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CalendarScreen from './calendar';

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
      locales: { 'kr': {} },
      defaultLocale: ''
    }
  };
});

describe('CalendarScreen', () => {
  it('should change month when header buttons are pressed', () => {
    const { getByText, getByTestId } = render(<CalendarScreen />);

    // Initial month is December 2025
    expect(getByText('2025년 12월')).toBeTruthy();

    // Go to next month
    fireEvent.press(getByTestId('next-month'));
    expect(getByText('2026년 1월')).toBeTruthy();

    // Go to previous month
    fireEvent.press(getByTestId('prev-month'));
    fireEvent.press(getByTestId('prev-month'));
    expect(getByText('2025년 11월')).toBeTruthy();
  });

  it('should select a new date when a day is pressed', () => {
    const { getByText } = render(<CalendarScreen />);

    // Initial date is 19
    expect(getByText('19. 목')).toBeTruthy();

    // Press a different day (mocked to be 24)
    fireEvent.press(getByText('24'));

    // The schedule section should now show the new date
    expect(getByText('24. 목')).toBeTruthy();
  });
});