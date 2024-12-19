
import express, { Request, Response } from "express";
import FindInvoiceUseCase from "../../../invoice/usecase/find-invoice/find-invoice.usecase";
import InvoiceRepository from "../../../invoice/repository/invoice.repository";

export const invoiceRoute = express.Router()

invoiceRoute.get("/:id", async (req: Request, res: Response) => {
    try {
        const usecase = new FindInvoiceUseCase(new InvoiceRepository());
        const output = await usecase.execute({ id: req.params.id });
        res.status(200).json(output);
    } catch (error: any) {
        if (error.message === "Invoice not found") {
            res.status(404).json({ message: error.message });
        } else {
            res.status(500).json({ message: "Internal server error" });
        }
    }
});
