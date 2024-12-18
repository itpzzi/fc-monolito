import { Sequelize } from "sequelize-typescript";
import InvoiceModel from "./invoice.model";
import InvoiceRepository from "./invoice.repository";
import Invoice from "../domain/invoice";
import InvoiceItem from "../domain/invoice-item";
import Id from "../../@shared/domain/value-object/id.value-object";
import Address from "../../@shared/domain/value-object/address";
import InvoiceItemModel from "./invoice-item.model";

describe("Invoice Repository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([InvoiceModel, InvoiceItemModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should generate an invoice", async () => {
    const invoice = new Invoice({
      id: new Id("1"),
      name: "Invoice Test",
      document: "1234-5678",
      address: new Address(
        "Street 1",
        "100",
        "Apt 202",
        "CityTest",
        "StateTest",
        "12345-678"
      ),
      items: [
        new InvoiceItem({
          id: new Id("1"),
          name: "Item 1",
          price: 50,
        }),
        new InvoiceItem({
          id: new Id("2"),
          name: "Item 2",
          price: 100,
        }),
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const repository = new InvoiceRepository();
    await repository.generate(invoice);

    const invoiceDb = await InvoiceModel.findOne({
      where: { id: "1" },
      include: ["items"],
    });

    expect(invoiceDb).toBeDefined();
    expect(invoiceDb.id).toEqual(invoice.id.id);
    expect(invoiceDb.name).toEqual(invoice.name);
    expect(invoiceDb.document).toEqual(invoice.document);
    expect(invoiceDb.street).toEqual(invoice.address.street);
    expect(invoiceDb.number).toEqual(invoice.address.number);
    expect(invoiceDb.complement).toEqual(invoice.address.complement);
    expect(invoiceDb.city).toEqual(invoice.address.city);
    expect(invoiceDb.state).toEqual(invoice.address.state);
    expect(invoiceDb.zipCode).toEqual(invoice.address.zipCode);
    expect(invoiceDb.items).toHaveLength(2);
    expect(invoiceDb.items[0].name).toEqual(invoice.items[0].name);
    expect(invoiceDb.items[0].price).toEqual(invoice.items[0].price);
    expect(invoiceDb.items[1].name).toEqual(invoice.items[1].name);
    expect(invoiceDb.items[1].price).toEqual(invoice.items[1].price);
  });

  it("should find an invoice", async () => {
    await InvoiceModel.create(
      {
        id: "1",
        name: "Invoice Test",
        document: "1234-5678",
        street: "Street 1",
        number: "100",
        complement: "Apt 202",
        city: "CityTest",
        state: "StateTest",
        zipCode: "12345-678",
        createdAt: new Date(),
        updatedAt: new Date(),
        items: [
          {
            id: "1",
            name: "Item 1",
            price: 50,
          },
          {
            id: "2",
            name: "Item 2",
            price: 100,
          },
        ],
      },
      {
        include: ["items"],
      }
    );

    const repository = new InvoiceRepository();
    const invoice = await repository.find("1");

    expect(invoice).toBeDefined();
    expect(invoice.id.id).toEqual("1");
    expect(invoice.name).toEqual("Invoice Test");
    expect(invoice.document).toEqual("1234-5678");
    expect(invoice.address.street).toEqual("Street 1");
    expect(invoice.address.number).toEqual("100");
    expect(invoice.address.complement).toEqual("Apt 202");
    expect(invoice.address.city).toEqual("CityTest");
    expect(invoice.address.state).toEqual("StateTest");
    expect(invoice.address.zipCode).toEqual("12345-678");
    expect(invoice.items).toHaveLength(2);
    expect(invoice.items[0].name).toEqual("Item 1");
    expect(invoice.items[0].price).toEqual(50);
    expect(invoice.items[1].name).toEqual("Item 2");
    expect(invoice.items[1].price).toEqual(100);
  });
});
