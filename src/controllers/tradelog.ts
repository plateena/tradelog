// Path: ./controllers/tradelog.ts
import { Request, Response } from "express"
import TradeLog from "@models/tradelog"
import { ITradeLogModel } from "@type/interfaces"
import { dateFormat } from "~/helpers"
import moment from "moment";
import { tradelogCreateValidation } from "@middleware/validations/tradelog";
import doValidaton from "@middleware/validations/do-validation";

const main = async (req: Request, res: Response) => {
    const tradelogResult = await TradeLog.search<ITradeLogModel, Request>(req);
    return res.json(tradelogResult)
}

const create = async (req: Request, res: Response) => {
    try {
        // Extract data from the request body
        const { symbol, price, unit, transactionDate, type } = req.body;

        const transactionDateObject = moment(transactionDate, dateFormat).toDate()

        // Create a new trade log record
        const newTradeLog = new TradeLog({
            symbol,
            price,
            unit,
            transactionDateObject,
            type
        });

        // Save the new trade log record to the database
        const createdTradeLog = await newTradeLog.save();

        // Respond with the created trade log record
        res.status(201).json(createdTradeLog);

    } catch (error) {
        // Handle any errors that occur during trade log creation
        console.error("Error creating trade log:", error);
        res.status(500).json({ error: "Failed to create trade log" });
    }
}

export const TradelogIndex = [doValidaton, main];
export const TradelogCreate = [tradelogCreateValidation, doValidaton, create];
