import Address from "../../@shared/domain/value-object/address";
import Id from "../../@shared/domain/value-object/id.value-object";
import Invoice from "../../invoice/domain/invoice";
import InvoiceItem from "../../invoice/domain/invoice-item";
import InvoiceGateway from "../../invoice/gateway/invoice.gateway";
import InvoiceModel from "../../invoice/repository/invoice.model";
import InvoiceItemModel from "./invoice-item.model";

export default class InvoiceRepository implements InvoiceGateway {
    private mapToAddress(entity: any): Address {
        return new Address(
            entity.street,
            entity.number,
            entity.complement,
            entity.city,
            entity.state,
            entity.zipCode
        );
    }

    private mapToInvoiceItems(items: any[]): InvoiceItem[] {
        return items.map(item => new InvoiceItem({
            id: new Id(item.id),
            name: item.name,
            price: item.price
        }));
    }

    private mapToInvoice(entity: any): Invoice {
        return new Invoice({
            id: new Id(entity.id),
            name: entity.name,
            document: entity.document,
            address: this.mapToAddress(entity),
            items: this.mapToInvoiceItems(entity.items),
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
        });
    }
    
    async find(id: string): Promise<Invoice> {
        const entity = await InvoiceModel.findOne({
            where: {
                id: id
            },
            include: ["items"]
        });

        if (!entity) {
            throw new Error("Invoice not found");
        }

        return this.mapToInvoice(entity);
    }

    async generate(entity: Invoice): Promise<void> {
        await InvoiceModel.create(
          {
            id: entity.id.id,
            name: entity.name,
            document: entity.document,
            street: entity.address.street,
            number: entity.address.number,
            complement: entity.address.complement,
            city: entity.address.city,
            state: entity.address.state,
            zipCode: entity.address.zipCode,
            items: entity.items.map((item) => ({
              id: item.id.id,
              name: item.name,
              price: item.price,
            })),
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
          },
          {
            include: [{ model: InvoiceItemModel }],
          }
        );
      }
}
