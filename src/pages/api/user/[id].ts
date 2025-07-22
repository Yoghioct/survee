import prismadb from '../../../../lib/prismadb';
import { NextApiRequest, NextApiResponse } from 'next';
import { hash } from 'bcrypt';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const user = await prismadb.user.findUnique({
        where: {
          id: id as string,
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

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      return res.status(200).json(user);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  if (req.method === 'PUT') {
    try {
      const { name, email, password, role, companyId } = req.body;

      if (!name || !email) {
        return res.status(400).json({ message: 'Name and email are required' });
      }

      // Check if email is already taken by another user
      const existingUser = await prismadb.user.findFirst({
        where: {
          email,
          NOT: {
            id: id as string,
          },
        },
      });

      if (existingUser) {
        return res.status(400).json({ message: 'Email is already taken by another user' });
      }

      const updateData: any = {
        name,
        email,
        role: role || 'USER',
        companyId: companyId || null,
      };

      // Only hash password if it's provided
      if (password) {
        updateData.hashedPassword = await hash(password, 12);
      }

      const user = await prismadb.user.update({
        where: {
          id: id as string,
        },
        data: updateData,
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

      return res.status(200).json(user);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      await prismadb.user.delete({
        where: {
          id: id as string,
        },
      });

      return res.status(204).end();
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
} 