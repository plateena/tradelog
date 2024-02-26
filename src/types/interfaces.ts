import { Request } from "express"

// Properties Interface
export interface ITradelog {
    _id?: string
    symbol: string
    price: number
    unit: number
    transaction_date: Date
    type: TradeLogType
}

export enum TradeLogType {
    buy = 'buy',
    sell = 'sell',
}

export interface ISearch<T> {
    status: string
    data: Partial<T>[]
    pagination: {
        total: number
        per_page: number
        current_page: number
        last_page: number
    }
}

// Model interface
export interface IDefaultModel {
    new<T>(doc?: T): this
    search<T, R>(req: R): Promise<T>
    delete<T>(id: number | string): Promise<T[]>
    create<T>(arg0: ITradelog): Promise<T>
    deleteAll<T>(): Promise<T>
    save(): Promise<ITradelog>
}

export interface ITradeLogModel extends IDefaultModel {
}
