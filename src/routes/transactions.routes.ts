import { Router } from 'express';
import { getCustomRepository } from 'typeorm';
import multer from 'multer';
import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import uploadConfig from '../config/upload';
import ImportTransactionsService from '../services/ImportTransactionsService';

const transactionsRouter = Router();
const upload = multer(uploadConfig);

transactionsRouter.get('/', async (request, response) => {
  try {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    response.json({
      transactions: await transactionsRepository.find(),
      balance: await transactionsRepository.getBalance(),
    });
  } catch (e) {
    response.json({ error: e.message });
  }
});

transactionsRouter.post('/', async (request, response) => {
  try {
    const { title, value, type, category } = request.body;

    const transaction = await new CreateTransactionService().execute({
      title,
      value,
      type,
      category,
    });

    return response.status(201).json(transaction);
  } catch (e) {
    return response.status(400).json({ message: e.message, status: 'error' });
  }
});

transactionsRouter.delete('/:id', async (request, response) => {
  try {
    const { id } = request.params;

    new DeleteTransactionService().execute(id);

    return response.json({ message: 'deleted' });
  } catch (e) {
    return response.json({ message: e });
  }
});

transactionsRouter.post(
  '/import',
  upload.single('file'),
  async (request, response) => {
    try {
      const transactions = await new ImportTransactionsService().execute(
        request.file.path,
      );

      return response.json(transactions);
    } catch (e) {
      return response.json({ message: e.message });
    }
  },
);

export default transactionsRouter;
