# CyberGuard: Interactive Phishing Awareness Training Module

CyberGuard is a modern, responsive, and highly interactive web-based presentation and self-paced online training module designed to educate users on recognizing and neutralizing phishing attacks and social engineering threats. Built with a premium, cyberpunk-inspired dark aesthetic featuring neon cyan highlights, this application is ideal for corporate security seminars, awareness workshops, or self-paced training.

---

## 🚀 Live Demo Features

- **PPT-Style Presentation Controls**: Presenters can navigate using standard prev/next HUD buttons, click pagination dots, or use keyboard inputs (`Right Arrow` / `Spacebar` for next slide, `Left Arrow` for previous).
- **Taxonomy Deep Dive**: Interactive expandable cards covering five major threat families: *Spear Phishing*, *Whaling*, *Smishing*, *Vishing*, and *Clone Phishing*.
- **Interactive Email Auditor**: A virtual email mockup featuring pulsing red warning hotspots. Clicking on a hotspot opens a side panel detailing the target threat (e.g. sender spoofing, double extensions, false urgency). Hovering over links displays fake URL tooltips.
- **Side-by-Side Website Spoof Comparison**: Interactive browser replicas displaying a legitimate Microsoft login portal side-by-side with a spoofed landing page, illustrating homograph/typosquatted domains.
- **Spot the Phish Simulator**: Two real-world inbox simulation tasks (VPN migration and delivery alerts) where users evaluate items as "Safe" or "Phishing" and receive immediate tactical feedback.
- **Stateful 10-Question Cyber Assessment**:
  - Dynamically rendered multiple-choice questions with 4 options each.
  - Interactive answer validation (correct choices pulse green; incorrect selections shake and highlight correct answers).
  - Detailed explanatory review boxes shown after each answer.
  - Real-time score calculations and progress bar gauges.
- **Gamified Badge Rank & Certificate Printing**:
  - Dynamic score breakdown showing percentages on a glowing radial gauge.
  - Generates ranks: **Cyber Sentinel** (90-100%), **Cyber Defender** (70-89%), **Security Novice** (50-69%), or **Phishing Target** (<50%).
  - Embedded CSS print layout allows users to print or save their score evaluation as an official completion certificate directly.
- **Sound Effects Engine**: Immersive interactive sound cues for selections, correct answers, and incorrect choices, with a global mute toggle.

---

## 🛠️ Technology Stack

- **Core**: Semantic HTML5 & Modern ES6 JavaScript (Stateful Quiz logic and presentation controls)
- **Styling**: Vanilla CSS3 (Glassmorphism, custom animations, custom CSS grids, print stylesheets)
- **Assets**: Inline custom SVGs, FontAwesome Icons CDN, Google Fonts (Inter, Orbitron)
- **Zero Dependencies**: Pure client-side static application. No compilations, databases, or complex configurations required.

---

## 💻 How to Run Locally

Since this is a client-side static application, you can run it instantly:

### Method 1: Double-Click (Offline)
Directly open the `index.html` file in any modern web browser (Chrome, Edge, Firefox, Safari).

### Method 2: Python HTTP Server (Recommended)
If you wish to host it locally on a network port, run the following command in your terminal:
```bash
python -m http.server 3000
```
Then navigate to `http://localhost:3000` in your web browser.

---

## 📂 File Directory

```
├── index.html                  # Main presentation HTML layout
├── styles.css                  # Custom CSS styling & responsive layouts
├── app.js                      # Core slide navigation & quiz logic
├── .gitignore                  # File rules for Git commits
├── README.md                   # Documentation guide
└── assets/
    └── images/
        └── cyber_security_shield.png   # AI generated cyber hero asset
```
