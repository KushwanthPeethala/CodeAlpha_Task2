const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const VALID_STATUSES = ['todo', 'inProgress', 'done'];
const VALID_PRIORITIES = ['low', 'medium', 'high'];

function validateRegister(body) {
  const errors = [];

  if (!body.name || typeof body.name !== 'string' || body.name.trim().length === 0) {
    errors.push('Name is required');
  } else if (body.name.trim().length < 2 || body.name.trim().length > 50) {
    errors.push('Name must be between 2 and 50 characters');
  }

  if (!body.email || typeof body.email !== 'string' || body.email.trim().length === 0) {
    errors.push('Email is required');
  } else if (!EMAIL_REGEX.test(body.email.trim())) {
    errors.push('Email is not valid');
  }

  if (!body.password || typeof body.password !== 'string') {
    errors.push('Password is required');
  } else if (body.password.length < 6) {
    errors.push('Password must be at least 6 characters');
  }

  return { valid: errors.length === 0, errors };
}

function validateLogin(body) {
  const errors = [];

  if (!body.email || typeof body.email !== 'string' || body.email.trim().length === 0) {
    errors.push('Email is required');
  }

  if (!body.password || typeof body.password !== 'string' || body.password.length === 0) {
    errors.push('Password is required');
  }

  return { valid: errors.length === 0, errors };
}

function validateProject(body) {
  const errors = [];

  if (!body.name || typeof body.name !== 'string' || body.name.trim().length === 0) {
    errors.push('Project name is required');
  } else if (body.name.trim().length > 100) {
    errors.push('Project name must be at most 100 characters');
  }

  if (body.description !== undefined && body.description !== null) {
    if (typeof body.description !== 'string') {
      errors.push('Description must be a string');
    } else if (body.description.length > 500) {
      errors.push('Description must be at most 500 characters');
    }
  }

  return { valid: errors.length === 0, errors };
}

function validateTask(body) {
  const errors = [];

  if (!body.title || typeof body.title !== 'string' || body.title.trim().length === 0) {
    errors.push('Task title is required');
  } else if (body.title.trim().length > 200) {
    errors.push('Task title must be at most 200 characters');
  }

  if (body.description !== undefined && body.description !== null) {
    if (typeof body.description !== 'string') {
      errors.push('Description must be a string');
    } else if (body.description.length > 1000) {
      errors.push('Description must be at most 1000 characters');
    }
  }

  if (body.status !== undefined && body.status !== null) {
    if (!VALID_STATUSES.includes(body.status)) {
      errors.push(`Status must be one of: ${VALID_STATUSES.join(', ')}`);
    }
  }

  if (body.priority !== undefined && body.priority !== null) {
    if (!VALID_PRIORITIES.includes(body.priority)) {
      errors.push(`Priority must be one of: ${VALID_PRIORITIES.join(', ')}`);
    }
  }

  return { valid: errors.length === 0, errors };
}

function sanitizeUpdate(body, allowedFields) {
  const sanitized = {};
  for (const field of allowedFields) {
    if (body[field] !== undefined) {
      sanitized[field] = body[field];
    }
  }
  return sanitized;
}

module.exports = {
  validateRegister,
  validateLogin,
  validateProject,
  validateTask,
  sanitizeUpdate,
};
