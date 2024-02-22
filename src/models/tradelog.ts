import mongoose, { Schema, Document } from 'mongoose'
import { ITradeLogModel, ITradelog, TradeLogType } from '../types/interfaces'

const TradelogSchema: Schema = new Schema({
    symbol: { type: String, required: true },
    price: { type: Number, required: true },
    unit: { type: Number, required: true },
    transaction_date: { type: Date, required: true },
    type: { type: String, enum: Object.values(TradeLogType), required: true },
})

TradelogSchema.statics.delete = async function <T>(id: number | string): Promise<T> {
    return await (this as any).findByIdAndDelete(id);
};

TradelogSchema.statics.deleteAll = async function <T>(): Promise<T> {
  return await (this as any).deleteMany({});
};

const TradelogModel: ITradeLogModel = mongoose.model<ITradelog, ITradeLogModel>('Tradelog', TradelogSchema)

export default TradelogModel
