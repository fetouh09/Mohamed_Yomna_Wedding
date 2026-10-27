# Mohamed & Yomna — Wedding Invitation

An animated, romantic, mobile-friendly wedding invitation. Ready for GitHub Pages; no installation, build process, database, or paid hosting required.

## The celebration

- **Couple:** Mohamed & Yomna
- **Date:** Thursday, November 12, 2026
- **Time:** 7:00 PM (Cairo time)
- **Venue:** Mountain Rose Hotel — One View Hall

## Included

- Interactive opening envelope and romantic floral visuals
- Background song, started by the guest opening the envelope (with a small mute/unmute icon at the top)
- Falling petals, reveal animations, and a live wedding countdown
- Add-to-Calendar download (`.ics`)
- Google Maps location link supplied by the couple
- Share Invitation button (mobile sharing sheet or copy link)
- Responsive desktop and mobile layouts, accessible reduced-motion support

## How to publish it on GitHub Pages

1. Unzip the download. Keep **all files and the `assets` folder together**.
2. On GitHub, create a new **public repository**, for example `mohamed-yomna-wedding`.
3. In the repository, select **Add file → Upload files**. Upload the **contents** of the extracted folder so `index.html`, `styles.css`, `script.js`, `.nojekyll`, and the `assets/` folder appear at the **repository root**. Do not upload the ZIP itself.
4. Select **Commit changes**.
5. Go to **Settings → Pages → Build and deployment**. Choose **Deploy from a branch**, then select branch **main** and folder **/(root)**. Save.
6. Once GitHub finishes deploying, visit `https://YOUR-USERNAME.github.io/mohamed-yomna-wedding/` and share that link.

If the site returns a 404 right after enabling Pages, give the first deployment a few minutes to finish.

## Files

```
index.html
styles.css
script.js
.nojekyll
assets/
  floral-art.webp
  favicon.svg
  a-thousand-years.mp3
```

## Helpful notes

- **Music:** Mobile browsers usually block autoplay before a user interaction. The song starts automatically as the guest clicks **Open Our Invitation** or the envelope. It is unmuted by default; the small speaker icon at the top mutes/unmutes the song. If playback is blocked by a browser, the same icon lets the guest start it.
- **Venue link:** The **View Location** button opens the exact Google Maps share link supplied by the couple: `https://maps.app.goo.gl/kK3xegVczcqw3K5i6?g_st=ac`.
- **Calendar:** The calendar entry begins on November 12, 2026 at 7 PM Cairo time. The couple did not specify an end time, so none is asserted.
- **Sharing:** The share button becomes useful once the page has been published and has a public URL.
- **Audio rights:** Before publishing a commercial recording publicly, make sure you have permission to distribute it. You can replace `assets/a-thousand-years.mp3` with a track you are licensed to publish, keeping the same filename.
- **Edits:** Update visible wording in `index.html`; update the event date in `script.js` (both `EVENT.date` and the `DTSTART` calendar field) if the schedule changes.

This is a static invitation: no guest information is collected and no RSVP data is stored.
