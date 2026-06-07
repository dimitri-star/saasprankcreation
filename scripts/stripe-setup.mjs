// One-off : crée les Produits + Prix Stripe à partir du CATALOG, puis écrit
// server/lib/stripe-prices.generated.json (price_id non secrets, committables).
// Idempotent : retrouve les prix par `lookup_key` et réutilise l'existant.
//
// Usage : node scripts/stripe-setup.mjs
// Prérequis : STRIPE_SECRET_KEY (clé TEST sk_test_…) dans .env.local.
import { readFileSync, writeFileSync } from 'node:fs'
import Stripe from 'stripe'
import { CATALOG } from '../server/lib/catalog.js'

// Charge .env.local — le token n'est JAMAIS affiché.
const env = readFileSync(new URL('../.env.local', import.meta.url), 'utf8')
for (const line of env.split('\n')) {
  const m = /^\s*([A-Z_]+)\s*=\s*(.*)\s*$/.exec(line)
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '').trim()
}

const key = process.env.STRIPE_SECRET_KEY
if (!key) { console.error('✗ STRIPE_SECRET_KEY absent de .env.local'); process.exit(1) }
if (!key.startsWith('sk_')) { console.error('✗ STRIPE_SECRET_KEY invalide (préfixe « sk_ » attendu)'); process.exit(1) }
console.log(`→ Mode Stripe : ${key.startsWith('sk_test_') ? 'TEST' : 'LIVE ⚠️'}\n`)

const stripe = new Stripe(key)
const prices = {}

for (const [priceKey, item] of Object.entries(CATALOG)) {
  // 1) Prix déjà créé ? (lookup_key unique = priceKey)
  //    → réutilise si le montant est identique, sinon crée un nouveau prix
  //    avec transfer_lookup_key pour archiver l'ancien.
  const existing = await stripe.prices.list({ lookup_keys: [priceKey], limit: 1 })
  if (existing.data.length) {
    const old = existing.data[0]
    if (old.unit_amount === item.amount) {
      prices[priceKey] = old.id
      console.log(`= ${priceKey.padEnd(18)} → ${old.id} (réutilisé)`)
      continue
    }
    console.log(`~ ${priceKey.padEnd(18)} montant changé (${old.unit_amount}→${item.amount}), nouveau prix…`)
    // L'ancien prix reste actif côté Stripe mais le lookup_key est transféré au nouveau.
  }

  // 2) Produit (retrouvé par metadata.app_key, sinon créé).
  let product = null
  try {
    const found = await stripe.products.search({ query: `metadata['app_key']:'${priceKey}'`, limit: 1 })
    product = found.data[0] || null
  } catch { /* search index non prêt → on crée */ }
  if (!product) {
    product = await stripe.products.create({ name: item.label, metadata: { app_key: priceKey } })
  }

  // 3) Prix (immuable) avec lookup_key.
  const params = {
    product: product.id,
    unit_amount: item.amount,
    currency: item.currency,
    lookup_key: priceKey,
    transfer_lookup_key: true,   // transfère le lookup_key si un ancien prix l'avait
    metadata: { app_key: priceKey, credits: String(item.creditsPerPeriod), plan: item.plan },
  }
  if (item.mode === 'subscription') params.recurring = { interval: item.interval }
  const price = await stripe.prices.create(params)
  prices[priceKey] = price.id
  console.log(`+ ${priceKey.padEnd(18)} → ${price.id} (créé)`)
}

const outPath = new URL('../server/lib/stripe-prices.generated.json', import.meta.url)
writeFileSync(outPath, JSON.stringify(prices, null, 2) + '\n')
console.log(`\n✓ ${Object.keys(prices).length} prix écrits → server/lib/stripe-prices.generated.json`)
console.log('  ⚠️ Redémarre le serveur de dev (server/lib hors HMR) pour charger les price_id.')
