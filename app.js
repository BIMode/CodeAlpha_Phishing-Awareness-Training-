/* ==========================================================================
   CYBERGUARD CORE CONTROLLER - APP.JS
   ========================================================================== */

// --- STATE MANAGEMENT ---
let currentSlideIndex = 0;
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;
const slideTitleHUD = document.getElementById('hud-slide-title');
const progressBarHUD = document.getElementById('hud-progress-bar');
const prevBtnHUD = document.getElementById('prev-slide-btn');
const nextBtnHUD = document.getElementById('next-slide-btn');
const dotsContainerHUD = document.getElementById('hud-slide-tracker');

// Audio Element References
const sndClick = document.getElementById('snd-click');
const sndCorrect = document.getElementById('snd-correct');
const sndWrong = document.getElementById('snd-wrong');
let soundEnabled = true;

// Fullscreen Reference
const presentationContainer = document.getElementById('presentation-container');
const fullscreenToggle = document.getElementById('fullscreen-toggle');
const soundToggle = document.getElementById('sound-toggle');

// Email Hotspot Data
const hotspotData = {
    sender: {
        title: "Sender Spoofing & Domain Typosquatting",
        description: "The sender display name is set to 'Microsoft Support Team' to build false trust. However, the actual email domain is '@sec-micro-login-auth.com'. Legitimate messages from Microsoft come from microsoft.com. This domain is typosquatted (made to look official but owned by attackers)."
    },
    subject: {
        title: "Artificial Urgency & Alert Manipulation",
        description: "Subject lines containing phrases like 'ACTION REQUIRED' and 'Password Expiration in 3 Hours!' are engineered to create a state of high anxiety. Fear and pressure force users to make quick decisions, bypassing normal verification checks."
    },
    greeting: {
        title: "Generic Greeting",
        description: "Standard cybersecurity notifications from corporate portals address you specifically by name. Generic greetings like 'Dear valued user' or 'Dear Employee' indicate automated mass campaigns."
    },
    urgency: {
        title: "Social Engineering Pressure",
        description: "Claiming an unauthorized login has occurred forces the recipient to act defensively. The email exploits our natural response to protect our assets to trick us into compromising them."
    },
    link: {
        title: "Spoofed Hyperlink Target",
        description: "Hovering over the credential link shows that the actual destination is 'http://portal-micro-verify.net/microsoft/login.php'. The URL is fake (not microsoftonline.com) and uses HTTP (unencrypted), meaning passwords entered here are sent directly to the attacker in plain text."
    },
    attachment: {
        title: "Malicious Attachment Double Extension",
        description: "The file is named 'Security_Log_Verification_Patch.pdf.exe'. Windows often hides extensions, so you may only see '.pdf'. Clicking this file will launch an executable file (.exe) which downloads malware, keyloggers, or spyware onto your machine."
    }
};

// Social Engineering Tactics Carousel State
let currentTacticIndex = 0;
const tacticSlides = document.querySelectorAll('.tactic-slide');
const tacticDotsContainer = document.getElementById('tactic-dots-container');
const prevTacticBtn = document.getElementById('prev-tactic-btn');
const nextTacticBtn = document.getElementById('next-tactic-btn');

// Spot the Phish Activity State
let currentScenarioIndex = 0;
const simFeedbackPanel = document.getElementById('sim-feedback-panel');
const simFeedbackIcon = document.getElementById('sim-feedback-icon');
const simFeedbackTitle = document.getElementById('sim-feedback-title');
const simFeedbackDescription = document.getElementById('sim-feedback-description');
const simFrom = document.getElementById('sim-from');
const simSubject = document.getElementById('sim-subject');
const simBody = document.getElementById('sim-body');
const simLink = document.getElementById('sim-link');
const simTabBtns = document.querySelectorAll('.sim-tab');
const choiceBtnSafe = document.getElementById('choice-btn-safe');
const choiceBtnPhish = document.getElementById('choice-btn-phish');

const scenarios = [
    {
        from: "helpdesk@internal-company-support.com",
        subject: "CRITICAL: Corporate VPN Migration Required - Immediate Action",
        body: `<p>Dear Colleague,</p>
               <p>We are migrating our primary database systems to a secure private cloud segment tonight. To prevent interruption to remote desktop services, you are required to re-authenticate your account credentials with our active directory agent.</p>
               <p>Click below to verify your corporate SSO login:</p>
               <p><a href="#" class="sim-mock-link" onclick="event.preventDefault();">http://auth-sso-gateway.net/ldap-auth/company/update</a></p>
               <p>Thank you,</p>
               <p>IT Infrastructure Team</p>`,
        isSafe: false,
        feedback: {
            title: "Threat Detected! (Phishing Email)",
            description: "Correct! This is a phishing email. The sender domain 'internal-company-support.com' is not our official company domain. Additionally, the hyperlink points to 'auth-sso-gateway.net' which is an unauthenticated external website using insecure HTTP. IT support will never request password verification through random external sites."
        }
    },
    {
        from: "auto-confirm@shipping.amazon.com",
        subject: "Your Amazon.com order #402-981827-029 has shipped!",
        body: `<p>Hello,</p>
               <p>Your order containing 'Cybersecurity Awareness Study Guide' has been shipped and is on its way. You can trace your package logistics and view estimated delivery updates directly within your account profile.</p>
               <p>Track your shipping coordinates here:</p>
               <p><a href="#" class="sim-mock-link" onclick="event.preventDefault();">https://www.amazon.com/gp/css/history</a></p>
               <p>We hope to see you again soon.</p>
               <p>Amazon.com Customer Service</p>`,
        isSafe: true,
        feedback: {
            title: "Verified Safe (Legitimate Notification)",
            description: "Correct! This is a safe email. The sender address uses the authentic 'shipping.amazon.com' subdomain, and the link points to the official secure 'https://www.amazon.com/...' root portal. No attachments, system files, or sensitive actions are requested."
        }
    }
];

// --- QUIZ GAME SYSTEM ---
let currentQuestionIndex = 0;
let quizScore = 0;
const quizQuestionNum = document.getElementById('quiz-question-number');
const quizScoreVal = document.getElementById('quiz-score-val');
const quizProgressInner = document.getElementById('quiz-progress-inner');
const quizQuestionText = document.getElementById('quiz-question-text');
const quizOptionsContainer = document.getElementById('quiz-options-container');
const quizExplanationBox = document.getElementById('quiz-explanation-box');
const explanationIcon = document.getElementById('explanation-icon');
const explanationTitle = document.getElementById('explanation-title');
const explanationBody = document.getElementById('explanation-body');

const quizQuestions = [
    {
        question: "What is the primary target of a social engineering/phishing attack?",
        options: [
            "Network firewall configurations",
            "Human behavior and trust",
            "Encrypted email server codes",
            "Database storage hard drives"
        ],
        answer: 1,
        explanation: "Phishing bypasses technological firewalls by targeting the human element—exploiting trust, curiosity, fear, or urgency to gain access."
    },
    {
        question: "Which of these is a key indicator of a spear-phishing attack?",
        options: [
            "Generic greetings like 'Dear valued client'",
            "Mass generic advertisements",
            "Highly personalized information tailored to the recipient",
            "A completely empty email body with no text"
        ],
        answer: 2,
        explanation: "Spear-phishing uses reconnaissance (from LinkedIn, social media) to target specific users with personalized detail, making it highly convincing."
    },
    {
        question: "How can you safely inspect the destination of a link before clicking it?",
        options: [
            "Click on the link to see what website opens",
            "Right-click and copy it to a Word document to inspect",
            "Hover your cursor over the link to preview the URL in the status bar",
            "Reply to the email asking if the link is safe"
        ],
        answer: 2,
        explanation: "Hovering over a link displays the target URL. Inspecting this carefully allows you to check for typosquatting before making any clicks."
    },
    {
        question: "A URL reads: 'https://login.paypa1-support.com/update'. What indicates this is a phishing threat?",
        options: [
            "It uses 'https://' indicating it is fully safe",
            "The domain name contains a '1' instead of an 'l' (typosquatting)",
            "The URL path contains '/update'",
            "The link requires logging in"
        ],
        answer: 1,
        explanation: "Attackers use typosquatting (substituting characters like paypa1 for paypal) to deceive users. Security protocols (like HTTPS) can still be set up on fake domains."
    },
    {
        question: "What type of attack targets high-level executives specifically to request wire transfers?",
        options: [
            "Whaling",
            "Vishing",
            "Clone Phishing",
            "Smishing"
        ],
        answer: 0,
        explanation: "Whaling targets 'big fish' (CEOs, CFOs, board members) to authorize high-value fund transfers or exfiltrate strategic corporate assets."
    },
    {
        question: "You receive an urgent email from your CEO asking you to wire funds immediately for a secret acquisition. What should you do?",
        options: [
            "Process the wire immediately to avoid insubordination",
            "Forward it to all your colleagues to verify",
            "Verify the request through an out-of-band channel, like calling the CEO directly",
            "Ignore the email and delete it"
        ],
        answer: 2,
        explanation: "Always use an out-of-band communication channel (known phone number, video call, in-person check) to verify unexpected financial or credential requests."
    },
    {
        question: "What is Multi-Factor Authentication (MFA) and why is it vital for protection?",
        options: [
            "It automatically deletes phishing emails from the inbox",
            "It requires multiple passwords for the same login screen",
            "It adds an extra verification layer, preventing access even if attackers steal your password",
            "It encrypts your local computer files"
        ],
        answer: 2,
        explanation: "MFA requires an extra code (e.g., SMS, Authenticator app token, security key). If an attacker gets your password, they are still blocked without this secondary code."
    },
    {
        question: "What is 'Smishing'?",
        options: [
            "Phishing using voice-altering AI cloning tools",
            "Infiltrating Wi-Fi networks in public coffee shops",
            "Social engineering attacks sent via SMS/text messaging",
            "Stealing files from discarded hard drives"
        ],
        answer: 2,
        explanation: "Smishing stands for SMS Phishing. Attackers send fraudulent texts containing shortened malicious links to mobile devices."
    },
    {
        question: "If you accidentally enter corporate credentials on a spoofed website, what should be your first action?",
        options: [
            "Change your password on that account immediately, and alert IT Security",
            "Shut down your home Wi-Fi and restart it",
            "Wait for a notification from the security scanner",
            "Delete your browser history to erase the session logs"
        ],
        answer: 0,
        explanation: "Time is critical. Immediately change your credentials on that system (and any other systems sharing that password) and report the breach to IT Security."
    },
    {
        question: "A file named 'Corporate_Payroll_Sheet.xlsx.exe' is attached to an email. What risk does this present?",
        options: [
            "It is a standard Excel spreadsheet containing tax documents",
            "It is a hidden archive that requires a zip tool to run",
            "It is an executable file (malware) disguised as a spreadsheet using double extensions",
            "It is automatically encrypted and fully safe"
        ],
        answer: 2,
        explanation: "The true extension is '.exe' (executable program). Attackers use double extensions like '.xlsx.exe' to trick users into running malware."
    }
];


// ==========================================================================
// --- INITIALIZATION ---
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
    // 1. Set up Slide Tracker dots
    setupDots();
    
    // 2. Set up Keyboard Listeners
    document.addEventListener('keydown', handleKeyPress);
    
    // 3. Set up Email Hotspot Listeners
    setupEmailHotspots();
    
    // 4. Initialize Social Engineering Tactic Carousel
    setupTacticsCarousel();
    
    // 5. Initialize spot-the-phish simulator
    loadScenario(0);

    // 6. Setup Fullscreen toggling
    setupFullscreenToggle();

    // 7. Setup Sound FX toggling
    setupSoundToggle();

    // 8. Render first slide states
    updatePresentationHUD();
});

// Play Audio effects
function playSound(type) {
    if (!soundEnabled) return;
    try {
        if (type === 'click' && sndClick) {
            sndClick.currentTime = 0;
            sndClick.play().catch(e => console.log("Audio play blocked."));
        } else if (type === 'correct' && sndCorrect) {
            sndCorrect.currentTime = 0;
            sndCorrect.play().catch(e => console.log("Audio play blocked."));
        } else if (type === 'wrong' && sndWrong) {
            sndWrong.currentTime = 0;
            sndWrong.play().catch(e => console.log("Audio play blocked."));
        }
    } catch (err) {
        console.error("Audio error", err);
    }
}

// ==========================================================================
// --- SLIDE NAVIGATION ENGINE ---
// ==========================================================================
function setupDots() {
    dotsContainerHUD.innerHTML = '';
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('div');
        dot.classList.add('slide-dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => {
            goToSlide(i);
        });
        dotsContainerHUD.appendChild(dot);
    }
}

function handleKeyPress(e) {
    // If user is focused on inputs or textareas, don't trigger navigation
    if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
        return;
    }
    
    if (e.key === 'ArrowRight' || e.key === 'Space') {
        nextSlide();
    } else if (e.key === 'ArrowLeft') {
        prevSlide();
    }
}

function updatePresentationHUD() {
    // Update Slide Title HUD
    const activeSlide = slides[currentSlideIndex];
    const slideTitle = activeSlide.getAttribute('data-title') || "Threat Briefing";
    slideTitleHUD.textContent = slideTitle;
    
    // Update Progress Bar
    const progressPercent = ((currentSlideIndex + 1) / totalSlides) * 100;
    progressBarHUD.style.width = `${progressPercent}%`;
    
    // Update Nav Buttons
    prevBtnHUD.disabled = currentSlideIndex === 0;
    nextBtnHUD.disabled = currentSlideIndex === totalSlides - 1;
    
    // Update Dots indicator
    const dots = document.querySelectorAll('.slide-dot');
    dots.forEach((dot, idx) => {
        if (idx === currentSlideIndex) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });

    // Special behavior per slide
    if (activeSlide.id === 'slide-quiz') {
        renderQuizQuestion();
    } else if (activeSlide.id === 'slide-results') {
        renderQuizResults();
    }
}

function goToSlide(index) {
    if (index >= 0 && index < totalSlides) {
        playSound('click');
        slides[currentSlideIndex].classList.remove('active');
        currentSlideIndex = index;
        slides[currentSlideIndex].classList.add('active');
        
        // Scroll presentation back to top
        document.getElementById('slides-container').scrollTop = 0;
        
        updatePresentationHUD();
    }
}

function nextSlide() {
    if (currentSlideIndex < totalSlides - 1) {
        goToSlide(currentSlideIndex + 1);
    }
}

function prevSlide() {
    if (currentSlideIndex > 0) {
        goToSlide(currentSlideIndex - 1);
    }
}

// Fullscreen API Helper
function setupFullscreenToggle() {
    fullscreenToggle.addEventListener('click', () => {
        playSound('click');
        if (!document.fullscreenElement) {
            presentationContainer.requestFullscreen()
                .then(() => {
                    fullscreenToggle.innerHTML = '<i class="fa-solid fa-compress"></i>';
                })
                .catch(err => {
                    console.error(`Error attempting to enable full-screen: ${err.message}`);
                });
        } else {
            document.exitFullscreen();
            fullscreenToggle.innerHTML = '<i class="fa-solid fa-expand"></i>';
        }
    });

    // Listen to escape key screen modifications
    document.addEventListener('fullscreenchange', () => {
        if (!document.fullscreenElement) {
            fullscreenToggle.innerHTML = '<i class="fa-solid fa-expand"></i>';
        }
    });
}

// Sound FX Controller Toggle
function setupSoundToggle() {
    soundToggle.addEventListener('click', () => {
        soundEnabled = !soundEnabled;
        if (soundEnabled) {
            soundToggle.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
            playSound('click');
        } else {
            soundToggle.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
        }
    });
}

// ==========================================================================
// --- INTERACTIVE ANATOMY: EMAIL HOTSPOTS ---
// ==========================================================================
function setupEmailHotspots() {
    const hotspots = document.querySelectorAll('.email-hotspot');
    const panel = document.getElementById('hotspot-detail-panel');
    const panelTitle = document.getElementById('hotspot-title');
    const panelDesc = document.getElementById('hotspot-description');

    hotspots.forEach(hotspot => {
        hotspot.addEventListener('click', (e) => {
            e.stopPropagation();
            playSound('click');
            const key = hotspot.getAttribute('data-hotspot');
            const details = hotspotData[key];
            if (details) {
                panelTitle.textContent = details.title;
                panelDesc.textContent = details.description;
                panel.classList.add('active-panel');
                
                // Remove previous highlighting from mockup elements
                document.querySelectorAll('.email-mockup .highlight-target').forEach(el => el.classList.remove('highlight-target'));
                // Highlight the specific target
                hotspot.parentElement.classList.add('highlight-target');
            }
        });
    });

    // Hover tooltip tracking for links
    const mockLink = document.getElementById('spoofed-link-hotspot');
    const tooltip = document.getElementById('link-hover-tooltip');
    
    if(mockLink && tooltip) {
        mockLink.addEventListener('mouseenter', () => {
            tooltip.style.display = 'block';
        });
        mockLink.addEventListener('mouseleave', () => {
            tooltip.style.display = 'none';
        });
    }
}

function closeHotspotPanel() {
    playSound('click');
    const panel = document.getElementById('hotspot-detail-panel');
    panel.classList.remove('active-panel');
    
    // Clear highlights
    document.querySelectorAll('.email-mockup .highlight-target').forEach(el => el.classList.remove('highlight-target'));
}

// Expandable Types of Phishing details
function toggleTypeDetail(card) {
    playSound('click');
    const wasExpanded = card.classList.contains('expanded');
    
    // Close other expanded cards
    document.querySelectorAll('.type-card').forEach(c => {
        c.classList.remove('expanded');
    });

    if (!wasExpanded) {
        card.classList.add('expanded');
    }
}

// ==========================================================================
// --- INTERACTIVE CAROUSEL: SOCIAL ENGINEERING TACTICS ---
// ==========================================================================
function setupTacticsCarousel() {
    // Generate dots
    tacticDotsContainer.innerHTML = '';
    tacticSlides.forEach((slide, index) => {
        const dot = document.createElement('div');
        dot.classList.add('tactic-dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => {
            goToTactic(index);
        });
        tacticDotsContainer.appendChild(dot);
    });

    prevTacticBtn.addEventListener('click', () => {
        if (currentTacticIndex > 0) {
            goToTactic(currentTacticIndex - 1);
        } else {
            goToTactic(tacticSlides.length - 1); // Wrap around
        }
    });

    nextTacticBtn.addEventListener('click', () => {
        if (currentTacticIndex < tacticSlides.length - 1) {
            goToTactic(currentTacticIndex + 1);
        } else {
            goToTactic(0); // Wrap around
        }
    });
}

function goToTactic(index) {
    playSound('click');
    tacticSlides[currentTacticIndex].classList.remove('active-tactic');
    
    // Update tactic indicator dot
    const dots = tacticDotsContainer.querySelectorAll('.tactic-dot');
    dots[currentTacticIndex].classList.remove('active');
    
    currentTacticIndex = index;
    
    tacticSlides[currentTacticIndex].classList.add('active-tactic');
    dots[currentTacticIndex].classList.add('active');
}

// ==========================================================================
// --- INTERACTIVE CHALLENGE: SPOT THE PHISH ---
// ==========================================================================
function loadScenario(index) {
    currentScenarioIndex = index;
    const s = scenarios[index];
    
    // Set headers
    simFrom.textContent = s.from;
    simSubject.textContent = s.subject;
    simBody.innerHTML = s.body;
    
    // Re-highlight target links
    const link = document.getElementById('sim-link');
    if (link) {
        link.addEventListener('click', (e) => {
            e.preventDefault();
        });
    }

    // Hide feedback panel
    simFeedbackPanel.style.display = 'none';
    simFeedbackPanel.className = 'sim-feedback-panel';
    
    // Reset tabs
    simTabBtns.forEach((btn, idx) => {
        if (idx === index) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Enable choices
    choiceBtnSafe.disabled = false;
    choiceBtnPhish.disabled = false;
}

function switchSimScenario(index) {
    playSound('click');
    loadScenario(index);
}

function evaluateChoice(userChoseSafe) {
    const s = scenarios[currentScenarioIndex];
    const userWasCorrect = (userChoseSafe === s.isSafe);
    
    // Disable choice buttons to prevent double entries
    choiceBtnSafe.disabled = true;
    choiceBtnPhish.disabled = true;
    
    // Render panel properties
    if (userWasCorrect) {
        playSound('correct');
        simFeedbackPanel.classList.add('success');
        simFeedbackIcon.innerHTML = '<i class="fa-solid fa-circle-check"></i>';
        simFeedbackTitle.textContent = "CORRECT DECISION!";
    } else {
        playSound('wrong');
        simFeedbackPanel.classList.add('danger');
        simFeedbackIcon.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i>';
        simFeedbackTitle.textContent = "THREAT LEVEL CRITICAL!";
    }
    
    simFeedbackDescription.textContent = s.feedback.description;
    simFeedbackPanel.style.display = 'flex';
}

// ==========================================================================
// --- INTERACTIVE ASSESSMENT: 10-QUESTION QUIZ ---
// ==========================================================================
function renderQuizQuestion() {
    // Hide old feedback
    quizExplanationBox.style.display = 'none';
    quizExplanationBox.className = 'quiz-explanation-box';

    const q = quizQuestions[currentQuestionIndex];
    
    // Update progress HUD elements
    quizQuestionNum.textContent = `${currentQuestionIndex + 1} / ${quizQuestions.length}`;
    quizScoreVal.textContent = `${Math.round((quizScore / quizQuestions.length) * 100)}%`;
    
    const progressWidth = ((currentQuestionIndex + 1) / quizQuestions.length) * 100;
    quizProgressInner.style.width = `${progressWidth}%`;
    
    // Render Question Text
    quizQuestionText.textContent = q.question;
    
    // Clear and Render Option buttons
    quizOptionsContainer.innerHTML = '';
    const letters = ['A', 'B', 'C', 'D'];
    
    q.options.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.classList.add('quiz-opt-btn');
        btn.innerHTML = `
            <span class="quiz-opt-marker">${letters[idx]}</span>
            <span class="quiz-opt-text">${escapeHTML(opt)}</span>
        `;
        
        btn.addEventListener('click', () => {
            selectQuizOption(idx);
        });
        
        quizOptionsContainer.appendChild(btn);
    });
}

function selectQuizOption(selectedIndex) {
    const q = quizQuestions[currentQuestionIndex];
    const isCorrect = (selectedIndex === q.answer);
    
    // Disable all options
    const optionBtns = quizOptionsContainer.querySelectorAll('.quiz-opt-btn');
    optionBtns.forEach(btn => {
        btn.classList.add('disabled');
    });
    
    // Update Visual State
    const selectedBtn = optionBtns[selectedIndex];
    const correctBtn = optionBtns[q.answer];
    
    if (isCorrect) {
        playSound('correct');
        selectedBtn.classList.add('correct');
        quizScore++;
        
        quizExplanationBox.classList.add('correct');
        explanationIcon.innerHTML = '<i class="fa-solid fa-circle-check"></i>';
        explanationTitle.textContent = "Correct Answer Verified";
    } else {
        playSound('wrong');
        selectedBtn.classList.add('wrong');
        correctBtn.classList.add('correct');
        selectedBtn.classList.add('shake-animation');
        
        quizExplanationBox.classList.add('wrong');
        explanationIcon.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i>';
        explanationTitle.textContent = "Security Breach Detected";
    }
    
    // Render score text
    quizScoreVal.textContent = `${Math.round((quizScore / quizQuestions.length) * 100)}%`;
    
    // Render explanation details
    explanationBody.textContent = q.explanation;
    quizExplanationBox.style.display = 'flex';
}

function nextQuizQuestion() {
    playSound('click');
    if (currentQuestionIndex < quizQuestions.length - 1) {
        currentQuestionIndex++;
        renderQuizQuestion();
    } else {
        // Quiz finished, load Results slide
        goToSlide(11);
    }
}

// ==========================================================================
// --- RESULTS & CERTIFICATION ENGINE ---
// ==========================================================================
function renderQuizResults() {
    const percentage = Math.round((quizScore / quizQuestions.length) * 100);
    const scoreTextLabel = document.getElementById('score-percent-num');
    const radialProgress = document.getElementById('results-radial-progress');
    const rankTitle = document.getElementById('results-rank-title');
    const evaluationMsg = document.getElementById('results-evaluation-message');
    const correctCount = document.getElementById('results-correct-count');
    const performanceRating = document.getElementById('results-performance-rating');
    const badgeIconWrap = document.getElementById('badge-icon-wrap');
    
    // Correct counts
    correctCount.textContent = `${quizScore} / ${quizQuestions.length}`;
    scoreTextLabel.textContent = `${percentage}%`;
    
    // Animate SVG Radial circle progress (stroke dashoffset)
    // Stroke dasharray represents circumference of radius 40 = 251.2
    const circumference = 251.2;
    const offset = circumference - (percentage / 100) * circumference;
    radialProgress.style.strokeDashoffset = offset;
    
    // Establish badges, ranks, and performance messaging
    let rank = "";
    let rating = "";
    let message = "";
    let iconHTML = "";
    let badgeClass = "";
    
    if (percentage >= 90) {
        rank = "Cyber Sentinel";
        rating = "Excellent (Elite)";
        message = "Outstanding! You demonstrate exceptional cyber threat awareness and defensive judgment. Your vigilance keeps organizations safe from complex phishing structures.";
        iconHTML = '<i class="fa-solid fa-shield-halved"></i>';
        badgeClass = 'text-green';
    } else if (percentage >= 70) {
        rank = "Cyber Defender";
        rating = "Good (Secure)";
        message = "Well done! You successfully identified the majority of threats, showing solid security knowledge. Continue refining your eye for detail to reach sentinel level.";
        iconHTML = '<i class="fa-solid fa-award"></i>';
        badgeClass = 'text-cyan';
    } else if (percentage >= 50) {
        rank = "Security Novice";
        rating = "Average (Vulnerable)";
        message = "Caution: You correctly spotted some threat indicators, but missed several critical indicators. You are at moderate risk of credential harvesting. We recommend re-studying the module.";
        iconHTML = '<i class="fa-solid fa-triangle-exclamation"></i>';
        badgeClass = 'text-orange';
    } else {
        rank = "Phishing Target";
        rating = "Needs Improvement";
        message = "Critical Threat Alert: Your security score is low, making you a high-value target for active hackers. Retake this training briefing immediately to learn vital defense practices.";
        iconHTML = '<i class="fa-solid fa-skull-crossbones"></i>';
        badgeClass = 'text-crimson';
    }
    
    rankTitle.textContent = rank;
    performanceRating.textContent = rating;
    performanceRating.className = `text-bold ${badgeClass}`;
    evaluationMsg.textContent = message;
    badgeIconWrap.innerHTML = iconHTML;
    
    // Apply status classes to the badge frame
    badgeIconWrap.className = 'badge-icon-wrap';
    if (percentage >= 90) badgeIconWrap.style.borderColor = 'var(--mint)';
    else if (percentage >= 70) badgeIconWrap.style.borderColor = 'var(--cyan)';
    else if (percentage >= 50) badgeIconWrap.style.borderColor = 'var(--orange)';
    else badgeIconWrap.style.borderColor = 'var(--crimson)';
}

function restartBriefing() {
    playSound('click');
    
    // Reset Quiz State
    currentQuestionIndex = 0;
    quizScore = 0;
    
    // Reset Activity State
    loadScenario(0);
    
    // Close email hotspots
    closeHotspotPanel();
    
    // Move to slide 0 (Introduction)
    goToSlide(0);
}

// --- UTILITY CODE ---
function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag)
    );
}
