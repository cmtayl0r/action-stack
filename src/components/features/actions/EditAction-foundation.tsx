// ===============================================================
// ACTION LIST ITEM - Individual Action Component
// ===============================================================
// Displays individual action with inline editing, completion toggle, and delete

import { useState } from "react";
import { Action, UpdateActionData } from "../database";
import { useActions, getPriorityInfo, isActionOverdue } from "../useActions";

interface ActionListItemProps {
  action: Action;
  stackId: number;
}

export default function ActionListItem({
  action,
  stackId,
}: ActionListItemProps) {
  // 📦 Action management hook
  const {
    updateAction,
    toggleComplete,
    deleteAction,
    isToggling,
    isUpdating,
    isDeleting,
  } = useActions(stackId);

  // ✏️ Inline editing state
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: action.name,
    description: action.description || "",
    priority: action.priority,
    due_date: action.due_date || "",
  });

  // 🎯 Get priority display information
  const priorityInfo = getPriorityInfo(action.priority);
  const isOverdue = isActionOverdue(action);

  // ✅ Handle completion toggle
  const handleToggleComplete = () => {
    toggleComplete(action.id);
  };

  // 📝 Handle starting edit mode
  const handleStartEdit = () => {
    setIsEditing(true);
    // Reset form to current action data
    setEditForm({
      name: action.name,
      description: action.description || "",
      priority: action.priority,
      due_date: action.due_date || "",
    });
  };

  // 💾 Handle saving edits
  const handleSaveEdit = () => {
    if (!editForm.name.trim()) return;

    const updates: Partial<UpdateActionData> = {
      name: editForm.name.trim(),
      description: editForm.description.trim() || null,
      priority: editForm.priority,
      due_date: editForm.due_date || null,
    };

    updateAction(action.id, updates, {
      onSuccess: () => {
        setIsEditing(false);
      },
    });
  };

  // ❌ Handle canceling edit
  const handleCancelEdit = () => {
    setIsEditing(false);
    // Reset form to original data
    setEditForm({
      name: action.name,
      description: action.description || "",
      priority: action.priority,
      due_date: action.due_date || "",
    });
  };

  // 🗑️ Handle delete action
  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this action?")) {
      deleteAction(action.id);
    }
  };

  // 📅 Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div
      className={`
        bg-white rounded-lg border transition-all duration-200
        ${
          action.completed
            ? "border-green-200 bg-green-50"
            : isOverdue
            ? "border-red-200 bg-red-50"
            : "border-gray-200 hover:shadow-md"
        }
        ${isEditing ? "ring-2 ring-blue-500" : ""}
      `}
    >
      <div className="p-4">
        {/* 📊 Action header with checkbox and priority */}
        <div className="flex items-start gap-3">
          {/* ✅ Completion checkbox */}
          <button
            onClick={handleToggleComplete}
            disabled={isToggling}
            className={`
              mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors
              ${
                action.completed
                  ? "bg-green-500 border-green-500 text-white"
                  : "border-gray-300 hover:border-green-400"
              }
              ${isToggling ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
            `}
          >
            {action.completed && "✓"}
          </button>

          {/* 📝 Action content */}
          <div className="flex-1 min-w-0">
            {isEditing ? (
              /* ✏️ Edit mode */
              <div className="space-y-3">
                {/* 📝 Name input */}
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Action name"
                  autoFocus
                />

                {/* 📋 Description input */}
                <textarea
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Optional description"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={2}
                />

                {/* 🎯 Priority and due date */}
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Priority
                    </label>
                    <select
                      value={editForm.priority}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          priority: Number(e.target.value) as 0 | 1 | 2 | 3,
                        }))
                      }
                      className="w-full px-3 py-1 border border-gray-300 rounded text-sm"
                    >
                      <option value={0}>⚪ None</option>
                      <option value={1}>🟢 Low</option>
                      <option value={2}>🟡 Medium</option>
                      <option value={3}>🔴 High</option>
                    </select>
                  </div>

                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Due Date
                    </label>
                    <input
                      type="date"
                      value={editForm.due_date}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          due_date: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-1 border border-gray-300 rounded text-sm"
                    />
                  </div>
                </div>

                {/* 💾 Save/Cancel buttons */}
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={handleSaveEdit}
                    disabled={!editForm.name.trim() || isUpdating}
                    className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
                  >
                    {isUpdating ? "Saving..." : "Save"}
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    disabled={isUpdating}
                    className="px-3 py-1 text-gray-600 border border-gray-300 rounded text-sm hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              /* 👁️ View mode */
              <div>
                {/* 🏷️ Action name and priority */}
                <div className="flex items-center gap-2 mb-1">
                  <h3
                    className={`
                      font-medium text-gray-900 flex-1
                      ${action.completed ? "line-through text-gray-500" : ""}
                    `}
                  >
                    {action.name}
                  </h3>

                  {/* 🎯 Priority indicator */}
                  {action.priority > 0 && (
                    <span
                      className="text-xs px-2 py-1 rounded-full font-medium"
                      style={{
                        backgroundColor: `${priorityInfo.color}20`,
                        color: priorityInfo.color,
                      }}
                    >
                      {priorityInfo.emoji} {priorityInfo.label}
                    </span>
                  )}

                  {/* ⚠️ Overdue indicator */}
                  {isOverdue && (
                    <span className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded-full font-medium">
                      ⚠️ Overdue
                    </span>
                  )}
                </div>

                {/* 📋 Description if available */}
                {action.description && (
                  <p
                    className={`
                    text-sm text-gray-600 mb-2 line-clamp-2
                    ${action.completed ? "line-through" : ""}
                  `}
                  >
                    {action.description}
                  </p>
                )}

                {/* 📅 Due date and metadata */}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-4">
                    {/* 📅 Due date */}
                    {action.due_date && (
                      <span
                        className={isOverdue ? "text-red-600 font-medium" : ""}
                      >
                        📅 Due: {formatDate(action.due_date)}
                      </span>
                    )}

                    {/* 📊 Created date */}
                    <span>Created: {formatDate(action.created_at)}</span>

                    {/* 🏷️ Tags if available */}
                    {action.tags && action.tags.length > 0 && (
                      <div className="flex gap-1">
                        {action.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="px-1 py-0.5 bg-gray-100 text-gray-600 rounded text-xs"
                          >
                            #{tag}
                          </span>
                        ))}
                        {action.tags.length > 3 && (
                          <span className="text-gray-400">
                            +{action.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ⚙️ Action buttons */}
          {!isEditing && (
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {/* ✏️ Edit button */}
              <button
                onClick={handleStartEdit}
                disabled={isUpdating || isDeleting}
                className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                title="Edit action"
              >
                ✏️
              </button>

              {/* 🗑️ Delete button */}
              <button
                onClick={handleDelete}
                disabled={isDeleting || isUpdating}
                className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                title="Delete action"
              >
                {isDeleting ? "⏳" : "🗑️"}
              </button>

              {/* 🔗 External link if available */}
              {action.external_url && (
                <a
                  href={action.external_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                  title="Open external link"
                >
                  🔗
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 📊 Action footer with additional metadata (only for non-completed actions) */}
      {!action.completed &&
        !isEditing &&
        (action.tags?.length || action.external_url) && (
          <div className="px-4 pb-3 border-t border-gray-100">
            <div className="flex items-center justify-between text-xs">
              {/* 🏷️ All tags */}
              {action.tags && action.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {action.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs hover:bg-gray-200 cursor-pointer"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* 🔗 External URL */}
              {action.external_url && (
                <a
                  href={action.external_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline text-xs mt-1 block truncate max-w-xs"
                  title={action.external_url}
                >
                  🔗 {action.external_url}
                </a>
              )}
            </div>
          </div>
        )}

      {/* 🔄 TODO: Add drag handle for reordering */}
      {/* ⏰ TODO: Add time tracking functionality */}
      {/* 📎 TODO: Add file attachment support */}
    </div>
  );
}
