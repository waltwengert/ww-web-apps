import React, { useEffect, useState } from 'react';

import { data } from './data';

const SECTION_IDS = ['about', 'projects', 'education', 'employment'] as const;

type SectionId = (typeof SECTION_IDS)[number];

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

        const { buttonsHeight } = getScrollHeights();
        window.scroll({
            top: element.offsetTop - buttonsHeight,
            behavior: 'auto'
        });
    };

    useEffect((): (() => void) => {
        const onScrollOrResize = (): void => {
            const { headingHeight, buttonsHeight } = getScrollHeights();
            setButtonsTopPx(headingHeight);
            setButtonsFixed(window.scrollY > headingHeight);

            let nextSection: SectionId = 'about';

            for (const sectionId of SECTION_IDS) {
                const section = document.getElementById(sectionId);
                if (!section) {
                    continue;
                }

                const top = section.offsetTop - buttonsHeight;
                const bottom = top + section.offsetHeight;

                if (
                    window.scrollY >= top - 40 &&
                    window.scrollY < bottom - 40
                ) {
                    nextSection = sectionId;
                    break;
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
                        <i className="fab fa-github" />
                    </a>
                    <a
                        id="linkedin"
                        className="text-center"
                        target="_blank"
                        href={data.heading.linkedinLink}
                        rel="noreferrer"
                    >
                        <i className="fab fa-linkedin-in" />
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
                <button
                    id="btnAbout"
                    type="button"
                    className={`btn btn-info ${activeSection === 'about' ? 'btn-active' : ''}`}
                    onClick={() => scrollToSection('about')}
                >
                    <i className="fas fa-address-card" />
                    <br />
                    About
                </button>
                <button
                    id="btnProj"
                    type="button"
                    className={`btn btn-info ${activeSection === 'projects' ? 'btn-active' : ''}`}
                    onClick={() => scrollToSection('projects')}
                >
                    <i className="fas fa-keyboard" />
                    <br />
                    Projects
                </button>
                <button
                    id="btnEdu"
                    type="button"
                    className={`btn btn-info ${activeSection === 'education' ? 'btn-active' : ''}`}
                    onClick={() => scrollToSection('education')}
                >
                    <i className="fas fa-user-graduate" />
                    <br />
                    Education
                </button>
                <button
                    id="btnEmp"
                    type="button"
                    className={`btn btn-info ${activeSection === 'employment' ? 'btn-active' : ''}`}
                    onClick={() => scrollToSection('employment')}
                >
                    <i className="fas fa-briefcase" />
                    <br />
                    Employment
                </button>
            </div>

            <div id="about" className="section">
                {data.about.map(
                    (item, index): React.ReactElement => (
                        <div
                            key={`about-${index}`}
                            className={`tile ${index === data.about.length - 1 ? 'lastTile' : ''}`}
                        >
                            <h2>{item.heading}</h2>
                            <p
                                dangerouslySetInnerHTML={{ __html: item.body }}
                            />
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
                                    <i className="fab fa-github projLink" />
                                </a>
                                {project.play !== 'na' ? (
                                    <a
                                        href={project.play}
                                        target="_blank"
                                        rel="noreferrer"
                                        aria-label={`${project.title} Live`}
                                    >
                                        <i className="fas fa-play-circle projLink" />
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
                            <h4
                                dangerouslySetInnerHTML={{
                                    __html: item.period
                                }}
                            />
                            <h3>{item.position}</h3>
                        </div>
                    )
                )}
            </div>
        </>
    );
};

export default App;
