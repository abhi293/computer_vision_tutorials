import { motion } from 'framer-motion'

// Colour palette for different slices of a tensor
const SLICE_COLOURS = [
  { bg: 'rgba(108,99,255,0.2)',  border: 'rgba(108,99,255,0.5)',  text: '#a78bfa' },
  { bg: 'rgba(0,212,255,0.15)', border: 'rgba(0,212,255,0.5)',   text: '#67e8f9' },
  { bg: 'rgba(255,107,157,0.15)',border: 'rgba(255,107,157,0.5)', text: '#f9a8d4' },
  { bg: 'rgba(255,209,102,0.15)',border: 'rgba(255,209,102,0.5)', text: '#fde68a' },
  { bg: 'rgba(6,214,160,0.15)', border: 'rgba(6,214,160,0.5)',   text: '#6ee7b7' },
]

/**
 * @param {number[][]} data       2D array
 * @param {number}     colourIdx  which palette colour to use
 * @param {boolean}    animate    pop-in animation
 * @param {number}     cellSize   px size of each cell
 * @param {Function}   onCellClick
 * @param {Set}        highlighted set of "row,col" strings to highlight
 */
export default function MatrixGrid({
  data = [[1,2],[3,4]],
  colourIdx = 0,
  animate = true,
  cellSize = 52,
  onCellClick,
  highlighted = new Set(),
  label,
}) {
  const pal = SLICE_COLOURS[colourIdx % SLICE_COLOURS.length]
  const rows = data.length
  const cols = data[0]?.length ?? 0

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.25rem' }}>
      {label && (
        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
          {label}
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
        {/* left bracket */}
        <svg width="12" height={rows * (cellSize + 4)} viewBox={`0 0 12 ${rows * (cellSize + 4)}`} fill="none">
          <path
            d={`M10 2 L4 2 L4 ${rows * (cellSize + 4) - 2} L10 ${rows * (cellSize + 4) - 2}`}
            stroke={pal.border} strokeWidth="2" strokeLinecap="round"
            style={animate ? { strokeDasharray: 300, strokeDashoffset: 300, animation: 'draw-bracket 0.6s ease forwards 0.2s' } : {}}
          />
        </svg>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {data.map((row, r) => (
            <div key={r} style={{ display: 'flex', gap: 4 }}>
              {row.map((val, c) => {
                const isHl = highlighted.has(`${r},${c}`)
                return (
                  <motion.div
                    key={c}
                    className="matrix-cell"
                    initial={animate ? { opacity: 0, scale: 0.5 } : false}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={animate ? { delay: (r * cols + c) * 0.04, type: 'spring', stiffness: 400 } : {}}
                    whileHover={{ scale: 1.15, zIndex: 10 }}
                    onClick={() => onCellClick?.(r, c, val)}
                    style={{
                      width: cellSize, height: cellSize,
                      background: isHl ? pal.border : pal.bg,
                      borderColor: isHl ? pal.text : pal.border,
                      color: isHl ? '#fff' : pal.text,
                      cursor: onCellClick ? 'pointer' : 'default',
                      boxShadow: isHl ? `0 0 16px ${pal.border}` : 'none',
                      transition: 'background 0.3s, box-shadow 0.3s',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      borderRadius: 8, fontFamily: "'JetBrains Mono',monospace",
                      fontWeight: 600, fontSize: '0.9rem',
                      border: `1px solid ${isHl ? pal.text : pal.border}`,
                    }}
                  >
                    {val}
                  </motion.div>
                )
              })}
            </div>
          ))}
        </div>

        {/* right bracket */}
        <svg width="12" height={rows * (cellSize + 4)} viewBox={`0 0 12 ${rows * (cellSize + 4)}`} fill="none">
          <path
            d={`M2 2 L8 2 L8 ${rows * (cellSize + 4) - 2} L2 ${rows * (cellSize + 4) - 2}`}
            stroke={pal.border} strokeWidth="2" strokeLinecap="round"
            style={animate ? { strokeDasharray: 300, strokeDashoffset: 300, animation: 'draw-bracket 0.6s ease forwards 0.4s' } : {}}
          />
        </svg>
      </div>

      {/* dimension label */}
      <div style={{
        fontSize: '0.72rem', color: 'var(--text-secondary)', textAlign: 'center', width: '100%',
        fontFamily: "'JetBrains Mono',monospace",
      }}>
        {rows} × {cols}
      </div>
    </div>
  )
}
