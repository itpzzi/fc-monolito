import GenerateInvoiceUseCase from "./generate-invoice.usecase";
import { GenerateInvoiceUseCaseInputDto } from "./generate-invoice.dto";

const MockInvoiceRepository = () => {
    return {
        generate: jest.fn(),
        find: jest.fn(),
    };
};

describe("Generate Invoice use case unit test", () => {

    it("should generate an invoice", async () => {

        const repository = MockInvoiceRepository();
        const usecase = new GenerateInvoiceUseCase(repository);

        const input: GenerateInvoiceUseCaseInputDto = {
            name: "Lucian",
            document: "1234-5678",
            street: "Rua 123",
            number: "99",
            complement: "Casa Verde",
            city: "Criciúma",
            state: "SC",
            zipCode: "88888-888",
            items: [
                {
                    id: "1",
                    name: "Product 1",
                    price: 100
                },
                {
                    id: "2",
                    name: "Product 2",
                    price: 200
                }
            ]
        };

        const result = await usecase.execute(input);

        expect(repository.generate).toHaveBeenCalled();
        expect(result.id).toBeDefined();
        expect(result.name).toEqual(input.name);
        expect(result.document).toEqual(input.document);
        expect(result.street).toEqual(input.street);
        expect(result.number).toEqual(input.number);
        expect(result.complement).toEqual(input.complement);
        expect(result.city).toEqual(input.city);
        expect(result.state).toEqual(input.state);
        expect(result.zipCode).toEqual(input.zipCode);
        expect(result.items.length).toBe(2);
        expect(result.items[0].name).toEqual(input.items[0].name);
        expect(result.items[0].price).toEqual(input.items[0].price);
        expect(result.items[1].name).toEqual(input.items[1].name);
        expect(result.items[1].price).toEqual(input.items[1].price);
        expect(result.total).toEqual(300);
    });

});
