import { asyncHandler } from '../utils/asyncHandler.js';
import { Team } from '../models/Team.js';

export const getDashboardStats = asyncHandler(async (req, res) => {
  const [totalTeams, pending, round1, round2, winners, rejected] = await Promise.all([
    Team.countDocuments(),
    Team.countDocuments({ status: 'pending' }),
    Team.countDocuments({ status: 'round1' }),
    Team.countDocuments({ status: 'round2' }),
    Team.countDocuments({ status: 'winner' }),
    Team.countDocuments({ status: 'rejected' }),
  ]);

  return res.status(200).json({
    success: true,
    message: 'Dashboard statistics fetched successfully',
    data: {
      totalTeams,
      pending,
      round1,
      round2,
      winners,
      rejected,
    },
  });
});
