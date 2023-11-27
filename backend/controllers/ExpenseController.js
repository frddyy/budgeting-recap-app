import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Controller untuk membuat Expense baru
export const createExpense = async (req, res) => {
  try {
    const response = await prisma.expense.create({
      data: {
        title: req.body.title,
        amount: req.body.amount,
        description: req.body.description,
        date: req.body.date,
        wallet_id: req.body.wallet_id,
        // Optional: Uncomment the line below if you want to associate the expense with a budget
        budget_id: req.body.budget_id,
      },
    });

    res
      .status(201)
      .json({ msg: "Expense created successfully", data: response });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

// Controller untuk mendapatkan semua Expenses
export const getAllExpenses = async (req, res) => {
  try {
    const expenses = await prisma.expense.findMany();
    res.status(200).json(expenses);
  } catch (error) {
    console.error("Error fetching expenses:", error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

// Controller untuk mendapatkan Expense berdasarkan ID
export const getExpenseById = async (req, res) => {
  try {
    const { id } = req.params;
    const expense = await prisma.expense.findUnique({
      where: { id: parseInt(id) },
    });

    if (!expense) {
      return res.status(404).json({ msg: "Expense not found" });
    }

    res.status(200).json(expense);
  } catch (error) {
    console.error("Error fetching expense:", error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

// Controller untuk memperbarui Expense berdasarkan ID
export const updateExpenseById = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedExpenseData = req.body;

    const updatedExpense = await prisma.expense.update({
      where: { id: parseInt(id) },
      data: updatedExpenseData,
    });

    res
      .status(200)
      .json({ msg: "Expense updated successfully", data: updatedExpense });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

// Controller untuk menghapus Expense berdasarkan ID
export const deleteExpenseById = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.expense.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({ msg: "Expense deleted successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

// Controller untuk mendapatkan Expenses berdasarkan nama pengguna
export const getExpenseByUsername = async (req, res) => {
  try {
    const { username } = req.params;

    const user = await prisma.user.findUnique({
      where: { username },
      include: {
        wallets: {
          include: {
            expenses: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const allExpenses = user.wallets.reduce((acc, wallet) => {
      acc.push(...wallet.expenses);
      return acc;
    }, []);

    res.status(200).json({ expenses: allExpenses });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ msg: 'Internal Server Error' });
  }
};

// Controller untuk memperbarui Expense berdasarkan nama pengguna dan ID Expense
export const updateExpenseByUsernameAndExpenseId = async (req, res) => {
  try {
    const { username, expense_id } = req.params;
    const updatedExpenseData = req.body;

    const user = await prisma.user.findUnique({
      where: { username },
      include: {
        wallets: {
          include: {
            expenses: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const updatedExpense = await prisma.expense.update({
      where: {
        id: parseInt(expense_id),
      },
      data: updatedExpenseData,
    });

    res.status(200).json({ msg: 'Expense updated successfully', data: updatedExpense });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ msg: 'Internal Server Error' });
  }
};

// Controller untuk menghapus Expense berdasarkan nama pengguna dan ID Expense
export const deleteExpenseByUsernameAndExpenseId = async (req, res) => {
  try {
    const { username, expense_id } = req.params;

    const user = await prisma.user.findUnique({
      where: { username },
      include: {
        wallets: {
          include: {
            expenses: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    await prisma.expense.delete({
      where: {
        id: parseInt(expense_id),
      },
    });

    res.status(200).json({ msg: 'Expense deleted successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ msg: 'Internal Server Error' });
  }
};
