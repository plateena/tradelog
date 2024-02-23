import { faker } from '@faker-js/faker'
import { ITradelog, TradeLogType } from '@type/interfaces'
import { dateFormat } from '~/helpers'
import moment from 'moment'

// Function to generate trade log data
export const genTradelogData = (
    quantity: number = 1,
    data: Partial<ITradelog> = {}
): ITradelog | ITradelog[] => {
    if (!Number.isInteger(quantity) || quantity < 1) {
        throw new Error('Quantity must be a positive integer.')
    }

    if (quantity === 1) {
        const buyDate: string = moment(faker.date.recent({ days: 21 })).format(
            dateFormat
        )
        const tradelogData: ITradelog = {
            symbol: faker.helpers.fromRegExp('[A-Z]{3,7}'),
            unit: faker.number.int({ min: 1, max: 900 }) * 100,
            price: (faker.number.int({ min: 1, max: 9000000 }) * 5) / 1000,
            transaction_date: new Date(buyDate),
            type: faker.helpers.arrayElement(
                Object.values(TradeLogType)
            ) as TradeLogType,
            ...data,
        }
        return tradelogData
    } else {
        const tradelogDataList: ITradelog[] = []
        for (let i = 0; i < quantity; i++) {
            const tradelogData: ITradelog = genTradelogData(
                1,
                data
            ) as ITradelog
            tradelogDataList.push(tradelogData)
        }
        return tradelogDataList
    }
}
