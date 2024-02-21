import moment from 'moment';

export const dateFormat = 'DD-MM-YYYY'

export const convertDateFormat = (a: Date): string => {
    return moment(a).format(dateFormat)
};
