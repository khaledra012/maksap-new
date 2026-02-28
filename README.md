<h1 align="center">🚀 Maksab KSA | Official Website</h1>

<p align="center">
  A professional corporate website for "Maksab", designed for blazing-fast performance, SEO optimization, and integrated with a dynamic Headless CMS for the blog.
</p>

---

## 🛠️ Tech Stack

This project is built using a modern stack to ensure the best performance and user experience:

* **Frontend:** HTML5, CSS3, Vanilla JavaScript.
* **CMS (Content Management System):** [Sanity.io](https://www.sanity.io/) for dynamic blog and article management.
* **Hosting:** [Hostinger](https://www.hostinger.com/) (Linked to the official domain).
* **CI/CD (Continuous Integration/Deployment):** GitHub Webhooks for automated deployments upon every `git push`.

---

## ✨ Key Features

* **⚡ Blazing Fast Performance:** A static frontend ensuring lightning-fast load times for visitors.
* **📝 Dynamic Blog:** Fetches articles in real-time from Sanity CMS without needing code modifications.
* **🔄 Auto-Deployment:** Any push to the `main` branch is instantly pulled and deployed to the live server within seconds.
* **🔍 SEO Optimized:** * Secure external links (`target="_blank" rel="noopener noreferrer"`).
  * Integrated Sitemap.
  * Connected to Google Search Console.
* **📱 Fully Responsive:** Works flawlessly across all devices (Mobile, Tablet, Desktop).

---

## 🚀 Deployment Flow

For Developers: This repository is connected to the Hostinger server via a GitHub Webhook. To update the live website:

1. Make your local changes.
2. Stage and commit: `git add .` and `git commit -m "Your update message"`
3. Push to live: `git push origin main`
4. *The server will automatically fetch and deploy the new files.*

> **⚠️ Important Note (CORS):** To ensure articles load correctly, the domain `https://maksab-ksa.com` must be added to the CORS Origins list in the Sanity project settings with `Allow credentials` enabled.

---

## 📬 Important Links

* **Live Website:** [https://maksab-ksa.com](https://maksab-ksa.com)
