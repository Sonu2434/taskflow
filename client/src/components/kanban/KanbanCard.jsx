import { Draggable } from '@hello-pangea/dnd';
import { Calendar, MessageSquare, Pencil, Trash2 } from 'lucide-react';
import { PriorityBadge } from '../common/Badge';
import { AvatarGroup } from '../common/Avatar';
import { formatDate, isOverdue } from '../../utils/helpers';

const KanbanCard = ({ task, index, onEdit, onDelete, isAdmin }) => {
  const overdue = isOverdue(task.deadline) && task.status !== 'done';

  return (
    <Draggable draggableId={task._id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="group rounded-xl p-3.5 mb-2.5 cursor-grab active:cursor-grabbing transition-all"
          style={{
            background: snapshot.isDragging
              ? 'rgba(79,142,247,0.12)'
              : 'rgba(255,255,255,0.04)',
            border: snapshot.isDragging
              ? '1px solid rgba(79,142,247,0.4)'
              : '1px solid rgba(255,255,255,0.06)',
            boxShadow: snapshot.isDragging ? '0 20px 40px rgba(0,0,0,0.5)' : 'none',
            transform: snapshot.isDragging ? 'rotate(2deg)' : 'none',
            ...provided.draggableProps.style,
          }}
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-2 mb-2.5">
            <p className="text-sm font-medium text-gray-200 leading-snug flex-1">{task.title}</p>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
              {onEdit && (
                <button onClick={() => onEdit(task)}
                  className="w-6 h-6 flex items-center justify-center rounded-lg text-gray-500 hover:text-blue-400 hover:bg-blue-500/10 transition-colors">
                  <Pencil size={11} />
                </button>
              )}
              {isAdmin && onDelete && (
                <button onClick={() => onDelete(task)}
                  className="w-6 h-6 flex items-center justify-center rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                  <Trash2 size={11} />
                </button>
              )}
            </div>
          </div>

          {/* Description */}
          {task.description && (
            <p className="text-xs text-gray-600 mb-2.5 leading-relaxed line-clamp-2">{task.description}</p>
          )}

          {/* Priority */}
          <div className="mb-3">
            <PriorityBadge priority={task.priority} />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between">
            <AvatarGroup users={task.assignedTo || []} max={3} size="xs" />
            <div className="flex items-center gap-2">
              {task.deadline && (
                <div className={`flex items-center gap-1 text-xs ${overdue ? 'text-red-400' : 'text-gray-600'}`}>
                  <Calendar size={10} />
                  <span>{formatDate(task.deadline)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Project label */}
          {task.projectId?.title && (
            <div className="mt-2.5 pt-2.5" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <span className="text-xs text-gray-600 truncate">{task.projectId.title}</span>
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
};

export default KanbanCard;
