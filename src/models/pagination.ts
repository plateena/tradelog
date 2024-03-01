import { Request } from 'express';

/**
 * Options for pagination.
 */
interface PaginationOptions {
    /**
     * Default number of items per page.
     */
    perPageDefault: number | string;

    /**
     * Name of the query parameter for specifying the number of items per page.
     */
    perPageQueryName: string;

    /**
     * Name of the query parameter for specifying the page number.
     */
    pageQueryName: string;
}

/**
 * Parses pagination parameters from the request query.
 * @param req The Express Request object containing query parameters.
 * @param options Pagination options.
 * @returns An object containing pagination parameters: `perPage`, `page`, and `skip`.
 */
export const paginate = (req: Request, options: PaginationOptions) => {
    const perPage: number = parseInt(
        req.query?.[options.perPageQueryName]?.toString() ||
            options.perPageDefault.toString()
    );

    // Parse the 'page' query parameter to a number.
    // If 'page' is not provided or cannot be parsed, it defaults to NaN.
    const page: number = parseInt(
        req.query?.[options.pageQueryName]?.toString() || 'xyz'
    );

    // Calculate the number of items to skip based on the current page.
    // If 'page' is NaN, skip will be 0, ensuring no pagination is applied.
    const skip: number = page ? (page - 1) * perPage : 0;

    return { perPage, page, skip };
};

export default paginate;
