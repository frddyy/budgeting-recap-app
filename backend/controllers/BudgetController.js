import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createBudget = async (req, res) => {
  try {
    const response = await prisma.Budget.create({
      data: {
        title: req.body.title,
        amount: req.body.amount,
        amount_now: req.body.amount,
        date: req.body.date,
        category_id: req.body.category_id,
      },
    });
    res
      .status(201)
      .json({ msg: "Budget created successfully", data: response });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getAllBudgets = async (req, res) => {
  try {
    const budgets = await prisma.budget.findMany();
    res.status(200).json(budgets);
  } catch (error) {
    console.error("Error fetching budgets:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getBudgetByUsername = async (req, res) => {
  try {
    // Ambil username dari parameter request
    const { username } = req.params;

    // Cari user berdasarkan username
    const user = await prisma.user.findUnique({
      where: { username },
      include: {
        categories: {
          include: {
            budgets: true,
          },
        },
      },
    });

    // Jika user tidak ditemukan, kirim respons 404
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Ambil semua budgets dari categories user
    const allBudgets = user.categories.reduce((acc, category) => {
      acc.push(...category.budgets);
      return acc;
    }, []);

    // Kirim respons dengan data budgets
    res.status(200).json({ budgets: allBudgets });
    res;
  } catch (error) {
    // Tangani kesalahan dan kirim respons 500 jika terjadi kesalahan server
    console.error("Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getBudgetByUsernameAndCategory = async (req, res) => {
  try {
    // Ambil username dan nama kategori dari parameter request
    const { username, category } = req.params;

    // Cari user berdasarkan username
    const user = await prisma.user.findUnique({
      where: { username },
      include: {
        categories: {
          where: { name: category }, // Filter berdasarkan nama kategori
          include: {
            budgets: true,
          },
        },
      },
    });

    // Jika user tidak ditemukan atau kategori tidak ditemukan, kirim respons 404
    if (!user || !user.categories || user.categories.length === 0) {
      return res.status(404).json({ message: "User or category not found" });
    }

    // Ambil semua budgets dari kategori yang sesuai
    const budgetsInCategory = user.categories[0].budgets;

    // Kirim respons dengan data budgets
    res.status(200).json({ budgets: budgetsInCategory });
  } catch (error) {
    // Tangani kesalahan dan kirim respons 500 jika terjadi kesalahan server
    console.error("Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


// Controller untuk mengupdate budget dari categories berdasarkan username dan budget_id
export const updateBudgetByUsernameAndBudgetId = async (req, res) => {
  try {
    // Ambil username dan budget_id dari parameter request
    const { username, budget_id } = req.params;
    const updatedBudgetData = req.body;

    // Cari user berdasarkan username
    const user = await prisma.user.findUnique({
      where: { username },
      include: {
        categories: {
          include: {
            budgets: true,
          },
        },
      },
    });

    // Jika user tidak ditemukan atau budget tidak ditemukan, kirim respons 404
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update budget dari categories yang sesuai
    const updatedBudget = await prisma.budget.update({
      where: {
        id: parseInt(budget_id),
      },
      data: updatedBudgetData,
    });

    // Kirim respons berhasil
    res.status(200).json({ message: "Budget updated successfully" });
  } catch (error) {
    // Tangani kesalahan dan kirim respons 500 jika terjadi kesalahan server
    console.error("Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Controller untuk menghapus budget dari categories berdasarkan username dan budget_id
export const deleteBudgetByUsernameAndBudgetId = async (req, res) => {
  try {
    // Ambil username dan budget_id dari parameter request
    const { username, budget_id } = req.params;

    // Cari user berdasarkan username
    const user = await prisma.user.findUnique({
      where: { username },
      include: {
        categories: {
          include: {
            budgets: true,
          },
        },
      },
    });

    // Jika user tidak ditemukan atau budget tidak ditemukan, kirim respons 404
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Hapus budget dari categories yang sesuai
    await prisma.budget.delete({
      where: {
        id: parseInt(budget_id),
      },
    });

    // Kirim respons berhasil
    res.status(200).json({ message: "Budget deleted successfully" });
  } catch (error) {
    // Tangani kesalahan dan kirim respons 500 jika terjadi kesalahan server
    console.error("Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
