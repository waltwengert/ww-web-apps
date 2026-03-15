import styled from 'styled-components';

import { MOBILE_DEVICE_WIDTH, SecretSanta } from '@ww-web-apps/ui';

export const ButtonRowWrapper = styled.div`
    justify-content: center;
    display: flex;
    width: 100%;
    margin-top: 15px;
`;

export const ButtonRowContainer = styled.div`
    background-color: ${SecretSanta.BackgroundGreen};
    color: ${SecretSanta.White};
    display: flex;
    flex-direction: row;
    justify-content: center;
    width: 50vw;

    @media (max-width: ${MOBILE_DEVICE_WIDTH}px) {
        width: 95vw;
    }
`;

export const BaseResultsPanel = styled.div`
    background-color: ${SecretSanta.PanelGreen};
    margin: 20px auto 40px;
    width: 50vw;

    @media (max-width: ${MOBILE_DEVICE_WIDTH}px) {
        width: 90vw;
    }
`;
