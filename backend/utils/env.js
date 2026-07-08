const DEFAULT_MAX_TEAM_SIZE = 5;
const DEFAULT_IDEA_PITCH_MAX_LENGTH = 1000;

export const getPort = () => Number(process.env.PORT || 5000);

export const getAllowedOrigins = () => {
  const value = process.env.CLIENT_URL || '';

  return value
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
};

export const getMaxTeamSize = () => Number(process.env.MAX_TEAM_SIZE || DEFAULT_MAX_TEAM_SIZE);

export const getIdeaPitchMaxLength = () =>
  Number(process.env.IDEA_PITCH_MAX_LENGTH || DEFAULT_IDEA_PITCH_MAX_LENGTH);
