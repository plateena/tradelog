import { Request } from 'express'
import { Model, Document } from 'mongoose'
import appConfig from '@config/app'

const BaseModel = async (
    model: Model<Document>,
    filters: any,
    req: Request
) => {
    const perPage: number = parseInt(
        req.query?.[appConfig.pagination.query_name.per_page]?.toString() ||
            appConfig.pagination.per_page
    )
    const page: number = parseInt(
        req.query?.[appConfig.pagination.query_name.page]?.toString() || '1'
    )
    const skip: number = (page - 1) * perPage

    // Constructing aggregation pipeline
    const pipeline: any[] = [
        {
            $match: { ...filters },
        },
        {
            $facet: {
                data: [
                    ...(page ? [{ $skip: skip }, { $limit: perPage }] : []),
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
                pagination: {
                    total: '$total.value',
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

    return result
}

export default BaseModel
