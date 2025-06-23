// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Scroll to Top Button
const scrollToTopBtn = document.getElementById("scrollToTopBtn");

window.onscroll = function() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        scrollToTopBtn.style.display = "block";
    } else {
        scrollToTopBtn.style.display = "none";
    }
};

scrollToTopBtn.addEventListener('click', function() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
});

// Show More Button
const showMoreBtn = document.getElementById("showMoreBtn");
const projectCards = document.querySelectorAll(".project-card");
let visibleProjects = 3; // Initially show 3 projects

showMoreBtn.addEventListener("click", function() {
    visibleProjects += 1; // Show next project

    // Show project
    if (visibleProjects <= projectCards.length) {
        projectCards[visibleProjects - 1].style.display = "block"; // Set display to block for the newly visible project
    }

    // Hide the "Show More" button if all projects are visible
    if (visibleProjects >= projectCards.length) {
        showMoreBtn.style.display = "none";
    }
});

//Hamburger Menu
document.querySelector('.hamburger').addEventListener('click', function() {
        document.querySelector('.navbar-menu').classList.toggle('active');
    });

// Active Navbar Link Highlight
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  let current = '';

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href').includes(current)) {
      link.classList.add('active');
    }
  });
});

// Experience Section Expansion
const experienceTitles = document.querySelectorAll('.experience-title');

experienceTitles.forEach(title => {
    title.addEventListener('click', function() {
        const experienceItem = this.parentNode;
        const allExperienceItems = document.querySelectorAll('.experience-item');

        // Close any other open items
        allExperienceItems.forEach(item => {
            if (item !== experienceItem) {
                item.classList.remove('active');
            }
        });

        // Toggle the clicked item
        experienceItem.classList.toggle('active');
    });
});