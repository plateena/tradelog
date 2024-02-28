import Tradelog from '@models/tradelog'
import { ITradelog, ITradeLogModel, TradeLogType } from '@type/interfaces'
import { faker } from '@faker-js/faker'
import BaseFactory from '@factories/base-factory'
import moment from 'moment'
import appConfig from '@config/app'

class TradeLogFactory extends BaseFactory<ITradelog> {

    private fake: boolean = true

    constructor() {
        super(Tradelog as Model<ITradelog>)
    }

    setDatefake(fake: boolean): this {
        this.fake = fake
        return this
    }

    definition(): Partial<ITradelog> {
        const buyDate: string = moment(faker.date.recent({ days: 21 })).format(
            appConfig.format.date
        )
        const tradelogData: ITradelog = {
            symbol: faker.helpers.fromRegExp('[A-Z]{3,7}'),
            unit: faker.number.int({ min: 1, max: 900 }) * 100,
            price: (faker.number.int({ min: 1, max: 9000000 }) * 5) / 1000,
            transaction_date: !this.fake
                ? new Date(buyDate)
                : (buyDate as unknown as Date),
            type: faker.helpers.arrayElement(
                Object.values(TradeLogType)
            ) as TradeLogType,
        }

        return tradelogData
    }

    // Implement specific methods for generating and saving trade log data
}

export default TradeLogFactory
