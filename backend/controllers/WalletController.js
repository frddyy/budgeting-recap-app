import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createWallet = async (req, res) => {
  const newWalletData = req.body;

  try {
    console.log("newWalletData.user_id:", newWalletData.user_id);

    const userId = newWalletData.user_id;
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    console.log("userId:", userId);

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const existingWallet = await prisma.wallet.findFirst({
      where: {
        name: newWalletData.name,
        user_id: userId,
      },
    });

    if (existingWallet) {
      return res.status(400).json({
        error: "Wallet with the same name already exists for this user",
      });
    }

    const balance = parseInt(newWalletData.balance, 10);
    if (isNaN(balance)) {
      return res.status(400).json({ error: "Invalid balance value" });
    }

    const wallet = await prisma.wallet.create({
      data: {
        name: newWalletData.name,
        balance: balance,
        user: { connect: { id: userId } },
      },
    });

    res
      .status(201)
      .json({ msg: "Wallet created successfully", wallet: wallet });
  } catch (error) {
    console.error("Error creating wallet:", error);
    res.status(500).json({ error: `Internal server error: ${error.message}` });
  }
};


export const getWalletByUsername = async (req, res) => {
  try {
    const response = await prisma.wallet.findMany({
      where: {
        user: { username: req.params.username },
      },
    });
    if (!response || response.length === 0) {
      res.status(404).json({ msg: "Wallet not found" });
    } else {
      res.status(200).json({ msg: "Wallet found", data: response });
    }
  } catch (error) {
    console.error("Error retrieving wallets:", error);
    res.status(500).json({ error: `Internal server error: ${error.message}` });
  }
};

export const updateWallet = async (req, res) => {
  const { username, wallet_name } = req.params;
  const updatedWalletData = {
    ...req.body,
    balance: parseInt(req.body.balance, 10), // Konversi balance ke integer
  };

  try {
    // Find the user by username
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Find the wallet by user ID and wallet name
    const wallet = await prisma.wallet.findFirst({
      where: {
        user_id: user.id,
        name: wallet_name,
      },
    });

    if (!wallet) {
      return res.status(404).json({ error: "Wallet not found" });
    }

    const updatedWallet = await prisma.wallet.update({
      where: {
        id: wallet.id,
        name: wallet_name,
      },
      data: updatedWalletData,
    });

    res
      .status(200)
      .json({ msg: "Wallet updated successfully", wallet: updatedWallet });
  } catch (error) {
    console.error("Error updating wallet:", error);
    res.status(500).json({ error: `Internal server error: ${error.message}` });
  }
};

export const deleteWallet = async (req, res) => {
  const { username, wallet_name } = req.params;

  try {
    // Find the user by username
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Find the wallet by user ID and wallet name
    const wallet = await prisma.wallet.findFirst({
      where: {
        user_id: user.id,
        name: wallet_name,
      },
    });

    if (!wallet) {
      return res.status(404).json({ error: "Wallet not found" });
    }

    // Start a transaction to delete related records before deleting the wallet
    await prisma.$transaction([
      prisma.expense.deleteMany({
        where: { wallet_id: wallet.id },
      }),
      prisma.income.deleteMany({
        where: { wallet_id: wallet.id },
      }),
      // Include other related deletes if necessary
      prisma.wallet.delete({
        where: { id: wallet.id },
      }),
    ]);

    res.status(200).json({ msg: "Wallet deleted successfully" });
  } catch (error) {
    console.error("Error deleting wallet:", error);
    res.status(500).json({ error: `Internal server error: ${error.message}` });
  }
};
