import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import multer from "multer";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

// Middleware untuk menyiapkan upload dengan multer
const upload = multer({
  storage: multer.diskStorage({
    destination: "public/user/image",
    filename: function (req, file, cb) {
      const extensionName = path.extname(file.originalname);
      // Tambahkan timestamp pada nama file
      const filename = `${req.params.username}-${Date.now()}${extensionName}`;
      cb(null, filename);
    },
  }),
});

// Function to update email, full_name, and image
// Function to update email, full_name, and image
export const updateUserDetails = async (req, res) => {
  // Gunakan multer middleware
  upload.single("image")(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ msg: "Error uploading file", error: err });
    }

    const { username } = req.params;
    const { email, full_name } = req.body;
    const imageFileName = req.file ? path.basename(req.file.path) : null;

    try {
      const user = await prisma.User.findUnique({
        where: { username: username },
      });

      if (!user) {
        return res.status(404).json({ msg: "User not found" });
      }

      // Jika ada gambar baru, hapus gambar lama jika berbeda dari gambar baru
      if (imageFileName && user.image && user.image !== imageFileName) {
        fs.unlink(path.join("public/user/image", user.image), (err) => {
          if (err) console.error("Error deleting old image:", err);
        });
      }

      const updatedUser = await prisma.User.update({
        where: { username: username },
        data: {
          email: email || user.email,
          full_name: full_name || user.full_name,
          image: imageFileName || user.image,
        },
      });

      res.json({ msg: "User updated successfully", data: updatedUser });
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
};

export const createUser = async (req, res) => {
  const { username, full_name, password, confirmPassword } = req.body;

  if (!username || !password || !confirmPassword) {
    return res.status(400).json({ msg: "All fields are required" });
  }

  // Check if username already exists
  const existingUser = await prisma.User.findUnique({
    where: {
      username: username,
    },
  });

  if (existingUser) {
    return res.status(400).json({ msg: "Username already taken" });
  }

  if (password !== confirmPassword) {
    return res
      .status(400)
      .json({ msg: "Password and confirmPassword do not match" });
  }

  // Hash the password
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);

  try {
    await prisma.User.create({
      data: {
        username: username,
        full_name: full_name,
        password: hashedPassword,
      },
    });
    res.status(201).json({ msg: "User created successfully" });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Function to fetch all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.User.findMany();
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getUserByUsername = async (req, res) => {
  try {
    const response = await prisma.User.findUnique({
      where: {
        username: req.params.username,
      },
    });
    if (!response) {
      res.status(404).json({ msg: "User not found" });
    } else {
      res.status(200).json({ msg: "User found", data: response });
    }
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Function to delete a user by username
export const deleteUserByUsername = async (req, res) => {
  try {
    const user = await prisma.User.findUnique({
      where: {
        username: req.params.username,
      },
    });

    if (!user) {
      res.status(404).json({ msg: "User not found" });
    } else {
      // Jika pengguna memiliki gambar, hapus gambar tersebut dari sistem file
      if (user.image) {
        const imagePath = path.join("public/user/image", user.image);
        fs.unlink(imagePath, (err) => {
          if (err) {
            console.error("Error deleting user image:", err);
            // Anda bisa memilih untuk mengirimkan respon error atau melanjutkan penghapusan pengguna
            // Bergantung pada bagaimana Anda ingin menangani error tersebut
          }
        });
      }

      // Lanjutkan menghapus pengguna dari database
      await prisma.User.delete({
        where: {
          username: req.params.username,
        },
      });

      res.status(200).json({ msg: "User deleted successfully" });
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ msg: error.message });
  }
};

// Function to update the username of a user by ID
export const updatePasswordByUsername = async (req, res) => {
  try {
    const user = await prisma.User.findUnique({
      where: {
        username: req.params.username,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const updatedUser = await prisma.User.update({
      where: {
        username: req.params.username,
      },
      data: {
        password: hashedPassword,
      },
    });

    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating username:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Function to login a user
export const login = async (req, res) => {
  try {
    const user = await prisma.User.findUnique({
      where: {
        username: req.body.username,
      },
    });

    // If user does not exist, return an error response
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // If user exists, compare the password
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid Password" });
    }
    res.json({ username: user.username, msg: "Login successful" });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
