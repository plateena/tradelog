export function calculateClearingFee(amount: number): number {
    // Define the clearing fee rate (0.03%)
    const clearingFeeRate = 0.0003

    // Calculate the clearing fee
    let clearingFee = amount * clearingFeeRate

    // Cap the clearing fee to a maximum of 1000
    if (clearingFee > 1000) {
        clearingFee = 1000
    }

    // Round the clearing fee to 2 decimal places
    clearingFee = Math.round(clearingFee * 100) / 100

    return clearingFee
}
