import { Fragment, useMemo, useState } from 'react'
import './App.css'

type CellState = 'check' | 'x' | null

const travelerCategory = {
  name: 'Travelers',
  description: 'Four explorers searching the Archivist vaults',
  items: [
    { id: 'sol', label: 'Sol (Cartographer)' },
    { id: 'lyra', label: 'Lyra (Linguist)' },
    { id: 'kira', label: 'Kira (Tactician)' },
    { id: 'dax', label: 'Dax (Chronologist)' },
  ],
}

const artifactCategory = {
  name: 'Artifacts',
  description: 'Relics hidden in the vault chambers',
  items: [
    { id: 'echo', label: 'Echo Compass' },
    { id: 'lumen', label: 'Lumen Prism' },
    { id: 'solstice', label: 'Solstice Lens' },
    { id: 'bloom', label: 'Frost Bloom' },
  ],
}

const rules = [
  'The explorer who studies the Lumen Prism writes notes beside Lyra, but never diagonally from Kira.',
  'Sol and the guardian of the Frost Bloom sit in the same column.',
  'The Echo Compass belongs to neither the Chronologist nor the Linguist.',
  'Dax uncovered an artifact that glows, but it is not powered by sunlight.',
  'Kira compares clues directly above the traveler linked to the Solstice Lens.',
  'Lyra trades information with the person researching the Echo Compass before anyone meets Dax.',
  'The Frost Bloom guardian works with the traveler in the third row.',
  'Exactly one traveler in each column has a confirmed match—remember to mark impossible options with an X.',
]

const cellOrder: CellState[] = [null, 'check', 'x']

function App() {
  const rows = travelerCategory.items
  const columns = artifactCategory.items

  const blankGrid = useMemo(
    () => rows.map(() => columns.map(() => null as CellState)),
    [rows, columns],
  )

  const [gridState, setGridState] = useState<CellState[][]>(blankGrid)

  const cycleCell = (rowIndex: number, columnIndex: number) => {
    setGridState((current) =>
      current.map((row, rIdx) =>
        row.map((cell, cIdx) => {
          if (rIdx !== rowIndex || cIdx !== columnIndex) {
            return cell
          }
          const position = cellOrder.indexOf(cell)
          const next = cellOrder[(position + 1) % cellOrder.length]
          return next
        }),
      ),
    )
  }

  const clearGrid = () => setGridState(blankGrid.map((row) => row.map(() => null)))

  return (
    <main className="app-shell">
      <header className="page-header">
        <div>
          <p className="eyebrow">Cross Logic</p>
          <h1>Vault of Echoes</h1>
          <p className="lede">
            Use the clues to determine which traveler is matched with each artifact. Click a cell to cycle
            through a checkmark, an X, or a blank state.
          </p>
        </div>
        <button className="ghost-button" type="button" onClick={clearGrid}>
          Clear grid
        </button>
      </header>

      <section className="grid-panel" aria-label="logic grid">
        <div
          className="logic-grid"
          style={{ gridTemplateColumns: `200px repeat(${columns.length}, minmax(0, 1fr))` }}
        >
          <div className="grid-cell corner" aria-hidden>
            <span>{travelerCategory.name}</span>
            <span className="corner-separator">vs</span>
            <span>{artifactCategory.name}</span>
          </div>
          {columns.map((column) => (
            <div key={column.id} className="grid-cell column-heading">
              <span className="category-name">{artifactCategory.name}</span>
              <span className="item-label">{column.label}</span>
            </div>
          ))}

          {rows.map((row, rowIndex) => (
            <Fragment key={row.id}>
              <div className="grid-cell row-heading">
                <span className="category-name">{travelerCategory.name}</span>
                <span className="item-label">{row.label}</span>
              </div>
              {columns.map((column, columnIndex) => {
                const cellValue = gridState[rowIndex]?.[columnIndex] ?? null
                const ariaLabel = `Mark relationship between ${row.label} and ${column.label}`
                return (
                  <button
                    key={`${row.id}-${column.id}`}
                    type="button"
                    aria-label={ariaLabel}
                    className={`grid-cell logic-cell ${cellValue ?? 'blank'}`}
                    onClick={() => cycleCell(rowIndex, columnIndex)}
                  >
                    {cellValue === 'check' && <span aria-hidden>✓</span>}
                    {cellValue === 'x' && <span aria-hidden>✕</span>}
                  </button>
                )
              })}
            </Fragment>
          ))}
        </div>
        <p className="hint-text">Tip: right-click to use your browser context menu undo, or use the button above to reset.</p>
      </section>

      <section className="rules-panel" aria-labelledby="rules-heading">
        <div className="rules-header">
          <h2 id="rules-heading">Mission Rules</h2>
          <p>The list scrolls independently so you can keep the grid in view.</p>
        </div>
        <ol>
          {rules.map((rule, index) => (
            <li key={rule}>
              <span className="rule-index">{index + 1}.</span> {rule}
            </li>
          ))}
        </ol>
      </section>
    </main>
  )
}

export default App
