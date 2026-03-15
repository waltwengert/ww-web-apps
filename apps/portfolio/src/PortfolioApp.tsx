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

import { data } from './portfolioData';

const SECTION_IDS = ['about', 'projects', 'education', 'employment'] as const;

type SectionId = (typeof SECTION_IDS)[number];

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
            <div className="heading" style={{ textAlign: 'center' }}>
                <h1 id="name">{data.heading.name}</h1>
                <img
                    id="ww"
                    className="img-circle"
                    alt="ww"
                    src="assets/ww.gif"
                />
                <a id="mail" href={data.heading.mailLink} target="_top">
                    {data.heading.mailText}
                </a>
                <div className="icons">
                    <a
                        id="github"
                        className="text-center"
                        target="_blank"
                        href={data.heading.githubLink}
                        rel="noreferrer"
                    >
                        <FontAwesomeIcon
                            icon={faGithub}
                            className="socialIcon"
                        />
                    </a>
                    <a
                        id="linkedin"
                        className="text-center"
                        target="_blank"
                        href={data.heading.linkedinLink}
                        rel="noreferrer"
                    >
                        <FontAwesomeIcon
                            icon={faLinkedinIn}
                            className="socialIcon"
                        />
                    </a>
                </div>
            </div>

            <div
                id="btns"
                className="buttons"
                style={{
                    position: buttonsFixed ? 'fixed' : 'absolute',
                    top: buttonsFixed ? '0px' : `${buttonsTopPx}px`
                }}
            >
                {NAV_ITEMS.map(item => (
                    <button
                        key={item.id}
                        id={item.buttonId}
                        type="button"
                        className={`btn btn-info ${activeSection === item.id ? 'btn-active' : ''}`}
                        onClick={() => scrollToSection(item.id)}
                    >
                        <FontAwesomeIcon icon={item.icon} className="navIcon" />
                        <br />
                        {item.label}
                    </button>
                ))}
            </div>

            <div id="about" className="section">
                {data.about.map(
                    (item, index): React.ReactElement => (
                        <div
                            key={`about-${index}`}
                            className={`tile ${index === data.about.length - 1 ? 'lastTile' : ''}`}
                        >
                            <h2>{item.heading}</h2>
                            <p>{item.body}</p>
                        </div>
                    )
                )}
            </div>

            <div id="projects" className="section">
                {data.projects.map(
                    (project, index): React.ReactElement => (
                        <div
                            key={`project-${index}`}
                            className={`tile projTile ${index === data.projects.length - 1 ? 'lastTile' : ''}`}
                        >
                            <div className="imgDiv">
                                <img
                                    className="projScreen"
                                    src={project.screen}
                                    alt={project.title}
                                />
                            </div>
                            <div className="txtDiv">
                                <h2>{project.title}</h2>
                                <h3 className="subheading">{project.tech}</h3>
                                <p>{project.about}</p>
                            </div>
                            <div className="btnDiv">
                                <a
                                    href={project.link}
                                    target="_blank"
                                    rel="noreferrer"
                                    aria-label={`${project.title} GitHub`}
                                >
                                    <FontAwesomeIcon
                                        icon={faGithub}
                                        className="projLink"
                                    />
                                </a>
                                {project.play !== 'na' ? (
                                    <a
                                        href={project.play}
                                        target="_blank"
                                        rel="noreferrer"
                                        aria-label={`${project.title} Live`}
                                    >
                                        <FontAwesomeIcon
                                            icon={faPlayCircle}
                                            className="projLink"
                                        />
                                    </a>
                                ) : null}
                            </div>
                        </div>
                    )
                )}
            </div>

            <div id="education" className="section">
                {data.education.map(
                    (item, index): React.ReactElement => (
                        <div
                            key={`education-${index}`}
                            className={`tile ${index === data.education.length - 1 ? 'lastTile' : ''}`}
                        >
                            <h2>{item.level}</h2>
                            <h4 className="eduInstitution">
                                {item.institution}
                            </h4>
                            <h3 className="subheading">{item.focus}</h3>
                            <h4>{item.period}</h4>
                        </div>
                    )
                )}
            </div>

            <div id="employment" className="section">
                {data.employment.map(
                    (item, index): React.ReactElement => (
                        <div
                            key={`employment-${index}`}
                            className={`tile ${index === data.employment.length - 1 ? 'lastTile' : ''}`}
                        >
                            <h2>{item.employer}</h2>
                            <h4>{item.period}</h4>
                            <h3>{item.position}</h3>
                        </div>
                    )
                )}
            </div>
        </>
    );
};

export default App;
