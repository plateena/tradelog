import {
    calculateBrokerCommission,
    BrokerCommissionConfig,
} from './broker-commission'
import { calculateClearingFee } from './clearing-fee'
import { calculateStampDuty } from './stamp-duty'

export function calculateNetTransactionAmount(
    transactionAmount: number,
    brokerCommissionConfig: BrokerCommissionConfig
): number {
    // Calculate broker commission
    const brokerCommission = calculateBrokerCommission(
        transactionAmount,
        brokerCommissionConfig
    )

    // Calculate clearing fee
    const clearingFee = calculateClearingFee(transactionAmount)

    // Calculate stamp duty
    const stampDuty = calculateStampDuty(transactionAmount)

    // Calculate total cost
    const totalCost =
        transactionAmount + brokerCommission + clearingFee + stampDuty

    // Calculate net total amount
    let netTotalAmount = transactionAmount - totalCost

    // Round the net total amount to 2 decimal places
    netTotalAmount = Math.round(netTotalAmount * 100) / 100

    return netTotalAmount
}
