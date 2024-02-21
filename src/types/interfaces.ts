// Properties Interface
export interface ITradelog {
    _id?: string,
    symbol: string
    price: number
    unit: number
    transactionDate: Date
    type: TradeLogType
}

export enum TradeLogType {
    buy = 'buy',
    sell = 'sell',
}

// Model interface
export interface IDefaultModel {
    new<T>(doc?: T): this
    delete<T>(id: number | string): Promise<T>
    create<T>(arg0: ITradelog): Promise<T>
    deleteAll<T>(): Promise<T>
    save(): Promise<ITradelog>
}

export interface ITradeLogModel extends IDefaultModel {
}
