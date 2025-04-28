import express, { Request, Response } from 'express';
import AddClientUseCase from '../../../modules/client-adm/usecase/add-client/add-client.usecase';
import ClientRepository from '../../../modules/client-adm/repository/client.repository';
import Address from '../../../modules/@shared/domain/value-object/address';

export const clientRoute = express.Router();

clientRoute.post('/', async (req: Request, res: Response) => {
    const usecase = new AddClientUseCase(new ClientRepository())
    try {
        const address = new Address(
            req.body.street,
            req.body.number,
            req.body.complement,
            req.body.city,
            req.body.state,
            req.body.zipcode
        )
        const input = {
            name: req.body.name,
            email: req.body.email,
            document: req.body.document,
            address
        }
        const output = await usecase.execute(input)
        res.status(200).send(output)
    } catch (err) {
        res.status(500).send(err)
    }
})