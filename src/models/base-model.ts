import { Request } from 'express'
import { Model, Document } from 'mongoose'
import appConfig from '@config/app'
import { ISearch, IPagination } from '@type/interfaces'

const BaseModel = async <T>(
    model: Model<Document>,
    filters: any,
    req: Request
): Promise<ISearch<T>> => {
    const perPage: number = parseInt(
        req.query?.[appConfig.pagination.query_name.per_page]?.toString() ||
            appConfig.pagination.per_page
    )
    const page: number | typeof NaN = parseInt(
        req.query?.[appConfig.pagination.query_name.page]?.toString() || 'xyz'
    )
    const skip: number = page ? (page - 1) * perPage : 0

    // Constructing aggregation pipeline
    const pipeline: any[] = [
        {
            $match: { ...filters },
        },
        {
            $facet: {
                data: [
                    ...(isNaN(page)
                        ? []
                        : [{ $skip: skip }, { $limit: perPage }]),
                    { $project: { _id: 0, document: '$$ROOT' } },
                ],
                total: [{ $count: 'value' }],
            },
        },
        {
            $unwind: '$total',
        },
        {
            $addFields: {
                totals: '$total.value',
                pagination: {
                    per_page: perPage,
                    current_page: page,
                    last_page: page
                        ? { $ceil: { $divide: ['$total.value', perPage] } }
                        : undefined,
                },
            },
        },
        {
            $project: { total: 0 },
        },
    ]
    const result = await model.aggregate(pipeline)

    return {
        _filter: filters,
        status: 'success',
        data: result[0]?.data.map((item: any) => item.document) || [],
        total: result[0]?.totals || 0,
        ...(!isNaN(page) ? {pagination: result[0]?.pagination || ({} as IPagination) } : {}),
    }
}

export default BaseModel
