import dayjs, { Dayjs } from 'dayjs';

export interface SwipePickerMonth {
  id: number;
  month: string;
  year: number;
  date: Dayjs;
}

const START_YEAR = 2020;
const END_YEAR = 2030;

/**
 * Generates array of months from START_YEAR to END_YEAR
 */
export const generateMonths = (): SwipePickerMonth[] => {
  const months: SwipePickerMonth[] = [];
  let id = 0;

  for (let year = START_YEAR; year <= END_YEAR; year++) {
    for (let month = 0; month < 12; month++) {
      const date = dayjs().year(year).month(month).startOf('month');
      months.push({
        id,
        month: date.format('MMMM').toLowerCase(),
        year,
        date,
      });
      id++;
    }
  }

  return months;
};

/**
 * Gets current month index in the months array
 */
export const getCurrentMonthIndex = (months: SwipePickerMonth[]): number => {
  const now = dayjs();
  const index = months.findIndex(
    m => m.year === now.year() && m.date.month() === now.month(),
  );
  return index >= 0 ? index : 0;
};

/**
 * Format month label for display
 */
export const formatMonthLabel = (
  month: SwipePickerMonth,
  currentYear: number,
  t: (key: string) => string,
): string => {
  const monthText = t(`common:month.${month.month}`);
  return month.year === currentYear ? monthText : `${monthText} ${month.year}`;
};
