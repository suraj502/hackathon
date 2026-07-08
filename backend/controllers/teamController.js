import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/AppError.js';
import { Team } from '../models/Team.js';
import { listTeams } from '../services/teamService.js';

const ensureUniqueTeamConstraints = async (payload) => {
  const existingTeam = await Team.findOne({
    $or: [{ teamName: payload.teamName }, { 'leader.email': payload.leader.email }],
  }).lean();

  if (existingTeam) {
    if (existingTeam.teamName === payload.teamName) {
      throw new AppError('Team name already exists', 409);
    }

    if (existingTeam.leader?.email === payload.leader.email) {
      throw new AppError('Leader email already exists', 409);
    }
  }
};

export const registerTeam = asyncHandler(async (req, res) => {
  await ensureUniqueTeamConstraints(req.body);

  const team = await Team.create(req.body);

  return res.status(201).json({
    success: true,
    message: 'Team registered successfully',
    data: {
      team,
    },
  });
});

export const getTeams = asyncHandler(async (req, res) => {
  const result = await listTeams(req.query);

  return res.status(200).json({
    success: true,
    message: 'Teams fetched successfully',
    data: result,
  });
});

export const getTeamById = asyncHandler(async (req, res) => {
  const team = await Team.findById(req.params.id).lean();

  if (!team) {
    throw new AppError('Team not found', 404);
  }

  return res.status(200).json({
    success: true,
    message: 'Team fetched successfully',
    data: {
      team,
    },
  });
});

export const updateTeamStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const team = await Team.findByIdAndUpdate(
    req.params.id,
    {
      status,
    },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!team) {
    throw new AppError('Team not found', 404);
  }

  const io = req.app.get('io');

  if (io) {
    io.emit('statusUpdated', {
      teamId: team._id,
      teamName: team.teamName,
      status: team.status,
    });
  }

  return res.status(200).json({
    success: true,
    message: 'Team status updated successfully',
    data: {
      team,
    },
  });
});

export const deleteTeam = asyncHandler(async (req, res) => {
  const team = await Team.findByIdAndDelete(req.params.id);

  if (!team) {
    throw new AppError('Team not found', 404);
  }

  return res.status(200).json({
    success: true,
    message: 'Team deleted successfully',
    data: {
      teamId: team._id,
    },
  });
});
