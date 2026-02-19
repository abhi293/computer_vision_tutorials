import { motion } from 'framer-motion'

export default function Sidebar({ chapters, currentStep, goTo, visited }) {
    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <div className="logo-icon">✨</div>
                <h3>Tensors Explorer</h3>
            </div>

            <div className="sidebar-content">
                {chapters.map((chapter, cIdx) => (
                    <div key={cIdx} className="chapter-group">
                        <h4 className="chapter-title">{chapter.title}</h4>
                        <div className="chapter-steps">
                            {chapter.steps.map((step) => {
                                const isActive = step.globalIndex === currentStep
                                const isVisited = visited.has(step.globalIndex)

                                return (
                                    <button
                                        key={step.globalIndex}
                                        onClick={() => goTo(step.globalIndex)}
                                        className={`sidebar-link ${isActive ? 'active' : ''} ${isVisited ? 'visited' : ''}`}
                                    >
                                        <span className="step-icon">{step.icon}</span>
                                        <span className="step-label">{step.label}</span>
                                        {isActive && (
                                            <motion.div
                                                layoutId="activeIndicator"
                                                className="active-indicator"
                                                initial={false}
                                                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                            />
                                        )}
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                ))}
            </div>

            <div className="sidebar-footer">
                <a href="https://github.com/abhi293/computer_vision_tutorials" target="_blank" rel="noreferrer" className="github-link">
                    <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                    </svg>
                    View Source
                </a>
            </div>
        </aside>
    )
}
