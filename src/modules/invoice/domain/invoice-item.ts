import Id from "../../@shared/domain/value-object/id.value-object";

type InvoiceItemProps = {
    id?: Id;
    name: string;
    price: number;
}

export default class InvoiceItem {
    private _id: Id;
    private _name: string;
    private _price: number;

    constructor(props: InvoiceItemProps) {
        this._id = props.id || new Id()
        this._name = props.name
        this._price = props.price
        this.validate()
    }

    get id(): Id {
        return this._id
    }
    get name(): string {
        return this._name
    }

    get price(): number {
        return this._price
    }

    validate(): boolean {
        if (this._name.length === 0) {
            throw new Error("Name is required");
        }
        if (this._price < 0) {
            throw new Error("Price must be greater than zero");
        }

        return true;
    }
}