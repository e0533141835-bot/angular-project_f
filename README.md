# 🚀 Task Manager Pro

<div align="center">

![Angular](https://img.shields.io/badge/Angular-17+-DD0031.svg?style=for-the-badge&logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![Status](https://img.shields.io/badge/Status-Live-success?style=for-the-badge)

**Orchestrate your work with precision.** A modern, dark-mode focused workspace designed for high-performance teams.

[View Live Demo](https://https://task-manager-angular-a2qj.onrender.com) · [Report Bug](https://github.com/e0533141835-bot/repo/issues)

</div>

---

## 📖 About The Project

**Task Manager Pro** is a comprehensive project management tool built with **Angular 17+** and **Signals**. It enables teams to collaborate efficiently, manage projects, and track tasks using a visual Kanban board.

The application features a sleek **Dark Mode** interface with Glassmorphism effects, ensuring a comfortable and focused user experience.

### ✨ Key Features

* **🔐 Secure Authentication:** JWT-based Login and Registration system with route guards.
* **🏢 Team Management:** Create teams, view members, and manage multiple workspaces.
* **📂 Project Hub:** Organize tasks within specific projects with search and filter capabilities.
* **📋 Interactive Kanban Board:** * Full **Drag & Drop** support (using Angular CDK) to move tasks between statuses (Todo / In Progress / Done).
    * Visual priority indicators (Low/Normal/High).
* **💬 Collaboration:** Real-time comments system on tasks with a chat-like interface.
* **⚡ Modern Tech Stack:** Built using Angular **Standalone Components**, **Signals** for reactive state management, and **Typed Forms**.
* **🎨 Stunning UI:** Custom CSS architecture featuring a "Dark Tech" theme, responsive grid layouts, and smooth animations.

---

## 🛠️ Built With

* **Framework:** [Angular 17](https://angular.io/)
* **State Management:** Angular Signals
* **Styling:** CSS3 (Variables, Flexbox, Grid, Glassmorphism)
* **Interactions:** Angular CDK (Drag & Drop)
* **Routing:** Angular Router
* **HTTP:** Angular HttpClient with Interceptors

---

## 📸 Screenshots

| **Landing Page** | **Kanban Board** |
|:---:|:---:|
| <img src="https://via.placeholder.com/400x200?text=Landing+Page" alt="Landing" width="400"> | <img src="https://via.placeholder.com/400x200?text=Kanban+Board" alt="Kanban" width="400"> |

| **Dark Mode UI** | **Mobile Responsive** |
|:---:|:---:|
| <img src="https://via.placeholder.com/400x200?text=Dark+Mode" alt="UI" width="400"> | <img src="https://via.placeholder.com/400x200?text=Mobile+View" alt="Mobile" width="400"> |

---

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

* Node.js (v18 or higher)
* Angular CLI (`npm install -g @angular/cli`)

### Installation

1.  **Clone the repo**
    ```sh
    git clone [https://github.com/YOUR_USERNAME/task-manager.git](https://github.com/YOUR_USERNAME/task-manager.git)
    ```
2.  **Navigate to the project folder**
    ```sh
    cd client/task-manager
    ```
3.  **Install dependencies**
    ```sh
    npm install
    ```
4.  **Configure Environment**
    Create/Update `src/environments/environment.ts` with your API URL:
    ```typescript
    export const environment = {
      production: false,
      apiUrl: 'http://localhost:3000/api' // Or your server URL
    };
    ```
5.  **Run the development server**
    ```sh
    ng serve
    ```
6.  Open your browser at `http://localhost:4200`

---

## 📂 Project Structure

```text
src/
├── app/
│   ├── components/         # Standalone Components
│   │   ├── home/           # Landing Page
│   │   ├── task-list/      # Kanban Board Logic
│   │   ├── ...
│   ├── services/           # API Services (Auth, Tasks, Teams)
│   ├── models/             # TypeScript Interfaces (User, Task, Project)
│   ├── guards/             # Auth Guards
│   ├── interceptors/       # Token & Error Handling
│   └── app.routes.ts       # Routing Configuration
├── assets/                 # Images and Fonts
└── styles.css              # Global Dark Theme Variables
