# A flower for you · petal & post

A purple flower greeting inspired by a geometric Python Turtle flower. Tap to watch it bloom, read the note, or make a personalized greeting to send to someone.

Plain HTML, CSS, JavaScript, and SVG. No build step, account, API key, or backend required. Responsive layout, keyboard controls, and reduced-motion support included. Fonts load from Google Fonts with local fallbacks.

## Preview

Open `index.html` directly, or run `python -m http.server 8080` in this directory and visit `http://localhost:8080`.

## GitHub Pages

Push these files to the `main` branch of a public GitHub repository. In the repository, open **Settings → Pages**, choose **Deploy from a branch**, select **main** and **/ (root)**, and save. GitHub will display the published URL there.

## Send a greeting

Open the published page, select **Make one for someone**, fill in the name, message, and sender, then select **Copy greeting link**. Send that link. The recipient taps **Open your flower** to reveal the bloom and your note.

Personalized text is stored in the URL fragment and rendered as text, never HTML. No database or analytics are used. Anyone you share the full link with can read the message. Keep the full link, including everything after `#`, when sending it. A local `file:` link cannot be opened by another person.

To change the default greeting, edit the message in `index.html`. Colors and layout are in `style.css`; the flower drawing and sharing behavior are in `app.js`.
