import { claimTask } from '../../api/talent';
import { getDeadlineStatus, formatExactDate, getRelativeTimeInfo } from '../../utils/date';

const STATUS_CLASS = {
  Open:      'status-badge-Open',
  Claimed:   'status-badge-Claimed',
  Submitted: 'status-badge-Submitted',
  Approved:  'status-badge-Approved',
  Rejected:  'status-badge-Rejected',
};

const TaskCard = ({ task, showClaimButton = false, onClaimed }) => {

  const handleClaim = async () => {
    try {
      await claimTask(task._id);
      if (onClaimed) onClaimed();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to claim task');
    }
  };

  return (
    <div className="bg-bg-card border border-border rounded-xl p-5 flex flex-col gap-3 hover:border-border-light hover:-translate-y-0.5 transition-all cursor-default">

      {/* Header: title + status */}
      <div className="flex items-start justify-between gap-2.5">
        <p className="text-[15px] font-semibold text-text-primary leading-snug">{task.title || 'Untitled Task'}</p>
        {task.status && (
          <span className={`shrink-0 inline-block px-2.5 py-[3px] rounded-full text-[11px] font-semibold tracking-[0.3px] ${STATUS_CLASS[task.status] || ''}`}>
            {task.status}
          </span>
        )}
      </div>

      
      {task.description && (
        <p className="text-[13px] text-text-muted leading-relaxed">{task.description}</p>
      )}

      {/* Meta row */}
      <div className="flex items-center justify-between flex-wrap gap-2 mt-auto">
        
        <div className="flex items-center gap-2.5">
          <span className="text-[12px] text-text-faint">
            {task.dueDate ? `Due: ${task.dueDate}` : 'No due date'}
          </span>
          {getDeadlineStatus(task.dueDate, task.status) && (
            <div className="relative group inline-block outline-none" tabIndex="0"
              aria-label={`Deadline status: ${getDeadlineStatus(task.dueDate, task.status)}. ${getRelativeTimeInfo(task.dueDate)}. Due Date: ${formatExactDate(task.dueDate)}`}>
              <span className={`inline-block px-2 py-[2px] rounded text-[9.5px] font-bold uppercase tracking-[0.5px] cursor-help ${getDeadlineStatus(task.dueDate, task.status) === 'Overdue' ? 'badge-overdue' : 'badge-due-soon'}`}>
                {getDeadlineStatus(task.dueDate, task.status)}
              </span>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:flex group-focus-within:flex flex-col items-center bg-bg-surface border border-border rounded py-1.5 px-2.5 shadow-xl pointer-events-none z-[100] text-center"
                style={{ minWidth: '130px' }}>
                <span className="text-[11.5px] font-bold text-text-primary block whitespace-nowrap">
                  {getRelativeTimeInfo(task.dueDate)}
                </span>
                <span className="text-[10.5px] text-text-muted block mt-0.5 whitespace-nowrap">
                  Due Date: {formatExactDate(task.dueDate)}
                </span>
                <div className="w-1.5 h-1.5 bg-bg-surface border-r border-b border-border rotate-45 absolute top-full -translate-y-1/2 left-1/2 -translate-x-1/2 pointer-events-none"></div>
              </div>
            </div>
          )}
        </div>
        {task.createdBy?.name && (
          <span className="text-[12px] text-text-faint">By {task.createdBy.name}</span>
        )}
      </div>

      {showClaimButton && (
        <button onClick={handleClaim}
          className="w-full py-2.5 rounded-lg border-none text-[13px] font-semibold text-white cursor-pointer btn-gradient font-sans mt-1">
          Claim Task →
        </button>
      )}
    </div>
  );
};

export default TaskCard;
