import React, { useState, useRef, useEffect } from 'react';
import './ProfileDropdown.css';

export default function ProfileDropdown({
  users = [],
  selectedId,
  selectedIds = [],
  isMulti = false,
  placeholder = "Select...",
  searchPlaceholder = "Search profiles...",
  onSelect,
  onAddProfile,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!isOpen) setSearch('');
  }, [isOpen]);

  const filteredUsers = users.filter((u) =>
    (u?.name || '').toLowerCase().includes(search.toLowerCase())
  );

  const getDisplayText = () => {
    if (isMulti) {
      if (selectedIds.length === 0) return placeholder;
      if (selectedIds.length === 1) {
        const u = users.find((item) => item._id === selectedIds[0]);
        return u ? u.name : placeholder;
      }
      return `${selectedIds.length} profiles selected`;
    } else {
      const u = users.find((item) => item._id === selectedId);
      return u ? u.name : placeholder;
    }
  };

  return (
    <div className="custom-dropdown" ref={dropdownRef}>
      <button
        type="button"
        className="dropdown-trigger"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{getDisplayText()}</span>
        <span className="dropdown-arrow">⇕</span>
      </button>

      {isOpen && (
        <div className="dropdown-menu">
          <div className="dropdown-search">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={searchPlaceholder}
              autoFocus
            />
          </div>

          <div className="dropdown-list">
            {filteredUsers.map((user) => {
              const isSelected = isMulti
                ? selectedIds.includes(user._id)
                : selectedId === user._id;

              return (
                <div
                  key={user._id}
                  className={`dropdown-item ${isSelected ? 'selected' : ''}`}
                  onClick={() => {
                    onSelect(user._id);
                    if (!isMulti) setIsOpen(false);
                  }}
                >
                  {isMulti && (
                    <input
                      type="checkbox"
                      checked={isSelected}
                      readOnly
                      style={{ marginRight: 8 }}
                    />
                  )}
                  {!isMulti && isSelected && <span className="check-mark">• </span>}
                  <span>{user.name}</span>
                </div>
              );
            })}
            {filteredUsers.length === 0 && (
              <div className="dropdown-empty">No users found</div>
            )}
          </div>

          {onAddProfile && (
            <button
              type="button"
              className="dropdown-add-btn"
              onClick={() => {
                setIsOpen(false);
                onAddProfile();
              }}
            >
              <span>+</span> Add Profile
            </button>
          )}
        </div>
      )}
    </div>
  );
}