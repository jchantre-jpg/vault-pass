const passwordEl = document.getElementById("password");
const bar = document.getElementById("bar");
const strengthLabel = document.getElementById("strengthLabel");
const len = document.getElementById("len");
const lenVal = document.getElementById("lenVal");

const SETS = {
  upper: "ABCDEFGHJKLMNPQRSTUVWXYZ",
  lower: "abcdefghijkmnopqrstuvwxyz",
  nums: "23456789",
  syms: "!@#$%&*?_+-=",
};

function charset() {
  let s = "";
  if (document.getElementById("upper").checked) s += SETS.upper;
  if (document.getElementById("lower").checked) s += SETS.lower;
  if (document.getElementById("nums").checked) s += SETS.nums;
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
  score(out);
}

function score(pw) {
  let pts = 0;
  if (pw.length >= 12) pts += 1;
  if (pw.length >= 16) pts += 1;
  if (/[A-Z]/.test(pw)) pts += 1;
  if (/[a-z]/.test(pw)) pts += 1;
  if (/\d/.test(pw)) pts += 1;
  if (/[^A-Za-z0-9]/.test(pw)) pts += 1;
  const levels = [
    { t: "Muy débil", c: "#ef4444", w: "20%" },
    { t: "Débil", c: "#f97316", w: "35%" },
    { t: "Aceptable", c: "#eab308", w: "55%" },
    { t: "Fuerte", c: "#22c55e", w: "75%" },
    { t: "Muy fuerte", c: "#0f766e", w: "100%" },
  ];
  const lvl = levels[Math.min(levels.length - 1, Math.max(0, pts - 1))];
  bar.style.width = lvl.w;
  bar.style.background = lvl.c;
  strengthLabel.textContent = lvl.t;
  strengthLabel.style.color = lvl.c;
}

len.addEventListener("input", () => {
  lenVal.textContent = len.value;
});
document.getElementById("gen").addEventListener("click", generate);
document.getElementById("copy").addEventListener("click", async () => {
  await navigator.clipboard.writeText(passwordEl.textContent);
  document.getElementById("copy").textContent = "¡Listo!";
  setTimeout(() => (document.getElementById("copy").textContent = "Copiar"), 1000);
});
["upper", "lower", "nums", "syms"].forEach((id) =>
  document.getElementById(id).addEventListener("change", generate)
);
generate();
