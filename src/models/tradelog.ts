import mongoose, { Schema, Document } from 'mongoose'

export enum TradeLogType {
    buy = 'buy',
    sell = 'sell',
}

export interface ITradelog {
    symbol: string
    price: number
    unit: number
    transactionDate: Date
    type: TradeLogType
}

const TradelogSchema: Schema = new Schema({
    symbol: { type: String, required: true },
    price: { type: Number, required: true },
    unit: { type: Number, required: true },
    transactionDate: { type: Date, required: true },
    type: { type: String, enum: Object.values(TradeLogType), required: true },
})

export default mongoose.model<ITradelog>('Tradelog', TradelogSchema)
