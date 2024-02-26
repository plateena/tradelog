import mongoose, { Schema, Document } from 'mongoose'
import {
    ITradeLogModel,
    ITradelog,
    TradeLogType,
    ISearch,
} from '../types/interfaces'
import { Request, query } from 'express'

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
    const perPage: number = parseInt(req.query.per_page?.toString() || '15')
    const page: number = parseInt(req.query.page?.toString() || '1')
    const skip: number = (page - 1) * perPage
    const filters = parseFilters(req.query)

    // Constructing aggregation pipeline
    const pipeline: any[] = [
        {
            $match: {
                ...filters,
            },
        },
        {
            $facet: {
                data: [
                    ...(page ? [{ $skip: skip }, { $limit: perPage }] : []), // Conditionally apply $skip and $limit
                    { $project: { _id: 0, document: '$$ROOT' } }, // Projecting fields excluding _id
                ],
                total: [{ $count: 'value' }],
            },
        },
        {
            $unwind: '$total',
        },
    ]

    const result = await (this as any).aggregate(pipeline)

    return {
        status: 'success',
        data: result[0].data.map((item: any) => item.document),
        pagination: {
            total: result[0].total.value,
            per_page: perPage,
            current_page: page,
            last_page: page
                ? Math.ceil(result[0].total.value / perPage)
                : undefined, // Calculate last_page only if page parameter is provided
        },
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
