import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import ParticleBackground from './components/ParticleBackground.jsx'
import ProgressHeader from './components/ProgressHeader.jsx'
import Sidebar from './components/Sidebar.jsx'

// Steps
import WelcomeStep from './components/steps/WelcomeStep.jsx'
import ScalarStep from './components/steps/ScalarStep.jsx'
import VectorStep from './components/steps/VectorStep.jsx'
import MatrixStep from './components/steps/MatrixStep.jsx'
import TensorIntroStep from './components/steps/TensorIntroStep.jsx'
import RankExplorerStep from './components/steps/RankExplorerStep.jsx'
import ConversionStep from './components/steps/ConversionStep.jsx'
import RealWorldStep from './components/steps/RealWorldStep.jsx'
import ComparisonStep from './components/steps/ComparisonStep.jsx'
import CVImagesStep from './components/steps/CVImagesStep.jsx'
import CVConvolutionStep from './components/steps/CVConvolutionStep.jsx'
import PlaygroundStep from './components/steps/PlaygroundStep.jsx'

const CHAPTERS = [
  {
    title: 'Foundations',
    steps: [
      { id: 'welcome', label: 'Welcome', icon: '🚀', component: WelcomeStep },
      { id: 'scalars', label: 'Scalars', icon: '⚡', component: ScalarStep },
      { id: 'vectors', label: 'Vectors', icon: '➡️', component: VectorStep },
      { id: 'matrices', label: 'Matrices', icon: '🔲', component: MatrixStep },
    ]
  },
  {
    title: 'Tensors Core',
    steps: [
      { id: 'tensors', label: 'Tensors', icon: '🧊', component: TensorIntroStep },
      { id: 'rank', label: 'Rank & Shape', icon: '📐', component: RankExplorerStep },
      { id: 'conversion', label: 'Conversion', icon: '🔄', component: ConversionStep },
      { id: 'realworld', label: 'Real World', icon: '🌍', component: RealWorldStep },
      { id: 'comparison', label: 'Comparison', icon: '⚖️', component: ComparisonStep },
    ]
  },
  {
    title: 'Computer Vision',
    steps: [
      { id: 'cv_images', label: 'Images as Tensors', icon: '🖼️', component: CVImagesStep },
      { id: 'cv_conv', label: 'Convolutions', icon: '🔍', component: CVConvolutionStep },
    ]
  },
  {
    title: 'Practice',
    steps: [
      { id: 'playground', label: 'Playground', icon: '🎮', component: PlaygroundStep },
    ]
  }
]

// Flatten steps and assign global indices
let globalCounter = 0
const STEPS = CHAPTERS.flatMap(ch =>
  ch.steps.map(st => ({ ...st, globalIndex: globalCounter++ }))
)

const chaptersWithGlobalIndices = CHAPTERS.map(ch => ({
  ...ch,
  steps: ch.steps.map(st => STEPS.find(s => s.id === st.id))
}))

const slideVariants = {
  enter: (dir) => ({
    x: dir > 0 ? '60%' : '-60%',
    opacity: 0,
    scale: 0.95,
  }),
  center: { x: 0, opacity: 1, scale: 1 },
  exit: (dir) => ({
    x: dir > 0 ? '-60%' : '60%',
    opacity: 0,
    scale: 0.95,
  }),
}

export default function App() {
  const [step, setStep] = useState(0)
  const [direction, setDir] = useState(1)
  const [visited, setVisited] = useState(new Set([0]))

  const goTo = (next) => {
    setDir(next > step ? 1 : -1)
    setStep(next)
    setVisited(prev => new Set([...prev, next]))
  }

  const next = () => step < STEPS.length - 1 && goTo(step + 1)
  const prev = () => step > 0 && goTo(step - 1)

  // keyboard navigation
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft') prev()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  })

  const StepComponent = STEPS[step].component
  const progress = ((step) / (STEPS.length - 1)) * 100

  return (
    <div className="layout-container">
      <ParticleBackground />

      <Sidebar
        chapters={chaptersWithGlobalIndices}
        currentStep={step}
        goTo={goTo}
        visited={visited}
      />

      <div className="main-wrapper">
        <ProgressHeader
          steps={STEPS}
          current={step}
          progress={progress}
          visited={visited}
          goTo={goTo}
        />

        {/* STEP CONTENT */}
        <div className="content-scroll">
          <main style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1, minHeight: '100%', paddingBottom: '80px' }}>
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={step}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: 'spring', stiffness: 300, damping: 30, mass: 0.8 }}
                style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
              >
                <StepComponent onNext={next} onPrev={prev} stepIndex={step} totalSteps={STEPS.length} />
              </motion.div>
            </AnimatePresence>
          </main>
        </div>

        {/* BOTTOM NAV */}
        <nav className="bottom-nav">
          <button
            className="btn btn-outline"
            onClick={prev}
            disabled={step === 0}
            style={{ minWidth: 120 }}
          >
            ← Previous
          </button>

          <div style={{ display: 'flex', gap: '0.4rem' }}>
            {STEPS.map((s, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Go to step ${i}`}
                style={{
                  width: i === step ? 24 : 8,
                  height: 8,
                  borderRadius: 4,
                  border: 'none',
                  cursor: 'pointer',
                  background: i === step
                    ? 'linear-gradient(90deg,#6c63ff,#00d4ff)'
                    : visited.has(i)
                      ? 'rgba(108,99,255,0.5)'
                      : 'rgba(255,255,255,0.15)',
                  transition: 'all 0.3s ease',
                  padding: 0,
                }}
              />
            ))}
          </div>

          <button
            className="btn btn-primary"
            onClick={next}
            disabled={step === STEPS.length - 1}
            style={{ minWidth: 120 }}
          >
            {step >= STEPS.length - 2 ? 'Playground →' : 'Next →'}
          </button>
        </nav>
      </div>
    </div>
  )
}
