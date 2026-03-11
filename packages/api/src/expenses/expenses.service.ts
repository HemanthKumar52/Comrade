import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExpenseDto, CreateSplitsDto } from './dto/expenses.dto';

@Injectable()
export class ExpensesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateExpenseDto) {
    return this.prisma.expense.create({
      data: {
        tripId: dto.tripId,
        userId,
        amount: dto.amount,
        currency: dto.currency,
        category: dto.category as any,
        description: dto.description || null,
        receiptUrl: dto.receiptUrl || null,
        merchantName: dto.merchantName || null,
        paidById: dto.paidById || userId,
        splitType: (dto.splitType as any) || null,
      },
      include: {
        user: { select: { id: true, name: true } },
        paidBy: { select: { id: true, name: true } },
      },
    });
  }

  async listByTrip(tripId: string, take = 50, skip = 0) {
    const [expenses, total] = await Promise.all([
      this.prisma.expense.findMany({
        where: { tripId },
        orderBy: { createdAt: 'desc' },
        take,
        skip,
        include: {
          user: { select: { id: true, name: true } },
          paidBy: { select: { id: true, name: true } },
          splits: {
            include: { user: { select: { id: true, name: true } } },
          },
        },
      }),
      this.prisma.expense.count({ where: { tripId } }),
    ]);

    return { expenses, total, take, skip };
  }

  async getSummary(tripId: string) {
    const expenses = await this.prisma.expense.findMany({
      where: { tripId },
      include: {
        paidBy: { select: { id: true, name: true } },
      },
    });

    const total = expenses.reduce((sum, e) => sum + e.amount, 0);
    const byCategory: Record<string, number> = {};
    const byPerson: Record<string, { name: string; total: number }> = {};

    for (const e of expenses) {
      byCategory[e.category] = (byCategory[e.category] || 0) + e.amount;
      const payerId = e.paidById || e.userId;
      if (!byPerson[payerId]) {
        byPerson[payerId] = {
          name: e.paidBy?.name || 'Unknown',
          total: 0,
        };
      }
      byPerson[payerId].total += e.amount;
    }

    const days = expenses.length > 0
      ? Math.max(
          1,
          Math.ceil(
            (expenses[0].createdAt.getTime() -
              expenses[expenses.length - 1].createdAt.getTime()) /
              (1000 * 60 * 60 * 24),
          ),
        )
      : 1;

    return {
      total,
      currency: expenses[0]?.currency || 'USD',
      count: expenses.length,
      dailyAverage: Math.round((total / days) * 100) / 100,
      byCategory,
      byPerson: Object.entries(byPerson).map(([userId, data]) => ({
        userId,
        ...data,
      })),
    };
  }

  async createSplits(expenseId: string, dto: CreateSplitsDto) {
    const expense = await this.prisma.expense.findUnique({
      where: { id: expenseId },
    });
    if (!expense) {
      throw new NotFoundException('Expense not found');
    }

    // Delete existing splits
    await this.prisma.expenseSplit.deleteMany({
      where: { expenseId },
    });

    const splits = await Promise.all(
      dto.splits.map((s) =>
        this.prisma.expenseSplit.create({
          data: {
            expenseId,
            userId: s.userId,
            amount: s.amount,
          },
          include: { user: { select: { id: true, name: true } } },
        }),
      ),
    );

    return splits;
  }

  async getSettlements(tripId: string) {
    const expenses = await this.prisma.expense.findMany({
      where: { tripId },
      include: {
        splits: true,
        paidBy: { select: { id: true, name: true } },
      },
    });

    // Calculate net balances
    const balances: Record<string, number> = {};
    const nameMap: Record<string, string> = {};

    for (const expense of expenses) {
      const payerId = expense.paidById || expense.userId;
      if (expense.paidBy) {
        nameMap[payerId] = expense.paidBy.name;
      }

      if (expense.splits.length > 0) {
        // Payer paid the full amount
        balances[payerId] = (balances[payerId] || 0) + expense.amount;
        // Each split participant owes their share
        for (const split of expense.splits) {
          nameMap[split.userId] = split.userId; // will be overridden with name below
          balances[split.userId] = (balances[split.userId] || 0) - split.amount;
        }
      }
    }

    // Minimum transactions algorithm (greedy)
    const debtors: Array<{ id: string; amount: number }> = [];
    const creditors: Array<{ id: string; amount: number }> = [];

    for (const [id, balance] of Object.entries(balances)) {
      if (balance > 0.01) creditors.push({ id, amount: balance });
      else if (balance < -0.01) debtors.push({ id, amount: -balance });
    }

    debtors.sort((a, b) => b.amount - a.amount);
    creditors.sort((a, b) => b.amount - a.amount);

    const settlements: Array<{
      from: string;
      fromName: string;
      to: string;
      toName: string;
      amount: number;
    }> = [];

    let i = 0;
    let j = 0;
    while (i < debtors.length && j < creditors.length) {
      const amount = Math.min(debtors[i].amount, creditors[j].amount);
      if (amount > 0.01) {
        settlements.push({
          from: debtors[i].id,
          fromName: nameMap[debtors[i].id] || debtors[i].id,
          to: creditors[j].id,
          toName: nameMap[creditors[j].id] || creditors[j].id,
          amount: Math.round(amount * 100) / 100,
        });
      }
      debtors[i].amount -= amount;
      creditors[j].amount -= amount;
      if (debtors[i].amount < 0.01) i++;
      if (creditors[j].amount < 0.01) j++;
    }

    return { settlements };
  }

  async getReport(tripId: string) {
    const [summary, settlements] = await Promise.all([
      this.getSummary(tripId),
      this.getSettlements(tripId),
    ]);

    return {
      ...summary,
      ...settlements,
    };
  }
}
