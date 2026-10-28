# CampusFest – College Event Management (MERN Stack Mini Project)

A website where students can **sign up, log in, register for college events, and send feedback**.
Everything is saved in a **MongoDB** database.

## Requirement checklist

| Requirement | Where it is |
|---|---|
| MERN stack | **M**ongoDB (database) · **E**xpress + **N**ode.js (`server/`) · **R**eact (`client/`) |
| Home page | `client/src/pages/Home.jsx` – banner, live stats, event cards |
| Form 1 (validated) | Sign Up – `client/src/pages/Signup.jsx` |
| Form 2 (validated) | Login – `client/src/pages/Login.jsx` |
| Form 3 (validated) | Event Registration – `client/src/pages/EventRegister.jsx` |
| Form 4 (validated) | Contact / Feedback – `client/src/pages/Contact.jsx` |
| HTML5 | `client/index.html`, semantic tags, input types `email`, `tel`, `number`, `password`, attributes `required`, `pattern`, `minLength`, `min`/`max` |
| CSS / Bootstrap | Bootstrap 5 (grid, cards, navbar, forms, alerts, table) + custom CSS in `client/src/index.css` |
| JavaScript | Validation functions in each form, `fetch` calls in `client/src/api.js` |
| React.js | Components, `useState`, `useEffect`, React Router for pages |
| Database | MongoDB with Mongoose models in `server/models/` |
| Live deployment | Render (website) + MongoDB Atlas (database) |

## How it works

```
Browser (React pages)  ──fetch /api/...──▶  Express server (Node.js)  ──Mongoose──▶  MongoDB
```

1. The user fills a form in React.
2. A JavaScript `validate()` function checks every field and shows red error messages (Bootstrap `is-invalid`).
3. If everything is valid, the data is sent to the Express API with `fetch`.
4. The server validates again (Mongoose schema rules) and saves it in MongoDB.
5. The server replies with success or an error message, which is shown on the page.

Passwords are hashed with **bcrypt** before saving, so they are never stored as plain text.

## Validation rules

| Form | Rules |
|---|---|
| Sign Up | Name 3–50 letters · valid email · 10-digit Indian mobile (starts 6–9) · department selected · password ≥ 8 chars with letters & numbers · passwords match · terms ticked · email not already used |
| Login | Valid email · password required · correct email/password |
| Event Registration | Name · email · roll no like `C084` · year selected · event selected · team size between 1 and the event's maximum · can't register twice for the same event |
| Feedback | Name · email · subject ≥ 5 chars · rating 1–5 · message 20–500 chars |

## API endpoints

| Method | URL | Purpose |
|---|---|---|
| GET | `/api/events` | List events |
| POST | `/api/signup` | Create account |
| POST | `/api/login` | Log in |
| POST | `/api/registrations` | Register for an event |
| GET | `/api/registrations` | List all registrations |
| POST | `/api/feedback` | Send feedback |
| GET | `/api/stats` | Counts shown on the home page |

## Folder structure

```
server/
  index.js            Express server + all API routes
  models/             MongoDB collections: User, Event, Registration, Feedback
client/
  index.html          HTML5 page that loads React
  src/main.jsx        Starts React, loads Bootstrap
  src/App.jsx         Page routes + logged-in user
  src/api.js          Helpers to call the backend
  src/components/     Navbar, Footer
  src/pages/          Home, Signup, Login, EventRegister, Registrations, Contact
```

## Run on your computer

You need Node.js and MongoDB installed.

```bash
npm install          # backend packages
npm run build        # installs + builds the React app
npm start            # open http://localhost:5000
```

By default it connects to `mongodb://127.0.0.1:27017/campusfest`.
To use another database, create a `.env` file with `MONGODB_URI=...`.

## Deployment

**Live URL:** https://campusfest.onrender.com

- **Database:** MongoDB Atlas free cluster. Its connection string is set as the `MONGODB_URI` environment variable on Render.
- **Website:** Render Web Service (free plan, Singapore) built from this GitHub repo.
  - Build command: `npm install && npm run build`
  - Start command: `npm start`
- After pushing changes to GitHub, open the service on Render and click **Manual Deploy → Deploy latest commit**.
- Note: free Render sites sleep after 15 minutes of no visitors. The first visit after that takes about 30–50 seconds to load.
