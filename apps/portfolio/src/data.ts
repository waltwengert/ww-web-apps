export interface HeadingData {
    name: string;
    imgSource: string;
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
        name: '<NAME>',
        imgSource: 'assets/<AVATAR_IMAGE>',
        mailLink: 'mailto:<EMAIL_ADDRESS>',
        mailText: '<ALIAS>@<EMAIL_DOMAIN>',
        githubLink: 'https://github.com/<GITHUB_USERNAME>',
        linkedinLink: 'https://www.linkedin.com/in/<LINKEDIN_USERNAME>/'
    },
    about: [
        {
            heading: '<ABOUT_HEADING>',
            body: '<ABOUT_BODY>'
        }
    ],
    projects: [
        {
            screen: 'assets/<PROJECT_SCREENSHOT>',
            title: '<PROJECT_TITLE>',
            tech: '<PROJECT_TECH>',
            about: '<PROJECT_DESCRIPTION>',
            link: '<PROJECT_LINK>',
            play: '<HOST_LINK>'
        }
    ],
    education: [
        {
            level: '<EDUCATION_LEVEL>',
            focus: '<EDUCATION_FOCUS>',
            institution: '<EDUCATION_INSTITUTION>',
            period: '<EDUCATION_END_DATE>'
        }
    ],
    employment: [
        {
            employer: '<EMPLOYER>',
            position: '<POSITION>',
            period: '<START_DATE> — <END_DATE>'
        }
    ]
};
