import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createIncome = async (req, res) => {
  try {
    const response = await prisma.Income.create({
      data: {
        title: req.body.title,
        amount: req.body.amount,
        description: req.body.description,
        date: req.body.date,
        wallet_id: req.body.wallet_id,
      },
    });
    res
      .status(201)
      .json({ msg: "Income created successfully", data: response });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getAllIncomes = async (req, res) => {
  try {
    const incomes = await prisma.income.findMany();
    res.status(200).json(incomes);
  } catch (error) {
    console.error("Error fetching incomes:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// export const getIncomeByUser = async (req, res) => {
//   const { username } = req.params; // Extract the username from the URL parameter

//   try {
//     const userIncomes = await prisma.Income.findMany({
//       where: { wallet: username },
//       select: {
//         id: true,
//         wallet_id: true,
//         title: true,
//         amount: true,
//         description: true,
//         date: true,
//         wallet: { select: { user_id: true, name: true } },
//       },
//     });

//     if (!userIncomes) {
//       return res.status(404).json({ error: "User not found" });
//     } else {
//       return res.status(200).json({ msg: "User found", data: userIncomes });
//     }
//   } catch (error) {
//     console.error("Error retrieving user incomes:", error);
//     res.status(500).json({ error: `Internal server error: ${error.message}` });
//   } finally {
//     await prisma.$disconnect();
//   }
// };

export const getIncomeByUser = async (req, res) => {
  try {
    // Ambil username dari parameter request
    const { username } = req.params;

    // Cari user berdasarkan username
    const user = await prisma.user.findUnique({
      where: { username },
      include: {
        wallets: {
          include: {
            incomes: true,
          },
        },
      },
    });

    // Jika user tidak ditemukan, kirim respons 404
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Ambil semua incomes dari wallets user
    const allIncomes = user.wallets.reduce((acc, wallet) => {
      acc.push(...wallet.incomes);
      return acc;
    }, []);

    // Kirim respons dengan data incomes
    res.status(200).json({ incomes: allIncomes });
  } catch (error) {
    // Tangani kesalahan dan kirim respons 500 jika terjadi kesalahan server
    console.error("Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// export const getIncomeInPeriod = async (req, res) => {
//   try {
//     const { startDate, endDate, user_id } = req.query;
//     const incomeByWallet = await prisma.Income.groupBy({
//       by: ["wallet_id"],
//       where: {
//         date: {
//           gte: new Date(startDate),
//           lte: new Date(endDate),
//         },
//         wallet: {
//           user_id: user_id,
//         },
//       },
//       _sum: {
//         amount: true,
//       },
//     });

//     const name = await prisma.Wallet.findMany({
//       where: {
//         user_id: user_id,
//       },
//       select: {
//         name: true,
//         wallet_id: true,
//       },
//     });

//     const result = [];
//     incomeByWallet.forEach((income) => {
//       for (let i = 0; i < name.length; i++) {
//         if (income.wallet_id === name[i].wallet_id) {
//           const modifiedIncome = {
//             date: startDate,
//             title: name[i].title,
//             amount: income._sum.amount,
//             namewallet: name[i].name,
//           };
//           result.push(modifiedIncome);
//           break;
//         }
//       }
//     });

//     res.json(result);
//   } catch (error) {
//     console.error("Error retrieving income in period:", error);
//     res.status(500).json({ msg: error.message });
//   } finally {
//     await prisma.$disconnect();
//   }
// };

export const getIncomesByUsernameAndPeriod = async (req, res) => {
  try {
    // Ambil username dan periode dari parameter request
    const { username } = req.params;
    const { startDate, endDate } = req.query;

    // Cari user berdasarkan username
    const user = await prisma.user.findUnique({
      where: { username },
      include: {
        wallets: {
          include: {
            incomes: {
              where: {
                date: {
                  gte: new Date(startDate),
                  lte: new Date(endDate),
                },
              },
            },
          },
        },
      },
    });

    // Jika user tidak ditemukan, kirim respons 404
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Ambil semua incomes dari wallets user sesuai periode
    const allIncomes = user.wallets.reduce((acc, wallet) => {
      acc.push(...wallet.incomes);
      return acc;
    }, []);

    // Kirim respons dengan data incomes sesuai periode
    res.status(200).json({ incomes: allIncomes });
  } catch (error) {
    // Tangani kesalahan dan kirim respons 500 jika terjadi kesalahan server
    console.error("Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  } finally {
    // Jangan lupa untuk selalu menutup koneksi Prisma setelah penggunaan
    await prisma.$disconnect();
  }
};

export const updateIncomeByUsernameAndIncomeId = async (req, res) => {
  try {
    const { username, income_id } = req.params;
    const updatedIncomeData = req.body;

    const user = await prisma.user.findUnique({
      where: { username },
      include: {
        wallets: {
          include: {
            incomes: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const updatedIncome = await prisma.income.update({
      where: {
        id: parseInt(income_id),
      },
      data: updatedIncomeData,
    });

    res
      .status(200)
      .json({ msg: "Income updated successfully", data: updatedIncome });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const getTotalIncomeInPeriod = async (req, res) => {
  try {
    const { startDate, endDate, user_id } = req.query;

    const incomeInPeriod = await prisma.Income.findMany({
      where: {
        date: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
        wallet: {
          user_id: user_id,
        },
      },
      select: {
        id: true,
        title: true,
        amount: true,
        description: true,
        date: true,
        wallet: { select: { user_id: true, name: true } },
      },
    });

    console.log(incomeInPeriod);
    const incomeByDay = {};
    let currentId = 0;

    incomeInPeriod.forEach((income) => {
      const dateKey = income.date.toISOString().split("T")[0];
      incomeByDay[dateKey] = incomeByDay[dateKey] || {
        dailyIncome: 0,
        wallet: income.wallet,
      };
      incomeByDay[dateKey].dailyIncome += income.amount;
    });

    // Create an array of date-income pairs
    const result = [];
    const currentDate = new Date(startDate);
    while (currentDate <= new Date(endDate)) {
      const dateKey = currentDate.toISOString().split("T")[0];
      const dailyIncomeData = incomeByDay[dateKey] || {
        dailyIncome: 0,
        title: Income.title,
        description: Income.description,
        wallet: { name: "-" },
      };
      result.push({
        id: currentId++,
        title: dailyIncomeData.title,
        date: dateKey,
        amount: dailyIncomeData.dailyIncome,
        description: dailyIncomeData.description,
        wallet: dailyIncomeData.wallet,
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }

    res.json(result);
  } catch (error) {
    console.error("Error retrieving income in period:", error);
    res.status(500).json({ msg: error.message });
  } finally {
    await prisma.$disconnect();
  }
};

// Controller untuk menghapus income dari wallet berdasarkan username dan income_id
export const deleteIncomeByUsernameAndIncomeId = async (req, res) => {
  try {
    // Ambil username dan income_id dari parameter request
    const { username, income_id } = req.params;

    // Cari user berdasarkan username
    const user = await prisma.user.findUnique({
      where: { username },
      include: {
        wallets: {
          include: {
            incomes: true,
          },
        },
      },
    });

    // Jika user tidak ditemukan atau income tidak ditemukan, kirim respons 404
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Hapus income dari wallet yang sesuai
    await prisma.income.delete({
      where: {
        id: parseInt(income_id),
      },
    });

    // Kirim respons berhasil
    res.status(200).json({ message: "Income deleted successfully" });
  } catch (error) {
    // Tangani kesalahan dan kirim respons 500 jika terjadi kesalahan server
    console.error("Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
