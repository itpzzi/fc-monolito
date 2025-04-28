import { app, sequelize } from '../express'
import request from 'supertest'

describe("E2E test for client", () => {
    beforeEach(async () => {
        await sequelize.sync({ force: true })
    })

    afterAll(async () => {
        await sequelize.close()
    })

    it("should create a client", async () => {
        const response = await request(app)
            .post("/clients")
            .send({
                name: "Italo",
                email: "italo@email.com",
                document: "12345678",
                street: "Rua 1",
                number: "123",
                complement: "Apto 1",
                city: "São Paulo",  
                state: "SP",
                zipcode: "12345678"
            })

        expect(response.status).toBe(200)
        expect(response.body.name).toBe("Italo")
        expect(response.body.email).toBe("italo@email.com")
        expect(response.body.document).toBe("12345678")
        expect(response.body.address._street).toBe("Rua 1")
        expect(response.body.address._number).toBe("123")
        expect(response.body.address._complement).toBe("Apto 1")
        expect(response.body.address._city).toBe("São Paulo")
        expect(response.body.address._state).toBe("SP")
        expect(response.body.address._zipCode).toBe("12345678")
        expect(response.body.createdAt).toBeDefined()
        expect(response.body.updatedAt).toBeDefined()
        expect(response.body.id).toBeDefined()
    })

    it("should not create a client", async () => {
        const response = await request(app)
            .post("/clients")
            .send({
                name: "Italo"
            })

        expect(response.status).toBe(500)
    })
})