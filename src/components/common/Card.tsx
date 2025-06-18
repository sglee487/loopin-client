import React from 'react';
import styled from 'styled-components';
import { CardProps } from '../../types';

const Card: React.FC<CardProps> = ({
  title,
  children,
  className = '',
}) => {
  return (
    <StyledCard className={className}>
      {title && (
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
      )}
      <CardBody>
        {children}
      </CardBody>
    </StyledCard>
  );
};

export default Card;

const StyledCard = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  border: 1px solid #e5e7eb;
  overflow: hidden;
`;

const CardHeader = styled.div`
  padding: 16px 24px;
  border-bottom: 1px solid #e5e7eb;
`;

const CardTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin: 0;
`;

const CardBody = styled.div`
  padding: 16px 24px;
`; 