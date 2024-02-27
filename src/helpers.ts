import moment from 'moment';
import appConfig from '@config/app'

export const dateFormat = appConfig.format.date

export const convertDateFormat = (a: Date): string => {
    return moment(a).format(dateFormat)
};
