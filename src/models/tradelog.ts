import mongoose, { Schema, Document } from 'mongoose'

export interface ITradelog {
    symbol: string
    price: number
    unit: number
    buy_date: Date
}

const TradelogSchema: Schema = new Schema({
    symbol: { type: String, required: true },
    price: { type: Number, required: true },
    unit: { type: Number, required: true },
    buy_date: { type: Date, required: true },
})

export default mongoose.model<ITradelog>('Tradelog', TradelogSchema)
