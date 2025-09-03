// script.js
const toggleBtn = document.getElementById('toggle-theme');
const readBtn = document.getElementById('read-page');
const increaseBtn = document.getElementById('increase-text');
const decreaseBtn = document.getElementById('decrease-text');
let currentSize = 100;

// Bytt tema
if (toggleBtn) {
  toggleBtn.addEventListener('click', function() {
    document.body.classList.toggle("dark-theme");
  });
}

// Les opp all synlig tekst på siden
if (readBtn) {
  readBtn.addEventListener('click', function() {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode: function(node) {
        if (!node.nodeValue.trim()) return NodeFilter.FILTER_SKIP;
        if (node.parentNode.tagName === 'SCRIPT' || node.parentNode.tagName === 'STYLE') return NodeFilter.FILTER_SKIP;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    let text = '';
    while(walker.nextNode()) {
      text += walker.currentNode.nodeValue + ' ';
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'no-NO';
    window.speechSynthesis.speak(utterance);
  });
}

// Justerbar tekststørrelse
function setTextSize(percent) {
  document.documentElement.style.fontSize = percent + '%';
}

if (increaseBtn && decreaseBtn) {
  increaseBtn.addEventListener('click', function() {
    if (currentSize < 200) {
      currentSize += 10;
      setTextSize(currentSize);
    }
  });

  decreaseBtn.addEventListener('click', function() {
    if (currentSize > 70) {
      currentSize -= 10;
      setTextSize(currentSize);
    }
  });
}

// Hent brukere fra localStorage eller lag standardbruker
function getUsers() {
  const users = localStorage.getItem('users');
  if (users) {
    return JSON.parse(users);
  } else {
    // Standardbruker første gang
    const defaultUsers = [{ username: "kunde", password: "passord123" }];
    localStorage.setItem('users', JSON.stringify(defaultUsers));
    return defaultUsers;
  }
}

function saveUsers(users) {
  localStorage.setItem('users', JSON.stringify(users));
}

// Innlogging
const loginForm = document.getElementById('login-form');
const loginMessage = document.getElementById('login-message');
if (loginForm) {
  loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const brukernavn = document.getElementById('brukernavn').value.trim();
    const passord = document.getElementById('passord').value;
    const users = getUsers();
    if (users.some(u => u.username === brukernavn && u.password === passord)) {
      loginMessage.textContent = "Innlogging vellykket!";
      loginMessage.style.color = "green";
    } else {
      loginMessage.textContent = "Feil brukernavn eller passord.";
      loginMessage.style.color = "red";
    }
  });
}

// Registrering
const registerForm = document.getElementById('register-form');
const registerMessage = document.getElementById('register-message');
if (registerForm) {
  registerForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const brukernavn = document.getElementById('reg-brukernavn').value.trim();
    const passord = document.getElementById('reg-passord').value;
    let users = getUsers();
    if (brukernavn.length < 3 || passord.length < 6) {
      registerMessage.textContent = "Brukernavn må være minst 3 tegn og passord minst 6 tegn.";
      registerMessage.style.color = "red";
    } else if (users.some(u => u.username === brukernavn)) {
      registerMessage.textContent = "Brukernavnet er allerede i bruk.";
      registerMessage.style.color = "red";
    } else {
      users.push({ username: brukernavn, password: passord });
      saveUsers(users);
      registerMessage.textContent = "Registrering vellykket! Du kan nå logge inn.";
      registerMessage.style.color = "green";
      registerForm.reset();
    }
  });
}

// Sett inn dine egne verdier her:
const EMAILJS_SERVICE_ID = 'din_service_id';
const EMAILJS_TEMPLATE_ID = 'din_template_id';
const EMAILJS_PUBLIC_KEY = 'din_public_key';

(function(){
  emailjs.init(EMAILJS_PUBLIC_KEY);
})();

const kontaktForm = document.getElementById('kontakt-form');
const kontaktMelding = document.getElementById('kontakt-melding');

if (kontaktForm) {
  kontaktForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    const navn = document.getElementById('navn').value;
    const epost = document.getElementById('epost').value;
    const melding = document.getElementById('melding').value;

    kontaktMelding.textContent = "Sender...";
    try {
      const res = await fetch('http://localhost:3000/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ navn, epost, melding })
      });
      const data = await res.json();
      if (data.success) {
        kontaktMelding.textContent = "Takk for din henvendelse!";
        kontaktForm.reset();
      } else {
        kontaktMelding.textContent = "Noe gikk galt. Prøv igjen senere.";
      }
    } catch {
      kontaktMelding.textContent = "Kunne ikke sende. Sjekk nettverk/innstillinger.";
    }
  });
}
