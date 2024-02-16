export interface BrokerCommissionConfig {
    commissionRate: number
    minCommission: number
    brokerName: string
}

// Define a function to calculate broker commission
export function calculateBrokerCommission(
    amount: number,
    config: BrokerCommissionConfig
): number {
    // Extract commission rate and minimum commission from the config object
    const { commissionRate, minCommission } = config

    // Calculate the broker commission
    let calculatedCommission = amount * commissionRate

    // Ensure that the commission is not lower than the minimum threshold
    const finalCommission = Math.max(calculatedCommission, minCommission)

    // Round the commission to 2 decimal places
    const roundedCommission = Math.round(finalCommission * 100) / 100

    return roundedCommission
}
