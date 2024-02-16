import { calculateStampDuty } from '../../services/stamp-duty'
import { faker } from '@faker-js/faker'

/**
 * @group unit
 */

describe('Stamp Duty Calculation', () => {
    it('should calculate stamp duty correctly for random property prices', () => {
        // Run the test 5 times
        for (let i = 0; i < 5; i++) {
            // Generate a random property price using Faker
            const randomPrice: number = parseFloat(
                faker.finance.amount({ min: 0, max: 1000000 })
            )

            // Calculate expected stamp duty manually based on the property price
            const expectedRandomStampDuty: number = Math.min(
                Math.floor(randomPrice / 1000),
                1000
            )

            // Calculate stamp duty using the calculateStampDuty function
            const randomStampDuty: number = calculateStampDuty(randomPrice)

            // Assert that the calculated stamp duty matches the expected value
            expect(randomStampDuty).toEqual(expectedRandomStampDuty)
        }
    })

    it('should calculate stamp duty correctly for predefined prices', () => {
        // Define a set of predefined prices and their expected stamp duties
        const predefinedPrices = [
            { price: 5450, expectedStampDuty: 5 },
            { price: 1520, expectedStampDuty: 1 },
            { price: 15320, expectedStampDuty: 15 },
            { price: 250400, expectedStampDuty: 250 },
            { price: 750920, expectedStampDuty: 750 },
            { price: 1000000, expectedStampDuty: 1000 }, // Max 1000
        ]

        // Test with predefined prices
        predefinedPrices.forEach(({ price, expectedStampDuty }) => {
            // Calculate stamp duty using the calculateStampDuty function
            const stampDuty = calculateStampDuty(price)

            // Assert that the calculated stamp duty matches the expected value
            expect(stampDuty).toEqual(expectedStampDuty)
        })
    })
})
