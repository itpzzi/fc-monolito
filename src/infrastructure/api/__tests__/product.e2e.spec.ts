import { app, sequelize } from '../express'
import request from 'supertest'

describe("E2E test for product", () => {
    beforeEach(async () => {
        await sequelize.sync({ force: true })
    })

    afterAll(async () => {
        await sequelize.close()
    })

    it("should create a product", async () => {
        const response = await request(app)
            .post("/products")
            .send({
                name: "Cappuccino",
                description: "Delicioso",
                purchasePrice: 7,
                stock: 20
            })

        expect(response.status).toBe(200)
        expect(response.body.id).toBeDefined()
        expect(response.body.name).toBe("Cappuccino")
        expect(response.body.description).toBe("Delicioso")
        expect(response.body.purchasePrice).toBe(7)
        expect(response.body.stock).toBe(20)
        expect(response.body.createdAt).toBeDefined()
        expect(response.body.updatedAt).toBeDefined()
    })

    it("should not create a product", async () => {
        const response = await request(app)
            .post("/products")
            .send({
                name: "Latte"
            })

        expect(response.status).toBe(500)
    })
})