import { calculateClearingFee } from '../../services/clearing-fee'
import { faker } from '@faker-js/faker'

describe('Clearing Fee Calculation', () => {
    it('should calculate clearing fee correctly for predefined and random transaction amounts', () => {
        // Define a set of predefined prices and their expected clearing fees
        const predefinedPrices = [
            { amount: 10000, expectedFee: 3 },
            { amount: 500000, expectedFee: 150 },
            { amount: 1000000, expectedFee: 300 },
            { amount: 2000000, expectedFee: 600 },
            { amount: 3000000, expectedFee: 900 },
            { amount: 4000000, expectedFee: 1000 }, // Cap at maximum fee
        ]

        // Test with predefined prices
        predefinedPrices.forEach(({ amount, expectedFee }) => {
            // Calculate clearing fee using the calculateClearingFee function
            const clearingFee = calculateClearingFee(amount)

            // Assert that the calculated clearing fee matches the expected value
            try {
                expect(clearingFee).toEqual(expectedFee)
            } catch (error) {
                throw new Error(
                    `Clearing fee for random amount £${clearingFee} should be £${expectedFee}`
                )
            }
        })

        // Test with random transaction amounts using Faker
        for (let i = 0; i < 5; i++) {
            // Generate a random transaction amount using Faker
            const randomAmount = parseFloat(
                faker.finance.amount({ min: 0, max: 5000000 })
            )

            // Calculate the expected clearing fee manually
            const expectedRandomFee =
                Math.round(Math.min(randomAmount * 0.0003, 1000) * 100) / 100

            // Calculate clearing fee using the calculateClearingFee function
            const randomFee = calculateClearingFee(randomAmount)

            // Assert that the calculated clearing fee matches the expected value
            try {
                expect(randomFee).toEqual(expectedRandomFee)
            } catch (error) {
                throw new Error(
                    `Clearing fee for random amount £${randomAmount} should be £${expectedRandomFee} instead of ${randomFee}`
                )
            }
        }
    })
})
