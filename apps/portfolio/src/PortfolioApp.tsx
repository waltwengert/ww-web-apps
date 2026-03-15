import React, { useEffect, useState } from 'react';
import {
    faGithub,
    faLinkedinIn,
    IconDefinition
} from '@fortawesome/free-brands-svg-icons';
import {
    faAddressCard,
    faBriefcase,
    faKeyboard,
    faPlayCircle,
    faUserGraduate
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled, { css } from 'styled-components';

import { Portfolio as PortfolioColors } from '@ww-web-apps/ui';

import { data } from './portfolioData';

const SECTION_IDS = ['about', 'projects', 'education', 'employment'] as const;

type SectionId = (typeof SECTION_IDS)[number];

const MOBILE_WIDTH = 600;
const WIDE_WIDTH = 1400;

const Header = styled.div`
    background-color: ${PortfolioColors.Background};
    width: 100%;
    position: fixed;
    top: 0;
    z-index: -3;
    text-align: center;
`;

const NameHeading = styled.h1`
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

const Avatar = styled.img`
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

const MailLink = styled.a`
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

const IconRow = styled.div``;

const SocialIconLink = styled.a`
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

const SocialIcon = styled(FontAwesomeIcon)`
    font-size: 30px;
    padding-left: 10px;
    padding-right: 10px;
    padding-top: 8px;

    @media screen and (max-width: ${MOBILE_WIDTH}px) {
        padding-top: 13px;
    }
`;

const ButtonsBar = styled.div<{ $fixed: boolean; $topPx: number }>`
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

const NavButton = styled.button<{ $active: boolean }>`
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

const NavIcon = styled(FontAwesomeIcon)`
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

const Section = styled.section<{ $zIndex: number; $isAbout?: boolean }>`
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

const Tile = styled.div<{ $isLast: boolean }>`
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

const AboutTile = styled(Tile)``;

const AboutHeading = styled.h2`
    padding-top: 25px;
    padding-bottom: 10px;
    padding-left: 7%;
`;

const AboutBody = styled.p`
    font-size: 18px;
    padding-bottom: 30px;
    padding-left: 7%;
    padding-right: 7%;

    strong {
        font-weight: bolder;
        color: ${PortfolioColors.TileText};
    }
`;

const ProjectsTile = styled(Tile)`
    display: flex;
`;

const ProjectImageWrap = styled.div`
    flex: 4;
    text-align: center;
`;

const ProjectTextWrap = styled.div`
    flex: 6;
`;

const ProjectButtonWrap = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    text-align: center;
`;

const ProjectImage = styled.img`
    max-width: 90%;
    margin: 10px;
    object-fit: cover;
    object-position: top;
    box-shadow: 3px 3px 3px ${PortfolioColors.Muted};

    @media screen and (max-width: ${MOBILE_WIDTH}px) {
        box-shadow: 1px 1px 1px ${PortfolioColors.Muted};
    }
`;

const ProjectHeading = styled.h2`
    padding: 10px;

    @media screen and (max-width: ${MOBILE_WIDTH}px) {
        padding-top: 5%;
    }
`;

const ProjectTech = styled.h3`
    font-size: 18px;
    font-style: italic;
    font-weight: normal;
    padding-left: 10px;

    @media screen and (max-width: ${MOBILE_WIDTH}px) {
        padding-bottom: 6%;
    }
`;

const ProjectAbout = styled.p`
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

const ProjectLink = styled.a`
    text-decoration: none;
`;

const ProjectLinkIcon = styled(FontAwesomeIcon)`
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

const EducationTile = styled(Tile)`
    @media screen and (max-width: ${MOBILE_WIDTH}px) {
        display: flex;
        flex-direction: column;
    }
`;

const EducationLevel = styled.h2`
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

const EducationFocus = styled.h3`
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

const EducationPeriod = styled.h4`
    width: 20%;
    padding-left: 3%;
    padding-right: 5%;
    float: left;
    text-align: right;

    @media screen and (max-width: ${MOBILE_WIDTH}px) {
        display: none;
    }
`;

const EducationInstitution = styled.h3`
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

const EmploymentTile = styled(Tile)`
    @media screen and (max-width: ${MOBILE_WIDTH}px) {
        display: flex;
        flex-direction: column;
    }
`;

const EmploymentEmployer = styled.h2`
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

const EmploymentPosition = styled.h3`
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

const EmploymentPeriod = styled.p`
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

// Portfolio currently standardizes on Font Awesome icon classes.
const NAV_ITEMS: Array<{
    id: SectionId;
    buttonId: string;
    label: string;
    icon: IconDefinition;
}> = [
    {
        id: 'about',
        buttonId: 'btnAbout',
        label: 'About',
        icon: faAddressCard
    },
    {
        id: 'projects',
        buttonId: 'btnProj',
        label: 'Projects',
        icon: faKeyboard
    },
    {
        id: 'education',
        buttonId: 'btnEdu',
        label: 'Education',
        icon: faUserGraduate
    },
    {
        id: 'employment',
        buttonId: 'btnEmp',
        label: 'Employment',
        icon: faBriefcase
    }
];

const getScrollHeights = (): {
    headingHeight: number;
    buttonsHeight: number;
} => {
    if (window.innerWidth >= 1400) {
        return { headingHeight: 310, buttonsHeight: 78 };
    }

    if (window.innerWidth >= 600) {
        return { headingHeight: 280, buttonsHeight: 78 };
    }

    return { headingHeight: 250, buttonsHeight: 54 };
};

const App = (): React.ReactElement => {
    const [activeSection, setActiveSection] = useState<SectionId>('about');
    const [buttonsFixed, setButtonsFixed] = useState(false);
    const [buttonsTopPx, setButtonsTopPx] = useState(280);

    const scrollToSection = (sectionId: SectionId): void => {
        const element = document.getElementById(sectionId);
        if (!element) {
            return;
        }

        setActiveSection(sectionId);

        const { buttonsHeight } = getScrollHeights();
        const maxScrollTop =
            document.documentElement.scrollHeight - window.innerHeight;
        window.scroll({
            top: Math.max(
                0,
                Math.min(element.offsetTop - buttonsHeight, maxScrollTop)
            ),
            behavior: 'auto'
        });
    };

    useEffect((): (() => void) => {
        const onScrollOrResize = (): void => {
            const { headingHeight, buttonsHeight } = getScrollHeights();
            setButtonsTopPx(headingHeight);
            setButtonsFixed(window.scrollY > headingHeight);

            let nextSection: SectionId = 'about';
            let bestScore = -1;
            let bestVisiblePx = -1;

            const viewportTop = buttonsHeight;
            const viewportBottom = window.innerHeight;

            for (const sectionId of SECTION_IDS) {
                const section = document.getElementById(sectionId);
                if (!section) {
                    continue;
                }

                const rect = section.getBoundingClientRect();
                const visiblePx =
                    Math.min(rect.bottom, viewportBottom) -
                    Math.max(rect.top, viewportTop);

                if (visiblePx <= 0) {
                    continue;
                }

                // Ratio favors short sections (e.g. Education) when they are
                // mostly visible, while visiblePx breaks ties naturally.
                const sectionHeight = Math.max(rect.height, 1);
                const score = visiblePx / sectionHeight;

                if (
                    score > bestScore ||
                    (score === bestScore && visiblePx > bestVisiblePx)
                ) {
                    bestScore = score;
                    bestVisiblePx = visiblePx;
                    nextSection = sectionId;
                }
            }

            setActiveSection(
                (prev): SectionId => (prev === nextSection ? prev : nextSection)
            );
        };

        onScrollOrResize();
        window.addEventListener('scroll', onScrollOrResize, true);
        window.addEventListener('resize', onScrollOrResize);

        return (): void => {
            window.removeEventListener('scroll', onScrollOrResize, true);
            window.removeEventListener('resize', onScrollOrResize);
        };
    }, []);

    return (
        <>
            <Header>
                <NameHeading id="name">{data.heading.name}</NameHeading>
                <Avatar id="ww" alt="ww" src="assets/ww.gif" />
                <MailLink id="mail" href={data.heading.mailLink} target="_top">
                    {data.heading.mailText}
                </MailLink>
                <IconRow>
                    <SocialIconLink
                        id="github"
                        className="text-center"
                        target="_blank"
                        href={data.heading.githubLink}
                        rel="noreferrer"
                        aria-label="GitHub"
                    >
                        <SocialIcon icon={faGithub} />
                    </SocialIconLink>
                    <SocialIconLink
                        id="linkedin"
                        className="text-center"
                        target="_blank"
                        href={data.heading.linkedinLink}
                        rel="noreferrer"
                        aria-label="LinkedIn"
                    >
                        <SocialIcon icon={faLinkedinIn} />
                    </SocialIconLink>
                </IconRow>
            </Header>

            <ButtonsBar
                id="btns"
                className="buttons"
                $fixed={buttonsFixed}
                $topPx={buttonsTopPx}
            >
                {NAV_ITEMS.map(item => (
                    <NavButton
                        key={item.id}
                        id={item.buttonId}
                        type="button"
                        className="btn btn-info"
                        $active={activeSection === item.id}
                        onClick={() => scrollToSection(item.id)}
                    >
                        <NavIcon icon={item.icon} />
                        <br />
                        {item.label}
                    </NavButton>
                ))}
            </ButtonsBar>

            <Section id="about" $zIndex={-5} $isAbout>
                {data.about.map(
                    (item, index): React.ReactElement => (
                        <AboutTile
                            key={`about-${index}`}
                            $isLast={index === data.about.length - 1}
                        >
                            <AboutHeading>{item.heading}</AboutHeading>
                            <AboutBody>{item.body}</AboutBody>
                        </AboutTile>
                    )
                )}
            </Section>

            <Section id="projects" $zIndex={-4}>
                {data.projects.map(
                    (project, index): React.ReactElement => (
                        <ProjectsTile
                            key={`project-${index}`}
                            $isLast={index === data.projects.length - 1}
                        >
                            <ProjectImageWrap>
                                <ProjectImage
                                    src={project.screen}
                                    alt={project.title}
                                />
                            </ProjectImageWrap>
                            <ProjectTextWrap>
                                <ProjectHeading>{project.title}</ProjectHeading>
                                <ProjectTech>{project.tech}</ProjectTech>
                                <ProjectAbout>{project.about}</ProjectAbout>
                            </ProjectTextWrap>
                            <ProjectButtonWrap>
                                <ProjectLink
                                    href={project.link}
                                    target="_blank"
                                    rel="noreferrer"
                                    aria-label={`${project.title} GitHub`}
                                >
                                    <ProjectLinkIcon icon={faGithub} />
                                </ProjectLink>
                                {project.play !== 'na' ? (
                                    <ProjectLink
                                        href={project.play}
                                        target="_blank"
                                        rel="noreferrer"
                                        aria-label={`${project.title} Live`}
                                    >
                                        <ProjectLinkIcon icon={faPlayCircle} />
                                    </ProjectLink>
                                ) : null}
                            </ProjectButtonWrap>
                        </ProjectsTile>
                    )
                )}
            </Section>

            <Section id="education" $zIndex={-3}>
                {data.education.map(
                    (item, index): React.ReactElement => (
                        <EducationTile
                            key={`education-${index}`}
                            $isLast={index === data.education.length - 1}
                        >
                            <EducationLevel>{item.level}</EducationLevel>
                            <EducationInstitution>
                                {item.institution}
                            </EducationInstitution>
                            <EducationFocus>{item.focus}</EducationFocus>
                            <EducationPeriod>{item.period}</EducationPeriod>
                        </EducationTile>
                    )
                )}
            </Section>

            <Section id="employment" $zIndex={-2}>
                {data.employment.map(
                    (item, index): React.ReactElement => (
                        <EmploymentTile
                            key={`employment-${index}`}
                            $isLast={index === data.employment.length - 1}
                        >
                            <EmploymentEmployer>
                                {item.employer}
                            </EmploymentEmployer>
                            <EmploymentPeriod>{item.period}</EmploymentPeriod>
                            <EmploymentPosition>
                                {item.position}
                            </EmploymentPosition>
                        </EmploymentTile>
                    )
                )}
            </Section>
        </>
    );
};

export default App;
