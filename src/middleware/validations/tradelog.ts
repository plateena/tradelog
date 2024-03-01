import { TradeLogType } from '@type/enums'
import { body } from 'express-validator'
import moment from 'moment'

// Define error messages as constants
export const ERROR_MESSAGES = {
    SYMBOL_REQUIRED: 'Symbol is required',
    PRICE_REQUIRED: 'Price is required',
    PRICE_INVALID: (value: any) =>
        `Price ${value} is invalid. It must be a positive number with a minimum value of 0.005`,
    PRICE_INCREMENT: 'Price must be in increments of 0.005',
    TRANSACTION_DATE_REQUIRED: 'Transaction date is required',
    TRANSACTION_DATE_FORMAT: (value: any) =>
        `Transaction date ${value} must be a valid date with format (YYYY-MM-DD)`,
    UNIT_REQUIRED: 'Unit is required',
    UNIT_POSITIVE_INTEGER: 'Unit must be a positive integer',
    TYPE_REQUIRED: 'Type is required',
    INVALID_TRADE_LOG_TYPE: (value: any) =>
        `Trade log type ${value} is invalid`,
}

const isValidRecentDate = (dateString: string) => {
    const inputDate = moment(dateString, 'YYYY-MM-DD', true)
    const today = moment().startOf('day') // Get the start of today

    return inputDate.isValid() && inputDate.isSameOrBefore(today)
}

const validateTradeLogType = (value: TradeLogType) => {
    if (!Object.values(TradeLogType).includes(value)) {
        return false
    }
    return true
}

export const tradelogCreateValidation = [
    // Validate symbol field
    body('symbol').notEmpty().withMessage(ERROR_MESSAGES.SYMBOL_REQUIRED),

    // Validate price field
    body('price')
        .notEmpty()
        .withMessage(ERROR_MESSAGES.PRICE_REQUIRED)
        .isFloat({ min: 0.005 })
        .withMessage((value) => ERROR_MESSAGES.PRICE_INVALID(value))
        .custom((value) => {
            const remainder = (value * 1000) % 5

            // Check if the remainder is greater than a small tolerance (indicating it's not an increment of 0.005)
            if (remainder != 0) {
                throw new Error(ERROR_MESSAGES.PRICE_INCREMENT)
            }
            return true
        })
        .withMessage(ERROR_MESSAGES.PRICE_INCREMENT),

    // Validate transaction date field
    body('transaction_date')
        .notEmpty()
        .withMessage(ERROR_MESSAGES.TRANSACTION_DATE_REQUIRED)
        .isString()
        .withMessage((value) => ERROR_MESSAGES.TRANSACTION_DATE_FORMAT(value))
        .custom((value) => isValidRecentDate(value))
        .withMessage((value) => ERROR_MESSAGES.TRANSACTION_DATE_FORMAT(value)),

    // Validate unit field
    body('unit')
        .notEmpty()
        .withMessage(ERROR_MESSAGES.UNIT_REQUIRED)
        .isInt({ min: 1 })
        .withMessage(ERROR_MESSAGES.UNIT_POSITIVE_INTEGER),

    // Validate type field
    body('type')
        .notEmpty()
        .withMessage(ERROR_MESSAGES.TYPE_REQUIRED)
        .custom(validateTradeLogType)
        .withMessage((value) => ERROR_MESSAGES.INVALID_TRADE_LOG_TYPE(value)),
]
