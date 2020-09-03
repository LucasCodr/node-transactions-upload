// import AppError from '../errors/AppError';

import { getCustomRepository, getRepository } from 'typeorm';
import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';
import Category from '../models/Category';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionRepository = getCustomRepository(TransactionsRepository);
    const categoriesRepository = getRepository(Category);

    const { total } = await transactionRepository.getBalance();

    const negativeBalance = total - value;

    if (type === 'outcome' && negativeBalance < 0) {
      throw new Error('Invalid balance');
    }

    let categoryFound = await categoriesRepository.findOne({
      where: { title: category },
    });

    if (!categoryFound) {
      categoryFound = await categoriesRepository.create({
        title: category,
      });
      await categoriesRepository.save(categoryFound);
    }

    const transaction = transactionRepository.create({
      title,
      value,
      type,
      category: categoryFound,
    });

    await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
