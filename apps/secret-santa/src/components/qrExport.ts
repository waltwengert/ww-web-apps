import JSZip from 'jszip';

import { SecretSantaColor } from '@ww-web-apps/ui';

interface QrCard {
    participantName: string;
    qrCode: SVGSVGElement;
}

const CARD_WIDTH = 720;
const QR_SIZE = 224;
const SCALE = 2;
const NAME_FONT_SIZE = 34;
const NAME_LINE_HEIGHT = 44;
const NAME_MAX_WIDTH = 340;

export async function createQrImageArchive(cards: QrCard[]): Promise<Blob> {
    const archive = new JSZip();
    const usedFileNames = new Set<string>();

    await Promise.all(
        cards.map(async (card, index) => {
            const fileName = getUniqueFileName(
                card.participantName,
                index,
                usedFileNames
            );
            const image = await loadQrImage(card.qrCode);
            const png = await drawQrCard(card.participantName, image);
            archive.file(fileName, png);
        })
    );

    return archive.generateAsync({ type: 'blob' });
}

const getUniqueFileName = (
    participantName: string,
    index: number,
    usedFileNames: Set<string>
): string => {
    const safeName =
        participantName
            .trim()
            .replace(/[<>:"/\\|?*\p{Cc}]/gu, '-')
            .replace(/\s+/g, '-')
            .replace(/[. ]+$/g, '') || `participant-${index + 1}`;
    let candidate = safeName;
    let suffix = 2;

    while (usedFileNames.has(candidate.toLowerCase())) {
        candidate = `${safeName}-${suffix}`;
        suffix += 1;
    }

    usedFileNames.add(candidate.toLowerCase());
    return `${candidate}.png`;
};

const loadQrImage = async (
    qrCode: SVGSVGElement
): Promise<HTMLImageElement> => {
    const markup = new XMLSerializer().serializeToString(qrCode);
    const svgBlob = new Blob([markup], {
        type: 'image/svg+xml;charset=utf-8'
    });
    const objectUrl = URL.createObjectURL(svgBlob);
    const image = new Image();

    try {
        await new Promise<void>((resolve, reject) => {
            image.onload = (): void => resolve();
            image.onerror = (): void =>
                reject(new Error('Could not load QR code'));
            image.src = objectUrl;
        });
    } finally {
        URL.revokeObjectURL(objectUrl);
    }

    return image;
};

const drawQrCard = async (
    participantName: string,
    qrImage: HTMLImageElement
): Promise<Blob> => {
    await document.fonts.ready;

    const measureCanvas = document.createElement('canvas');
    const measureContext = measureCanvas.getContext('2d');
    if (!measureContext) throw new Error('Canvas is unavailable');

    measureContext.font = `500 ${NAME_FONT_SIZE}px Grandstander, sans-serif`;
    const lines = wrapName(measureContext, participantName);
    const cardHeight = Math.max(280, lines.length * NAME_LINE_HEIGHT + 64);
    const canvas = document.createElement('canvas');
    canvas.width = CARD_WIDTH * SCALE;
    canvas.height = cardHeight * SCALE;

    const context = canvas.getContext('2d');
    if (!context) throw new Error('Canvas is unavailable');

    context.scale(SCALE, SCALE);
    context.fillStyle = SecretSantaColor.PanelGreen;
    context.fillRect(0, 0, CARD_WIDTH, cardHeight);
    context.fillStyle = SecretSantaColor.Gold;
    context.fillRect(0, 0, 8, cardHeight);

    const qrX = CARD_WIDTH - QR_SIZE - 24;
    const qrY = (cardHeight - QR_SIZE) / 2;
    context.fillStyle = SecretSantaColor.White;
    context.fillRect(qrX - 8, qrY - 8, QR_SIZE + 16, QR_SIZE + 16);
    context.drawImage(qrImage, qrX, qrY, QR_SIZE, QR_SIZE);

    context.font = `500 ${NAME_FONT_SIZE}px Grandstander, sans-serif`;
    context.fillStyle = SecretSantaColor.White;
    context.textBaseline = 'middle';
    const firstLineY =
        cardHeight / 2 - ((lines.length - 1) * NAME_LINE_HEIGHT) / 2;
    lines.forEach((line, index) => {
        context.fillText(
            line,
            48,
            firstLineY + index * NAME_LINE_HEIGHT,
            NAME_MAX_WIDTH
        );
    });

    return new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(blob => {
            if (blob) resolve(blob);
            else reject(new Error('Could not create QR image'));
        }, 'image/png');
    });
};

const wrapName = (
    context: CanvasRenderingContext2D,
    participantName: string
): string[] => {
    const words = participantName.trim().split(/\s+/).filter(Boolean);
    if (words.length === 0) return ['Participant'];

    const lines: string[] = [];
    let currentLine = '';
    for (const word of words) {
        const candidate = currentLine ? `${currentLine} ${word}` : word;
        if (
            currentLine &&
            context.measureText(candidate).width > NAME_MAX_WIDTH
        ) {
            lines.push(currentLine);
            currentLine = word;
        } else {
            currentLine = candidate;
        }
    }
    lines.push(currentLine);
    return lines;
};
