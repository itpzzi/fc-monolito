import { app, sequelize } from '../express'
import request from 'supertest'

describe("E2E test for checkout", () => {
    beforeEach(async () => {
        await sequelize.sync({ force: true })
    })

    afterAll(async () => {
        await sequelize.close()
    })

    it("should create a checkout", async () => {
        const response = await request(app)
            .post("/checkout")
            .send({
                amount: 50,
                orderId: "1234"
            })

        expect(response.status).toBe(200)
        expect(response.body.transactionId).toBeDefined()
        expect(response.body.amount).toBe(50)
        expect(response.body.orderId).toBe("1234")
        expect(response.body.status).toBe("declined")
        expect(response.body.createdAt).toBeDefined()
        expect(response.body.updatedAt).toBeDefined()
    })

    it("should not create a checkout", async () => {
        const response = await request(app)
            .post("/checkout")
            .send({
                amount: -10,
                orderId: "9999"
            })

        expect(response.status).toBe(500)
    })
})