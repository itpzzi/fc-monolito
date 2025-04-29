import express, { Request, Response } from 'express';
import ProcessPaymentUseCase from '../../../modules/payment/usecase/process-payment/process-payment.usecase';
import TransactionRepostiory from '../../../modules/payment/repository/transaction.repository';

export const checkoutRoute = express.Router();

checkoutRoute.post('/', async (req: Request, res: Response) => {
    const usecase = new ProcessPaymentUseCase(new TransactionRepostiory())
    try {
        const input = {
            amount: req.body.amount,
            orderId: req.body.orderId
        }
        const output = await usecase.execute(input)
        res.status(200).send(output)
    } catch (err) {
        res.status(500).send(err)
    }
})