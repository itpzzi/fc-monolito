import InvoiceItemModel from "../../../invoice/repository/invoice-item.model";
import InvoiceModel from "../../../invoice/repository/invoice.model";
import FindInvoiceUseCase from "../../../invoice/usecase/find-invoice/find-invoice.usecase";
import { app, sequelize } from "../express";
import request from "supertest";

describe("E2E test for invoice", () => {
    beforeEach(async () => {
        sequelize.addModels([InvoiceModel, InvoiceItemModel]);
        await sequelize.sync({ force: true });

        await InvoiceModel.create({
            id: "1",
            name: "Invoice 1",
            document: "12345678900",
            street: "Rua 1",
            number: "123",
            complement: "Apto 101",
            city: "São Paulo",
            state: "SP",
            zipCode: "12345-678",
            items: [
                { id: "i1", name: "Item 1", price: 100, invoice_id: "1" },
                { id: "i2", name: "Item 2", price: 200, invoice_id: "1" },
            ],
        }, {
            include: [InvoiceItemModel],
        });
    });

    afterAll(async () => {
        await sequelize.close();
    });

    it("should find an invoice by ID", async () => {
        const response = await request(app)
            .get("/invoice/1")
            .send();

        expect(response.status).toBe(200);
        expect(response.body.id).toBe("1");
        expect(response.body.name).toBe("Invoice 1");
        expect(response.body.document).toBe("12345678900");
        expect(response.body.address).toEqual({
            street: "Rua 1",
            number: "123",
            complement: "Apto 101",
            city: "São Paulo",
            state: "SP",
            zipCode: "12345-678",
        });
        expect(response.body.items).toHaveLength(2);
        expect(response.body.items[0]).toEqual({
            id: "i1",
            name: "Item 1",
            price: 100,
        });
        expect(response.body.items[1]).toEqual({
            id: "i2",
            name: "Item 2",
            price: 200,
        });
    });

    it("should return 404 when invoice is not found", async () => {
        const response = await request(app).get("/invoice/nonexistent-id").send();

        expect(response.status).toBe(404);
        expect(response.body.message).toBe("Invoice not found");
    });

    it("should return 500 on unexpected error", async () => {
        jest.spyOn(FindInvoiceUseCase.prototype, "execute").mockImplementationOnce(() => {
            throw new Error("Unexpected error");
        });

        const response = await request(app).get("/invoice/any-id").send();

        expect(response.status).toBe(500);
        expect(response.body.message).toBe("Internal server error");

        jest.restoreAllMocks();
    });

});
