//js file rather than json so it can be read from index.js without the need for hosting this file
//this data is a stand-in for an API response data to populate the HTML page
var data = {
  heading: {
    name: "<NAME>",
    imgSource: "assets/<AVATAR_IMAGE>",
    mailLink: "mailto:<EMAIL_ADDRESS>",
    mailText: "<ALIAS>@<EMAIL_DOMAIN>",
    githubLink: "https://github.com/<GITHUB_USERNAME>",
    linkedinLink: "https://www.linkedin.com/in/<LINKEDIN_USERNAME>/",
  },
  about: [
    {
      heading: "<ABOUT_HEADING>",
      body:
        "<ABOUT_BODY>",
    },
  ],
  projects: [
    {
      screen: "assets/<PROJECT_SCREENSHOT>",
      title: "<PROJECT_TITLE>",
      tech: "<PROJECT_TECH>",
      about: "<PROJECT_DESCRIPTION>",
      link: "<PROJECT_LINK>",
      play: "<HOST_LINK>",
    },
  ],
  education: [
    {
      level: "<EDUCATION_LEVEL>",
      focus: "<EDUCATION_FOCUS>",
      institution: "<EDUCATION_INSTITUTION>",
      period: "<EDUCATION_END_DATE>",
    },
  ],
  employment: [
    {
      employer: "<EMPLOYER>",
      position: "<POSITION>",
      period: "<START_DATE> &mdash; <END_DATE>",
    },
  ],
};
