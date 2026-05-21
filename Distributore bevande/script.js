let deposito = 0.0;

let loginDiv = document.getElementById('login');
let distributoreDiv = document.getElementById('paginadistributore');
let moneteDiv = document.getElementById('monete');
let creditoDiv = document.getElementById('credito');
let restoDiv = document.getElementById('resto');
let tecnicoDiv = document.getElementById('pannelloTecnico');

let bevande = {
  coca: { nome: 'Coca-Cola', prezzo: 1.5, quantita: 5, slot: 'slot1' },
  sprite: { nome: 'Sprite', prezzo: 0.9, quantita: 5, slot: 'slot2' },
  fanta: { nome: 'Fanta', prezzo: 1.2, quantita: 5, slot: 'slot3' },
  acqua: { nome: 'Acqua', prezzo: 0.5, quantita: 5, slot: 'slot4' },
  up7: { nome: '7up', prezzo: 1.0, quantita: 5, slot: 'slot5' },
};

function checklogin() {
  let user = document.getElementById('usr').value.trim();
  let pass = document.getElementById('pass').value.trim();

  let userOk = /^[a-zA-Z]+$/.test(user);
  let passOk = /^[a-zA-Z0-9]+$/.test(pass);

  document.getElementById('usrfailtxt').style.visibility = userOk ? 'hidden' : 'visible';
  document.getElementById('passfailtxt').style.visibility = passOk ? 'hidden' : 'visible';

  if (!(userOk && passOk)) return;

  let ruolo = 'Utente';
  if (user.toLowerCase() === 'tecnico' && pass === 'j6fa') ruolo = 'Tecnico';

  alert('Accesso effettuato come: ' + ruolo);

  document.getElementById('benvenuto').textContent = user;

  window.ruoloCorrente = ruolo;
  SetupInterfacciaDaRuolo();
}

function animaCadutaBevanda(tipo) {
  let bev = bevande[tipo];
  let slot = document.getElementById(bev.slot);

  let rect = slot.getBoundingClientRect();

  let img = document.createElement('img');
  img.src = slot.src;
  img.classList.add('bevanda-caduta');

  img.style.left = rect.left + 'px';
  img.style.top = rect.top + 'px';

  img.draggable = false;

  img.addEventListener('animationend', () => {
    img.style.pointerEvents = 'auto';
    img.style.cursor = 'pointer';

    img.onclick = () => {
      img.remove();
    };
  });

  document.body.appendChild(img);
}

function SetupInterfacciaDaRuolo() {
  loginDiv.style.display = 'none';
  distributoreDiv.style.display = 'block';

  if (window.ruoloCorrente === 'Tecnico') {
    tecnicoDiv.style.display = 'block';
    document.getElementById('distributore').style.display = 'none';
    document.title = 'Gestione Distributore';
    document.getElementById('favicon').setAttribute('href', 'imgs/Tecnicofav.ico');
    popolaSelectBevande();
    aggiornaUiTecnico();
  } else {
    tecnicoDiv.style.display = 'none';
    document.getElementById('distributore').style.display = 'block';
    document.title = 'Distributore';
    document.getElementById('favicon').setAttribute('href', 'imgs/dai-logo.ico');
  }
}

function popolaSelectBevande() {
  let select = document.getElementById('Selettore');
  select.innerHTML = '';

  for (let key in bevande) {
    let opt = document.createElement('option');
    opt.value = key;
    opt.textContent = bevande[key].nome;
    select.appendChild(opt);
  }
}

function ricarica() {
  let tipo = document.getElementById('Selettore').value;
  bevande[tipo].quantita++;
  aggiornaVisibilitaBevande();
  aggiornaUiTecnico();
}

function logout() {
  document.getElementById('favicon').setAttribute('href', 'imgs/loginimg.ico');
  distributoreDiv.style.display = 'none';
  loginDiv.style.display = 'flex';
  document.title = 'Login';
}

function toggleMonete() {
  moneteDiv.style.display = moneteDiv.style.display === 'none' ? 'block' : 'none';
}

function aggiungiCredito(credito) {
  let currentCredito = parseFloat(creditoDiv.textContent.replace('€', '').trim());
  creditoDiv.textContent = '€ ' + (currentCredito + credito).toFixed(2);
}

function acquistaBevanda(tipo) {
  let bev = bevande[tipo];

  if (bev.quantita <= 0) return;

  let credito = parseFloat(creditoDiv.textContent.replace('€', '').trim());
  if (credito < bev.prezzo) {
    alert('Credito insufficiente!');
    return;
  }

  animaCadutaBevanda(tipo);

  if (bev.quantita === 1) {
    setTimeout(() => {
      document.getElementById(bev.slot).style.display = 'none';
    }, 500);
  }

  bev.quantita--;

  aggiornaVisibilitaBevande();

  let resto = credito + parseFloat(restoDiv.textContent.replace('€', '').trim()) - bev.prezzo;
  restoDiv.textContent = '€ ' + resto.toFixed(2);
  creditoDiv.textContent = '€ 0.00';

  deposito += bev.prezzo;
}

function aggiornaVisibilitaBevande() {
  for (let key in bevande) {
    let b = bevande[key];
    document.getElementById(b.slot).style.display = b.quantita > 0 ? 'block' : 'none';
  }
}

function ritiraResto() {
  restoDiv.textContent = '€ 0.00';
}

function aggiornaUiTecnico() {
  let tipo = document.getElementById('Selettore').value;
  console.log('');
  document.getElementById('qtBevanda').textContent = bevande[tipo].quantita;
  document.getElementById('soldiDeposito').textContent = deposito.toFixed(2);
}

function ritiraSoldi() {
  if (window.ruoloCorrente !== 'Tecnico') {
    alert('Accesso negato: solo il tecnico può ritirare i soldi.');
    return;
  }

  alert('Soldi ritirati: €' + deposito.toFixed(2));
  deposito = 0.0;
  aggiornaUiTecnico();
}
