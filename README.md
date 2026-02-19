# Matrices vs Tensors: An Interactive Tutorial

An interactive, visual tutorial explaining the fundamental differences between Matrices and Tensors, and extending these concepts to Computer Vision. This project is built using React, Vite, and Framer Motion for a creative and engaging learning experience.

## Features

- **Math Foundations:** Step-by-step introduction to Scalars, Vectors, Matrices, and Tensors.
- **Interactive Playground:** Manipulate tensors in real-time.
- **Computer Vision Applications:** Learn how convolutions work on images and tensors in CV.
- **Smooth Animations:** Powered by `framer-motion` for dynamic scene transitions and visual progress tracking.
- **Responsive Navigation:** A robust sidebar to switch between chapters with a beautiful particle background.

## Tech Stack

- React (v18)
- Vite for fast, optimized builds
- Framer Motion for animations
- Vanilla CSS for styling

## 🚀 Getting Started

Follow these steps to get the project up and running locally.

### Prerequisites

You will need [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. Clone the repository and navigate into the project directory:
   ```bash
   cd d:\Projects\matricesVStensors
   ```

2. Install the necessary dependencies:
   ```bash
   npm install
   ```

### Running Locally

Start the Vite development server:

```bash
npm run dev
```

The application will be accessible at `http://localhost:5173/` by default.

## 📦 Deployment

This project is configured to be deployed easily to GitHub Pages.

1. Build the production application:
   ```bash
   npm run build
   ```

2. Deploy the application to GitHub Pages:
   ```bash
   npm run deploy
   ```

## Directory Structure

Here's a quick overview of the essential directories and files:

- `src/components/`: Contains the global UI components (e.g. `Sidebar.jsx`, `ProgressHeader.jsx`, `ParticleBackground.jsx`).
- `src/components/steps/`: Contains individual tutorial pages/steps:
  - `ScalarStep.jsx`
  - `VectorStep.jsx`
  - `MatrixStep.jsx`
  - `TensorIntroStep.jsx`
  - `CVImagesStep.jsx`
  - `CVConvolutionStep.jsx`
  - `PlaygroundStep.jsx`
  - `WelcomeStep.jsx`
  ...and more!

## License

This project is open source and available under the MIT License.
