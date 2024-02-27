import { Request } from 'express'

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

export interface IPagination {
    per_page: number | undefined
    current_page: number | undefined
    last_page: number | undefined
}

export interface ISearch<T> {
    status: string
    _filter?: any[]
    data: Partial<T>[]
    total: number
    pagination?: IPagination
}

// Model interface
export interface IDefaultModel {
    find<T>(arg0: {}): Promise<T[]>
    new <T>(doc?: T): this
    search<T, R>(req: R): Promise<T>
    delete<T>(id: number | string): Promise<T[]>
    create<T>(arg0: ITradelog): Promise<T>
    deleteAll<T>(): Promise<T>
    save(): Promise<ITradelog>
}

export interface ITradeLogModel extends IDefaultModel {}
