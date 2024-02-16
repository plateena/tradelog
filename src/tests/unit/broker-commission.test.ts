import {
    calculateBrokerCommission,
    BrokerCommissionConfig,
} from './../../services/broker-commission'
import { faker } from '@faker-js/faker'

describe('Broker Commission Calculation', () => {
    it('should calculate broker commission correctly for predefined and random transaction amounts', () => {
        // Define a set of predefined transaction amounts and their expected broker commissions
        const predefinedTransactions = [
            { amount: 4000, expectedCommission: 8.88 },
            { amount: 50000, expectedCommission: 19.4 },
            { amount: 1000000, expectedCommission: 388 },
            { amount: 2000000, expectedCommission: 776 },
            { amount: 3000000, expectedCommission: 1164 },
        ]

        // Test with predefined transaction amounts
        predefinedTransactions.forEach(({ amount, expectedCommission }) => {
            // Define commission configuration
            const config: BrokerCommissionConfig = {
                commissionRate: 0.0388 / 100,
                minCommission: 8.88,
                brokerName: 'CGS Securities',
            }

            // Calculate broker commission using the calculateBrokerCommission function
            const commission = calculateBrokerCommission(amount, config)

            // Assert that the calculated broker commission matches the expected value
            try {
                expect(commission).toEqual(expectedCommission)
            } catch (error) {
                throw new Error(
                    `Expected commission ${expectedCommission.toFixed(2)} \
                        instead of ${commission.toFixed(2)} for amount ${amount}`
                )
            }
        })

        // Test with random transaction amounts using Faker
        for (let i = 0; i < 5; i++) {
            // Generate a random transaction amount using Faker
            const randomAmount: number = parseFloat(
                faker.finance.amount({ min: 0, max: 5000000 })
            )

            // Define commission configuration
            const config: BrokerCommissionConfig = {
                commissionRate: 0.0388 / 100,
                minCommission: 8.88,
                brokerName: 'CGS Securities',
            }

            // Calculate broker commission using the calculateBrokerCommission function
            const commission = calculateBrokerCommission(randomAmount, config)

            const expectedRandomCommission =
                Math.round(
                    Math.max(
                        randomAmount * config.commissionRate,
                        config.minCommission
                    ) * 100
                ) / 100

            // Assert that the calculated broker commission matches the expected value
            try {
                expect(commission).toEqual(expectedRandomCommission)
            } catch (error) {
                throw new Error(
                    `Expected commission \
                        ${expectedRandomCommission.toFixed(2)} instead of \
                        ${commission.toFixed(2)} for amount ${randomAmount}`
                )
            }
        }
    })
})
