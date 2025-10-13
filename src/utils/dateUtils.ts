import { nonNullValue } from "./nonNull";

export const months: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/**
 * @param previousDate mm/yyyy
 * @returns The `date` as a string in mm/yyyy format
 * @returns The `label` as a string in Month-yyyy format
 */
export function getIncrementingDate(previousDate: string): { date: string, monthYearLabel: string } {
    const previousMonth: number = Number(getMonthFromDate(previousDate));
    const previousYear: number = Number(getYearFromDate(previousDate));

    let nextMonth: number = previousMonth % 12 + 1;
    const nextYear: number = previousMonth === 12 ? previousYear + 1 : previousYear;

    return {
        date: `${nextMonth.toString().padStart(2, '0')}/${nextYear}`,
        monthYearLabel: `${months[nextMonth - 1]}-${nextYear}`,
    };
}

/**
 * @param date mm/dd/yyyy or mm/yyyy
 * @returns mm
 */
export function getMonthFromDate(date: string): string {
    return nonNullValue(date.split('/').at(0));
}

/**
 * @param date mm/dd/yyyy or mm/yyyy
 * @returns yyyy
 */
export function getYearFromDate(date: string): string {
    return nonNullValue(date.split('/').at(-1));
}

const monthsMap: Map<string, string> = new Map([
    ['Jan', '01'],
    ['Feb', '02'],
    ['Mar', '03'],
    ['Apr', '04'],
    ['May', '05'],
    ['Jun', '06'],
    ['Jul', '07'],
    ['Aug', '08'],
    ['Sep', '09'],
    ['Oct', '10'],
    ['Nov', '11'],
    ['Dec', '12'],
]);

/**
 * @param label A date in Month-yyyy format
 * @returns mm
 */
export function getMonthFromMonthYearLabel(label: string): string {
    const month: string = label.split('-')[0];
    return nonNullValue(monthsMap.get(month));
}

/**
 * @param label A date in Month-yyyy format
 * @returns yyyy
 */
export function getYearFromMonthYearLabel(label: string): string {
    const year: string = label.split('-')[1];
    return year;
}

/**
 * @param date mm/dd/yyyy
 * @returns yyyy-mm-dd
 */
export function convertDateToISOFormat(date: string): string {
    const [month, day, year] = date.split('/');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}