import styled from 'styled-components';
import React from 'react';

const StyledP = styled.p`
    margin: 0;
`;

interface LabelProps {
    children: React.ReactNode;
}

export const BaseLabel = ({ children }: LabelProps) => {
    return <StyledP>{children}</StyledP>;
};
