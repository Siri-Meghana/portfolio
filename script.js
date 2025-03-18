const canvas = document.getElementById('revealCanvas');
const ctx = canvas.getContext('2d');

// // Function for Progressive Reveal (Squares) - for mobile view
// function progressiveReveal() {
//     const revealInterval = 50; // Time in milliseconds between each reveal step
//     const revealSize = 80; // Size of each square reveal step (both width and height)
//     let currentX = 0;
//     let currentY = 0;

//     const revealStep = () => {
//         ctx.globalCompositeOperation = 'destination-out';
//         ctx.fillStyle = 'white';
//         ctx.fillRect(currentX, currentY, revealSize, revealSize);

//         currentX += revealSize;
//         if (currentX > canvas.width) {
//             currentX = 0;
//             currentY += revealSize;
//         }

//         if (currentY <= canvas.height) {
//             setTimeout(revealStep, revealInterval);
//         }
//     };

//     revealStep();
// }

let isRevealing = false; // Flag to track if the reveal effect is running

function progressiveReveal() {
    const revealInterval = 50; // Time between each reveal step
    const revealSize = 60; // Size of each square reveal step (both width and height)
    let currentX = 0;
    let currentY = 0;

    const revealStep = () => {
        if (currentY > canvas.height) return; // Stop the loop if the entire canvas is revealed

        ctx.globalCompositeOperation = 'destination-out';
        ctx.fillStyle = 'white';
        ctx.fillRect(currentX, currentY, revealSize, revealSize);

        currentX += revealSize;
        if (currentX >= canvas.width) {
            currentX = 0;
            currentY += revealSize;
        }

        setTimeout(revealStep, revealInterval); // Continue the reveal effect at set intervals
    };

    revealStep(); // Start the reveal effect
}

canvas.addEventListener('touchstart', (event) => {
    if (!isRevealing) { // Check if the reveal effect is not running
        isRevealing = true; // Mark that the effect is now running
        progressiveReveal(); // Trigger the reveal effect
        event.preventDefault(); // Prevent default scroll behavior while effect is running
    }
}, { passive: false });

canvas.addEventListener('touchend', () => {
    // After touch ends, allow scrolling and reset the reveal flag
    setTimeout(() => {
        isRevealing = false; // Reset flag after reveal effect completes
    }, 200); // Slight delay to ensure the reveal completes before allowing scrolling
});


// Function for Erasing on Mouse Move - for desktop view
function eraseOnMouseMove(event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 80, 0, Math.PI * 2);
    ctx.fill();
}

// Resize canvas on window resize
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = document.querySelector('.reveal-container').offsetHeight;
    drawWhiteLayer();
}

function drawWhiteLayer() {
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Listen for mobile touchstart event to reveal squares
// canvas.addEventListener('touchstart', (event) => {
//     if (window.innerWidth <= 768) {  // Check for mobile screen size
//         event.preventDefault();
//         progressiveReveal();
//     }
// }, { passive: false });

// Listen for mousemove event to erase on desktop
if (window.innerWidth > 768) {  // Check for desktop screen size
    canvas.addEventListener('mousemove', eraseOnMouseMove);
}

// Run on page load
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Parallax Effect
window.addEventListener('scroll', function() {
    let scrollPosition = window.scrollY;
    document.querySelector('.parallax-bg').style.transform = `translateY(${scrollPosition * 0.5}px)`;
});

// Reveal Sections on Scroll
function revealSections() {
    const sections = document.querySelectorAll('section');
    const triggerBottom = window.innerHeight * 0.85;

    sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        if (sectionTop < triggerBottom) {
            section.classList.add('visible');
        }
    });
}

document.querySelectorAll(".skill-card").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
        let rect = card.getBoundingClientRect();
        let x = (e.clientX - rect.left) / rect.width - 0.5;
        let y = (e.clientY - rect.top) / rect.height - 0.5;

        let rotateX = y * 70; // Controls the tilt on Y-axis
        let rotateY = x * -70; // Controls the tilt on X-axis

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
        card.style.transition = "transform 0.1s ease-out"; // Smoother animation
    });

    card.addEventListener("mouseleave", () => {
        card.style.transform = "rotateX(0deg) rotateY(0deg) scale(1)";
        card.style.transition = "transform 0.5s ease-out"; // Smooth return
    });
});

function openTab(evt, tabName) {
    // Hide all tab contents
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
        content.classList.remove('active');
    });

    // Remove active class from all tabs
    const tabLinks = document.querySelectorAll('.tablinks');
    tabLinks.forEach(link => {
        link.classList.remove('active');
    });

    // Show the content for the clicked tab and set it active
    document.getElementById(tabName).classList.add('active');
    evt.currentTarget.classList.add('active');
}

// Set default tab (simulate a click event to show the first tab by default)
document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('.tablinks').click(); // Trigger the first tab on page load
});

window.addEventListener('scroll', revealSections);
revealSections(); // Run on page load
