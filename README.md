<!-- 
  ╔═══════════════════════════════════════════════════════════════════════════╗
  ║  Smart India Hackathon 2019 Winner - World's Largest Hackathon            ║
  ║  Blockchain-powered authentication that doesn't replace, but upgrades.    ║
  ╚═══════════════════════════════════════════════════════════════════════════╝
-->

<div align="center">

# 🔐 Alternate Authentication

### *Blockchain-powered password management that upgrades your existing systems*

<br>

[![Smart India Hackathon](https://img.shields.io/badge/🏆_Smart_India_Hackathon-2019_Winner-FFD700?style=for-the-badge&labelColor=0D1117)](https://www.sih.gov.in/)
[![World's Largest](https://img.shields.io/badge/World's_Largest-Hackathon-00D9FF?style=for-the-badge&labelColor=0D1117)](https://www.sih.gov.in/)

<br>

[![License](https://img.shields.io/github/license/NP-compete/Alternate-Authentication?style=flat-square&color=00D9FF)](LICENSE.md)
[![Last Commit](https://img.shields.io/github/last-commit/NP-compete/Alternate-Authentication?style=flat-square&color=00D9FF)](https://github.com/NP-compete/Alternate-Authentication/commits/main)
[![Stars](https://img.shields.io/github/stars/NP-compete/Alternate-Authentication?style=flat-square&color=FFD700)](https://github.com/NP-compete/Alternate-Authentication/stargazers)
[![Issues](https://img.shields.io/github/issues/NP-compete/Alternate-Authentication?style=flat-square)](https://github.com/NP-compete/Alternate-Authentication/issues)

<br>

[**Demo Video**](https://www.youtube.com/watch?v=SF3bruNefgk) · [**Report Bug**](https://github.com/NP-compete/Alternate-Authentication/issues/new?template=bug_report.md) · [**Request Feature**](https://github.com/NP-compete/Alternate-Authentication/issues/new?template=feature_request.md)

</div>

---

## 💡 The Problem

Traditional username/password authentication is broken:
- **Passwords get reused** across multiple sites
- **Breaches expose millions** of credentials
- **Replacing existing systems** is expensive and risky

## 🚀 Our Solution

Instead of replacing your authentication system, we **upgrade it** with:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│   ┌──────────┐     ┌──────────────┐     ┌─────────────────────────┐    │
│   │  Chrome  │────▶│   Desktop    │────▶│   Storage Backend       │    │
│   │Extension │     │     App      │     │                         │    │
│   └──────────┘     └──────────────┘     │  ┌─────────────────┐    │    │
│                                         │  │  Google Drive   │    │    │
│   Auto-fills         Manages keys       │  │  (Home Users)   │    │    │
│   credentials        & encryption       │  └─────────────────┘    │    │
│                                         │                         │    │
│                                         │  ┌─────────────────┐    │    │
│                                         │  │  BigchainDB     │    │    │
│                                         │  │  (Enterprise)   │    │    │
│                                         │  └─────────────────┘    │    │
│                                         └─────────────────────────┘    │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Key Features

| Feature | Description |
|---------|-------------|
| **Zero Infrastructure Change** | Works on top of existing username/password systems |
| **Decentralized Storage** | Credentials stored in Google Drive (home) or BigchainDB (enterprise) |
| **End-to-End Encryption** | AES-256 encryption with Shamir's Secret Sharing |
| **Cross-Platform** | Chrome extension + Electron desktop app |
| **Blockchain-Backed** | Enterprise solution uses BigchainDB for immutable audit trails |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           ALTERNATE AUTHENTICATION                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                        APPLICATION LAYER                            │   │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────┐  │   │
│  │  │ Chrome Extension│  │  Desktop App    │  │   OTP Manager       │  │   │
│  │  │ • Auto-fill     │  │  • Key mgmt     │  │   • 2FA support     │  │   │
│  │  │ • Form detect   │  │  • Encryption   │  │   • Authy integ.    │  │   │
│  │  └─────────────────┘  └─────────────────┘  └─────────────────────┘  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                        │
│                                    ▼                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                        SECURITY LAYER                               │   │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────┐  │   │
│  │  │ AES-256         │  │ Shamir's Secret │  │   BIP39 Mnemonic    │  │   │
│  │  │ Encryption      │  │ Sharing         │  │   Key Generation    │  │   │
│  │  └─────────────────┘  └─────────────────┘  └─────────────────────┘  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                        │
│                                    ▼                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                        STORAGE LAYER                                │   │
│  │  ┌───────────────────────────┐  ┌───────────────────────────────┐   │   │
│  │  │      HOME USERS           │  │       ENTERPRISE              │   │   │
│  │  │  ┌─────────────────────┐  │  │  ┌─────────────────────────┐  │   │   │
│  │  │  │    Google Drive     │  │  │  │     BigchainDB          │  │   │   │
│  │  │  │  • Personal vault   │  │  │  │  • Immutable ledger     │  │   │   │
│  │  │  │  • OAuth 2.0        │  │  │  │  • Audit trail          │  │   │   │
│  │  │  └─────────────────────┘  │  │  │  • Tendermint consensus │  │   │   │
│  │  │                           │  │  └─────────────────────────┘  │   │   │
│  │  │  ┌─────────────────────┐  │  │                               │   │   │
│  │  │  │    On-Premise       │  │  │                               │   │   │
│  │  │  │  • Local storage    │  │  │                               │   │   │
│  │  │  └─────────────────────┘  │  │                               │   │   │
│  │  └───────────────────────────┘  └───────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🎬 Demo

<div align="center">

[![Watch the Demo](https://img.shields.io/badge/▶_Watch_Demo-YouTube-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://www.youtube.com/watch?v=SF3bruNefgk)

</div>

---

## 🛠️ Tech Stack

<div align="center">

| Layer | Technologies |
|-------|-------------|
| **Frontend** | ![Chrome](https://img.shields.io/badge/Chrome_Extension-4285F4?style=flat-square&logo=googlechrome&logoColor=white) ![Electron](https://img.shields.io/badge/Electron-47848F?style=flat-square&logo=electron&logoColor=white) |
| **Backend** | ![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white) ![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white) |
| **Blockchain** | ![BigchainDB](https://img.shields.io/badge/BigchainDB-3C3C3D?style=flat-square&logo=ethereum&logoColor=white) ![Tendermint](https://img.shields.io/badge/Tendermint-362D59?style=flat-square) |
| **Storage** | ![Google Drive](https://img.shields.io/badge/Google_Drive-4285F4?style=flat-square&logo=googledrive&logoColor=white) |
| **Security** | ![Crypto](https://img.shields.io/badge/AES--256-000000?style=flat-square&logo=letsencrypt&logoColor=white) ![Shamir](https://img.shields.io/badge/Shamir's_Secret_Sharing-FF6B6B?style=flat-square) |

</div>

---

## 📦 Installation

### Prerequisites

- [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/)
- [Node.js](https://nodejs.org/) (v14+)
- [Google Chrome](https://www.google.com/chrome/)

### Quick Start

```bash
# Clone the repository
git clone https://github.com/NP-compete/Alternate-Authentication.git
cd Alternate-Authentication

# Install dependencies
npm install
```

### For Home Users

```bash
# Start the desktop backend
cd Application/Desktop
npm install
cd backend
node server.js
```

Then load the Chrome extension:
1. Navigate to `chrome://extensions`
2. Enable **Developer mode**
3. Click **Load unpacked**
4. Select the `Application/Extension/` folder

### For Enterprise

```bash
# Start BigchainDB
cd Enterprise/BlockChain/Server/bigchaindb
make run

# Start the desktop app
cd ../../../../Application/Desktop
npm install
npm start
```

---

## 📁 Project Structure

```
Alternate-Authentication/
├── Application/
│   ├── Desktop/          # Electron desktop application
│   │   ├── backend/      # Express server for key management
│   │   └── ...
│   └── Extension/        # Chrome browser extension
│       ├── background.js # Service worker
│       ├── contentscript.js
│       └── popup.js
├── Enterprise/
│   └── BlockChain/       # BigchainDB integration
│       ├── Server/       # BigchainDB server setup
│       ├── assetManager.js
│       └── passwordManager.js
├── Home/
│   ├── Gdrive/          # Google Drive storage backend
│   └── OnPrem/          # On-premise storage option
└── package.json
```

---

## 🔒 Security

This project implements multiple layers of security:

- **AES-256 Encryption**: All credentials encrypted before storage
- **Shamir's Secret Sharing**: Master key split across multiple shares
- **BIP39 Mnemonics**: Human-readable key backup
- **Zero-Knowledge**: Server never sees plaintext credentials

See [SECURITY.md](SECURITY.md) for our security policy and how to report vulnerabilities.

---

## 🤝 Contributing

Contributions are what make the open source community amazing! Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

---

## 👥 Team

<div align="center">

| | | |
|:---:|:---:|:---:|
| [![Soham](https://img.shields.io/badge/Soham_Dutta-181717?style=for-the-badge&logo=github)](https://github.com/NP-compete) | [![Abhishek](https://img.shields.io/badge/Abhishek_Verma-181717?style=for-the-badge&logo=github)](https://github.com/abhishek-verma) | [![Nandini](https://img.shields.io/badge/V._Nandini_Soni-181717?style=for-the-badge&logo=github)](https://github.com/nandini8) |
| [![Mridul](https://img.shields.io/badge/Mridul_Gain-181717?style=for-the-badge&logo=github)](https://github.com/mridulgain) | [![Shivam](https://img.shields.io/badge/Shivam_Gangwar-181717?style=for-the-badge&logo=github)](https://github.com/shivamHCU) | [![Gaurav](https://img.shields.io/badge/Gaurav-181717?style=for-the-badge&logo=github)](https://github.com/gaurav476) |

</div>

### Mentors

- **Dr. Y V Subba Rao**
- **Dr. Anjenya Swami Kare**

---

## 📄 License

Distributed under the MIT License. See [LICENSE.md](LICENSE.md) for more information.

---

## 🙏 Acknowledgments

- [Smart India Hackathon](https://www.sih.gov.in/) for the platform
- [KG Info System Pvt. Ltd](https://www.kgisl.com/) for the problem statement
- [BigchainDB](https://www.bigchaindb.com/) for the blockchain infrastructure
- All contributors and supporters

---

<div align="center">

**Built with determination at Smart India Hackathon 2019**

*"Don't replace the system. Upgrade it."*

[![Star History](https://img.shields.io/badge/⭐_Star_this_repo-if_it_helped_you!-FFD700?style=for-the-badge)](https://github.com/NP-compete/Alternate-Authentication)

</div>
