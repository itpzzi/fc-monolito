import express, { Request, Response } from 'express';
import InvoiceRepository from '../../../modules/invoice/repository/invoice.repository';
import FindInvoiceUseCase from '../../../modules/invoice/usecase/find-invoice/find-invoice.usecase';

export const invoiceRoute = express.Router();

invoiceRoute.get('/:id', async (req: Request, res: Response) => {
    const usecase = new FindInvoiceUseCase(new InvoiceRepository())
    try {
        const input = {
            id: req.params.id
        }
        const output = await usecase.execute(input)
        res.status(200).send(output)
    } catch (err) {
        res.status(500).send(err)
    }
})