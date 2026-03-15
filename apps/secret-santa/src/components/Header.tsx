import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import {
    Button,
    Label,
    MOBILE_DEVICE_WIDTH,
    SecretSanta
} from '@ww-web-apps/ui';

const HeaderWrapper = styled.div`
    flex: 0 1 auto;

    background-color: ${SecretSanta.BackgroundGreen};
    color: ${SecretSanta.Gold};

    justify-content: center;
    font-size: calc(40px + 2vmin);

    margin-top: 30px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;

    // The below prevents text from being selectable
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
`;

const NavContainer = styled.nav`
    display: flex;
    gap: 12px;

    @media (max-width: ${MOBILE_DEVICE_WIDTH}px) {
        width: 95vw;
    }
`;

const NavButton = styled(Button)<{ $isActive: boolean }>`
    padding: 10px 18px;
    margin-left: 0;
    margin-right: 0;
    background-color: ${({ $isActive }): string =>
        $isActive ? SecretSanta.Gold : SecretSanta.Red};
    color: ${({ $isActive }): string =>
        $isActive ? SecretSanta.PanelGreen : SecretSanta.White};

    @media (hover: hover) {
        &:hover {
            filter: ${({ $isActive }): string =>
                $isActive ? 'none' : 'brightness(0.8)'};
        }

        &:active:hover {
            filter: none;
        }
    }
`;

export const Header = (): React.ReactElement => {
    const navigate = useNavigate();
    const location = useLocation();

    const isGeneratorRoute = location.pathname === '/';
    const isDecrypterRoute = location.pathname.startsWith('/decrypter');

    return (
        <HeaderWrapper>
            <Label>Secret Santa</Label>
            <NavContainer>
                <NavButton
                    $isActive={isGeneratorRoute}
                    onClick={() => navigate('/')}
                >
                    Generator
                </NavButton>
                <NavButton
                    $isActive={isDecrypterRoute}
                    onClick={() => navigate('/decrypter')}
                >
                    Decrypter
                </NavButton>
            </NavContainer>
        </HeaderWrapper>
    );
};
