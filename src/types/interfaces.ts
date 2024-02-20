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
    delete<T>(id: number | string): Promise<T>
    create<T>(arg0: ITradelog): Promise<T>
    deleteAll<T>(): Promise<T>
}

export interface ITradeLogModel extends IDefaultModel {
}
