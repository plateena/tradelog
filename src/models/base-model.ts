// File: src/base-model.ts
import { Request } from 'express';
import { Model, Document, Schema } from 'mongoose';
import defaultAppConfig from '@config/app';
import pagination from './pagination';
import { ISearch, IPagination } from '@type/interface';

/**
 * Function signature for parsing query filters.
 */
interface FilterParser {
    (query: any): any;
}

/**
 * Base model function to extend Mongoose schemas with common CRUD operations and search functionality.
 * @param schema The Mongoose schema to extend.
 * @param options Additional options for customizing the base model behavior.
 */
export const BaseModel = <T extends Document>(
    schema: Schema<T>,
    options: { parseFilters: FilterParser, appConfig?: any }
) => {
    const parseFilters = options.parseFilters || ((query: any) => query);
    const appConfig = { ...defaultAppConfig, ...options.appConfig };

    // Documenting delete method
    /**
     * Deletes a document by ID.
     * @param id The ID of the document to delete.
     * @returns A promise resolving to the deleted document.
     */
    schema.statics.delete = async function <T>(
        id: number | string
    ): Promise<T> {
        return await (this as any).findByIdAndDelete(id)
    }

    // Documenting deleteAll method
    /**
     * Deletes all documents of the model.
     * @returns A promise resolving to the result of the delete operation.
     */
    schema.statics.deleteAll = async function <T>(): Promise<T> {
        return await (this as any).deleteMany({})
    }

    // Documenting search method
    /**
     * Performs a search operation based on the request query parameters.
     * @param req The Express Request object containing query parameters.
     * @returns A promise resolving to the search result.
     */
    schema.statics.search = async function <T>(
        this: Model<T>,
        req: Request
    ): Promise<ISearch<T>> {
        const filters = parseFilters(req.query) // Use the injected parseFilters function
        const result = await BaseQuery<T>(this as any, filters, req, appConfig)

        return result
    }
}

/**
 * Executes a base query operation with pagination and filtering support.
 * @param model The Mongoose model to perform the query on.
 * @param filters The filters to apply to the query.
 * @param req The Express Request object containing query parameters.
 * @param appConfig Application configuration.
 * @returns A promise resolving to the search result.
 */
const BaseQuery = async <T>(
    model: Model<Document>,
    filters: any,
    req: Request,
    appConfig: any
): Promise<ISearch<T>> => {
    const { perPage, page, skip } = pagination(req, {
        perPageDefault: appConfig.pagination.per_page || 'xyz',
        perPageQueryName: appConfig.pagination.query_name.per_page,
        pageQueryName: appConfig.pagination.query_name.page,
    })

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
                    totals: '$total.value',
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
        ...(!isNaN(page)
            ? { pagination: result[0]?.pagination || ({} as IPagination) }
            : {}),
    }
}

export default BaseModel;
