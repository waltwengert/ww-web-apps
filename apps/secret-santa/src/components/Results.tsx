import React, { useRef, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import styled from 'styled-components';

import { Button, SecretSantaColor } from '@ww-web-apps/ui';

import { Participant } from '../lib/secretSanta';
import { BaseResultsPanel } from './layout';
import { createQrImageArchive } from './qrExport';

const ResultsContainer = styled(BaseResultsPanel)`
    flex: 1 1 auto;
    overflow: auto;
`;

const ResultRow = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: center;
`;

const QrResultRow = styled(ResultRow)`
    grid-template-columns: minmax(0, 1fr) 160px;
    min-height: 164px;
    margin: 8px;
    padding: 10px;
    border-radius: 4px;
    background-color: ${SecretSantaColor.PanelGreen};
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

const QrParticipantName = styled(Name)`
    padding: 16px 20px;
    font-size: 20px;
    font-weight: 500;
    text-align: left;
`;

const QrCodeCell = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`;

const QrCodeFrame = styled.div`
    display: flex;
    padding: 8px;
    background-color: ${SecretSantaColor.White};

    svg {
        display: block;
        width: 128px;
        height: 128px;
    }
`;

const SaveToolbar = styled.div`
    display: flex;
    justify-content: center;
    padding: 12px 0 4px;
`;

const SaveAllButton = styled(Button).attrs({
    backgroundColor: SecretSantaColor.Red,
    color: SecretSantaColor.White
})`
    flex: 0 0 auto;
    width: auto;
    margin: 0;
    padding: 0 16px;

    &:active {
        font-size: 18px;
    }
`;

const ExportError = styled.p`
    color: ${SecretSantaColor.Gold};
`;

interface ResultsProps {
    participants: Participant[];
    shuffledNameList: string[];
    hidden: boolean;
    mode: 'plain' | 'encrypted' | 'qr';
}

export const Results = ({
    participants,
    shuffledNameList,
    hidden,
    mode
}: ResultsProps): React.ReactElement => {
    const rowCount = Math.max(participants.length, shuffledNameList.length);
    const qrCodeRefs = useRef(new Map<string, SVGSVGElement>());
    const [isSaving, setIsSaving] = useState(false);
    const [exportError, setExportError] = useState('');

    const onSaveAll = async (): Promise<void> => {
        setIsSaving(true);
        setExportError('');

        try {
            const cards = participants.flatMap((participant, index) => {
                const qrCode = qrCodeRefs.current.get(participant.id);
                return qrCode && shuffledNameList[index] !== undefined
                    ? [{ participantName: participant.name, qrCode }]
                    : [];
            });
            if (cards.length !== participants.length) {
                throw new Error('QR codes are not ready to save');
            }

            const archive = await createQrImageArchive(cards);
            const archiveUrl = URL.createObjectURL(archive);
            const downloadLink = document.createElement('a');
            downloadLink.href = archiveUrl;
            downloadLink.download = 'secret-santa-qr-codes.zip';
            downloadLink.click();
            window.setTimeout(() => URL.revokeObjectURL(archiveUrl), 1000);
        } catch {
            setExportError('Could not save the QR images. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <ResultsContainer>
            {mode === 'qr' && shuffledNameList.length > 0 ? (
                <SaveToolbar>
                    <SaveAllButton
                        type="button"
                        disabled={isSaving}
                        onClick={() => void onSaveAll()}
                    >
                        {isSaving ? 'Preparing images...' : 'Save all QR codes'}
                    </SaveAllButton>
                </SaveToolbar>
            ) : null}
            {exportError ? (
                <ExportError role="alert">{exportError}</ExportError>
            ) : null}
            {Array.from({ length: rowCount }, (_, index) => {
                const shuffledName = shuffledNameList[index];
                const participant = participants[index];

                if (mode === 'qr') {
                    return (
                        <QrResultRow
                            key={`result-${index}`}
                            data-testid={`assignment-row-${index}`}
                        >
                            <QrParticipantName>
                                {participant?.name}
                            </QrParticipantName>
                            <QrCodeCell hidden={hidden}>
                                {shuffledName !== undefined && participant ? (
                                    <QrCodeFrame>
                                        <QRCodeSVG
                                            ref={svg => {
                                                if (svg) {
                                                    qrCodeRefs.current.set(
                                                        participant.id,
                                                        svg
                                                    );
                                                } else {
                                                    qrCodeRefs.current.delete(
                                                        participant.id
                                                    );
                                                }
                                            }}
                                            value={getDecrypterUrl(
                                                shuffledName
                                            )}
                                            size={256}
                                            role="img"
                                            aria-label="Scan to reveal assignment"
                                        />
                                    </QrCodeFrame>
                                ) : null}
                            </QrCodeCell>
                        </QrResultRow>
                    );
                }

                return (
                    <ResultRow
                        key={`result-${index}`}
                        data-testid={`assignment-row-${index}`}
                    >
                        <Name>{participant?.name}</Name>
                        <Name hidden={hidden}>
                            {shuffledName === undefined ? null : mode ===
                              'encrypted' ? (
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
