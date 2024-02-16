import { calculateNetTransactionAmount } from '../../services/calculate-net-transaction-amount'
import { calculateClearingFee } from '../../services/clearing-fee'
import { calculateStampDuty } from '../../services/stamp-duty'
import {
    BrokerCommissionConfig,
    calculateBrokerCommission,
} from './../../services/broker-commission'

jest.mock('../../services/broker-commission', () => ({
    calculateBrokerCommission: jest.fn()
}))

jest.mock('../../services/clearing-fee', () => ({
    calculateClearingFee: jest.fn(),
}))

jest.mock('../../services/stamp-duty', () => ({
    calculateStampDuty: jest.fn(),
}))

describe('calculateNetTransactionAmount', () => {
    beforeEach(() => {
        // Reset mocks before each test
        jest.clearAllMocks()
    })

    it('should calculate net transaction amount correctly', () => {
        const brokerCommissionConfig: BrokerCommissionConfig = {
            commissionRate: 0.0388 / 100,
            minCommission: 8.88,
            brokerName: 'CGS Securities',
        }

        // Mock the functions' return values
        (calculateBrokerCommission as jest.Mock).mockReturnValue(50)
        // calculateBrokerCommission.mockReturnValue(10)
        // calculateClearingFee.mockReturnValue(10)
        // calculateStampDuty.mockReturnValue(5)

        console.log(calculateBrokerCommission(200, brokerCommissionConfig))
        const transactionAmount = 1000

        // Call the function
        const netTotalAmount = calculateNetTransactionAmount(
            transactionAmount,
            brokerCommissionConfig
        )

        // Assert the result
        expect(netTotalAmount).toBe(935) // Expected net total amount = 1000 + (50 + 10 + 5) = 935
    })
})
