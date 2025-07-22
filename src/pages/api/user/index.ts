import prismadb from '../../../../lib/prismadb';
import { NextApiRequest, NextApiResponse } from 'next';
import { hash } from 'bcrypt';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const users = await prismadb.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          companyId: true,
          createdAt: true,
          updatedAt: true,
          image: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return res.status(200).json(users);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { name, email, password, role, companyId } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({ message: 'Name, email, and password are required' });
      }

      // Check if user already exists
      const existingUser = await prismadb.user.findUnique({
        where: {
          email,
        },
      });

      if (existingUser) {
        return res.status(400).json({ message: 'User with this email already exists' });
      }

      const hashedPassword = await hash(password, 12);

      const newUser = await prismadb.user.create({
        data: {
          name,
          email,
          hashedPassword,
          role: role || 'USER',
          companyId: companyId || null,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          companyId: true,
          createdAt: true,
          updatedAt: true,
          image: true,
        },
      });

      return res.status(201).json(newUser);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
} 