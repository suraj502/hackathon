import { asyncHandler } from '../utils/asyncHandler.js';
import { listTeamsByStatus } from '../services/teamService.js';

const buildResultHandler = (status, message) =>
  asyncHandler(async (req, res) => {
    const teams = await listTeamsByStatus(status);

    return res.status(200).json({
      success: true,
      message,
      data: {
        teams,
      },
    });
  });

export const getRound1Results = buildResultHandler('round1', 'Round 1 results fetched successfully');
export const getRound2Results = buildResultHandler('round2', 'Round 2 results fetched successfully');
export const getWinnersResults = buildResultHandler('winner', 'Winner results fetched successfully');
