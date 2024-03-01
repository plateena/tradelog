import { Model } from 'mongoose'
import Tradelog from '@models/tradelog'
import type { ITradelog, ITradeLogModel } from '@type/interface'
import { TradeLogType } from '@type/enums'
import { faker } from '@faker-js/faker'
import BaseFactory from '@zainundin/mongoose-factory'
import moment from 'moment'
import appConfig from '@config/app'

export class TradeLogFactory extends BaseFactory<ITradelog> {

    private fake: boolean = true

    constructor() {
        super(Tradelog as Model<ITradelog>)
        return this
    }

    setDatefake(fake: boolean): this {
        this.fake = fake
        return this
    }

    definition(): ITradelog {
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

const TradeLogFactoryClass = new TradeLogFactory()

export default TradeLogFactoryClass
