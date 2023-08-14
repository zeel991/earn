import type { NextApiRequest, NextApiResponse } from 'next';

import { prisma } from '@/prisma';

export default async function user(req: NextApiRequest, res: NextApiResponse) {
  const params = req.query;
  const slug = params.slug as string;
  try {
    const result = await prisma.bounties.findFirst({
      where: {
        slug,
        isActive: true,
      },
      include: { sponsor: true, poc: true, Submission: true },
    });

    const submissionsCount = await prisma.submission.count({
      where: {
        listing: {
          slug,
          isActive: true,
        },
      },
    });

    res.status(200).json({
      ...result,
      submissionsCount,
    });

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      error,
      message: `Error occurred while fetching bounty with slug=${slug}.`,
    });
  }
}
