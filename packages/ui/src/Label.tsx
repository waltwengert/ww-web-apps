import React from 'react';
import styled from 'styled-components';

const StyledP = styled.p`
    margin: 0;
`;

interface LabelProps {
    children: React.ReactNode;
}

export const Label = ({ children }: LabelProps): React.ReactElement => {
    return <StyledP>{children}</StyledP>;
};
