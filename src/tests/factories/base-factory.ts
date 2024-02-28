import { Document, Model } from 'mongoose'
// import { IDefaultModel } from '@type/interfaces'

abstract class BaseFactory<T> {
    protected quantity: number = 1
    protected data: Partial<T>[] = []
    protected useFakeData: boolean = true
    protected model: Model<T>
    private mutation: (() => Partial<T>)[] = []

    abstract definition(): Partial<T>

    constructor(model: Model<T>) {
        this.model = model
    }

    count(quantity: number): this {
        this.quantity = quantity
        return this
    }

    withState(state: Partial<T> | (() => Partial<T>)): this {
        if (state instanceof Function) {
            this.mutation.push(state)
        } else {
            this.mutation.push(() => {
                return state
            })
        }
        return this
    }

    generate(): void {
        if (this.quantity < 1) {
            throw new Error('Quantity must be a positive integer.')
        }
        for (let i = 0; i < this.quantity; i++) {
            let newData: Partial<T> = this.definition()
            for (const mutation of this.mutation) {
                newData = { ...newData, ...mutation() }
            }
            this.data.push(newData)
        }
    }

    make(): Partial<T> | Partial<T>[] {
        this.generate()
        if (this.quantity === 1) {
            return this.data[0]
        } else {
            return this.data
        }
    }

    async save(): Promise<T[]> {
        this.generate()
        try {
            const savedData = await this.model.insertMany(this.data)
            return savedData
        } catch (error) {
            console.error('Error saving data:', error)
            throw error
        }
    }
}

export default BaseFactory
