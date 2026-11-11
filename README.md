# Accord

**Accord is a Grokbot alternative — a chatbot/agent you actually own.**

Accord is a BYOK (Bring Your Own Key) AI assistant. Instead of a service supplying a shared key and billing you a markup, you plug in your own API key. Your key, your model, your cost, your data.

- 🤖 A clean alternative to Grokbot — chat and agent workflows, without the lock-in
- 🔑 BYOK — your key stays yours: stored only in your browser, never sent to our servers
- 🧠 Choice of models — pick any model your provider offers
- 🔒 Privacy-first — no accounts, no tracking, no middleman

## What's in the repo

| File | Purpose |
|------|---------|
| `index.html` | Landing page (hero, value props, how it works, get-started demo widget) |
| `styles.css` | Modern dark, responsive styling |
| `app.js` | Demo widget logic (BYOK key handling + chat UI) |
| `README.md` | This file |

No build step, no frameworks, no backend. Plain HTML/CSS/JS.

## Run locally

```bash
git clone https://github.com/WBR-Technologies/Accord.git
cd Accord
# any static server works, e.g.:
python3 -m http.server 8000
# then open http://localhost:8000
```

(Or just open `index.html` in a browser.)

## Enable GitHub Pages

1. Go to **Settings → Pages** on this repository.
2. Under **Source**, choose **Deploy from a branch**.
3. Select branch `main` and folder `/ (root)`, then **Save**.
4. The site will be live at `https://wbr-technologies.github.io/Accord/` within a minute or two.

## About the demo widget

The demo widget in `app.js` lets a visitor paste their own API key (kept in memory/localStorage only, never sent to our servers — there are none) and try a chat. It calls an **OpenAI-compatible endpoint** of the user's choosing with their key, directly from the browser, or runs in a clearly marked stub mode until a key and endpoint are set. We never ask for or hardcode any real key.

## License

MIT
