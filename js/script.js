document.addEventListener("DOMContentLoaded", async () => {
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav-menu");
    const navLinks = document.querySelectorAll(".nav-link");
    const sections = document.querySelectorAll("main > section[id]");

    // --- FIX: Highlight nav link immediately on click ---
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // --- NEW: Smooth scroll for all anchor links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", function(e) {
            e.preventDefault();
            const targetId = this.getAttribute("href");
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: "smooth"
                });
            }
        });
    });

    // --- NEW: Highlight nav link on scroll ---
    const scrollObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                navLinks.forEach(link => {
                    link.classList.remove("active");
                    if (link.getAttribute("href") === `#${sectionId}`) {
                        link.classList.add("active");
                    }
                });
            }
        });
    }, {
        rootMargin: "-50% 0px -50% 0px"
    }); // Activates when the section is in the middle of the viewport

    sections.forEach(section => {
        scrollObserver.observe(section);
    });

    // --- UPDATED: Mobile navigation ---
    if (hamburger && navMenu) {
        hamburger.addEventListener("click", () => {
            hamburger.classList.toggle("active");
            navMenu.classList.toggle("active");
        });

        navLinks.forEach(link => {
            link.addEventListener("click", () => {
                hamburger.classList.remove("active");
                navMenu.classList.remove("active");
            });
        });
    }

    // Add scroll effect to navbar
    window.addEventListener("scroll", () => {
        const navbar = document.querySelector(".navbar");
        if (window.scrollY > 50) {
            navbar.style.background = "rgba(17, 24, 39, 0.95)";
        } else {
            navbar.style.background = "rgba(17, 24, 39, 0.9)";
        }
    });

    // Fade in animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
    };

    const fadeInObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("fade-in-up");
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll(".preview-card, .timeline-item, .skill-item, .interest-card, .certificate-card, .project-card, .web3-project-card, .tool-card").forEach((card) => {
        fadeInObserver.observe(card);
    });

    // Skills page animations
    const skillBars = document.querySelectorAll(".skill-progress");

    const animateSkillBars = (entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const skillBar = entry.target;
                const width = skillBar.getAttribute("data-width");
                skillBar.style.width = width;
                observer.unobserve(skillBar);
            }
        });
    };

    const skillObserver = new IntersectionObserver(animateSkillBars, {
        threshold: 0.5,
    });

    skillBars.forEach((bar) => {
        skillObserver.observe(bar);
    });

    // Certificate modal functionality
    const modal = document.getElementById("certificateModal");
    const modalImage = document.getElementById("modalImage");
    const closeModal = document.querySelector(".close");
    const viewButtons = document.querySelectorAll(".view-certificate");

    const certificateData = {
        cert1: "/aws-certification-certificate.png",
        cert2: "/react-certification-detailed-view.png",
        cert3: "/blockchain-certificate-detailed.png",
        cert4: "/google-cloud-certificate.png",
        cert5: "/javascript-certification-detailed-view.png",
        cert6: "/cybersecurity-certificate-detailed.png",
    };

    viewButtons.forEach((button) => {
        button.addEventListener("click", (e) => {
            e.preventDefault();
            const certId = button.getAttribute("data-cert");
            const imageSrc = certificateData[certId];

            if (imageSrc && modal && modalImage) {
                modalImage.src = imageSrc;
                modal.style.display = "block";
                document.body.style.overflow = "hidden";
            }
        });
    });

    const closeModalFunction = () => {
        if (modal) {
            modal.style.display = "none";
            document.body.style.overflow = "auto";
        }
    };

    if (closeModal) closeModal.addEventListener("click", closeModalFunction);
    if (modal) modal.addEventListener("click", (e) => {
        if (e.target === modal) closeModalFunction();
    });
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal && modal.style.display === "block") closeModalFunction();
    });

    const filterButtons = document.querySelectorAll(".filter-btn");
    const projectCards = document.querySelectorAll(".project-card");

    filterButtons.forEach((button) => {
        button.addEventListener("click", () => {
            filterButtons.forEach((btn) => btn.classList.remove("active"));
            button.classList.add("active");
            const filterValue = button.getAttribute("data-filter");
            projectCards.forEach((card) => {
                if (filterValue === "all" || card.getAttribute("data-category") === filterValue) {
                    card.style.display = "block";
                    setTimeout(() => {
                        card.style.opacity = "1";
                        card.style.transform = "translateY(0)";
                    }, 100);
                } else {
                    card.style.opacity = "0";
                    card.style.transform = "translateY(20px)";
                    setTimeout(() => {
                        card.style.display = "none";
                    }, 300);
                }
            });
        });
    });

    // Copy contract address functionality
    const copyButtons = document.querySelectorAll(".copy-btn");
    copyButtons.forEach((button) => {
        button.addEventListener("click", async () => {
            const address = button.getAttribute("data-address");
            try {
                await navigator.clipboard.writeText(address);
                const originalIcon = button.innerHTML;
                button.innerHTML = '<i class="fas fa-check"></i>';
                button.style.color = "var(--accent-primary)";
                setTimeout(() => {
                    button.innerHTML = originalIcon;
                    button.style.color = "";
                }, 2000);
                showToast("Contract address copied to clipboard!");
            } catch (err) {
                console.error("Failed to copy address:", err);
                showToast("Failed to copy address", "error");
            }
        });
    });

    // Copy wallet address functionality
    const copyWalletButtons = document.querySelectorAll(".copy-wallet-btn");
    copyWalletButtons.forEach((button) => {
        button.addEventListener("click", async () => {
            const wallet = button.getAttribute("data-wallet");
            try {
                await navigator.clipboard.writeText(wallet);
                const originalText = button.textContent;
                button.textContent = "Copied!";
                button.style.color = "var(--accent-primary)";
                setTimeout(() => {
                    button.textContent = originalText;
                    button.style.color = "";
                }, 2000);
                showToast("Wallet address copied to clipboard!");
            } catch (err) {
                console.error("Failed to copy wallet:", err);
                showToast("Failed to copy wallet address", "error");
            }
        });
    });

    // MetaMask wallet connection
    const connectWalletBtn = document.getElementById("connectWallet");
    if (connectWalletBtn) {
        connectWalletBtn.addEventListener("click", async () => {
            if (typeof window.ethereum !== "undefined") {
                try {
                    const accounts = await window.ethereum.request({
                        method: "eth_requestAccounts"
                    });
                    if (accounts.length > 0) {
                        const account = accounts[0];
                        const shortAccount = `${account.slice(0, 6)}...${account.slice(-4)}`;
                        connectWalletBtn.innerHTML = `<i class="fas fa-wallet"></i> ${shortAccount}`;
                        connectWalletBtn.style.background = "var(--accent-secondary)";
                        showToast("Wallet connected successfully!");
                    }
                } catch (error) {
                    console.error("Error connecting wallet:", error);
                    showToast("Failed to connect wallet", "error");
                }
            } else {
                showToast("MetaMask not detected. Please install MetaMask.", "error");
            }
        });
    }

    // Contact form validation and submission
    const contactForm = document.getElementById("contactForm");
    if (contactForm) {
        const formInputs = contactForm.querySelectorAll("input, textarea, select");
        formInputs.forEach((input) => {
            input.addEventListener("blur", () => validateField(input));
            input.addEventListener("input", () => clearFieldError(input));
        });
    }

    // FAQ accordion functionality
    const faqItems = document.querySelectorAll(".faq-item");
    faqItems.forEach((item) => {
        const question = item.querySelector(".faq-question");
        question.addEventListener("click", () => {
            const isActive = item.classList.contains("active");
            faqItems.forEach((faqItem) => faqItem.classList.remove("active"));
            if (!isActive) {
                item.classList.add("active");
            }
        });
    });

    loadTheme(); // Load theme on initial script load
});

// --- HELPER FUNCTIONS ---

// Form validation functions
function validateContactForm(form) {
    let isValid = true;
    const name = form.querySelector('input[name="name"]');
    if (!name.value.trim()) {
        showFieldError(name, "Name is required");
        isValid = false;
    } else if (name.value.trim().length < 2) {
        showFieldError(name, "Name must be at least 2 characters");
        isValid = false;
    } else {
        showFieldSuccess(name);
    }

    const email = form.querySelector('input[name="email"]');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim()) {
        showFieldError(email, "Email is required");
        isValid = false;
    } else if (!emailRegex.test(email.value)) {
        showFieldError(email, "Please enter a valid email address");
        isValid = false;
    } else {
        showFieldSuccess(email);
    }

    const message = form.querySelector('textarea[name="message"]');
    if (!message.value.trim()) {
        showFieldError(message, "Message is required");
        isValid = false;
    } else if (message.value.trim().length < 10) {
        showFieldError(message, "Message must be at least 10 characters");
        isValid = false;
    } else {
        showFieldSuccess(message);
    }
    return isValid;
}

function validateField(field) {
    clearFieldError(field);
    // Add validation logic based on field name or type
}

function showFieldError(field, message) {
    const formGroup = field.closest(".form-group");
    formGroup.classList.add("error");
    const errorElement = document.createElement("span");
    errorElement.className = "error-message";
    errorElement.textContent = message;
    formGroup.appendChild(errorElement);
}

function showFieldSuccess(field) {
    const formGroup = field.closest(".form-group");
    formGroup.classList.remove("error");
    formGroup.classList.add("success");
}

function clearFieldError(field) {
    const formGroup = field.closest(".form-group");
    formGroup.classList.remove("error", "success");
    const errorMessage = formGroup.querySelector(".error-message");
    if (errorMessage) {
        errorMessage.remove();
    }
}

// Toast notification function
function showToast(message, type = "success") {
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = "1";
        toast.style.transform = "translateY(0)";
    }, 100);

    setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateY(-20px)";
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// Dark/Light mode toggle
function toggleTheme() {
    document.body.classList.toggle('light-mode');
    localStorage.setItem('theme', document.body.classList.contains('light-mode') ? 'light' : 'dark');
}

// Load saved theme
function loadTheme() {
    if (localStorage.getItem('theme') === 'light') {
        document.body.classList.add('light-mode');
    }
}