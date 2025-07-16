import React, { useState, useRef, useEffect } from 'react'
import './CustomSelect.css'

interface Option {
  value: string | number
  label: string
  icon?: string
  description?: string
  color?: string
}

interface CustomSelectProps {
  options: Option[]
  value: string | number
  onChange: (value: string | number) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = "선택하세요",
  disabled = false,
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const selectRef = useRef<HTMLDivElement>(null)
  const optionRefs = useRef<(HTMLDivElement | null)[]>([])

  const selectedOption = options.find(option => option.value === value)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setHighlightedIndex(-1)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (isOpen && highlightedIndex >= 0 && optionRefs.current[highlightedIndex]) {
      optionRefs.current[highlightedIndex]?.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth'
      })
    }
  }, [highlightedIndex, isOpen])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return

    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault()
        if (isOpen && highlightedIndex >= 0) {
          handleOptionClick(options[highlightedIndex])
        } else {
          setIsOpen(true)
        }
        break
      case 'ArrowDown':
        e.preventDefault()
        if (!isOpen) {
          setIsOpen(true)
          setHighlightedIndex(0)
        } else {
          setHighlightedIndex(prev => 
            prev < options.length - 1 ? prev + 1 : 0
          )
        }
        break
      case 'ArrowUp':
        e.preventDefault()
        if (!isOpen) {
          setIsOpen(true)
          setHighlightedIndex(options.length - 1)
        } else {
          setHighlightedIndex(prev => 
            prev > 0 ? prev - 1 : options.length - 1
          )
        }
        break
      case 'Escape':
        setIsOpen(false)
        setHighlightedIndex(-1)
        break
    }
  }

  const handleOptionClick = (option: Option) => {
    onChange(option.value)
    setIsOpen(false)
    setHighlightedIndex(-1)
  }

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen)
      if (!isOpen) {
        setHighlightedIndex(-1)
      }
    }
  }

  return (
    <div 
      ref={selectRef}
      className={`custom-select ${className} ${disabled ? 'disabled' : ''} ${isOpen ? 'open' : ''}`}
      tabIndex={disabled ? -1 : 0}
      onKeyDown={handleKeyDown}
      role="combobox"
      aria-expanded={isOpen}
      aria-haspopup="listbox"
    >
      <div 
        className="custom-select-trigger"
        onClick={toggleDropdown}
        aria-label={selectedOption ? selectedOption.label : placeholder}
      >
        <div className="custom-select-value">
          {selectedOption ? (
            <div className="selected-option">
              {selectedOption.icon && (
                <span className="option-icon">{selectedOption.icon}</span>
              )}
              <span className="option-label">{selectedOption.label}</span>
              {selectedOption.description && (
                <span className="option-description">{selectedOption.description}</span>
              )}
            </div>
          ) : (
            <span className="placeholder">{placeholder}</span>
          )}
        </div>
        <div className="custom-select-arrow">
          <svg 
            viewBox="0 0 20 20" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className={`arrow-icon ${isOpen ? 'rotated' : ''}`}
          >
            <path 
              d="M6 8l4 4 4-4" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {isOpen && (
        <div className="custom-select-dropdown" role="listbox">
          {options.map((option, index) => (
            <div
              key={option.value}
              ref={el => optionRefs.current[index] = el}
              className={`custom-select-option ${
                option.value === value ? 'selected' : ''
              } ${highlightedIndex === index ? 'highlighted' : ''}`}
              onClick={() => handleOptionClick(option)}
              onMouseEnter={() => setHighlightedIndex(index)}
              role="option"
              aria-selected={option.value === value}
            >
              {option.icon && (
                <span className="option-icon">{option.icon}</span>
              )}
              <div className="option-content">
                <span className="option-label">{option.label}</span>
                {option.description && (
                  <span className="option-description">{option.description}</span>
                )}
              </div>
              {option.value === value && (
                <span className="check-icon">✓</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default CustomSelect