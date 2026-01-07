import dayjs, { Dayjs } from 'dayjs';
import { GENERAL_START_DATE, GENERAL_END_DATE } from '../../constants';

export type SwipePickerMonth = {
    id: number;
    date: Dayjs;
    month: string;
    year: number;
};

export const months = (): SwipePickerMonth[] => {
    const arrayOfDate: SwipePickerMonth[] = [];
    let i = 0;
    let startingDate = dayjs(GENERAL_START_DATE, 'DD-MM-YYYY');
    const endingDate = dayjs(GENERAL_END_DATE, 'DD-MM-YYYY');

    while (startingDate.isBefore(endingDate) || startingDate.isSame(endingDate)) {
        arrayOfDate.push({
            id: i,
            date: startingDate,
            month: startingDate.format('MMMM').toLowerCase(),
            year: startingDate.year(),
        });
        startingDate = startingDate.add(1, 'month');
        i++;
    }

    return arrayOfDate;
};
