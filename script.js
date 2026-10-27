(() => {
  'use strict';

  document.documentElement.classList.add('js');

  const EVENT = {
    names: 'Mohamed & Yomna',
    date: new Date('2026-11-12T19:00:00+02:00'),
    venue: 'Mountain Rose Hotel — One View Hall'
  };

  const audio = document.getElementById('weddingAudio');
  const intro = document.getElementById('intro');
  const site = document.getElementById('site');
  const musicButton = document.getElementById('musicButton');
  const toast = document.getElementById('toast');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let invitationOpened = false;
  let toastTimer;

  // The opening overlay prevents interacting with the hidden page underneath it.
  site.inert = true;
  audio.volume = 1;
  // Start buffering ahead of the guest's tap so playback can begin quickly.
  if (audio.readyState === 0) audio.load();

  function showToast(message, duration = 3600) {
    toast.textContent = message;
    toast.classList.add('show');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove('show'), duration);
  }

  function syncSoundButton() {
    musicButton.classList.toggle('is-muted', audio.muted);
    musicButton.classList.toggle('needs-play', invitationOpened && audio.paused);
    musicButton.setAttribute('aria-pressed', String(audio.muted));
    const label = audio.paused ? 'Play music' : (audio.muted ? 'Unmute music' : 'Mute music');
    musicButton.setAttribute('aria-label', label);
    musicButton.title = label;
  }

  function handleMusicFailure(error) {
    syncSoundButton();
    const blocked = error && error.name === 'NotAllowedError';
    showToast(blocked
      ? 'Your browser blocked the music. Tap the speaker icon to start it.'
      : 'Music could not load. Make sure the MP3 file was uploaded with the site.', 6500);
    if (error) console.warn('Wedding invitation music:', error);
  }

  function playMusic() {
    // Call play() synchronously during the actual guest tap: no await, timer,
    // transition, or network request is allowed before this call.
    audio.muted = false;
    let playback;
    try {
      playback = audio.play();
    } catch (error) {
      handleMusicFailure(error);
      return;
    }
    if (playback && typeof playback.then === 'function') {
      playback.then(syncSoundButton).catch(handleMusicFailure);
    }
  }

  function openInvitation() {
    if (invitationOpened) return;
    invitationOpened = true;

    // Playing in the click handler is essential for mobile autoplay rules.
    playMusic();
    intro.classList.add('is-opening');
    document.body.classList.remove('is-locked');
    window.setTimeout(() => {
      intro.hidden = true;
      site.inert = false;
      document.getElementById('heroTitle').focus({ preventScroll: true });
    }, reducedMotion ? 25 : 1520);
  }

  document.getElementById('enterButton').addEventListener('click', openInvitation);
  document.getElementById('envelopeButton').addEventListener('click', openInvitation);

  musicButton.addEventListener('click', () => {
    if (audio.paused) {
      playMusic();
    } else {
      audio.muted = !audio.muted;
      syncSoundButton();
    }
  });
  audio.addEventListener('playing', syncSoundButton);
  audio.addEventListener('pause', syncSoundButton);
  audio.addEventListener('volumechange', syncSoundButton);
  audio.addEventListener('error', () => handleMusicFailure(audio.error));
  syncSoundButton();

  // Count down to 7 PM Cairo time (UTC+2 on November 12, 2026).
  const counters = {
    days: document.getElementById('days'),
    hours: document.getElementById('hours'),
    minutes: document.getElementById('minutes'),
    seconds: document.getElementById('seconds')
  };

  function updateCountdown() {
    const difference = Math.max(0, EVENT.date.getTime() - Date.now());
    const totalSeconds = Math.floor(difference / 1000);
    const values = {
      days: Math.floor(totalSeconds / 86400),
      hours: Math.floor((totalSeconds % 86400) / 3600),
      minutes: Math.floor((totalSeconds % 3600) / 60),
      seconds: totalSeconds % 60
    };
    for (const [key, element] of Object.entries(counters)) {
      element.textContent = String(values[key]).padStart(2, '0');
    }
    if (difference === 0) {
      document.getElementById('countdownMessage').textContent = 'Our forever has begun. Thank you for sharing our joy!';
    }
  }
  updateCountdown();
  window.setInterval(updateCountdown, 1000);

  // Add-to-calendar is a generated, portable .ics event; no server is needed.
  document.getElementById('calendarButton').addEventListener('click', () => {
    const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    const calendarText = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Wedding Invitation//Mohamed and Yomna//EN',
      'CALSCALE:GREGORIAN',
      'BEGIN:VEVENT',
      'UID:mohamed-yomna-wedding-20261112@invitation.local',
      'DTSTAMP:' + stamp,
      'DTSTART:20261112T170000Z',
      'SUMMARY:Mohamed & Yomna — Wedding Celebration',
      'LOCATION:Mountain Rose Hotel - One View Hall',
      'DESCRIPTION:You are warmly invited to celebrate Mohamed and Yomna’s wedding. The celebration begins at 7:00 PM Cairo time.',
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const file = new Blob([calendarText], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Mohamed-and-Yomna-Wedding.ics';
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 10000);
    showToast('Wedding date saved to your downloads.');
  });

  document.getElementById('shareButton').addEventListener('click', async () => {
    if (window.location.protocol === 'file:') {
      showToast('Publish this invitation online to share its link.');
      return;
    }
    const data = {
      title: 'Mohamed & Yomna — Wedding Invitation',
      text: 'You are invited! Thursday, November 12, 2026 at 7:00 PM.',
      url: window.location.href.split('#')[0]
    };

    if (navigator.share) {
      try {
        await navigator.share(data);
      } catch (error) {
        if (error.name !== 'AbortError') showToast('You can copy the invitation link from your browser.');
      }
    } else {
      try {
        await navigator.clipboard.writeText(data.url);
        showToast('Invitation link copied — share the love!');
      } catch (error) {
        showToast('Copy the invitation link from your browser to share it.');
      }
    }
  });

  // Reveal sections gently as guests explore the invitation.
  const revealed = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reducedMotion) {
    const observer = new IntersectionObserver((entries, instance) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          instance.unobserve(entry.target);
        }
      }
    }, { threshold: 0.13, rootMargin: '0px 0px -25px 0px' });
    revealed.forEach((element) => observer.observe(element));
  } else {
    revealed.forEach((element) => element.classList.add('is-visible'));
  }

  // Lightweight CSS petals (disabled for people who prefer reduced motion).
  if (!reducedMotion) {
    const layer = document.getElementById('petals');
    const petalCount = window.innerWidth < 680 ? 12 : 19;
    for (let index = 0; index < petalCount; index += 1) {
      const petal = document.createElement('span');
      petal.className = 'petal';
      petal.style.setProperty('--left', (Math.random() * 100).toFixed(2) + '%');
      petal.style.setProperty('--size', (8 + Math.random() * 8).toFixed(1) + 'px');
      petal.style.setProperty('--duration', (13 + Math.random() * 16).toFixed(2) + 's');
      petal.style.setProperty('--delay', (-Math.random() * 26).toFixed(2) + 's');
      const drift = Math.random() * 140 - 70;
      petal.style.setProperty('--drift', drift.toFixed(0) + 'px');
      petal.style.setProperty('--drift-back', (-drift).toFixed(0) + 'px');
      petal.style.setProperty('--opacity', (0.2 + Math.random() * .35).toFixed(2));
      layer.appendChild(petal);
    }
  }
})();
