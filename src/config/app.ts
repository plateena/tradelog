// Define your config object structure
export interface IAppConfig {
    format: {
        date: string
    }
    pagination: {
        per_page: string // Default per page value
        query_name: {
            page: string
            per_page: string // Name of the query parameter for per page
        }
    }
}

const appConfig: IAppConfig = {
    format: {
        date: 'YYYY-MM-DD',
    },
    pagination: {
        query_name: {
            page: 'page',
            per_page: 'per_page',
        },
        per_page: '15',
    },
}

export default appConfig
