# 🛡️ 0xS3id0x Manual Testing Checklist

> Interactive web app for bug bounty hunters & pentesters  
> 🔗 [Live Demo](https://0xS3id0x.github.io/0xS3id0x-Manual-Testing-Checklist) • 📦 [Download ZIP](../../archive/refs/heads/main.zip)


[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![Last Updated](https://img.shields.io/github/last-commit/0xS3id0x/0xS3id0x-Manual-Testing-Checklist?label=Last%20Update)](../../commits/main)
[![Issues Welcome](https://img.shields.io/badge/Issues-Welcome-brightgreen)](../../issues)
[![Live Demo](https://img.shields.io/badge/Live-Demo-00d4ff)](https://0xS3id0x.github.io/0xS3id0x-Manual-Testing-Checklist)

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| ✅ **150+ Checks** | Auth flows, XSS, SSRF, logic bugs, recon & more |
| 🔍 **Smart Search** | Filter by keyword, severity, or completion status |
| 💾 **Offline-First** | All data saved in `localStorage` — zero tracking |
| ⌨️ **Keyboard Shortcuts** | `/` search, `F` cycle filters, `R` reset, `Esc` clear |
| 🎨 **Cyberpunk UI** | Dark mode, scanlines, optimized for long hunting sessions |
| 📊 **Progress Tracking** | Visual stats per section + overall completion % |

---

## 📚 Checklist Categories

<details>
<summary>🔐 Authentication & Sessions </summary>

- Login flow enumeration, brute force, SQLi, JWT flaws
- Registration mass assignment, email verification bypasses
- 2FA/MFA bypass techniques (OTP reuse, response manipulation)
- Password reset token attacks, host header injection
- Session fixation, cookie flags, JWT algorithm confusion
- OAuth/SSO misconfigurations (state param, redirect_uri)

</details>

<details>
<summary>🎯 Injection & Code Execution </summary>

- XSS: Reflected, Stored, DOM, filter bypasses
- SSTI: Jinja2, Twig, ERB probes + exploitation
- SQLi, Command Injection, XXE basics
- Prototype pollution (client + server-side)

</details>

<details>
<summary>🌐 API & Modern Web </summary>

- GraphQL: Introspection, IDOR, query depth DoS
- REST API auth bypasses, CORS misconfigs
- JWT kid injection, HTTP smuggling basics
- Web cache poisoning, 403 bypass techniques

</details>

<details>
<summary>🧠 Business Logic & Race Conditions </summary>

- IDOR/BOLA across objects & actions
- Price manipulation, negative values, rounding bugs
- Race conditions: coupons, payments, OTP, inventory
- Workflow bypasses, state skipping, parameter tampering

</details>

<details>
<summary>🔍 Recon & Automation </summary>

- Google/GitHub/FOFA/Shodan dorking
- Subdomain takeover detection
- JavaScript analysis: secrets, endpoints, DOM sinks
- Information disclosure: /.env, /debug, verbose errors

</details>

---

## ⌨️ Keyboard Shortcuts

| Key | Action | Context |
|-----|--------|---------|
| `/` | Focus search bar | Anywhere (not typing) |
| `F` | Cycle through filters | Anywhere (not typing) |
| `R` | Reset all progress | Anywhere (not typing) |
| `Esc` | Clear search + blur | When search is focused |
| `Click card` | Toggle checked state | On any vulnerability card |
| `Click section header` | Collapse/expand section | On any section title |

> 💡 Pro tip: Use `F` to quickly filter to `critical` or `undone` checks during active hunts.

---

## 🚀 Quick Start

## 🌐 Online (No Install)
1. Visit: [Live Demo](https://0xS3id0x.github.io/0xS3id0x-Manual-Testing-Checklist)
2. Start hunting immediately — progress auto-saves in your browser
3. No account, no tracking, no external requests

## 💻 Run Locally
```bash
# Option 1: Clone via Git
git clone https://github.com/0xS3id0x/bug-hunter-checklist.git
cd bug-hunter-checklist
# Open index.html in any modern browser

# Option 2: Local server (recommended for dev)
python3 -m http.server 8000
# Then visit: http://localhost:8000

# Option 3: Direct download
# Click "Code" → "Download ZIP" on GitHub → extract → open index.html
```
---

## ⚠️ Disclaimer

This project is intended for educational purposes and authorized security testing only.  
Do not use this checklist against systems without proper permission.

---

## 🤝 Contributing

Contributions are welcome.  
If you have ideas, improvements, or additional checks, feel free to open an issue or submit a pull request.

---

## ⭐ Support

If you find this project useful:

- Give it a ⭐ on GitHub  
- Share it with other hunters  
- Use it in your workflow  

---

This checklist is built to be fast, practical, and distraction-free during real bug bounty sessions.  
It is designed to support your workflow — not replace your thinking.

**Happy Hunting! 🎯**
