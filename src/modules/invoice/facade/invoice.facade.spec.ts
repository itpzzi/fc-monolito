import { Sequelize } from "sequelize-typescript";
import InvoiceRepository from "../repository/invoice.repository";
import GenerateInvoiceUseCase from "../usecase/generate-invoice/generate-invoice.usecase";
import FindInvoiceUseCase from "../usecase/find-invoice/find-invoice.usecase";
import InvoiceFacade from "./invoice.facade";
import InvoiceFacadeFactory from "../factory/invoice.facade.factory";
import InvoiceModel from "../repository/invoice.model";
import InvoiceItemModel from "../repository/invoice-item.model";

describe("Invoice Facade test", () => {

    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false,
            sync: { force: true }
        });

        sequelize.addModels([InvoiceModel, InvoiceItemModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should generate an invoice", async () => {
        const repository = new InvoiceRepository();
        const generateUseCase = new GenerateInvoiceUseCase(repository);
        const findUseCase = new FindInvoiceUseCase(repository);
        const facade = new InvoiceFacade({
            generateUsecase: generateUseCase,
            findUsecase: findUseCase
        });

        const address = {
            street: "Rua 123",
            number: "99",
            complement: "Casa Verde",
            city: "Criciúma",
            state: "SC",
            zipCode: "88888-888"
        };

        const items = [
            { id: "1", name: "Product 1", price: 100 },
            { id: "3", name: "Product 3", price: 300 }
        ];

        const input = {
            ...address,
            name: "Lucian",
            document: "1234-5678",
            items
        };

        await facade.generate(input);

        const invoice = await InvoiceModel.findOne({
            include: ['items']
        });

        expect(invoice).toBeDefined();
        expect(invoice.name).toBe(input.name);
        expect(invoice.document).toBe(input.document);
        expect(invoice.items.length).toBe(input.items.length);


        input.items.forEach((item, index) => {
            expect(invoice.items[index].name).toBe(item.name);
            expect(invoice.items[index].price).toBe(item.price);
        });
    });

    it("should find an invoice by ID", async () => {
        const invoice1 = await InvoiceModel.create(
            {
                id: "1",
                name: "Invoice 1",
                document: "1234-5678",
                street: "Rua A",
                number: "10",
                complement: "Complemento 1",
                city: "Cidade A",
                state: "Estado A",
                zipCode: "12345-678",
                items: [
                    { id: "101", name: "Item 1", price: 100 },
                    { id: "102", name: "Item 2", price: 200 },
                ],
            },
            { include: [InvoiceItemModel] }
        );

        const invoice2 = await InvoiceModel.create(
            {
                id: "2",
                name: "Invoice 2",
                document: "8765-4321",
                street: "Rua B",
                number: "20",
                complement: "Complemento 2",
                city:
                    "Cidade B",
                state: "Estado B",
                zipCode: "98765-432",
                items: [
                    { id: "201", name: "Item A", price: 150 },
                    { id: "202", name: "Item B", price: 250 },
                ],
            },
            { include: [InvoiceItemModel] }
        );

        const facade = InvoiceFacadeFactory.create();

        const input1 = { id: "1" };
        const result1 = await facade.find(input1);

        expect(result1).toBeDefined();
        expect(result1.id).toBe(invoice1.id);
        expect(result1.name).toBe(invoice1.name);
        expect(result1.document).toBe(invoice1.document);
        expect(result1.address.street).toBe(invoice1.street);
        expect(result1.address.number).toBe(invoice1.number);
        expect(result1.address.complement).toBe(invoice1.complement);
        expect(result1.address.city).toBe(invoice1.city);
        expect(result1.address.state).toBe(invoice1.state);
        expect(result1.address.zipCode).toBe(invoice1.zipCode);
        expect(result1.items).toHaveLength(2);
        expect(result1.items).toEqual([
            { id: "101", name: "Item 1", price: 100 },
            { id: "102", name: "Item 2", price: 200 },
        ]);

        const input2 = { id: "2" };
        const result2 = await facade.find(input2);

        expect(result2).toBeDefined();
        expect(result2.id).toBe(invoice2.id);
        expect(result2.name).toBe(invoice2.name);
        expect(result2.document).toBe(invoice2.document);
        expect(result2.address.street).toBe(invoice2.street);
        expect(result2.address.number).toBe(invoice2.number);
        expect(result2.address.complement).toBe(invoice2.complement);
        expect(result2.address.city).toBe(invoice2.city);
        expect(result2.address.state).toBe(invoice2.state);
        expect(result2.address.zipCode).toBe(invoice2.zipCode);
        expect(result2.items).toHaveLength(2);
        expect(result2.items).toEqual([
            { id: "201", name: "Item A", price: 150 },
            { id: "202", name: "Item B", price: 250 },
        ]);
    });
});
