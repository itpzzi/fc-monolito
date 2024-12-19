import express, { Express } from "express"
import { Sequelize } from "sequelize-typescript"
import { productsRoute } from "./routes/products.route"
import { clientsRoute } from "./routes/clients.route"
import { checkoutRoute } from "./routes/checkout.route"
import { invoiceRoute } from "./routes/invoice.route"

export const app: Express = express()
app.use(express.json())
app.use("/products", productsRoute)
app.use("/clients", clientsRoute)
app.use("/checkout", checkoutRoute)
app.use("/invoice", invoiceRoute)

export let sequelize: Sequelize;

async function setupDb() {
    sequelize = new Sequelize({
        dialect: "sqlite",
        storage: ":memory:",
        logging: false
    })
    await sequelize.addModels([])
    await sequelize.sync()
}

setupDb()