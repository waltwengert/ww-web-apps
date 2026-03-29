import React, { useEffect, useState } from 'react';
import { faGithub, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';
import { faPlayCircle } from '@fortawesome/free-solid-svg-icons';

import avatarImage from '../assets/ww.gif';
import {
    getScrollHeights,
    NAV_ITEMS,
    SECTION_IDS,
    SectionId
} from './portfolio.constants';
import {
    AboutBody,
    AboutHeading,
    AboutTile,
    Avatar,
    ButtonsBar,
    EducationFocus,
    EducationInstitution,
    EducationLevel,
    EducationPeriod,
    EducationTile,
    EmploymentEmployer,
    EmploymentPeriod,
    EmploymentPosition,
    EmploymentTile,
    Header,
    IconRow,
    MailLink,
    NameHeading,
    NavButton,
    NavIcon,
    ProjectAbout,
    ProjectButtonWrap,
    ProjectHeading,
    ProjectImage,
    ProjectImageWrap,
    ProjectLink,
    ProjectLinkIcon,
    ProjectsTile,
    ProjectTech,
    ProjectTextWrap,
    Section,
    SocialIcon,
    SocialIconLink
} from './portfolio.styles';
import { data } from './portfolioData';

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
                <Avatar id="ww" alt="ww" src={avatarImage} />
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
