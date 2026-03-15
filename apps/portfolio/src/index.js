window.onload = function () {
  populatePage();
  toggleBtn(0, true);
};

//detect a scroll anywhere on the page
document.addEventListener(
  "scroll",
  function (e) {
    //assign heading and buttons height based on device size
    var headingHeight = 0;
    var buttonsHeight = 0;
    if (window.innerWidth >= 1400) {
      //full screen
      headingHeight = 310;
      buttonsHeight = 78;
    } else if (window.innerWidth >= 600) {
      //medium screen
      headingHeight = 280;
      buttonsHeight = 78;
    } else {
      //small (mobile) screen
      headingHeight = 250;
      buttonsHeight = 54;
    }

    buttons = document.getElementById("btns");
    buttons.style.position = "absolute";
    buttons.style.top = headingHeight + "px";

    //if the user has scrolled past the heading set fixed top to 0,
    //otherwise set it to the amount scrolled down the heading
    if (window.scrollY > headingHeight) {
      buttons.style.position = "fixed";
      buttons.style.top = "0";
    }

    //the IDs for each button and its corresponding div
    var btns = ["btnAbout", "btnProj", "btnEdu", "btnEmp"];
    var divs = ["about", "projects", "education", "employment"];

    for (var i = 0; i < divs.length; i++) {
      var divTop = document.getElementById(divs[i]).offsetTop - buttonsHeight;
      var divBottom = divTop + document.getElementById(divs[i]).offsetHeight; //else scrolling through the heading so do nothing

      //offset of 40 counteracts padding between divs
      if (window.scrollY >= divTop - 40 && window.scrollY < divBottom - 40) {
        //scrolling through this div
        document.getElementById(btns[i]).classList.add("btn-active");
        document.getElementById(btns[i]).focus();
      } else if (window.scrollY >= headingHeight) {
        //scrolling past the heading but not in this div
        document.getElementById(btns[i]).classList.remove("btn-active");
      }
    }
  },
  true
);

function toggleBtn(btnID, firstLoad) {
  var btnsHeight = 0;
  if (window.innerWidth >= 600) {
    //if the browser is desktop 
    btnsHeight = 78;
  } else {
    //otherwise the browser is mobile 
    btnsHeight = 54;
  }

  //btnID for each button corresponds with index of its div
  var divs = ["about", "projects", "education", "employment"];

  //no need to scroll on page load as user hasn't made an action
  if (!firstLoad) {
    var elementYOff = document.getElementById(divs[btnID]).offsetTop;
    //scroll to the top of the selected section taking buttons into account
    window.scroll({ top: elementYOff - btnsHeight, behavior: "auto" });
    //scroll behaviour "smooth" looks nice but low support
  }
}

function populatePage() {
  var jsonData = data; //the JSON data that is a stand-in for an API response

  //populate the heading
  var heading = jsonData.heading;
  document.getElementById("name").innerHTML = heading.name;
  document.getElementById("ww").src = heading.imgSource;
  document.getElementById("mail").href = heading.mailLink;
  document.getElementById("mail").innerHTML = heading.mailText;
  document.getElementById("github").href = heading.githubLink;
  document.getElementById("linkedin").href = heading.linkedinLink;

  //populate all the sections
  populateAbout(jsonData);
  populateProjects(jsonData);
  populateEducation(jsonData);
  populateEmployment(jsonData);
}

function populateAbout(jsonData) {
  //populate the about section
  var about = jsonData.about;

  for (var i = 0; i < about.length; i++) {
    //each about tile is a simple <h2> heading for the first word or two stored
    //and a <p> paragraph
    var aboutTile = document.createElement("div");
    aboutTile.classList.add("tile");
    if (i == about.length - 1) {
      aboutTile.classList.add("lastTile");
    }
    document.getElementById("about").append(aboutTile);

    var aboutHeading = document.createElement("h2");
    aboutHeading.innerHTML = about[i].heading;
    aboutTile.append(aboutHeading);

    var aboutBody = document.createElement("p");
    aboutBody.innerHTML = about[i].body;
    aboutTile.append(aboutBody);
  }
}

function populateProjects(jsonData) {
  //populate the projects section
  var projects = jsonData.projects;

  for (var i = 0; i < projects.length; i++) {
    //each project tile has a <h2> title, and to the right of it a <h3> tech
    //beneath these a screen shot img, and to the far right a github link
    var projectTile = document.createElement("div");
    projectTile.classList.add("tile");
    projectTile.classList.add("projTile");
    if (i == projects.length - 1) {
      projectTile.classList.add("lastTile");
    }
    document.getElementById("projects").append(projectTile);

    //divs/columns for tile content
    var imgDiv = document.createElement("div");
    imgDiv.classList.add("imgDiv");
    var txtDiv = document.createElement("div");
    txtDiv.classList.add("txtDiv");
    var btnDiv = document.createElement("div");
    btnDiv.classList.add("btnDiv");
    projectTile.append(imgDiv);
    projectTile.append(txtDiv);
    projectTile.append(btnDiv);

    var projectScreen = document.createElement("img");
    projectScreen.classList.add("projScreen");
    projectScreen.src = projects[i].screen;
    imgDiv.append(projectScreen);

    var projectTitle = document.createElement("h2");
    projectTitle.innerHTML = projects[i].title;
    txtDiv.append(projectTitle);

    var projectTech = document.createElement("h3");
    projectTech.classList.add("subheading");
    projectTech.innerHTML = projects[i].tech;
    txtDiv.append(projectTech);

    var projectAbout = document.createElement("p");
    projectAbout.innerHTML = projects[i].about;
    txtDiv.append(projectAbout);

    var linkIcon = document.createElement("i");
    linkIcon.classList.add("fab");
    linkIcon.classList.add("fa-github");
    linkIcon.classList.add("projLink");
    var projectLink = document.createElement("a");
    projectLink.href = projects[i].link;
    projectLink.innerHTML = linkIcon.outerHTML;
    btnDiv.append(projectLink);

    if (projects[i].play != "na") {
      var lI = document.createElement("i");
      lI.classList.add("fas");
      lI.classList.add("fa-play-circle");
      lI.classList.add("projLink");
      var projectPlay = document.createElement("a");
      projectPlay.href = projects[i].play;
      projectPlay.innerHTML = lI.outerHTML;
      btnDiv.append(projectPlay);
    }
  }
}

function populateEducation(jsonData) {
  //populate the education section
  var education = jsonData.education;

  for (var i = 0; i < education.length; i++) {
    //each education tile has a <h2> level, and beneath it a <h3> focus
    //and two <h4> institution and period on the right hand side
    var eduTile = document.createElement("div");
    eduTile.classList.add("tile");
    if (i == education.length - 1) {
      eduTile.classList.add("lastTile");
    }
    document.getElementById("education").append(eduTile);

    var eduLevel = document.createElement("h2");
    eduLevel.innerHTML = education[i].level;
    eduTile.append(eduLevel);

    var eduInstitution = document.createElement("h4");
    eduInstitution.classList.add("eduInstitution");
    eduInstitution.innerHTML = education[i].institution;
    eduTile.append(eduInstitution);

    var eduFocus = document.createElement("h3");
    eduFocus.classList.add("subheading");
    eduFocus.innerHTML = education[i].focus;
    eduTile.append(eduFocus);

    var eduPeriod = document.createElement("h4");
    eduPeriod.innerHTML = education[i].period;
    eduTile.append(eduPeriod);
  }
}

function populateEmployment(jsonData) {
  //populate the employment section
  var employment = jsonData.employment;

  for (var i = 0; i < employment.length; i++) {
    //each employment tile has a <h2> employer, and beneath it has
    //two <h3>'s; position and period which are left and right alligned respectively
    var empTile = document.createElement("div");
    if (i == employment.length - 1) {
      empTile.classList.add("lastTile");
    }
    empTile.classList.add("tile");
    document.getElementById("employment").append(empTile);

    var empEmployer = document.createElement("h2");
    empEmployer.innerHTML = employment[i].employer;
    empTile.append(empEmployer);

    var empPeriod = document.createElement("h4");
    empPeriod.innerHTML = employment[i].period;
    empTile.append(empPeriod);

    var empPosition = document.createElement("h3");
    empPosition.innerHTML = employment[i].position;
    empTile.append(empPosition);
  }
}
