import { Team } from '../models/Team.js';
import { buildSortQuery, buildTeamFilter } from '../utils/query.js';

export const listTeams = async (query = {}) => {
  const page = Math.max(Number(query.page || 1), 1);
  const limit = Math.max(Number(query.limit || 20), 1);
  const skip = (page - 1) * limit;
  const filter = buildTeamFilter(query);
  const sort = buildSortQuery(query.sort);

  const [teams, total] = await Promise.all([
    Team.find(filter).sort(sort).skip(skip).limit(limit).lean(),
    Team.countDocuments(filter),
  ]);

  return {
    teams,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.max(Math.ceil(total / limit), 1),
    },
  };
};

export const listTeamsByStatus = async (status) => {
  return Team.find({ status }).sort({ createdAt: -1 }).lean();
};
