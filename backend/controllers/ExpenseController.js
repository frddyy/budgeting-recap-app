import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Controller untuk membuat Expense baru
export const createExpense = async (req, res) => {
  try {
    // Log request body untuk debugging
    console.log("Request body:", req.body);

    const { title, amount, description, date, wallet_id, budget_id } = req.body;

    if (!wallet_id || !budget_id) {
      return res
        .status(400)
        .json({ msg: "Wallet ID and Budget ID are required" });
    }

    const response = await prisma.expense.create({
      data: {
        title,
        amount,
        description,
        date,
        wallet: { connect: { id: wallet_id } },
        budget: { connect: { id: budget_id } }, // If your schema has a relation with budget
      },
    });

    res
      .status(201)
      .json({ msg: "Expense created successfully", data: response });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ msg: "Internal Server Error", error: error.message });
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

// // Controller untuk mendapatkan Expenses berdasarkan nama pengguna
// export const getExpenseByUsername = async (req, res) => {
//   try {
//     const { username } = req.params;

//     const expenses = await prisma.expense.findMany({
//       where: { wallet: { user: { username: username } } }, // Update the query to correctly reference the user
//       include: {
//         wallet: true,
//         budget: true,
//       },
//     });

//     // Optionally, you can reshape the data to include only necessary fields
//     const result = expenses.map((expense) => ({
//       ...expense,
//       wallet_name: expense.wallet.name,
//       budget_title: expense.budget.title,
//     }));

//     res.status(200).json({ expenses: result });
//   } catch (error) {
//     console.error("Error:", error);
//     res.status(500).json({ msg: "Internal Server Error" });
//   }
// };

export const getExpenseByUsername = async (req, res) => {
  try {
    const { username } = req.params;
    const { startDate, endDate } = req.query;

    const whereClause = {
      wallet: { user: { username } },
    };

    if (startDate && endDate) {
      whereClause.date = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    }

    const expenses = await prisma.expense.findMany({
      where: whereClause,
      include: {
        wallet: true,
        budget: true,
      },
    });

    //   Sisanya sama...
    //  Optionally, you can reshape the data to include only necessary fields
    const result = expenses.map((expense) => ({
      ...expense,
      wallet_name: expense.wallet ? expense.wallet.name : "No Wallet",
      budget_title: expense.budget ? expense.budget.title : "No Budget",
    }));

    res.status(200).json({ expenses: result });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ msg: "Internal Server Error" });
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
      return res.status(404).json({ msg: "User not found" });
    }

    const updatedExpense = await prisma.expense.update({
      where: {
        id: parseInt(expense_id),
      },
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
      return res.status(404).json({ msg: "User not found" });
    }

    await prisma.expense.delete({
      where: {
        id: parseInt(expense_id),
      },
    });

    res.status(200).json({ msg: "Expense deleted successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};
