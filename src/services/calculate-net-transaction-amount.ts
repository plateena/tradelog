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

    // Calculate total additional costs
    const totalAdditionalCosts = brokerCommission + clearingFee + stampDuty

    // Calculate net transaction amount (amount user has to pay)
    const netTransactionAmount = transactionAmount + totalAdditionalCosts

    // Round the net transaction amount to 2 decimal places
    const roundedNetTransactionAmount =
        Math.round(netTransactionAmount * 100) / 100

    return roundedNetTransactionAmount
}
