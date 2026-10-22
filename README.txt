LOOMTRACE WEBSITE
=================

To view: unzip this folder and double-click index.html. It opens in any modern browser
(Chrome, Edge, Firefox, Safari). No installation or server is needed.

Files
  index.html         Page content and structure
  css/styles.css     All styling, including light and dark mode
  js/script.js       Interactive parts: menu, workflow steps, product preview,
                     stakeholder tabs, FAQ, contact form
  images/founder.jpg Founder portrait

Common edits
  Contact email   Open js/script.js and set CONTACT_EMAIL near the top, e.g.
                  var CONTACT_EMAIL = "hello@yourdomain.com";
  Founder photo   Replace images/founder.jpg with a new image of the same name
                  (a square image works best).
  FAQ answers     In js/script.js, edit the FAQ list.
  Preview data    In js/script.js, edit the ORDERS list (all sample data is fictional).

Fonts (Manrope, IBM Plex Mono) load from Google Fonts when online. Offline, the page
falls back to system fonts and still works.

To publish online, upload the whole folder as-is to any static host
(e.g. Netlify, Vercel, GitHub Pages, or your web hosting's public_html folder).
