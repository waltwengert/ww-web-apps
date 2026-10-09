import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import styled from 'styled-components';

import { SecretSantaColor } from '@ww-web-apps/ui';

import { BaseResultsPanel } from './layout';

const ResultsContainer = styled(BaseResultsPanel)`
    flex: 1 1 auto;
    overflow: auto;
`;

const ResultRow = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: center;
`;

const Name = styled.div`
    padding: 20px 10px;
    color: ${SecretSantaColor.White};
`;

const ResultText = styled.div`
    color: ${SecretSantaColor.Gold};
`;

const ResultLink = styled.a`
    color: ${SecretSantaColor.Gold};
`;

interface ResultsProps {
    nameList: string[];
    shuffledNameList: string[];
    hidden: boolean;
    mode: 'plain' | 'encrypted' | 'qr';
}

export const Results = ({
    nameList,
    shuffledNameList,
    hidden,
    mode
}: ResultsProps): React.ReactElement => {
    const rowCount = Math.max(nameList.length, shuffledNameList.length);

    return (
        <ResultsContainer>
            {Array.from({ length: rowCount }, (_, index) => {
                const shuffledName = shuffledNameList[index];

                return (
                    <ResultRow key={`result-${index}`}>
                        <Name>{nameList[index]}</Name>
                        <Name hidden={hidden}>
                            {shuffledName === undefined ? null : mode ===
                              'qr' ? (
                                <QRCodeSVG
                                    value={getDecrypterUrl(shuffledName)}
                                    size={128}
                                    role="img"
                                    aria-label="Scan to reveal assignment"
                                />
                            ) : mode === 'encrypted' ? (
                                <ResultLink
                                    href={getDecrypterUrl(shuffledName)}
                                >
                                    {shuffledName}
                                </ResultLink>
                            ) : (
                                <ResultText>{shuffledName}</ResultText>
                            )}
                        </Name>
                    </ResultRow>
                );
            })}
        </ResultsContainer>
    );
};

const getDecrypterUrl = (token: string): string => {
    const url = new URL(window.location.href);
    url.hash = `/decrypter/${encodeURIComponent(token)}`;
    return url.toString();
};
