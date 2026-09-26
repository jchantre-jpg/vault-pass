const passwordEl = document.getElementById("password");
const bar = document.getElementById("bar");
const strengthLabel = document.getElementById("strengthLabel");
const entropyEl = document.getElementById("entropy");
const len = document.getElementById("len");
const lenVal = document.getElementById("lenVal");
const historyEl = document.getElementById("history");
const history = [];

const SETS = {
  upper: "ABCDEFGHJKLMNPQRSTUVWXYZ",
  lower: "abcdefghijkmnopqrstuvwxyz",
  nums: "23456789",
  syms: "!@#$%&*?_+-=",
  upperFull: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lowerFull: "abcdefghijklmnopqrstuvwxyz",
  numsFull: "0123456789",
};

function charset() {
  const amb = document.getElementById("ambiguous").checked;
  let s = "";
  if (document.getElementById("upper").checked) s += amb ? SETS.upper : SETS.upperFull;
  if (document.getElementById("lower").checked) s += amb ? SETS.lower : SETS.lowerFull;
  if (document.getElementById("nums").checked) s += amb ? SETS.nums : SETS.numsFull;
  if (document.getElementById("syms").checked) s += SETS.syms;
  return s || SETS.lower;
}

function generate() {
  const n = Number(len.value);
  const chars = charset();
  const arr = new Uint32Array(n);
  crypto.getRandomValues(arr);
  let out = "";
  for (let i = 0; i < n; i++) out += chars[arr[i] % chars.length];
  passwordEl.textContent = out;
  score(out, chars.length);
  history.unshift(out);
  if (history.length > 6) history.pop();
  historyEl.innerHTML = history.map((h) => `<li>${h}</li>`).join("");
}

function score(pw, pool) {
  let pts = 0;
  if (pw.length >= 12) pts += 1;
  if (pw.length >= 16) pts += 1;
  if (pw.length >= 24) pts += 1;
  if (/[A-Z]/.test(pw)) pts += 1;
  if (/[a-z]/.test(pw)) pts += 1;
  if (/\d/.test(pw)) pts += 1;
  if (/[^A-Za-z0-9]/.test(pw)) pts += 1;
  const levels = [
    { t: "Muy débil", c: "#ef4444", w: "18%" },
    { t: "Débil", c: "#f97316", w: "32%" },
    { t: "Aceptable", c: "#eab308", w: "50%" },
    { t: "Fuerte", c: "#22c55e", w: "70%" },
    { t: "Muy fuerte", c: "#0f766e", w: "88%" },
    { t: "Excelente", c: "#0f766e", w: "100%" },
  ];
  const lvl = levels[Math.min(levels.length - 1, Math.max(0, pts - 1))];
  bar.style.width = lvl.w;
  bar.style.background = lvl.c;
  strengthLabel.textContent = lvl.t;
  strengthLabel.style.color = lvl.c;
  const bits = pw.length * Math.log2(Math.max(pool, 2));
  entropyEl.textContent = `Entropía ≈ ${bits.toFixed(1)} bits · pool ${pool}`;
}

len.addEventListener("input", () => { lenVal.textContent = len.value; });
document.getElementById("gen").addEventListener("click", generate);
document.getElementById("copy").addEventListener("click", async () => {
  await navigator.clipboard.writeText(passwordEl.textContent);
  document.getElementById("copy").textContent = "¡Listo!";
  setTimeout(() => (document.getElementById("copy").textContent = "Copiar"), 1000);
});
["upper", "lower", "nums", "syms", "ambiguous"].forEach((id) =>
  document.getElementById(id).addEventListener("change", generate)
);
generate();
