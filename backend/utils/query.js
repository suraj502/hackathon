export const escapeRegex = (value = '') => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const buildSortQuery = (sort = 'newest') => {
  switch (String(sort).toLowerCase()) {
    case 'oldest':
      return { createdAt: 1 };
    case 'alphabetical':
      return { teamName: 1 };
    default:
      return { createdAt: -1 };
  }
};

export const buildTeamFilter = (query = {}) => {
  const filters = [];

  if (query.status) {
    filters.push({ status: query.status });
  }

  if (query.track) {
    filters.push({ track: new RegExp(escapeRegex(query.track), 'i') });
  }

  if (query.college) {
    filters.push({ collegeName: new RegExp(escapeRegex(query.college), 'i') });
  }

  const searchTerms = [];
  if (query.search) {
    searchTerms.push(query.search);
  }
  if (query.teamName) {
    searchTerms.push(query.teamName);
  }
  if (query.leaderName) {
    searchTerms.push(query.leaderName);
  }

  if (searchTerms.length > 0) {
    const searchExpressions = searchTerms.flatMap((term) => {
      const regex = new RegExp(escapeRegex(term), 'i');
      return [
        { teamName: regex },
        { 'leader.name': regex },
        { collegeName: regex },
        { track: regex },
      ];
    });

    filters.push({ $or: searchExpressions });
  }

  if (filters.length === 0) {
    return {};
  }

  if (filters.length === 1) {
    return filters[0];
  }

  return { $and: filters };
};
