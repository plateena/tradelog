import mongoose, { Schema } from 'mongoose'
import {
    ITradeLogModel,
    ITradelog,
    TradeLogType,
} from '@type/interfaces'
import { BaseModel } from '@models/base-model'

const TradelogSchema: Schema = new Schema({
    symbol: { type: String, required: true },
    price: { type: Number, required: true },
    unit: { type: Number, required: true },
    transaction_date: { type: Date, required: true },
    type: { type: String, enum: Object.values(TradeLogType), required: true },
})

TradelogSchema.plugin(BaseModel, { parseFilters: parseFilters })

function parseFilters(query: any) {
    const filters: any = {}
    for (const key in query) {
        if (key.startsWith('filter[') && key.endsWith(']')) {
            const field = key.substring(7, key.length - 1) // Extract field name from filter[field] format
            const value = query[key]
            if (field === 'symbol') {
                filters[field] = { $regex: new RegExp(value, 'i') } // Treat symbol as regex filter
            } else if (field === 'transaction_date') {
                filters[field] = new Date(value) // Treat transaction_date as exact date match
            } else if (field === 'type') {
                filters[field] = value // Treat other fields as exact match
            }
        }
    }
    return filters
}

const TradelogModel = mongoose.model<ITradelog, ITradeLogModel>(
    'Tradelog',
    TradelogSchema
)

export default TradelogModel
