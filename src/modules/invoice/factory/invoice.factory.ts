import Address from "../../@shared/domain/value-object/address";
import Id from "../../@shared/domain/value-object/id.value-object";
import Invoice from "../domain/invoice";
import InvoiceItem from "../domain/invoice-item";

type InvoiceFactoryProps = {
    id?: Id;
    name: string;
    document: string;
    street: string;
    number: string;
    complement: string;
    city: string;
    state: string;
    zipCode: string;
    items: {
        id: string;
        name: string;
        price: number;
    }[];
    createdAt?: Date;
    updatedAt?: Date;
}

export default class InvoiceFactory {
    static create(props: InvoiceFactoryProps): Invoice {

        const items = props.items.map((item) => {
            return new InvoiceItem({
                id: new Id(item.id),
                name: item.name,
                price: item.price
            })
        })

        return new Invoice({
            id: props.id,
            name: props.name,
            document: props.document,
            address: new Address(
                props.street,
                props.number,
                props.complement,
                props.city,
                props.state,
                props.zipCode
            ),
            createdAt: props.createdAt,
            updatedAt: props.updatedAt,
            items
        })
    }
}