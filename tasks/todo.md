# PrankCreation — TODO

> App FR pour lycéens : transforme une photo (voyage, voiture de luxe, musclé, soirée…) via IA pour bluffer ses potes. **Multi-transfo**, plus seulement voyage. DA bleue (#3B82F6), police Sora — inspiration Lumia.
> Stack cible : React+Vite+Tailwind · Supabase · Stripe · Replicate (google/nano-banana) · Vercel.
> Fait à ce jour : **UI front complète, zéro clé API** — rebrand DestinIA→PrankCreation terminé (couleur or→bleu, copy ado, 8 transfos), landing (studio embarqué sous le titre), studio, /abonnement (3 tiers + offre **À vie**), tuto Snap enrichi + section Snap « partout ».

## FAIT (session 9+) — Hausse des prix (niveau Lumia) + refonte tuto Snap (méthode app)
Demande user : « augmente les prix au même niveau que mes concurrents » (Lumia) + « mets l'application, explique qu'il faut installer OVF Editor et les manipulations ».

Prix abos relevés sur Lumia (Découverte/Pro/Ultimate = 7,99 / 14,99 / 34,99). Annuel = mensuel ×12 ×0,8 (−20 %, badge conservé). Crédits **inchangés**.
- [x] `server/lib/catalog.js` (cents) : evasion_monthly 499→**799**, evasion_annual 4788→**7668**, signature_monthly 999→**1499**, signature_annual 9588→**14388**, prestige_monthly 1999→**3499**, prestige_annual 19188→**33588**, **snap-tuto 99→299** (0,99€→2,99€, le chiffre que Dimitri avait donné ; Lumia est à 4,99€ → bumpable si voulu).
- [x] `src/data/plans.js` : Évasion 4,99→**7,99** (an. 6,39 / 76,68€ / éco 19) ; Signature 9,99→**14,99** (an. 11,99 / 143,88€ / éco 36) ; Prestige 19,99→**34,99** (an. 27,99 / 335,88€ / éco 84).
- [x] `src/components/chat/ChatWidget.jsx` : réponse « prix » alignée (7,99 / 14,99 / 34,99).
- [x] `src/pages/TutoSnap.jsx` CTA : 0,99€→**2,99€** ; « inclus dans Signature 9,99€ »→**14,99€/mois**.
- **NON touché (volontaire)** : weekly 1,99€ / monthly 2,99€ (hooks d'impulsion du paywall /debloquer, pas d'équivalent Lumia ; les changer obligerait à toucher les CGV légales). Lifetime 49/99/169€ inchangé (pas de réf concurrent).

Refonte tuto Snap — l'ancienne méthode « galerie » (rester appuyé → Partager → Snapchat) **ne marche pas** (Snap tague « média chargé »). Nouvelle méthode = **app de spoof caméra** :
- [x] `STEPS` réécrits : 01 télécharger la photo → 02 **installer OVF Editor** (iOS App Store ; Android = Snaptroid APK) → 03 importer la photo → 04 **Partager vers Snapchat depuis l'app** (charge la photo comme capture live, sans bandeau « média chargé ») → 05 snap rouge (timer court).
- [x] Bloc **« Plan B garanti — méthode 2 écrans »** ajouté (affiche la photo sur un 2e écran, la photographier avec l'appareil Snap → vraie capture live 100 % indétectable) + **avertissement honnête** (contourne les règles Snap ; tester sur son compte d'abord).
- [x] `BONUS` nettoyé (retiré le tip faux « partager direct depuis l'app PrankCreation »).
- vite build : 117 modules, 0 erreur.

✅ **FAIT (Claude a lancé `node scripts/stripe-setup.mjs` en LIVE).** Le script lit `sk_live` depuis `.env.local` sans jamais l'exposer. Résultat : 8 nouveaux prix créés (evasion/signature/prestige mensuel+annuel, snap-tuto 0,99→2,99€) via `transfer_lookup_key:true` (anciens abonnés gardent leur prix) ; 4 réutilisés (weekly, monthly, 3 lifetime — montants inchangés). `server/lib/stripe-prices.generated.json` régénéré avec les nouveaux price_id → **à committer + push Vercel** pour que le site facture les nouveaux prix.
⚠️ **Tester OVF Editor sur son propre téléphone** avant la pub TikTok — l'app est peut-être patchée par Snap (d'où le Plan B 2 écrans intégré).

## FAIT (session 9+) — Crédits « gonflés » ×100 (affichage concurrent, coût réel inchangé)
Demande user (AskUserQuestion : « **Afficher gros** ») : matcher les chiffres de crédits des concurrents (CREDIA/Lumia affichent 2000/7000 crédits) « pour ceux qui payent ». Piège : leurs « 2000 crédits » sont des unités marketing gonflées, pas 2000 images.
Solution = **inflation ×100 sans toucher au coût réel** : `GENERATION_COST = 100` (1 image = 100 crédits ⇒ 2000 crédits = 20 images). Tous les `creditsPerPeriod` finis ×100 → l'affichage matche les concurrents, le nombre RÉEL d'images et le coût Replicate sont **identiques**. Honnête : crédits réels, coût/génération (100) annoncé en FAQ/chat + visible (le compteur header baisse de 100).
- [x] `server/lib/catalog.js` : `GENERATION_COST=100` ajouté ; `UNLIMITED` 9999→**9_999_900** (doit rester > plus gros palier fini signature_annual=84000, sinon la dérivation METERED + la détection « illimité » cassent) ; tous les `creditsPerPeriod` finis ×100 (weekly 500, monthly 1000, evasion_m 2000 / _a 24000, signature_m 7000 / _a 84000, avie-echappee 2000, avie-odyssee 6000).
- [x] `server/lib/http.js` : gate `credits < GENERATION_COST` + débit `- GENERATION_COST` + `credits_used: GENERATION_COST` (au lieu de −1). **METERED_PLANS inchangé** : {weekly, monthly, evasion, signature, lifetime_echappee, lifetime_odyssee} (vérifié par script).
- [x] `src/lib/planLabels.js` : `PLAN_CREDITS_LABEL` ×100 ; **helper `isUnlimitedPlan(plan)`** ajouté (prestige||lifetime_infini) → affiche « illimité » au lieu de la sentinelle 9 999 900.
- [x] `src/data/plans.js` : features « 20/70 transfos »→« 2000/7000 crédits / mois » ; lifetime « 20/60 crédits »→« 2000/6000 crédits / mois — à vie » (gardé « Transfos illimitées » + « Crédits illimités — à vie »).
- [x] `src/pages/Debloquer.jsx` : « 10 transfos / mois »→« 1000 crédits / mois inclus ».
- [x] `src/data/faq.js` + `src/components/chat/ChatWidget.jsx` : copy crédits passée à « **100 crédits par génération, quelle que soit la qualité** » (corrige un bug pré-existant : l'ancienne copy annonçait 1/2/3 crédits selon qualité, mais http.js débitait toujours un forfait).
- [x] `src/components/layout/Sidebar.jsx` + `src/pages/Studio.jsx` + `src/pages/Abonnement.jsx` : import `isUnlimitedPlan` + affichent « crédits illimités » pour prestige/lifetime_infini (sinon ils verraient 9 999 900).
- vite build : **117 modules, 0 erreur.** METERED_PLANS re-vérifié = {weekly, monthly, evasion, signature, lifetime_echappee, lifetime_odyssee}.
- **Reste** : commit + push (deploy Vercel). Hors scope assumé : « 3 crédits offerts » du free paraît petit à côté des chiffres gonflés (AuthModal/Footer/planLabels free).

## EN COURS — Limite par crédits (session 9+) — modèle MÉTRÉ (abonnés seuls)
Demande user (AskUserQuestion) : « **Limiter par crédits** » — chaque génération = −1 crédit ; à 0, **l'abonné** attend le renouvellement (10/mois) ou upgrade.
Contexte : début session 9, le gate crédits avait été retiré (génération « gratuite ») → après correction du double-paywall (HeroStudio passe `isUnlocked`), les abonnés étaient en illimité de fait. On re-branche le compteur côté serveur.

⚠️ **Itération 1 (commit faaa853) cassée → corrigée (commit a3779d6).** J'avais d'abord codé un modèle UNIFIÉ (−1 crédit pour TOUS, free inclus, en supposant que le trigger offre 3 crédits). **FAUX** : `schema.sql` met `credits_balance INTEGER NOT NULL DEFAULT 0` et `handle_new_user()` n'insère QUE `(id, email)` → **chaque nouveau free démarre à 0 crédit**. Résultat : tous les free bloqués (`402 no_credits`) dès la 1re génération → tunnel « générer → flouter → payer » MORT. Déployé en prod, puis corrigé.

Décision retenue — modèle **MÉTRÉ** (gate uniquement sur les abonnements décomptés) :
- **−1 crédit par génération UNIQUEMENT pour `METERED_PLANS`** (weekly, monthly, evasion, signature, lifetime_echappee, lifetime_odyssee) — abonnements à crédits FINIS. Dérivé du CATALOG : `0 < creditsPerPeriod < 9999` (zéro hardcode).
- **EXCLUS du décompte (génèrent librement)** : `free` (paywall = le FLOU, jamais un blocage — honore « générer → flouter → payer »), `snap_tuto` (0 crédit), `prestige` + `lifetime_infini` (illimités, sentinelle 9999).
- **Blocage à 0 AVANT l'appel Replicate**, uniquement pour un métré épuisé → `402 no_credits` (« attends le renouvellement / upgrade »).
- **Recharge par période** : déjà gérée par `webhook-core.grant()` (SET credits_balance sur checkout.session.completed + invoice.paid). Aucune modif webhook.
- **Affichage clair (flou levé)** reste gouverné par `isPaid(plan)` (inchangé). 2 gates distincts : crédits = générer (abonnés métrés) ; isPaid = voir net.

Fait :
- [x] `server/lib/http.js` — `verifyAuth`→`verifyAuthAndProfile` (lit plan+credits) ; **`METERED_PLANS`** dérivé du CATALOG ; check `402 no_credits` avant `generate()` SI `METERED_PLANS.has(plan) && credits<=0` ; débit −1 après succès SI métré (max 0, log-and-continue) ; renvoie `{ credits }`. **Vérifié** : node --check OK ; derivation = {evasion, lifetime_echappee, lifetime_odyssee, monthly, signature, weekly}, exclut free/snap_tuto/prestige/lifetime_infini ; vite build 117 modules 0 erreur.
- [x] `src/hooks/useStudio.js` — branche `no_credits` (affiche message serveur) ; `refreshProfile()` après génération réussie (MAJ compteur header). (Inchangé entre itér. 1 et 2.)
- [x] `src/lib/planLabels.js` — corrige `PLAN_CREDITS_LABEL` (weekly 15→5, monthly 42→10) = alignement sur le CATALOG (sinon pub mensongère sur /debloquer).
- Pas de DDL. Le free reste à 0 crédit (décision a0dca61 assumée) et n'est PAS bloqué (modèle métré). Le coût Replicate sur les non-payeurs n'est PAS borné par les crédits — borné seulement par le rate-limit (12/60s) + la compression image client.

À tester en prod (commit a3779d6 déployé) : **free génère librement → flou → CTA payer (NON bloqué)** ; abonné métré : compteur décrémente à chaque génération, à 0 → `no_credits` ; renouvellement webhook recharge.

⚠️ **Option alternative non retenue (à proposer si Dimitri veut borner le coût des non-payeurs)** : donner N crédits offerts au signup (`ALTER TABLE profiles ALTER COLUMN credits_balance SET DEFAULT 3` **+** modifier `handle_new_user()` pour insérer le crédit, **+** repasser au modèle UNIFIÉ qui gate aussi le free). Coûte une migration DDL + casse le « générer illimité avant de payer » au profit d'un quota d'essai.

## EN COURS — Connexion des API : faire marcher le studio (full prod)
Décisions validées avec l'utilisateur :
- **Périmètre : Tout** → Replicate (génération) + Supabase (auth/crédits/galerie) + Stripe (paiements).
- **Modèle : `google/nano-banana`** (Gemini 2.5 Flash Image) — édition d'image **préservant l'identité** en un seul appel (photo + instruction de scène ; le visage est gardé). **Pas de détection de visage ni de routage** : un seul modèle, le visage n'est pas requis (sans visage, le rendu est juste « moins toi »). Choisi pour l'identité, le coût et la vitesse (cf. session 5).
- **Clés** : token Replicate **dispo** (à placer en `.env.local`, jamais dans le code/chat). ⚠️ Le token collé en chat est **compromis** → à révoquer + régénérer.

Contraintes d'archi (non négociables) :
- **Aucune clé côté navigateur.** Appels via couche serveur : `/api/*` = **fonctions serverless Vercel** en prod ; en dev, serveur Node local + proxy Vite `/api`→API. Cœur de logique partagé (`server/lib/`) entre les deux adaptateurs (dev Express / prod Vercel), zéro duplication.
- **Stub honnête conservé** tant qu'une clé manque ; jamais de faux résultat affiché comme réel.
- **Validation serveur systématique** (type/taille image, longueur prompt, quota) — pas seulement client.
- Modèle Replicate exact (`google/nano-banana`) : schéma d'input **vérifié** = `{ prompt, image_input: [bytes] }` (snippet officiel fourni par l'utilisateur). `useFileOutput: false` → sorties = URLs strings.

### Ordre de build (incrémental, vérifié à chaque palier)
**Phase A — Génération réelle** (« le studio marche ») — **CÂBLÉ ✓ (session 5)**, n'attend plus qu'un token valide
- [x] Infra dev : `server/lib/` (cœur partagé) + plugin Vite `server/dev-api.js` (dev) + `api/generate.js` (Vercel prod) ; `.env.local` (gitignored via `*.local`) + `.env.example` ; `.claude/launch.json` lance Vite (+ API montée par le plugin).
- [x] `POST /api/generate` : valide l'input (prompt non vide ; image = data URL `image/jpeg|png|webp`) → `google/nano-banana` (photo + prompt construit) ; renvoie `{ imageUrl, mode }`. Clé via `process.env.REPLICATE_API_TOKEN`. **Validation à la frontière AVANT le check token** (input malformé ⇒ 400 quel que soit l'état serveur).
- [x] ~~Détection visage~~ **supprimée** : nano-banana préserve l'identité nativement, pas de routage. Visage non requis (UploadPanel n'affiche plus de faux « visage détecté »).
- [x] `hooks/useStudio.js` : `handleGenerate` appelle `/api/generate` (loading réel, erreur honnête, rendu) — branché et vérifié.
- [x] Page révélation : `ResultView` (loader + image + aperçu **verrouillé** = tunnel paywall jusqu'à Stripe). Téléchargement réel = après déverrouillage (étape C).
- [x] Garde-fou coût : `server/lib/http.js` `rateLimit` 12 hits/60 s (in-memory) → 429. (Métrage crédits réel = Phase B.)
- [ ] **Reste pour générer pour de vrai** : un `REPLICATE_API_TOKEN` **valide** dans `.env.local` (le token collé en chat est compromis → révoquer + régénérer). Sans lui → stub honnête (503 `no_key` → aperçu verrouillé démo).

**Phase B — Supabase (auth + crédits + galerie)** — **CÂBLÉ ✓ · clés chargées ✓ · schéma appliqué ✓ (session 7)** — n'attend plus que le test du flux complet
- [x] Schéma : `profiles` (+ RLS, trigger `handle_new_user` = 3 crédits à l'inscription), `generations`. **Vérifié session 7** : `GET /rest/v1/profiles` → 200 `[]` (table existe). Auth login/signup câblés (AuthContext/AuthModal/Sidebar).
- [x] Clés serveur **et** client chargées (cf. session 7 : `.env.local` était malformé, corrigé). `/api/checkout` franchit la garde `supabase_missing`.
- [ ] **À tester** (nécessite une vraie génération = dépense Replicate) : signup → 3 crédits affichés → génération → décrément crédit **côté serveur**. Galerie utilisateur.

**Phase C — Stripe (abos + one-time + crédits)** — **CÂBLÉ ✓ (session 6) · CLÉS TEST CHARGÉES ✓ (session 8)** — prêt à tester carte `4242`
Principe sécurité : catalogue source de vérité **côté serveur** (`server/lib/catalog.js`) ; le client n'envoie JAMAIS un prix, seulement un `priceKey` (anti-tampering). Webhook à signature vérifiée = seule source de vérité pour créditer.
- [x] `npm install stripe` (+ `.env.example` : blocs Supabase & Stripe documentés, vars vides dans `.env.local`).
- [x] `server/lib/catalog.js` — map `priceKey` → `{ mode, amount(cents), currency, interval, creditsPerPeriod, plan }` :
      `weekly`(199/sem) · `monthly`(299/mois) · `evasion_monthly`(499) · `evasion_annual`(4788) · `signature_monthly`(999) · `signature_annual`(9588) · `prestige_monthly`(1999) · `prestige_annual`(19188) · `avie-echappee`(4900 one-time) · `avie-odyssee`(9900) · `avie-infini`(16900). + `getPriceId`/`priceKeyFromId` (lookup `stripe-prices.generated.json`, chargement défensif).
- [x] `scripts/stripe-setup.mjs` — crée Produits+Prix (idempotent via `lookup_key`), masque le token, valide `sk_`, log TEST/LIVE, écrit `server/lib/stripe-prices.generated.json` (price_id non secrets, committables), rappelle le restart dev.
- [x] `server/lib/checkout-core.js` + `api/checkout.js` + route dev (`server/dev-api.js`) — ordre de validation : CATALOG(400 `bad_plan`) → Stripe(503 `stripe_missing`) → Supabase(503 `supabase_missing`) → priceId(503 `stripe_not_setup`) → origin(400 `bad_origin`) → JWT(401 `not_authenticated`) → get-or-create Stripe customer (`profiles.stripe_customer_id`) → Checkout Session (mode abo/paiement, `allow_promotion_codes`), `success_url=/studio?checkout=success`.
- [x] `server/lib/webhook-core.js` + `api/stripe-webhook.js` (RAW body + `constructEvent`, `bodyParser:false`) + route dev — `checkout.session.completed`/`invoice.paid` → **SET** (idempotent) `plan` + `creditsPerPeriod` (via service_role) ; `customer.subscription.deleted` → `free`. `userIdFromCustomer` (lookup par `stripe_customer_id`).
- [x] Client : `src/lib/checkout.js` (`startCheckout(priceKey)`) ; CTA `Debloquer` (weekly/monthly) + `Abonnement` (handleSelect → `${id}_${billing}`, handleLifetime → `id`) ; `Studio` gère `?checkout=success` (refreshProfile immédiat + à 3 s pour le webhook async + bannière). Pas de clé publishable (redirection Checkout hébergé).
- Crédits/période (dans catalog.js) : evasion 20 · signature 70 · prestige illim.(9999) · à-vie 20/60/illim. · paywall weekly 5 / monthly 10 ; annuel = 12× le mensuel.
- Simplifications v1 actées : illimité = 9999 cr/période (pas de bypass http.js) ; annuel = 12× le mensuel crédité d'un coup ; « à vie X/mois » = X crédité à l'achat, recharge mensuelle = **cron TODO**.
- **Reste pour encaisser pour de vrai** (prérequis user, JAMAIS en chat) : clé TEST `sk_test_` → `.env.local` → `node scripts/stripe-setup.mjs` → `stripe listen --forward-to localhost:5180/api/stripe-webhook` pour le `whsec_` → **stop+start** dev → tester carte `4242 4242 4242 4242`. Sans clé → 503 `stripe_missing` (stub honnête, aucun faux paiement).
- ✅ **DÉBLOQUÉ (session 8)** : `sk_test_` chargée + 11 produits créés (`stripe-prices.generated.json`) + webhook listener actif (`whsec_` dans `.env.local`) + pipeline vérifié : `401 not_authenticated` = Stripe entièrement opérationnel, auth seule requise pour finaliser. Tester : signup → login → clic « S'abonner » → carte `4242 4242 4242 4242`.
- ✅ **UX déblocage (session 8+)** — implémenté + compile vérifié (transform frais `HTTP 200`), profil remis à zéro (`free`/3 crédits/snap verrouillé), webhook listener (PID stripe) + dev 5180 actifs. Prêt à tester de zéro :
  - **Tuto Snap** : 5 étapes **toutes masquées** tant que non payé (placeholders + overlay opaque `#0a0a0a/95`). Achat snap-tuto → `success_url=/tuto-snap?checkout=success`. Déverrouillage = `hasSnapAccess(plan)` **OU** `user_metadata.snap_tuto_unlocked` (le webhook écrit ce flag **si déjà abonné**, sinon `profiles.plan='snap_tuto'`). Timing corrigé : `useEffect([user?.id])` rafraîchit dès la session async chargée ; `refreshProfile` fait `supabase.auth.getUser()` → `user_metadata` frais (bypass JWT caché).
  - **Studio défloutage** : photo gratuite floutée + persistée en `sessionStorage` (`pc_pending_result`, survit au redirect Stripe même onglet). Retour `/studio?checkout=success` → `restorePending()` restaure la photo + `justUnlocked=true` → `ResultView` démarre flouté puis **anime la révélation** (`blur-2xl scale-110` → `blur-0 scale-100`, 1400 ms) une fois `isUnlocked` confirmé. Téléchargement = fetch→blob→anchor.
  - Webhook : garde `SUBSCRIPTION_PLANS` empêche `snap_tuto` d'écraser un plan d'abo.
- ✅ **Refonte paywall + Google (session 8+)** — compile OK (`node_modules/.bin/vite build` : 116 modules, 0 erreur) :
  - **ResultView verrouillé** redesigné façon Ravage (marque bleue) : bandeau urgence « Supprimée dans M:SS » (compteur **visuel** — la photo n'est PAS réellement supprimée), badge « 🔒 Verrouillée » + cadenas centré sur l'aperçu flouté, badge « ✓ Ta photo est prête ! », CTA **« ⚡ Débloquer ta photo » → `/debloquer`** (au lieu de `/abonnement`), réassurance ★★★★★ 4,9/5 · paiement 100% sécurisé.
  - **Aperçu admin SUPPRIMÉ** partout : composant `AdminPreview` + props `isAdmin`/`ADMIN_EMAIL` retirés de `ResultView` + `Studio.jsx` + `HeroStudio.jsx` (import `useAuth` devenu inutile retiré dans HeroStudio). Plus personne ne voit le rendu réel sans payer.
  - **`/debloquer` (Debloquer.jsx)** enrichi : CTA prix dynamique « Débloquer maintenant — {1,99€|2,99€} » (`PRICE_LABEL[plan]`), social proof « 10 000+ créateurs », note ★★★★★ 4,9/5 ; countdown + réduction + features + « paiement 100% sécurisé » déjà présents.
  - **Google OAuth** ajouté à `AuthModal` : `supabase.auth.signInWithOAuth({ provider:'google', options:{ redirectTo: origin+pathname } })` + bouton « Continuer avec Google » + séparateur « ou ». ⚠️ **Inopérant tant que le provider Google n'est pas activé côté dashboard** : Supabase Auth → Providers → Google (Client ID/Secret depuis Google Cloud, callback `https://<ref>.supabase.co/auth/v1/callback`) + Redirect URLs allow-list (localhost + prod). Le trigger `handle_new_user` crée le profil pareil pour un signup Google (email présent).
- [ ] **RESTE — pay-before-generate** (demande explicite : « il paye AVANT que ça soit généré ») : aujourd'hui `handleGenerate` appelle Replicate PUIS floute → coût IA sur les non-payeurs. À refondre : différer l'appel `/api/generate` après le paiement (sauver la **requête** en sessionStorage, pas le résultat ; aperçu = photo uploadée floutée ; générer au retour `?checkout=success` avec retry pour le lag webhook). + passer le signup gratuit à **0 crédit** (DDL `ALTER TABLE profiles ALTER COLUMN credits_balance SET DEFAULT 0` à lancer par Dimitri dans Supabase) et remettre son compte test à 0.

### Prérequis utilisateur (au fil des phases)
- A : `REPLICATE_API_TOKEN` → `.env.local` (dispo ✓).
- B : `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` + projet créé.
- C : `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `VITE_STRIPE_PUBLISHABLE_KEY` + produits configurés.

## Fait — Session 7 : reprise (« relance prankcreation ») — déblocage Phase B
Demande : reprendre où on s'était arrêté. État trouvé : serveur dev déjà up (5180, depuis 15:30) mais env **périmé/malformé**.
- [x] **Cause racine corrigée — `.env.local` malformé** : URL Supabase + clés anon/service_role + clé OpenAI collées en **lignes nues** (sans `NOM_VAR=`) → invisibles pour le code → Phase B silencieusement morte. Reconstruit en `CLE=valeur` (URL+anon dupliquées sur `SUPABASE_*` **et** `VITE_SUPABASE_*`), sauvegarde `.env.local.bak`, valeurs jamais affichées (cf. lessons.md).
- [x] **Stop+start** serveur (preview `destinia`) pour charger l'env corrigé (env hors HMR). Vite boot 0 erreur (`prankcreation@0.1.0`, 345 ms) ; landing rend (`<title>` PrankCreation, h1 « Bluffe tes potes », 0 overlay Vite, 4106 car.) → `createClient(VITE_…)` ne throw pas = **Supabase client OK**.
- [x] **Vérifs honnêtes** (codes HTTP réels) : `/api/checkout {monthly}` → **503 `stripe_not_setup`** (clés Stripe+Supabase chargées, aucun appel live atteint) ; `GET /rest/v1/profiles` → **200 `[]`** (schéma Supabase **appliqué**). → **Phase B débloquée et live.**
- [x] **Sécurité** : détecté `STRIPE_SECRET_KEY = sk_live_…` (production). Refus de lancer setup/checkout. Bloqueur reporté en Phase C (clé TEST requise).
- Reste immédiat (user) : coller une `sk_test_` (+ `whsec_` via `stripe listen`) pour finir Phase C ; sinon, tester une vraie génération Replicate (Phase A/B end-to-end).

## Fait — Session 6 : câblage Stripe (paywall /debloquer + /abonnement)
Demande : « laisse nano-banana pro […] et viens en connect stripe ». Modèle tranché empiriquement (A/B sur Bugatti : nano-banana-pro garde une plaque nette + cadrage arrière fidèle ; seedream-4.5 a écrit « BUGGATTI » et inversé la voiture → **nano-banana-pro retenu**). Puis build Stripe complet, **pattern cœur-partagé** identique à generate.js (dev plugin Vite ↔ fonctions Vercel).
- [x] `npm install stripe` ; `server/lib/stripe.js` (client lazy, `null` si pas de clé = stub honnête).
- [x] `server/lib/catalog.js` (11 priceKeys, source de vérité) + `scripts/stripe-setup.mjs` (idempotent `lookup_key`, écrit `stripe-prices.generated.json`).
- [x] `server/lib/checkout-core.js` + `webhook-core.js` ; adaptateurs `api/checkout.js`, `api/stripe-webhook.js` (RAW body) + 2 middlewares dans `server/dev-api.js` (+ `STRIPE_SECRET_KEY`/`STRIPE_WEBHOOK_SECRET` dans le pont d'env).
- [x] Client : `src/lib/checkout.js` ; CTA branchés `Debloquer.jsx` + `Abonnement.jsx` ; `Studio.jsx` gère `?checkout=success` ; `.env.example` documenté.

**Vérifié ✓** — `node --check` OK sur les 9 fichiers ; import `stripe` OK ; imports runtime `checkout-core`/`webhook-core`/`catalog` OK (11 priceKeys, `getPriceId('monthly')=null` attendu avant setup) ; `vite build` propre (113 modules, 1.86 s). **Routes HTTP testées** (serveur jetable 5199, clé Stripe vide), corps lus en octets réels (`od -c`, pas l'affichage `curl` qui masque le JSON — cf. lessons.md) :
- `POST /api/checkout {priceKey:"monthly"}` → **503 `stripe_missing`** (priceKey valide → `getStripe()` null) ;
- `POST /api/checkout {priceKey:"nope"}` → **400 `bad_plan`** « Offre inconnue. » (CATALOG validé en premier) ;
- `POST /api/stripe-webhook` sans signature → **503 `stripe_missing`** (garde avant `constructEvent`) ;
- `GET /api/checkout` → **405 `method`** « POST requis. ».
Ordre de validation à la frontière prouvé : input/catalogue **avant** l'état serveur. Stub honnête actif tant que `STRIPE_SECRET_KEY` est vide. **Reste = clés TEST user** (cf. Phase C).

## Fait — Session 5 : câblage génération réelle (Replicate · google/nano-banana)
Demande : « connecte l'API pour générer les photos d'abord » → choix du modèle. L'utilisateur a tranché **`google/nano-banana`** (token + snippet officiel fournis). Adaptation de l'infra serveur (déjà bâtie pour InstantID/FLUX) au modèle unique nano-banana, **tous les contrôles de sécurité conservés**.
- [x] `server/lib/replicate.js` — `runInstantId`+`runFlux` remplacés par **`runNanoBanana({ image, prompt })`** : `client.run('google/nano-banana', { input: { prompt, image_input: [bytes] } })`. `useFileOutput:false` → `firstUrl()` normalise en URL string. `isAuthError` (401/403) conservé.
- [x] `server/lib/generate.js` — un seul appel nano-banana (pas de fallback). **Validation réordonnée AVANT le check token** (input malformé ⇒ 400 quel que soit l'état serveur). `dataUrlToBuffer` (regex `^data:(image/(jpeg|png|webp));base64,…`) = **anti-SSRF** : toute URL fournie par le client est rejetée (aucune URL distante n'atteint Replicate). Prompt d'édition « garde le visage/l'identité, place dans la scène, photoréaliste ». Constante `QUALITY` morte retirée.
- [x] `src/hooks/useStudio.js` + `src/components/studio/UploadPanel.jsx` — commentaires obsolètes (InstantID/FLUX) corrigés → nano-banana. Comportement client inchangé.
- [x] `.env.local` : `REPLICATE_API_TOKEN` **vide** (placeholder) → mode stub honnête actif.

**Vérifié navigateur ✓** (serveur 5180 **stop+start** car `server/lib` hors HMR ; Vite boot 0 erreur d'import ; `prankcreation@0.1.0`). `POST /api/generate` testé sur 4 branches, token vide :
- input valide (PNG data URL + prompt) → **503 `no_key`** (chemin stub → aperçu verrouillé démo) ;
- prompt vide → **400 `no_prompt`** (rejeté à la frontière, avant le check token) ;
- **URL en guise d'image** (`https://evil.example.com/…`) → **400 `no_image`** (**anti-SSRF prouvé** : le serveur ne fetch jamais l'URL du client) ;
- image absente → **400 `no_image`**.
Greps propres : 0 `runInstantId`/`runFlux`/`InstantID`/`flux` résiduel (code **et** commentaires).

**Reste pour « générer pour de vrai »** : token Replicate **valide** dans `.env.local` (celui collé en chat est **compromis** → révoquer + régénérer sur replicate.com). Ensuite : test A/B nano-banana sur transfos réelles, puis Phase B (Supabase), Phase C (Stripe).

## Fait — Session 4 : Rebrand DestinIA → PrankCreation (avant connexion API)
Demande : « avant de connecter l'api fais le rebrand… c'est plus seulement le voyage mais voiture, ajouter des filles, muscler etc, plusieurs choix → change le copywriting, design type capture Lumia pour cibler les lycéens, couleur bleu ; après on connecte l'API (photos d'abord, vidéos plus tard), Supabase et Stripe ».
Front pur, sans clé. **3 sous-agents parallèles** (un jeu de fichiers disjoint chacun, spec de voix de marque partagée).
- [x] **1. Tokens & style global** — `tailwind.config.js` : token `gold`→`bleu` (#3B82F6, light #38BDF8, dark #2563EB, glow/shadow/`bleu-line`), `fontFamily.display` Playfair→**Sora**. `index.html` : `<title>` PrankCreation + lien Google Fonts Sora+Inter. `index.css` : `::selection`, `.text-gradient-bleu`, `.btn-bleu` (text-white), `.eyebrow` bleu. ⚠️ **stop+start serveur** (HMR ne recharge pas la config).
- [x] **2. Classes gold→bleu (composants)** — `for f in $(grep -rl gold src…); do perl -i -pe 's/gold(?!en)/bleu/g' "$f"; done` (lookahead `(?!en)` protège le style d'éclairage réel **`golden`**/« Golden hour » des prompts Replicate). + fixes manuels : hex/rgba en dur (SocialProof `#3B82F6`, ChatWidget/Sidebar `rgba(59,130,246,…)`), `text-noir`→`text-white` sur fonds dégradés bleus (Testimonials, LifetimeCard, PlanCard, Abonnement).
- [x] **3. Catégories : `destinations`→`transfos`** — `data/transformations.js` (NOUVEAU, remplace `destinations.js` **supprimé**) : 8 presets (voyage🌴, voiture🏎️, muscle💪, soiree🎉, argent💸, paysage🌆, tenue🧥, neige🏔️) avec `promptSeed`/`gradient`/`flag`/`popular`. « ajouter des filles/gens » = preset **soiree** en **composition de scène** (fête, amis) — jamais explicite, ni ciblage d'une personne réelle (app publiable stores/Stripe). Consommateurs recâblés (HeroBackdrop, BeforeAfterSlider, PromptPanel, DestinationsGrid — ancre `#destinations` conservée).
- [x] **4. Copy landing (ado)** — Hero (« Bluffe tes potes / avec une seule photo », sous-titre multi-transfo), HowItWorks (« Choisis ta transfo · 8 catégories »), BeforeAfterSlider, DestinationsGrid (« En quoi tu veux te transformer ? »), SocialProof, Footer (« Tes potes vont halluciner »), SnapTip. Testimonials/TrustBadges inchangés (volontaire).
- [x] **5. Copy studio + chat + sidebar** — PromptPanel (« Décris ta transfo »), HeroStudio (« 3 transfos offertes »), UploadPanel (« Lâche ton selfie ici »), ResultView, ChatWidget (greeting + intent visage multi-transfo ; **intent prix gardé au mot près** : Évasion 4,99/Signature 9,99/Prestige 19,99).
- [x] **6. Copy pages + plans + légal + package.json** — `package.json` name `prankcreation` ; Confidentialite (hello@prankcreation.app, clause d'âge gardée), MentionsLegales, Studio, Abonnement (« Débloque toutes tes transfos »), plans.js (taglines + feature « Toutes les catégories » ; **noms+montants intacts**), faq.js (8 Q/R réécrites + Snap rouge), testimonials.js (4.9/1284 gardé, quotes par catégorie).

**Vérifié navigateur ✓** (serveur 5180 **stop+start** car `tailwind.config.js` modifié ; 0 erreur console) : `<title>` « PrankCreation — Photos & vidéos IA bluffantes » ; `.eyebrow` = `rgb(59,130,246)/.8` (**bleu compilé**) ; `h1` police **Sora** chargée (`document.fonts` status `loaded`) ; landing h1 « Bluffe tes potes avec une seule photo » (« photo » dégradé bleu) ; /abonnement = Évasion/Signature/Prestige (montants intacts) ; /studio = « TA PHOTO » + « transfo ». **0 overflow horizontal de page** (`documentElement.scrollWidth-clientWidth = 0`) en **desktop 1280** ET **mobile 375** (les 138 « offenders » au scan = items du `animate-marquee`, clippés par `overflow-hidden`, pas de scroll de page). Greps propres : 0 `destinia`, 0 token `gold` résiduel, `destinations.js` supprimé sans import orphelin.

### Reste (annoncé à l'utilisateur après rebrand) → enchaîner sur « ## EN COURS — Connexion des API »
Rebrand fini → prochaine étape = **Phase A (Replicate, photos)**, puis Supabase, puis Stripe. Prérequis : `REPLICATE_API_TOKEN` dans `.env.local`.

## Fait — Session 3 : offres « À vie » (paiement unique) sur /abonnement
Demandes successives : « ajoute un plan à vie » → « met le avec mensuel et annuel » → « met moins cher et met plusieurs choix ».
→ **3e option du toggle** (Mensuel · Annuel · **À vie**) : sélectionner « À vie » **remplace** la grille des 3 tiers d'abonnement par une grille de **3 paliers paiement unique** (moins chers, plusieurs choix). DA luxe or/sombre, front pur, sans clé. 0 modif `tailwind.config.js`.
- [x] `data/plans.js` — export `lifetimePlans` (array de 3) : **Échappée 49 €** (20 créd./mois à vie) · **Odyssée 99 €** *(populaire)* (60 créd./mois à vie, tuto Snap offert) · **Infini 169 €** (crédits illimités à vie). + 3e entrée `{ id: 'lifetime', label: 'À vie' }` dans `billingOptions`. **Prix (49/99/169 €) + quotas = placeholders à valider (décision business)** — signalé en commentaire. Coût borné : seul « Infini » est illimité.
- [x] `components/pricing/LifetimeCard.jsx` (NOUVEAU) — carte compacte calée sur `PlanCard` (badge « Le plus choisi » si populaire, prix unique « X € une fois » + pill or « Paiement unique · à vie », features ✓, CTA gold/ghost). Stub honnête.
- [x] `pages/Abonnement.jsx` — rendu conditionnel dans **la même grille** `md:grid-cols-3` : `billing === 'lifetime'` → `lifetimePlans.map(LifetimeCard)`, sinon `plans.map(PlanCard)`. Handler `handleLifetime` réutilisé (notice « …paiement unique… · Stripe étape 6 »).
- [x] `components/pricing/LifetimePlan.jsx` (ancienne carte unique 299 €) **supprimé** — code mort après le passage aux 3 paliers (grep : 0 référence). Serveur **stop+start** pour purger le graphe HMR après suppression (cf. lessons.md).

**Vérifié navigateur ✓** (serveur 5180 redémarré, 0 erreur console, 0 vite-overlay) : toggle = Mensuel · Annuel −20% · À vie ; défaut (annuel) = 3 tiers abo (Évasion/Signature/Prestige, 3,99…) ; clic « À vie » → 3 cartes À vie (Échappée 49 € · Odyssée 99 € « Le plus choisi » · Infini 169 €, toutes « une fois » + pill « Paiement unique · à vie », 4/6/7 avantages, 0 nom d'abo qui fuit) ; CTA Odyssée → notice « Offre « Odyssée » · 99 € (paiement unique) sélectionnée. …Stripe étape 6. » ; **mobile 375** = 3 cartes empilées 1 colonne, **0 overflow horizontal de page**.

## Fait — Session 3 : studio embarqué (home) + section Snap « partout » (inspiration Lumia)
Demande : « ajoute la section snap, fais en sorte que ça s'affiche un peu partout et ajoute le studio en dessous du titre ».
Pattern UX Lumia emprunté, **DA luxe or/sombre conservée (zéro violet)**. Front pur, sans clé.
Contrainte : couleurs core Tailwind (tokens red/emerald/gold existants) → 0 modif `tailwind.config.js`.
NB : un **stop+start** a été fait pour purger un faux `ReferenceError` HMR (cf. lessons.md), pas pour une modif de config.

### A. Logique métier partagée (DRY)
- [x] `hooks/useStudio.js` (NOUVEAU) — extrait l'état du Studio (image, faceState 1400 ms, prompt, style, quality, generating, notice, canGenerate, handleGenerate stub) + `COST`. Partagé page /studio ↔ studio embarqué.
- [x] `pages/Studio.jsx` — refactor pour consommer `useStudio` (comportement identique, 3 panneaux inchangés) + SnapTip ajouté en bas.

### B. Studio sous le titre du hero
- [x] `components/studio/HeroStudio.jsx` (NOUVEAU) — carte compacte 2 colonnes (UploadPanel + PromptPanel) + bouton « Générer ma photo » (stub honnête) + lien « Studio complet → » + note « Replicate étape 3 ». Réutilise useStudio.
- [x] `components/landing/Hero.jsx` — HeroStudio inséré sous le titre ; les 2 CTA redondants remplacés (le studio EST l'action) ; lien « ou voir des exemples → » conservé ; import `Link` mort retiré.

### C. Section Snap enrichie (Lumia) + « un peu partout »
- [x] `pages/TutoSnap.jsx` — refonte : « Pourquoi débloquer ? » 3 bénéfices (Anonymat / pas de tag « importé » / 30 s), 5 étapes **floutées + verrouillées**, carte « Débloquer le tuto — 4,99 € » (stub honnête : dévoile gratuitement pendant le lancement, « aucun débit · Stripe étape 6 »), preuve sociale « 2 300+ », « Paiement unique · Accès à vie », badge « ✓ Débloqué » au clic.
- [x] SnapTip monté sur **Landing** + **Studio** (en plus d'**Abonnement**) ; item **« Tuto Snap »** ajouté à la sidebar (`/tuto-snap`, icône fantôme) → visible partout.

**Vérifié navigateur ✓** (serveur 5180 redémarré, 0 erreur console) : home = studio embarqué fonctionnel (fichier injecté → « Visage détecté » → prompt → bouton activé → clic → notice « …étape 3 (Replicate) ») ; sidebar « Tuto Snap » actif ; tuto-snap = 3 bénéfices + étapes floutées + déverrouillage (badge ✓ + note « aucun débit ») ; SnapTip présent sur landing/studio/abonnement ; mobile 375 = 0 overflow horizontal (home, tuto-snap, studio, abonnement).

## Fait — Session 2 : conversion + légal + chatbot (front pur, sans clé)
Demande : FAQ, « Comment ça marche », pricing avec réductions visibles, avis enrichis,
couleurs/techniques, mentions légales + politique de confidentialité, page Tuto Snap, chatbot.
Contrainte respectée : palette **core Tailwind** (emerald/sky/amber/red) → 0 modif `tailwind.config.js` → pas de redémarrage.

### A. UI sans clé — FAIT
- [x] `components/landing/HowItWorks.jsx` — 3 étapes (upload → décor → partage), accents couleur (sky/gold/emerald)
- [x] `data/faq.js` + `components/landing/Faq.jsx` — accordéon réutilisable, filtrable par `tag` (Landing = toutes, Abonnement = pricing)
- [x] Avis enrichis : `data/testimonials.js` (6 + note ★) + `Testimonials.jsx` (note agrégée 4,9/5, étoiles or)
- [x] Pricing : `data/plans.js` (`annualSavings`) + `PlanCard.jsx` (prix mensuel barré + pill emerald −XX€) + bandeau « Offre de lancement −20% »
- [x] `components/landing/TrustBadges.jsx` — paiement sécurisé / RGPD / sans engagement / satisfaction (réutilisable)
- [x] `components/legal/LegalPage.jsx` + `pages/MentionsLegales.jsx` + `pages/Confidentialite.jsx` (identité = placeholders `[À compléter]`, zéro invention ; sous-traitants Replicate/Supabase/Stripe/Vercel)
- [x] `pages/TutoSnap.jsx` — la technique Snap en 5 étapes (SnapTip → `Link to="/tuto-snap"`)
- [x] `components/chat/ChatWidget.jsx` — bulle flottante + réponses scriptées par mots-clés (stub honnête ; IA conversationnelle réelle = clé LLM)
- [x] Câblage : `App.jsx` (3 routes) · `Footer.jsx` (liens légaux) · `AppLayout.jsx` (ChatWidget global) · `Landing.jsx` (HowItWorks+Faq) · `Abonnement.jsx` (bandeau+TrustBadges+Faq)

**Vérifié navigateur ✓** (serveur 5180) : 5 routes + 3 nouvelles rendent (h1 OK, 0 vite-overlay, 0 erreur console) ; FAQ accordéon toggle (aria-expanded) ; chat ouvre + répond (intent prix → « Trois plans » + bouton « Voir les tarifs ») ; pricing annuel = prix barré (4,99/9,99/19,99) + pills −12/−24/−48 €/an + bandeau lancement + trust badges ; mobile 375 = 0 overflow (landing, abonnement, panneau chat 16→359 px).

### B. Bloqué — assets manquants (vraies photos)
- [ ] Photos hero (fond), avant/après, destinations → déposer dans `/public/…` puis câbler (fallback gradient)

### C. Bloqué — clés API
- [ ] Replicate (`REPLICATE_API_TOKEN`) — génération ; **décider préservation visage** (InstantID/PuLID/IP-Adapter FaceID)
- [ ] Supabase (auth/crédits/galerie) · Stripe (abos + one-time) · chatbot IA réel (clé LLM)

## Ordre de build strict
- [x] 1. Landing page (hero, slider avant/après, preuve sociale, grid 8 destinations, témoignages)
- [x] 2. Studio (upload + détection visage simulée, picker destinations + sous-catégories, options style/qualité, bouton générer en stub)
- [ ] 3. Intégration Replicate API (génération photo) — **clé requise**
- [ ] 4. Loader + page révélation résultat
- [ ] 5. Système de crédits + Supabase — **clés requises**
- [ ] 6. Stripe (abonnements + crédits one-time) — **clés requises**
- [ ] 7. Galerie utilisateur
- [x] 8. Page pricing /abonnement — **UI faite** (front pur, sans clé) ; checkout réel = étape 6 (Stripe)

## Fait — Refonte structure « appli » (sidebar type Lumia)
Objectif : passer du « site web » à une **coque appli** : sidebar gauche fixe + sections claires. DA luxe or/sombre conservée.
Front pur, sans clé — vérifié dans le navigateur (desktop 1280 + mobile 375, 0 erreur console, pas d'overflow horizontal). Aucune modif `tailwind.config.js` → pas de redémarrage requis (tokens existants + utilitaires core).
Choix : prix 4,99/9,99/19,99 € · sidebar gauche · sections Invite & Gagne + Concours du mois · titre « Fais croire que tu voyages partout ».

**Coque de navigation**
- [x] `components/layout/Sidebar.jsx` — logo DestinIA (→ Accueil) + items NavLink : Accueil · Studio · Abonnement · Invite & Gagne · Concours du mois ; bas = « Se connecter » (stub). Item actif = pill or (état NavLink). Icônes SVG inline.
- [x] `components/layout/AppLayout.jsx` — sidebar fixe (w-64) + `<Outlet />` décalé (`lg:pl-64`). Mobile : barre top + hamburger qui ouvre la sidebar en drawer.
- [x] `App.jsx` — route layout englobant : `/` Accueil, `/studio`, `/abonnement`, `/invite`, `/concours`.

**Pages**
- [x] `Hero.jsx` — nouveau titre « Fais croire que tu voyages **partout** » (mot en or). Reste conservé (mosaïque, compteur).
- [x] `Landing.jsx` (Accueil) — retirer le `<Navbar />` (remplacé par la sidebar) ; garder hero/preuve/slider/destinations/avis/footer.
- [x] `Abonnement.jsx` — retirer le header de page (← Accueil / logo / Studio) redondant avec la sidebar.
- [x] `Studio.jsx` — adapter son header au shell (pas de double nav).
- [x] `pages/Invite.jsx` (NOUVEAU) — parrainage : lien à copier (clipboard, lien factice), 3 étapes, stats « 0 filleul / 0 crédit » + note « suivi réel = étape Supabase ». Stub honnête.
- [x] `pages/Concours.jsx` (NOUVEAU) — « 🎁 Concours du mois · EN COURS », règle (3 abonnés tirés au sort → 30 photos), X participants, date limite, condition, bouton « S'inscrire » = stub honnête.

**Prix**
- [x] `data/plans.js` — Évasion 4,99→3,99 (47,88 €/an) · Signature 9,99→7,99 (95,88 €/an) · Prestige 19,99→15,99 (191,88 €/an).

**Nettoyage**
- [x] `Navbar.jsx` — supprimé (grep : 0 référence dans `src/`) — pas de code mort.

**Vérifié ✓** : sidebar active par route (Accueil/Studio/Abonnement/Invite/Concours) ; drawer mobile ouvre → navigue → ferme ; prix mensuels **4,99/9,99/19,99 €** + annuels 3,99/7,99/15,99 (47,88/95,88/191,88 €/an) ; titre hero « voyages **partout** » (or) ; 2 nouvelles pages avec stubs honnêtes (copie lien presse-papiers, inscription concours, notes Supabase/Stripe) ; 0 erreur console sur les 5 routes ; pas d'overflow horizontal (375=375).

## Fait — 3 ajouts UI (inspiration Lumia, DA luxe conservée)
Front pur, sans clé (vérifié dans le navigateur : 3 strips animées, compteur +5/6 s, stub Snap honnête, 0 erreur console, pas d'overflow mobile).
- [x] **Fond hero mosaïque** : `HeroBackdrop.jsx` — 3 rangées de tuiles (gradients destinations,
      pas d'URL externe) en défilement horizontal lent auto (keyframes `marquee` 70 s / `marquee-rev` 90 s Tailwind),
      overlay sombre ~70 % + fondu vertical pour lisibilité du titre, lueurs or conservées. `motion-reduce:animate-none`.
- [x] **Compteur live hero** : sous le CTA, « 🔥 [X] photos générées aujourd'hui » — socle 12 847 (= SocialProof),
      +1..+3 toutes les 2,2–5,2 s (setTimeout récursif, cleanup au démontage). Simulation assumée, pas une vraie métrique.
- [x] **Section « Snap rouge »** sur /abonnement après le pricing : `SnapTip.jsx` — badge « 🔴 Astuce exclusive 🔴 »,
      titre Snapchat, bouton « Voir la technique — 4,99€ », « Paiement unique · Accès à vie ».
      Stub honnête (message inline « Stripe étape 6, aucun débit »). DA : rouge maîtrisé (crémeux sombre), non criard — à valider.
- ⚠️ NB : modif `tailwind.config.js` → redémarrage serveur dev requis (HMR ne recharge pas la config) — cf. lessons.md.

## Fait — Refonte Studio : prompt libre + chips (inspiration Lumia)
Grille de destinations fixe remplacée par un système mixte (vérifié dans le navigateur).
- [x] `destinations.js` : `promptSeed` ajouté aux 8 destinations, `subcategories` supprimées (devenues mortes)
- [x] `PromptPanel.jsx` (remplace `DestinationPicker.jsx`) : textarea libre (200 car + compteur,
      placeholder « Décris où tu veux être placé… ») + 8 chips qui pré-remplissent le champ au clic
- [x] `Studio.jsx` : état `prompt` au lieu de selectedDest/sub ;
      canGenerate = photo + visage détecté + prompt non vide ; notice = texte saisi
- [x] `OptionsPanel.jsx` : helper « …choisis une destination » → « …décris ton voyage »
- [x] Limite 200 car appliquée dans le handler (slice) + maxLength — le texte partira tel quel dans Replicate (étape 3)
DA : luxe sombre/or conservé — on n'a emprunté QUE le pattern UX de Lumia, pas son violet.

## Fait — Page /abonnement (inspiration Lumia, DA luxe)
Front pur, sans clé Stripe (vérifié dans le navigateur). Route `/abonnement` + liens « Tarifs » (Navbar + Footer).
- [x] `data/plans.js` : 3 plans Évasion / Signature (populaire) / Prestige · prix mensuel + annuel (-20%)
- [x] `components/pricing/PlanCard.jsx` : carte (badge « Le plus choisi », features ✓, CTA gold/ghost)
- [x] `pages/Abonnement.jsx` : header, hero, toggle Mensuel/Annuel, code promo, footer réutilisé
- [x] Boutons = stub honnête : « paiement Stripe branché à l'étape 6 » (jamais de faux paiement)
- [x] Routing (`App.jsx`) + entrées « Tarifs » dans `Navbar.jsx` et `Footer.jsx`

## Fait cette session
- Scaffold Vite + React + Tailwind (config DA luxe sombre : #0A0A0A / #C9A84C / #FFFFFF, Playfair + Inter).
- Routing `/` (Landing) et `/studio` (Studio).
- Étape 1 : landing complète avec slider avant/après interactif (drag).
- Étape 2 : studio 3 colonnes fonctionnel (upload réel + preview, sélection destination/sous-catégorie, options, bouton générer en stub honnête).
- Placeholders : dégradés CSS par destination (pas d'URLs externes). Vraies photos à déposer dans `/public/destinations/`.

## À décider avant l'étape 3
- **Préservation du visage** : FLUX `flux-dev` img2img ne garde PAS le visage de façon fiable.
  Choisir une approche identité : InstantID / PuLID / IP-Adapter FaceID, ou face-swap + compositing.
- Fournir les clés : REPLICATE_API_TOKEN, Supabase, Stripe.
