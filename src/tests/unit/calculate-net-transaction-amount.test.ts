import { calculateNetTransactionAmount } from '../../services/calculate-net-transaction-amount'
import { calculateClearingFee } from '../../services/clearing-fee'
import { calculateStampDuty } from '../../services/stamp-duty'
import {
    calculateBrokerCommission,
    BrokerCommissionConfig,
} from './../../services/broker-commission'
import { faker } from '@faker-js/faker'

// Mock the calculateBrokerCommission function
jest.mock('../../services/broker-commission', () => ({
    calculateBrokerCommission: jest.fn(),
}))

// Mock the calculateClearingFee function
jest.mock('../../services/clearing-fee', () => ({
    calculateClearingFee: jest.fn(),
}))

// Mock the calculateStampDuty function
jest.mock('../../services/stamp-duty', () => ({
    calculateStampDuty: jest.fn(),
}))

describe('calculateNetTransactionAmount', () => {
    beforeEach(() => {
        // Reset mocks before each test
        jest.clearAllMocks()
    })

    it('should calculate net transaction amount correctly', () => {
        // Define the broker commission configuration
        const brokerCommissionConfig: BrokerCommissionConfig = {
            commissionRate: parseFloat(
                faker.finance.amount({ min: 0.01, max: 0.1 })
            ),
            minCommission: parseFloat(
                faker.finance.amount({ min: 5, max: 20 })
            ),
            brokerName: 'CGH Securities',
        }

        // Mock the calculateBrokerCommission function's return value with Faker
        ;(calculateBrokerCommission as jest.Mock).mockReturnValue(
            parseFloat(faker.finance.amount({ min: 5, max: 20 }))
        )

        // Mock the calculateClearingFee function's return value with Faker
        ;(calculateClearingFee as jest.Mock).mockReturnValue(
            parseFloat(faker.finance.amount({ min: 1, max: 5 }))
        )

        // Mock the calculateStampDuty function's return value with Faker
        ;(calculateStampDuty as jest.Mock).mockReturnValue(
            parseFloat(faker.finance.amount({ min: 0.1, max: 1 }))
        )

        // Repeat the test with Faker values
        const iterations = 5
        for (let i = 0; i < iterations; i++) {
            // Generate a random transaction amount using Faker
            const randomAmount: number = parseFloat(
                faker.finance.amount({ min: 1, max: 10000 })
            )

            // Call the calculateNetTransactionAmount function with Faker value
            const result = calculateNetTransactionAmount(
                randomAmount,
                brokerCommissionConfig
            )

            // Calculate the expected net amount based on mock functions' return values
            const expectedNetAmount =
                randomAmount +
                calculateBrokerCommission(
                    randomAmount,
                    brokerCommissionConfig
                ) +
                calculateClearingFee(randomAmount) +
                calculateStampDuty(randomAmount)

            const roundedExpectedNetAmount =
                Math.round(expectedNetAmount * 100) / 100

            // Assert the result with try-catch block for more detailed error information
            try {
                expect(result).toBe(roundedExpectedNetAmount)
            } catch (error: any) {
                // Throw a custom error with more details
                throw new Error(`Test iteration ${i + 1}: ${error.message}`)
            }
        }
    })
})
