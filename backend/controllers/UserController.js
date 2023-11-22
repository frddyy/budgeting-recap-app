import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createUser = async (req, res) => {
  const { username, password, confirmPassword, full_name } = req.body;

  // Check if username already exists
  const existingUser = await prisma.User.findUnique({
    where: {
      username: username,
    },
  });

  if (existingUser) {
    // Username already exists; return an error response
    return res.status(400).json({ msg: 'Username already taken' });
  }

  // Check if password and confirmPassword match
  if (password !== confirmPassword) {
    return res.status(400).json({ msg: 'Password and confirmPassword do not match' });
  }

  // If username does not exist and passwords match, hash the password
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);

  try {
    const newUser = req.body;
    const user = await prisma.User.create({
      data: {
        username: newUser.username,
        password: hashedPassword,
        full_name: newUser.full_name,
        email: newUser.email,
      },
    });
    res.status(201).json({ msg: 'User created successfully' });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


// Function to fetch all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.User.findMany();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
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
            res.status(404).json({ msg: 'User not found' });
        } else {
            res.status(200).json({msg: 'User found', data: response});
        }
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const deleteUserByUsername = async (req, res) => {
  try {
    const user = await prisma.User.findUnique({
      where: {
        username: req.params.username,
      },
    });
    if (!user) {
      res.status(404).json({ msg: 'User not found' });
    } else {
      await prisma.User.delete({
        where: {
          username: req.params.username,
        },
      });
      res.status(200).json({ msg: 'User deleted successfully' });
    }
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
}

// Function to update the username of a user by ID
export const updatePasswordByUsername = async (req, res) => {
  try {
    const user = await prisma.User.findUnique({
      where: {
        username: req.params.username,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
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
  }
  catch (error) {
    console.error('Error updating username:', error);
    res.status(500).json({ error: 'Internal server error' });
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
      return res.status(404).json({ error: 'User not found' });
    }

    // If user exists, compare the password
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid Password' });
    }
    res.json({ username:user.username,msg: 'Login successful' });

  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};



