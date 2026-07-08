import { body, validationResult } from 'express-validator';

import { AppError } from '../utils/AppError.js';
import { getIdeaPitchMaxLength, getMaxTeamSize } from '../utils/env.js';

const genderValues = ['male', 'female', 'other', 'prefer_not_to_say'];

const normalize = (value) => String(value || '').trim();

const buildMemberErrors = (payload) => {
  const errors = [];
  const leader = payload.leader || {};
  const members = Array.isArray(payload.members) ? payload.members : [];
  const teamSize = Number(payload.teamSize);
  const maxTeamSize = getMaxTeamSize();

  if (members.length !== Math.max(teamSize - 1, 0)) {
    errors.push('teamSize must match members length plus one for the leader');
  }

  if (teamSize < 1 || teamSize > maxTeamSize) {
    errors.push(`teamSize must be between 1 and ${maxTeamSize}`);
  }

  const allParticipants = [leader, ...members];
  const emails = allParticipants.map((participant) => normalize(participant.email).toLowerCase());
  const names = allParticipants.map((participant) => normalize(participant.name).toLowerCase());

  if (emails.some((email) => !email)) {
    errors.push('All team members must include an email address');
  }

  if (new Set(emails).size !== emails.length) {
    errors.push('Duplicate emails are not allowed within the team');
  }

  if (new Set(names).size !== names.length) {
    errors.push('Duplicate member names are not allowed within the team');
  }

  const femalePresent = allParticipants.some(
    (participant) => normalize(participant.gender).toLowerCase() === 'female',
  );

  if (!femalePresent) {
    errors.push('At least one female member is required');
  }

  return errors;
};

const normalizeTeamPayload = (payload) => {
  const leader = payload.leader || {};
  const members = Array.isArray(payload.members) ? payload.members : [];

  return {
    ...payload,
    teamName: normalize(payload.teamName),
    collegeName: normalize(payload.collegeName),
    track: normalize(payload.track),
    ideaPitch: normalize(payload.ideaPitch),
    teamSize: Number(payload.teamSize),
    leader: {
      name: normalize(leader.name),
      email: normalize(leader.email).toLowerCase(),
      phone: normalize(leader.phone),
      branch: normalize(leader.branch),
      year: normalize(leader.year),
      gender: normalize(leader.gender).toLowerCase(),
    },
    members: members.map((member) => ({
      name: normalize(member.name),
      email: normalize(member.email).toLowerCase(),
      phone: normalize(member.phone),
      branch: normalize(member.branch),
      year: normalize(member.year),
      gender: normalize(member.gender).toLowerCase(),
    })),
  };
};

export const validateRequest = (req, res, next) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    return next(new AppError('Validation failed', 400, result.array().map((error) => error.msg)));
  }

  return next();
};

export const validateAdminLogin = [
  body('email').trim().isEmail().withMessage('A valid email is required'),
  body('password').trim().notEmpty().withMessage('Password is required'),
  validateRequest,
];

export const validateRegisterTeam = [
  body('teamName').trim().notEmpty().withMessage('Team name is required'),
  body('collegeName').trim().notEmpty().withMessage('College name is required'),
  body('track').trim().notEmpty().withMessage('Track is required'),
  body('teamSize')
    .isInt({ min: 1, max: getMaxTeamSize() })
    .withMessage(`teamSize must be an integer between 1 and ${getMaxTeamSize()}`),
  body('ideaPitch')
    .trim()
    .notEmpty()
    .withMessage('Idea pitch is required')
    .isLength({ max: getIdeaPitchMaxLength() })
    .withMessage(`Idea pitch must be at most ${getIdeaPitchMaxLength()} characters`),
  body('leader.name').trim().notEmpty().withMessage('Leader name is required'),
  body('leader.email').trim().isEmail().withMessage('Leader email must be valid'),
  body('leader.phone')
    .trim()
    .matches(/^\+?[0-9]{7,15}$/)
    .withMessage('Leader phone number must be valid'),
  body('leader.branch').trim().notEmpty().withMessage('Leader branch is required'),
  body('leader.year').trim().notEmpty().withMessage('Leader year is required'),
  body('leader.gender')
    .trim()
    .toLowerCase()
    .isIn(genderValues)
    .withMessage(`Leader gender must be one of: ${genderValues.join(', ')}`),
  body('members').optional().isArray().withMessage('Members must be an array'),
  body('members.*.name').optional().trim().notEmpty().withMessage('Member name is required'),
  body('members.*.email').optional().trim().isEmail().withMessage('Member email must be valid'),
  body('members.*.branch').optional().trim().notEmpty().withMessage('Member branch is required'),
  body('members.*.year').optional().trim().notEmpty().withMessage('Member year is required'),
  body('members.*.gender')
    .optional()
    .trim()
    .toLowerCase()
    .isIn(genderValues)
    .withMessage(`Member gender must be one of: ${genderValues.join(', ')}`),
  body().custom((_, { req }) => {
    const errors = buildMemberErrors(req.body);

    if (errors.length > 0) {
      throw new Error(errors[0]);
    }

    req.body = normalizeTeamPayload(req.body);
    return true;
  }),
  validateRequest,
];

export const validateStatusUpdate = [
  body('status')
    .trim()
    .toLowerCase()
    .isIn(['pending', 'round1', 'round2', 'winner', 'rejected'])
    .withMessage('Status must be one of pending, round1, round2, winner, rejected'),
  validateRequest,
];
