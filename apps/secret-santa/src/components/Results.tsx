import React from 'react';
import styled from 'styled-components';

import { SecretSanta } from '@ww-web-apps/ui';

import { BaseResultsPanel } from './layout';

const ResultsContainer = styled(BaseResultsPanel)`
    flex: 1 1 auto;
    overflow: auto;
`;

const NamesContainer = styled.div`
    width: 50%;
    display: inline-block;
`;

const Name = styled.div`
    padding: 20px 10px;
    color: ${SecretSanta.White};
`;

const ResultText = styled.div`
    color: ${SecretSanta.Gold};
`;

const ResultLink = styled.a`
    color: ${SecretSanta.Gold};
`;

interface ResultsProps {
    nameList: string[];
    shuffledNameList: string[];
    hidden: boolean;
    encrypted: boolean;
}

export const Results = ({
    nameList,
    shuffledNameList,
    hidden,
    encrypted
}: ResultsProps): React.ReactElement => {
    const names = nameList.map(
        (name): React.ReactElement => <Name key={`name-${name}`}>{name}</Name>
    );
    const shuffledNames = shuffledNameList.map(
        (name): React.ReactElement => (
            <Name key={`shuffledName-${name}`} hidden={hidden}>
                {encrypted ? (
                    <ResultLink href={`/secret-santa/#/decrypter/${name}`}>
                        {name}
                    </ResultLink>
                ) : (
                    <ResultText>{name}</ResultText>
                )}
            </Name>
        )
    );

    return (
        <ResultsContainer>
            <NamesContainer>{names}</NamesContainer>
            <NamesContainer>{shuffledNames}</NamesContainer>
        </ResultsContainer>
    );
};
