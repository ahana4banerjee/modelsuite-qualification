/**
 * Returns 'Overdue' or 'Due Soon' or null based on dueDate and task status.
 * @param {string} dueDate - Due date in 'YYYY-MM-DD' format.
 * @param {string} status - Task status ('Open', 'Claimed', etc.).
 */
export const getDeadlineStatus = (dueDate, status) => {
  if (!dueDate) return null;
  if (['Submitted', 'Approved', 'Rejected'].includes(status)) return null;

  const parts = dueDate.split('-');
  let due;
  if (parts.length === 3) {
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    // Treat the due date as due by 23:59:59 of that local day
    due = new Date(year, month, day, 23, 59, 59, 999);
  } else {
    due = new Date(dueDate);
  }

  if (isNaN(due.getTime())) return null;

  const now = new Date();
  const diffTime = due.getTime() - now.getTime();

  if (diffTime < 0) {
    return 'Overdue';
  } else if (diffTime <= 48 * 60 * 60 * 1000) {
    return 'Due Soon';
  }
  return null;
};

/**
 * Formats date string to 'D MMM YYYY' format (e.g., '24 Jun 2026')
 */
export const formatExactDate = (dueDate) => {
  if (!dueDate) return '';
  const parts = dueDate.split('-');
  if (parts.length === 3) {
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    const dateObj = new Date(year, month, day);
    return dateObj.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  }
  return dueDate;
};

/**
 * Returns relative time string (e.g., 'Due in 2 days', 'Overdue by 3 days')
 */
export const getRelativeTimeInfo = (dueDate) => {
  if (!dueDate) return '';

  const parts = dueDate.split('-');
  let due;
  if (parts.length === 3) {
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    due = new Date(year, month, day, 23, 59, 59, 999);
  } else {
    due = new Date(dueDate);
  }

  if (isNaN(due.getTime())) return '';

  const now = new Date();

  // Set both dates to midnight local to calculate calendar day difference
  const dueMidnight = new Date(due.getFullYear(), due.getMonth(), due.getDate());
  const nowMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const diffTime = dueMidnight.getTime() - nowMidnight.getTime();
  const diffDays = Math.round(diffTime / (24 * 60 * 60 * 1000));

  if (diffDays < 0) {
    const absDays = Math.abs(diffDays);
    return `Overdue by ${absDays} day${absDays > 1 ? 's' : ''}`;
  } else if (diffDays === 0) {
    return 'Due today';
  } else if (diffDays === 1) {
    return 'Due tomorrow';
  } else {
    return `Due in ${diffDays} days`;
  }
};
