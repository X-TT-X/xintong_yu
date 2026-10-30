const menu=document.querySelector('.menu'),
nav=document.querySelector('#nav');
menu.addEventListener('click',()=> {
  const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',open);nav.classList.toggle('open',open)
}
);
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=> {
  menu.setAttribute('aria-expanded','false');nav.classList.remove('open')
}
));
document.querySelector('#copy-email').addEventListener('click',async()=> {
  const out=document.querySelector('#copy-status');try {
    await navigator.clipboard.writeText('xintong.yu-2@postgrad.manchester.ac.uk');out.textContent='Email copied.'
  }
  catch {
    out.textContent='Use the email icon to open your email app.'
  }
}
);
// Keep the current section highlighted, including the final section at page bottom.
const sectionLinks = [...nav.querySelectorAll('a')];
const trackedSections = sectionLinks.map(link =>
  document.querySelector(link.getAttribute('href'))
).filter(Boolean);

function highlightSection(id) {
  sectionLinks.forEach(link => {
    const active = link.getAttribute('href') === '#' + id;
    link.classList.toggle('active', active);
    if (active) {
      link.setAttribute('aria-current', 'location');
    } else {
      link.removeAttribute('aria-current');
    }
  });
}

function updateSectionHighlight() {
  const marker = Math.max(85, window.innerHeight * 0.25);
  const lastSection = trackedSections[trackedSections.length - 1];
  const atBottom = window.scrollY + window.innerHeight >=
    document.documentElement.scrollHeight - 4;

  if (atBottom && lastSection &&
      lastSection.getBoundingClientRect().top < window.innerHeight) {
    highlightSection(lastSection.id);
    return;
  }

  let current = '';
  trackedSections.forEach(section => {
    if (section.getBoundingClientRect().top <= marker) {
      current = section.id;
    }
  });
  highlightSection(current);
}

sectionLinks.forEach(link => {
  link.addEventListener('click', () => {
    highlightSection(link.getAttribute('href').slice(1));
  });
});

let highlightFrame = null;
function scheduleHighlight() {
  if (highlightFrame !== null) return;
  highlightFrame = requestAnimationFrame(() => {
    highlightFrame = null;
    updateSectionHighlight();
  });
}
window.addEventListener('scroll', scheduleHighlight, { passive: true });
window.addEventListener('resize', scheduleHighlight);
window.addEventListener('hashchange', scheduleHighlight);
window.addEventListener('load', scheduleHighlight);
scheduleHighlight();

// Switch visual skill domains using native, keyboard-accessible buttons.
const skillButtons = [...document.querySelectorAll('[data-skill]')];
skillButtons.forEach(button => {
  button.addEventListener('click', () => {
    skillButtons.forEach(item => {
      const active = item === button;
      item.setAttribute('aria-pressed', String(active));
      document.getElementById(item.getAttribute('aria-controls')).hidden = !active;
    });
  });
});

// Awards remain a list; one item can be selected by mouse, touch or keyboard.
const awardButtons = [...document.querySelectorAll('.award-select')];
awardButtons.forEach(button => {
  button.addEventListener('click', () => {
    const select = button.getAttribute('aria-pressed') !== 'true';
    awardButtons.forEach(item => {
      const active = select && item === button;
      item.setAttribute('aria-pressed', String(active));
      item.closest('.award-item').classList.toggle('is-selected', active);
    });
  });
});

// Reference GIFs load only on request and can be stopped at any time.
document.querySelectorAll('.reference-play').forEach(button => {
  button.addEventListener('click', () => {
    const image = button.closest('.reference-figure').querySelector('img');
    const play = button.getAttribute('aria-pressed') !== 'true';
    image.src = play ? image.dataset.animation : image.dataset.poster;
    button.setAttribute('aria-pressed', String(play));
    button.textContent = play ? 'Stop animation' : 'Play animation';
  });
});
