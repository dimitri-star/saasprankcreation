import { transformations } from '../../data/transformations.js'

const MAX = 200

export default function PromptPanel({ prompt, onPrompt }) {
  return (
    <div className="glass flex h-full flex-col rounded-2xl p-5">
      <div className="mb-1.5 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-white/80">
          Décris ta transfo
        </h2>
        <span className="text-xs text-white/35">Champ libre</span>
      </div>
      <p className="mb-4 text-xs text-white/40">
        Plus c’est précis, meilleur est le rendu — c’est ce texte qui guide l’IA.
      </p>

      <textarea
        value={prompt}
        onChange={(e) => onPrompt(e.target.value.slice(0, MAX))}
        maxLength={MAX}
        rows={5}
        placeholder="Décris la scène où tu veux te retrouver… (ex : « au volant d’une Lamborghini », « musclé sur la plage », « en soirée avec mes potes », « à Dubai devant le Burj »)"
        className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3.5 text-sm leading-relaxed text-white placeholder:text-white/30 transition-colors focus:border-bleu/50 focus:bg-white/[0.03] focus:outline-none focus:ring-1 focus:ring-bleu/40"
      />
      <div className="mt-1.5 text-right text-[11px] tabular-nums text-white/30">
        {prompt.length}/{MAX}
      </div>

      <div className="mb-3 mt-6 flex items-center justify-between">
        <h3 className="text-xs font-medium uppercase tracking-wider text-white/45">
          Inspirations
        </h3>
        <span className="text-[11px] text-white/30">clique pour pré-remplir</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {transformations.map((d) => {
          const active = prompt.trim() === d.promptSeed
          return (
            <button
              key={d.id}
              type="button"
              onClick={() => onPrompt(d.promptSeed)}
              title={d.promptSeed}
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-all duration-200 ${
                active
                  ? 'border-bleu/60 bg-bleu/10 text-white'
                  : 'border-white/10 text-white/60 hover:border-white/25 hover:text-white'
              }`}
            >
              <span className="text-sm leading-none">{d.flag}</span>
              {d.name}
            </button>
          )
        })}
      </div>
    </div>
  )
}
