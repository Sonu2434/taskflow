import { Droppable } from '@hello-pangea/dnd';
import { Plus } from 'lucide-react';
import KanbanCard from './KanbanCard';

const KanbanColumn = ({ column, tasks, onAddTask, onEdit, onDelete, isAdmin }) => {
  return (
    <div className="flex flex-col w-72 flex-shrink-0 rounded-2xl"
      style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>

      {/* Column header */}
      <div className="flex items-center justify-between px-4 py-3.5"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: column.color }} />
          <span className="text-sm font-semibold text-gray-200">{column.title}</span>
          <span className="text-xs text-gray-600 px-1.5 py-0.5 rounded-full"
            style={{ background: 'rgba(255,255,255,0.06)' }}>
            {tasks.length}
          </span>
        </div>
        {onAddTask && (
          <button onClick={() => onAddTask(column.id)}
            className="w-6 h-6 flex items-center justify-center rounded-lg text-gray-500 hover:text-blue-400 hover:bg-blue-500/10 transition-colors">
            <Plus size={14} />
          </button>
        )}
      </div>

      {/* Droppable task list */}
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="flex-1 p-3 overflow-y-auto min-h-[200px] transition-colors"
            style={{
              background: snapshot.isDraggingOver ? 'rgba(79,142,247,0.04)' : 'transparent',
              maxHeight: 'calc(100vh - 220px)',
            }}
          >
            {tasks.map((task, index) => (
              <KanbanCard
                key={task._id}
                task={task}
                index={index}
                onEdit={onEdit}
                onDelete={onDelete}
                isAdmin={isAdmin}
              />
            ))}
            {provided.placeholder}
            {tasks.length === 0 && !snapshot.isDraggingOver && (
              <div className="flex items-center justify-center h-24 text-gray-700 text-sm">
                Drop tasks here
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default KanbanColumn;
