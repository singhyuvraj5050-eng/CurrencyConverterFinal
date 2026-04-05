const currencies = {
  "INR": "IN",
  "USD": "US",
  "EUR": "EU",
  "GBP": "GB",
  "JPY": "JP"
};

const currencySymbols = {
  "INR": "₹",
  "USD": "$",
  "EUR": "€",
  "GBP": "£",
  "JPY": "¥"
};

const fromList = document.getElementById("fromList");
const toList = document.getElementById("toList");
const fromSelected = document.getElementById("fromSelected");
const toSelected = document.getElementById("toSelected");

function getFlagUrl(code) {
  if (code === "EU") {
    return "https://upload.wikimedia.org/wikipedia/commons/b/b7/Flag_of_Europe.svg";
  }
  return `https://flagsapi.com/${code}/flat/64.png`;
}

function fillList(list, selectedBox) {
  list.innerHTML = "";
  Object.keys(currencies).forEach(cur => {
    const div = document.createElement("div");
    div.className = "currency-item";
    div.dataset.code = cur;

    const flagUrl = getFlagUrl(currencies[cur]);

    div.innerHTML = `
      <img src="${flagUrl}" alt="${cur} flag">
      <span>${cur}</span>
    `;
    div.onclick = () => {
      selectedBox.innerHTML = div.innerHTML;
      selectedBox.dataset.code = cur;
      list.classList.remove("open");
    };
    list.appendChild(div);
  });
}

fillList(fromList, fromSelected);
fillList(toList, toSelected);

document.getElementById("fromSelected").onclick = () => {
  fromList.classList.toggle("open");
  toList.classList.remove("open");
};

document.getElementById("toSelected").onclick = () => {
  toList.classList.toggle("open");
  fromList.classList.remove("open");
};

document.addEventListener("click", (e) => {
  if (!fromList.contains(e.target) && !fromSelected.contains(e.target)) {
    fromList.classList.remove("open");
  }
  if (!toList.contains(e.target) && !toSelected.contains(e.target)) {
    toList.classList.remove("open");
  }
});

document.getElementById("swapBtn").onclick = () => {
  const tempCode = fromSelected.dataset.code;
  fromSelected.dataset.code = toSelected.dataset.code;
  toSelected.dataset.code = tempCode;

  const tempHTML = fromSelected.innerHTML;
  fromSelected.innerHTML = toSelected.innerHTML;
  toSelected.innerHTML = tempHTML;
};

document.getElementById("convertBtn").onclick = async () => {
  const amount = document.getElementById("amount").value;
  const from = fromSelected.dataset.code;
  const to = toSelected.dataset.code;

  if (amount === "" || isNaN(amount)) return;

  try {
    const res = await fetch(`https://api.exchangerate-api.com/v4/latest/${from}`);
    const data = await res.json();
    const rate = data.rates[to];

    if (!rate) {
      document.getElementById("result").innerText = "Rate not available.";
      return;
    }

    const converted = (amount * rate).toFixed(2);
    const fromSymbol = currencySymbols[from] || "";
    const toSymbol = currencySymbols[to] || "";

    document.getElementById("result").innerText =
      `${fromSymbol}${amount} ${from} = ${toSymbol}${converted} ${to}`;
  } catch (err) {
    document.getElementById("result").innerText = "Error fetching rates.";
  }
};

const darkToggle = document.getElementById("darkToggle");
darkToggle.onclick = () => {
  darkToggle.classList.toggle("active");
  document.body.classList.toggle("dark-mode");
};

const calcToggle = document.getElementById("calcToggle");
const calcPopup = document.getElementById("calcPopup");
calcToggle.onclick = () => {
  calcToggle.classList.toggle("active");
  calcPopup.classList.toggle("open");
};

function press(val) {
  document.getElementById("calcDisplay").value += val;
}

function clearCalc() {
  document.getElementById("calcDisplay").value = "";
}

function calculate() {
  try {
    document.getElementById("calcDisplay").value =
      eval(document.getElementById("calcDisplay").value);
  } catch {
    document.getElementById("calcDisplay").value = "Error";
  }
}