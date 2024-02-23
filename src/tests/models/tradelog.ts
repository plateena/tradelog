import { faker } from '@faker-js/faker'
import { ITradelog, TradeLogType } from './../../types/interfaces'
import { dateFormat } from '../../helpers'
import moment from 'moment'

export const genTradeLogData = () => {
    const buyDate = moment(faker.date.recent({ days: 21 })).format(dateFormat)
    const tradelogData: ITradelog = {
        symbol: faker.helpers.fromRegExp('[A-Z]{3,7}'),
        unit: faker.number.int({ min: 1, max: 900 }) * 100,
        price: (faker.number.int({ min: 1, max: 9000000 }) * 5) / 1000,
        transaction_date: buyDate as unknown as Date,
        type: faker.helpers.arrayElement(Object.values(TradeLogType)) as TradeLogType,
    }

    return tradelogData
}
