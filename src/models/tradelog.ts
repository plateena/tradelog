import mongoose, { Schema, Document } from 'mongoose'
import {
    ITradeLogModel,
    ITradelog,
    TradeLogType,
    ISearch,
    IPagination,
} from '../types/interfaces'
import { Request, query } from 'express'
import BaseModel from '@models/base-model'
import Tradelog from '@models/tradelog'

const TradelogSchema: Schema = new Schema({
    symbol: { type: String, required: true },
    price: { type: Number, required: true },
    unit: { type: Number, required: true },
    transaction_date: { type: Date, required: true },
    type: { type: String, enum: Object.values(TradeLogType), required: true },
})

TradelogSchema.statics.delete = async function <T>(
    id: number | string
): Promise<T> {
    return await (this as any).findByIdAndDelete(id)
}

TradelogSchema.statics.deleteAll = async function <T>(): Promise<T> {
    return await (this as any).deleteMany({})
}

TradelogSchema.statics.search = async function <T extends Document>(
    req: Request
): Promise<ISearch<T>> {
    const filters = parseFilters(req.query)
    const result = await BaseModel(this as any, filters, req)

    return {
        status: 'success',
        data: result[0]?.data.map((item: any) => item.document) || {},
        pagination: result[0]?.pagination || ({} as unknown as IPagination),
    } as ISearch<T>
}

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

const TradelogModel: ITradeLogModel = mongoose.model<ITradelog, ITradeLogModel>(
    'Tradelog',
    TradelogSchema
)

export default TradelogModel
