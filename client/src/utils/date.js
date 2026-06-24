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
