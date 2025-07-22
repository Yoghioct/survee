import prismadb from '../../../../lib/prismadb';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const company = await prismadb.company.findUnique({
        where: {
          id: id as string,
        },
      });

      if (!company) {
        return res.status(404).json({ message: 'Company not found' });
      }

      return res.status(200).json(company);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  if (req.method === 'PUT') {
    try {
      const { name } = req.body;

      if (!name) {
        return res.status(400).json({ message: 'Company name is required' });
      }

      const company = await prismadb.company.update({
        where: {
          id: id as string,
        },
        data: {
          name,
        },
      });

      return res.status(200).json(company);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      await prismadb.company.delete({
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