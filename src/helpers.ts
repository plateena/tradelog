import moment from 'moment';

export const dateFormat = 'YYYY-MM-DD'

export const convertDateFormat = (a: Date): string => {
    return moment(a).format(dateFormat)
};
