import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled, { css } from 'styled-components';

import { Portfolio as PortfolioColors } from '@ww-web-apps/ui';

import { MOBILE_WIDTH, WIDE_WIDTH } from './portfolio.constants';

export const Header = styled.div`
    background-color: ${PortfolioColors.Background};
    width: 100%;
    position: fixed;
    top: 0;
    z-index: -3;
    text-align: center;
`;

export const NameHeading = styled.h1`
    font-family: 'Roboto Slab', 'Arial', sans-serif;
    font-size: 44px;
    font-weight: 100;
    color: ${PortfolioColors.Text};
    padding-top: 10px;

    @media screen and (max-width: ${MOBILE_WIDTH}px) {
        font-size: 32px;
    }

    @media screen and (min-width: ${WIDE_WIDTH}px) {
        padding-top: 20px;
    }
`;

export const Avatar = styled.img`
    width: 120px;
    border-radius: 50%;
    padding-bottom: 10px;
    padding-top: 5px;
    margin: auto;
    display: block;

    @media screen and (max-width: ${MOBILE_WIDTH}px) {
        width: 100px;
    }

    @media screen and (min-width: ${WIDE_WIDTH}px) {
        width: 120px;
        padding-bottom: 15px;
        padding-top: 10px;
    }
`;

export const MailLink = styled.a`
    font-family: 'Roboto Slab', 'Arial', sans-serif;
    font-size: 18px;
    width: min-content;
    color: ${PortfolioColors.Text};
    padding-top: 10px;
    text-decoration: none;

    @media screen and (max-width: ${MOBILE_WIDTH}px) {
        font-size: 16px;
    }

    @media (hover: hover) {
        &:hover {
            text-decoration: underline;
            color: ${PortfolioColors.Muted};
        }
    }
`;

export const IconRow = styled.div``;

export const SocialIconLink = styled.a`
    color: ${PortfolioColors.Text};
    padding-top: 10px;
    text-decoration: none;

    @media (hover: hover) {
        &:hover {
            text-decoration: underline;
            color: ${PortfolioColors.Muted};
        }
    }
`;

export const SocialIcon = styled(FontAwesomeIcon)`
    font-size: 30px;
    padding-left: 10px;
    padding-right: 10px;
    padding-top: 8px;

    @media screen and (max-width: ${MOBILE_WIDTH}px) {
        padding-top: 13px;
    }
`;

export const ButtonsBar = styled.div<{ $fixed: boolean; $topPx: number }>`
    display: flex;
    padding-right: 11%;
    padding-left: 11%;
    position: ${({ $fixed }): string => ($fixed ? 'fixed' : 'absolute')};
    top: ${({ $fixed, $topPx }): string => ($fixed ? '0px' : `${$topPx}px`)};
    left: 0;
    right: 0;
    z-index: 0;

    @media screen and (max-width: ${MOBILE_WIDTH}px) {
        padding-right: 0;
        padding-left: 0;
    }

    @media screen and (min-width: ${WIDE_WIDTH}px) {
        padding-left: 19%;
        padding-right: 19%;
    }
`;

export const NavButton = styled.button<{ $active: boolean }>`
    background-color: ${({ $active }): string =>
        $active ? PortfolioColors.ButtonActive : PortfolioColors.Button};
    color: ${({ $active }): string =>
        $active ? PortfolioColors.Text : PortfolioColors.ButtonText};
    cursor: pointer;
    padding: 12px;
    flex: 1;
    font-size: 20px;

    &:focus {
        outline: 2px solid ${PortfolioColors.Text};
        outline-offset: -2px;
    }

    @media screen and (max-width: ${MOBILE_WIDTH}px) {
        font-size: 0;
    }

    @media (hover: hover) {
        &:hover {
            color: ${({ $active }): string =>
                $active ? PortfolioColors.Text : PortfolioColors.Muted};
        }
    }
`;

export const NavIcon = styled(FontAwesomeIcon)`
    font-size: 30px;
`;

const AboutMarginStyles = css`
    margin-top: 358px;

    @media screen and (max-width: ${MOBILE_WIDTH}px) {
        margin-top: 304px;
    }

    @media screen and (min-width: ${WIDE_WIDTH}px) {
        margin-top: 388px;
    }
`;

export const Section = styled.section<{ $zIndex: number; $isAbout?: boolean }>`
    background-color: ${PortfolioColors.Surface};
    width: 78%;
    margin-left: auto;
    margin-right: auto;
    padding-top: 20px;
    color: ${PortfolioColors.TileText};
    box-sizing: border-box;
    overflow: visible;
    display: flex;
    flex-direction: column;
    z-index: ${({ $zIndex }): number => $zIndex};

    ${({ $isAbout }): ReturnType<typeof css> =>
        $isAbout ? AboutMarginStyles : css``}

    h2 {
        font-size: 28px;
    }

    @media screen and (max-width: ${MOBILE_WIDTH}px) {
        width: 100%;

        h2 {
            font-size: 24px;
        }
    }

    @media screen and (min-width: ${WIDE_WIDTH}px) {
        width: 62%;
    }
`;

export const Tile = styled.div<{ $isLast: boolean }>`
    margin: 5px auto;
    border-left: 2px solid ${PortfolioColors.TileBorder};
    background-color: ${PortfolioColors.TileBackground};
    width: 80%;
    ${({ $isLast }): ReturnType<typeof css> | false =>
        $isLast &&
        css`
            margin-bottom: 40px;
        `}

    @media screen and (max-width: ${MOBILE_WIDTH}px) {
        width: 96%;
        border: 0;
        border-bottom: 1px dotted ${PortfolioColors.MobileBorder};
        margin: 0 auto;

        ${({ $isLast }): ReturnType<typeof css> | false =>
            $isLast &&
            css`
                margin-bottom: 30px;
                border-bottom: none;
            `}
    }
`;

export const AboutTile = styled(Tile)``;

export const AboutHeading = styled.h2`
    padding-top: 25px;
    padding-bottom: 10px;
    padding-left: 7%;
`;

export const AboutBody = styled.p`
    font-size: 18px;
    padding-bottom: 30px;
    padding-left: 7%;
    padding-right: 7%;

    strong {
        font-weight: bolder;
        color: ${PortfolioColors.TileText};
    }
`;

export const ProjectsTile = styled(Tile)`
    display: flex;
`;

export const ProjectImageWrap = styled.div`
    flex: 4;
    text-align: center;
`;

export const ProjectTextWrap = styled.div`
    flex: 6;
`;

export const ProjectButtonWrap = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    text-align: center;
`;

export const ProjectImage = styled.img`
    max-width: 90%;
    margin: 10px;
    object-fit: cover;
    object-position: top;
    box-shadow: 3px 3px 3px ${PortfolioColors.Muted};

    @media screen and (max-width: ${MOBILE_WIDTH}px) {
        box-shadow: 1px 1px 1px ${PortfolioColors.Muted};
    }
`;

export const ProjectHeading = styled.h2`
    padding: 10px;

    @media screen and (max-width: ${MOBILE_WIDTH}px) {
        padding-top: 5%;
    }
`;

export const ProjectTech = styled.h3`
    font-size: 18px;
    font-style: italic;
    font-weight: normal;
    padding-left: 10px;

    @media screen and (max-width: ${MOBILE_WIDTH}px) {
        padding-bottom: 6%;
    }
`;

export const ProjectAbout = styled.p`
    padding-left: 10px;
    padding-top: 15px;
    padding-right: 20px;
    padding-bottom: 30px;

    @media screen and (max-width: ${MOBILE_WIDTH}px) {
        display: none;
    }

    @media screen and (min-width: ${WIDE_WIDTH}px) {
        padding-bottom: 20px;
    }
`;

export const ProjectLink = styled.a`
    text-decoration: none;
`;

export const ProjectLinkIcon = styled(FontAwesomeIcon)`
    font-size: 36px;
    color: ${PortfolioColors.TileText};
    flex: 1;
    padding: 0;
    padding-right: 10px;

    @media screen and (max-width: ${MOBILE_WIDTH}px) {
        padding-top: 4%;
    }

    @media (hover: hover) {
        &:hover {
            color: ${PortfolioColors.Muted};
        }
    }
`;

export const EducationTile = styled(Tile)`
    @media screen and (max-width: ${MOBILE_WIDTH}px) {
        display: flex;
        flex-direction: column;
    }
`;

export const EducationLevel = styled.h2`
    width: 55%;
    padding-left: 7%;
    padding-top: 25px;
    padding-bottom: 10px;
    float: left;

    @media screen and (max-width: ${MOBILE_WIDTH}px) {
        width: 80%;
        padding-bottom: 10px;
        float: none;
        order: 1;
    }
`;

export const EducationFocus = styled.h3`
    font-size: 18px;
    font-weight: normal;
    font-style: italic;
    width: 55%;
    padding-left: 7%;
    padding-right: 10%;
    padding-bottom: 30px;
    float: left;

    @media screen and (max-width: ${MOBILE_WIDTH}px) {
        width: 80%;
        float: none;
        padding-bottom: 10px;
        order: 2;
    }
`;

export const EducationPeriod = styled.h4`
    width: 20%;
    padding-left: 3%;
    padding-right: 5%;
    float: left;
    text-align: right;

    @media screen and (max-width: ${MOBILE_WIDTH}px) {
        display: none;
    }
`;

export const EducationInstitution = styled.h3`
    width: 30%;
    padding-left: 3%;
    padding-right: 5%;
    padding-top: 5%;
    padding-bottom: 15px;
    float: left;
    text-align: right;

    @media screen and (max-width: ${MOBILE_WIDTH}px) {
        padding-top: 0;
        float: none;
        order: 3;
        display: block;
        width: 80%;
        text-align: left;
        font-size: 18px;
        font-weight: normal;
        padding-bottom: 20px;
        padding-left: 7%;
    }
`;

export const EmploymentTile = styled(Tile)`
    @media screen and (max-width: ${MOBILE_WIDTH}px) {
        display: flex;
        flex-direction: column;
    }
`;

export const EmploymentEmployer = styled.h2`
    width: 55%;
    padding-left: 7%;
    padding-top: 25px;
    padding-bottom: 10px;
    float: left;

    @media screen and (max-width: ${MOBILE_WIDTH}px) {
        width: 80%;
        padding-right: 0;
        padding-bottom: 10px;
        float: none;
        order: 1;
    }
`;

export const EmploymentPosition = styled.h3`
    font-size: 18px;
    font-weight: normal;
    font-style: italic;
    width: 55%;
    padding-left: 7%;
    padding-right: 10%;
    padding-bottom: 30px;
    float: left;

    @media screen and (max-width: ${MOBILE_WIDTH}px) {
        width: 80%;
        float: none;
        padding-bottom: 10px;
        order: 2;
    }
`;

export const EmploymentPeriod = styled.p`
    width: 30%;
    padding-left: 3%;
    padding-right: 5%;
    padding-top: 5%;
    padding-bottom: 15px;
    float: left;
    text-align: right;

    @media screen and (max-width: ${MOBILE_WIDTH}px) {
        padding-top: 0;
        float: none;
        order: 3;
        display: block;
        width: 80%;
        text-align: left;
        font-size: 18px;
        font-weight: normal;
        padding-bottom: 20px;
        padding-left: 7%;
    }
`;
