import React from 'react';
import styled from 'styled-components';
import { ButtonProps } from '../../types';

interface StyledButtonProps {
  variant: 'primary' | 'secondary' | 'danger';
  size: 'small' | 'medium' | 'large';
  disabled: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'medium',
  disabled = false,
  className = '',
}) => {
  return (
    <StyledButton
      type={type}
      variant={variant}
      size={size}
      disabled={disabled}
      onClick={onClick}
      className={className}
    >
      {children}
    </StyledButton>
  );
};

export default Button;

const StyledButton = styled.button<StyledButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.2s ease;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.disabled ? 0.5 : 1};
  outline: none;
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
  }

  /* Size variants */
  ${props => {
    switch (props.size) {
      case 'small':
        return `
          padding: 4px 8px;
          font-size: 14px;
        `;
      case 'large':
        return `
          padding: 12px 24px;
          font-size: 18px;
        `;
      default: // medium
        return `
          padding: 8px 16px;
          font-size: 16px;
        `;
    }
  }}

  /* Color variants */
  ${props => {
    switch (props.variant) {
      case 'primary':
        return `
          background-color: #2563eb;
          color: white;
          &:hover:not(:disabled) {
            background-color: #1d4ed8;
          }
        `;
      case 'secondary':
        return `
          background-color: #4b5563;
          color: white;
          &:hover:not(:disabled) {
            background-color: #374151;
          }
        `;
      case 'danger':
        return `
          background-color: #dc2626;
          color: white;
          &:hover:not(:disabled) {
            background-color: #b91c1c;
          }
        `;
    }
  }}
`; 