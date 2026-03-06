import clsx from 'clsx'
import type { UserTask } from '../types'

interface TaskItemProps {
  task: UserTask
  checked: boolean
  onToggle: () => void
}

export function TaskItem({ task, checked, onToggle }: TaskItemProps) {
  return (
    <button
      type="button"
      className={clsx(
        'task-toggle px-4 py-3 text-left',
        checked && 'checked',
      )}
      onClick={onToggle}
    >
      <span className="flex items-center justify-between gap-3">
        <span className="flex items-center gap-3">
          <span className="text-xl" aria-hidden>
            {task.icon || '•'}
          </span>
          <span className="text-sm font-medium text-slate-100">{task.name}</span>
        </span>

        <span
          className={clsx(
            'task-weight-badge flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold',
            checked && 'checked',
          )}
        >
          {checked ? '✓' : task.weight}
        </span>
      </span>
    </button>
  )
}
