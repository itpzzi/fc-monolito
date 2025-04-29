import Address from '../../../modules/@shared/domain/value-object/address';
import Id from '../../../modules/@shared/domain/value-object/id.value-object';
import Invoice from '../../../modules/invoice/domain/invoice';
import InvoiceItem from '../../../modules/invoice/domain/invoice-item';
import InvoiceRepository from '../../../modules/invoice/repository/invoice.repository';
import { app, sequelize } from '../express'
import request from 'supertest'

const invoice = new Invoice({
    id: new Id("inv-123"),
    name: "Cliente Exemplo",
    document: "12345678900",
    address: new Address(
        "Rua Exemplo",
        "123",
        "Apto 45",
        "São Paulo",
        "SP",
        "01000-000"
    ),
    items: [
        new InvoiceItem({
            id: new Id("prod-1"),
            name: "Produto 1",
            price: 30
        }),
        new InvoiceItem({
            id: new Id("prod-2"),
            name: "Produto 2",
            price: 20
        })
    ],
    createdAt: new Date(),
    updatedAt: new Date()
});

describe("E2E test for invoice", () => {
    beforeEach(async () => {
        await sequelize.sync({ force: true })
    })

    afterAll(async () => {
        await sequelize.close()
    })

    it("should get a invoice by id", async () => {
        const repository = new InvoiceRepository();
        await repository.generate(invoice);
        
        const response = await request(app)
            .get("/invoice/inv-123")

        expect(response.status).toBe(200);
        expect(response.body.id).toBe("inv-123");
        expect(response.body.name).toBe("Cliente Exemplo");
        expect(response.body.document).toBe("12345678900");

        expect(response.body.address).toEqual({
            street: "Rua Exemplo",
            number: "123",
            complement: "Apto 45",
            city: "São Paulo",
            state: "SP",
            zipCode: "01000-000"
        });

        expect(response.body.items).toEqual([
            { id: "prod-1", name: "Produto 1", price: 30 },
            { id: "prod-2", name: "Produto 2", price: 20 }
        ]);

        expect(response.body.createdAt).toBeDefined()
        expect(response.body.total).toBe(50);
    })

    it("should not get an invoice by non-existent id", async () => {
        const response = await request(app)
            .get("/invoice/inv-678")

        expect(response.status).toBe(500)
    })
})