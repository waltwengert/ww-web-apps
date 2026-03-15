export interface HeadingData {
    name: string;
    mailLink: string;
    mailText: string;
    githubLink: string;
    linkedinLink: string;
}

export interface AboutData {
    heading: string;
    body: string;
}

export interface ProjectData {
    screen: string;
    title: string;
    tech: string;
    about: string;
    link: string;
    play: string;
}

export interface EducationData {
    level: string;
    focus: string;
    institution: string;
    period: string;
}

export interface EmploymentData {
    employer: string;
    position: string;
    period: string;
}

export interface PortfolioData {
    heading: HeadingData;
    about: AboutData[];
    projects: ProjectData[];
    education: EducationData[];
    employment: EmploymentData[];
}

export const data: PortfolioData = {
    heading: {
        name: 'Walt Wengert',
        mailLink: 'mailto:hello@example.com',
        mailText: 'hello@example.com',
        githubLink: 'https://github.com/waltwengert',
        linkedinLink: 'https://www.linkedin.com/in/example-profile/'
    },
    about: [
        {
            heading: 'About This Site',
            body: 'This portfolio uses intentionally generic profile content while still showcasing real projects and code quality work from this monorepo.'
        },
        {
            heading: 'About Me (Mock Profile)',
            body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. This section will be replaced with a real profile when needed.'
        }
    ],
    projects: [
        {
            screen: 'assets/secretsanta_Browser.png',
            title: 'Secret Santa',
            tech: 'React, TypeScript, Vite, styled-components',
            about: 'Randomized Secret Santa pairing tool with optional encrypted links for sharing assignments.',
            link: 'https://github.com/waltwengert/ww-web-apps/tree/master/apps/secret-santa',
            play: 'na'
        },
        {
            screen: 'assets/portfolio_Browser.png',
            title: 'Portfolio Site',
            tech: 'React, TypeScript, Vite',
            about: 'Single-page portfolio with sticky section navigation and responsive tiles.',
            link: 'https://github.com/waltwengert/ww-web-apps/tree/master/apps/portfolio',
            play: 'na'
        },
        {
            screen: 'assets/calc.PNG',
            title: 'Future Weight Calculator',
            tech: 'React, TypeScript, Vitest',
            about: 'BMR, TDEE, and BMI calculator with reusable UI components and extracted domain logic.',
            link: 'https://github.com/waltwengert/ww-web-apps/tree/master/apps/future-weight',
            play: 'na'
        }
    ],
    education: [
        {
            level: 'Mock Degree',
            focus: 'Lorem Ipsum Engineering',
            institution: 'Placeholder Institute of Technology',
            period: '2019 - 2022'
        }
    ],
    employment: [
        {
            employer: 'Example Company Pty Ltd',
            position: 'Software Developer (Mock Role)',
            period: '2022 — Present'
        },
        {
            employer: 'Sample Solutions',
            position: 'Junior Developer (Mock Role)',
            period: '2020 — 2022'
        }
    ]
};
