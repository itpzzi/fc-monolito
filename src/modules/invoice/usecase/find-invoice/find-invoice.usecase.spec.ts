import Address from "../../../@shared/domain/value-object/address";
import Id from "../../../@shared/domain/value-object/id.value-object";
import Invoice from "../../../invoice/domain/invoice";
import InvoiceItem from "../../../invoice/domain/invoice-item";
import FindInvoiceUseCase from "../../../invoice/usecase/find-invoice/find-invoice.usecase";

const invoice = new Invoice({
  id: new Id("1"),
  name: "Test Invoice",
  document: "1234-5678",
  address: new Address(
    "Street 123",
    "99",
    "Apt 202",
    "Test City",
    "Test State",
    "12345-678"
  ),
  items: [
    new InvoiceItem({
      id: new Id("1"),
      name: "Item 1",
      price: 50
    }),
    new InvoiceItem({
      id: new Id("2"),
      name: "Item 2",
      price: 100
    })
  ],
  createdAt: new Date(),
  updatedAt: new Date()
});

const MockRepository = () => {
  return {
    generate: jest.fn(),
    find: jest.fn().mockReturnValue(Promise.resolve(invoice))
  };
};

describe("Find Invoice use case unit test", () => {
  it("should find an invoice", async () => {
    const repository = MockRepository();
    const usecase = new FindInvoiceUseCase(repository);

    const input = { id: "1" };

    const result = await usecase.execute(input);

    expect(repository.find).toHaveBeenCalledWith("1");
    expect(result.id).toEqual(invoice.id.id);
    expect(result.name).toEqual(invoice.name);
    expect(result.document).toEqual(invoice.document);
    expect(result.address.street).toEqual(invoice.address.street);
    expect(result.address.number).toEqual(invoice.address.number);
    expect(result.address.complement).toEqual(invoice.address.complement);
    expect(result.address.city).toEqual(invoice.address.city);
    expect(result.address.state).toEqual(invoice.address.state);
    expect(result.address.zipCode).toEqual(invoice.address.zipCode);
    expect(result.items).toHaveLength(2);
    expect(result.items[0].id).toEqual(invoice.items[0].id.id);
    expect(result.items[0].name).toEqual(invoice.items[0].name);
    expect(result.items[0].price).toEqual(invoice.items[0].price);
    expect(result.createdAt).toEqual(invoice.createdAt);
  });
});
