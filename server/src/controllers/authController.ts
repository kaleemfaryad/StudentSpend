import {Request, Response} from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import prisma from '../config/prisma';

const JWT_SECRET =
  process.env.JWT_SECRET || 'studentspend-dev-secret';

export const register = async (
  req: Request,
  res: Response,
) => {
  try {
    const {name, email, password} = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        message:
          'Name, email and password are required.',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message:
          'Password must be at least 6 characters.',
      });
    }

    const normalizedEmail =
      email.toLowerCase().trim();

    // Check existing user
    const existingUser =
      await prisma.user.findUnique({
        where: {
          email: normalizedEmail,
        },
      });

    if (existingUser) {
      return res.status(409).json({
        message: 'Email is already registered.',
      });
    }

    // Hash password
    const hashedPassword =
      await bcrypt.hash(password, 10);

    // Create user
    const user =
      await prisma.user.create({
        data: {
          name: name.trim(),
          email: normalizedEmail,
          password: hashedPassword,
        },
      });

    // Create JWT
    const token = jwt.sign(
      {
        userId: user.id,
      },
      JWT_SECRET,
      {
        expiresIn: '7d',
      },
    );

    return res.status(201).json({
      message: 'Registration successful.',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(
      'Registration error:',
      error,
    );

    return res.status(500).json({
      message: 'Internal server error.',
    });
  }
};

export const login = async (
  req: Request,
  res: Response,
) => {
  try {
    const {email, password} = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message:
          'Email and password are required.',
      });
    }

    const normalizedEmail =
      email.toLowerCase().trim();

    const user =
      await prisma.user.findUnique({
        where: {
          email: normalizedEmail,
        },
      });

    if (!user) {
      return res.status(401).json({
        message: 'Invalid email or password.',
      });
    }

    const passwordMatches =
      await bcrypt.compare(
        password,
        user.password,
      );

    if (!passwordMatches) {
      return res.status(401).json({
        message: 'Invalid email or password.',
      });
    }

    const token = jwt.sign(
      {
        userId: user.id,
      },
      JWT_SECRET,
      {
        expiresIn: '7d',
      },
    );

    return res.json({
      message: 'Login successful.',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(
      'Login error:',
      error,
    );

    return res.status(500).json({
      message: 'Internal server error.',
    });
  }
};