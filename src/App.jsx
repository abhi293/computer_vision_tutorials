import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import ParticleBackground from './components/ParticleBackground.jsx'
import ProgressHeader from './components/ProgressHeader.jsx'
import WelcomeStep from './components/steps/WelcomeStep.jsx'
import ScalarStep from './components/steps/ScalarStep.jsx'
import VectorStep from './components/steps/VectorStep.jsx'
import MatrixStep from './components/steps/MatrixStep.jsx'
import TensorIntroStep from './components/steps/TensorIntroStep.jsx'
import RankExplorerStep from './components/steps/RankExplorerStep.jsx'
import ConversionStep from './components/steps/ConversionStep.jsx'
import RealWorldStep from './components/steps/RealWorldStep.jsx'
import ComparisonStep from './components/steps/ComparisonStep.jsx'
import PlaygroundStep from './components/steps/PlaygroundStep.jsx'

const STEPS = [
  { id: 0, label: 'Welcome',       icon: '🚀', component: WelcomeStep },
  { id: 1, label: 'Scalars',       icon: '⚡', component: ScalarStep },
  { id: 2, label: 'Vectors',       icon: '➡️', component: VectorStep },
  { id: 3, label: 'Matrices',      icon: '🔲', component: MatrixStep },
  { id: 4, label: 'Tensors',       icon: '🧊', component: TensorIntroStep },
  { id: 5, label: 'Rank & Shape',  icon: '📐', component: RankExplorerStep },
  { id: 6, label: 'Conversion',    icon: '🔄', component: ConversionStep },
  { id: 7, label: 'Real World',    icon: '🌍', component: RealWorldStep },
  { id: 8, label: 'Comparison',    icon: '⚖️', component: ComparisonStep },
  { id: 9, label: 'Playground',    icon: '🎮', component: PlaygroundStep },
]

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
  const [step, setStep]       = useState(0)
  const [direction, setDir]   = useState(1)
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
      if (e.key === 'ArrowLeft')  prev()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  })

  const StepComponent = STEPS[step].component
  const progress = ((step) / (STEPS.length - 1)) * 100

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <ParticleBackground />

      <ProgressHeader
        steps={STEPS}
        current={step}
        progress={progress}
        visited={visited}
        goTo={goTo}
      />

      {/* STEP CONTENT */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1 }}>
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

      {/* BOTTOM NAV */}
      <nav style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        padding: '1rem 2rem',
        background: 'linear-gradient(to top, rgba(5,8,21,1) 60%, transparent)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        zIndex: 50,
      }}>
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
          {step === STEPS.length - 2 ? 'Playground →' : 'Next →'}
        </button>
      </nav>
    </div>
  )
}
