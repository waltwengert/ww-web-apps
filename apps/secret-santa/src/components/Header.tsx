import styled from 'styled-components';
import { BaseLabel } from '@ww-web-apps/ui';

const HeaderWrapper = styled.div`
    flex: 0 1 auto;

    background-color: #146b3a;
    color: #f8b229;

    justify-content: center;
    font-size: calc(40px + 2vmin);

    margin-top: 30px;

    // The below prevents text from being selectable
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
`;

export const Header = () => {
    return (
        <HeaderWrapper>
            <BaseLabel>Secret Santa</BaseLabel>
        </HeaderWrapper>
    );
};
