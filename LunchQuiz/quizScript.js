const quizForm = document.getElementById("overwatchQuiz");
const changeSlider = document.getElementById("change");
const changeValue = document.getElementById("changeValue");
const resultSection = document.getElementById("result");
const resultTitle = document.getElementById("resultTitle");
const resultRole = document.getElementById("resultRole");
const resultText = document.getElementById("resultText");
const heroBadge = document.getElementById("heroBadge");
const answerSummary = document.getElementById("answerSummary");
const restartBtn = document.getElementById("restartBtn");
const lastResult = document.getElementById("lastResult");

const STORAGE_KEY = "overwatchLoreQuizAnswers";
const RESULT_KEY = "overwatchLoreQuizResult";

const heroes = {
  tracer: {
    name: "Tracer",
    role: "Hopeful time-jumper | Brave, warm, impossible to keep still",
    initials: "TR",
    className: "hero-tracer",
    description:
      "Like Tracer, you carry light into unstable places. Your answer pattern points to someone who believes the future is still worth running toward, even after the world has gone wrong."
  },
  reinhardt: {
    name: "Reinhardt",
    role: "Old guard protector | Loyal, honorable, larger than life",
    initials: "RH",
    className: "hero-reinhardt",
    description:
      "Like Reinhardt, you are drawn to duty, protection, and moral clarity. You may be dramatic about it, but underneath the drama is a sincere promise: people should not have to stand alone."
  },
  mercy: {
    name: "Mercy",
    role: "Brilliant healer | Compassionate, principled, quietly stubborn",
    initials: "MC",
    className: "hero-mercy",
    description:
      "Like Mercy, you are shaped by care and responsibility. You are interested in repair, not glory, and you understand that healing a broken world takes patience as much as courage."
  },
  sombra: {
    name: "Sombra",
    role: "Information seeker | Independent, suspicious, always three steps ahead",
    initials: "SB",
    className: "hero-sombra",
    description:
      "Like Sombra, you do not accept the official story just because someone powerful tells it. You are drawn to hidden systems, secrets, and the freedom that comes from knowing the truth."
  },
  widowmaker: {
    name: "Widowmaker",
    role: "Haunted specialist | Controlled, distant, difficult to read",
    initials: "WM",
    className: "hero-widowmaker",
    description:
      "Like Widowmaker, your result suggests distance, discipline, and emotional self-protection. You may not reveal much at first, but there is a complicated inner world beneath the stillness."
  },
  lucio: {
    name: "Lucio",
    role: "Community voice | Joyful, rebellious, rooted in people",
    initials: "LC",
    className: "hero-lucio",
    description:
      "Like Lucio, you believe culture can be resistance. You are pulled toward community, rhythm, public joy, and the idea that people become braver when they move together."
  },
  dva: {
    name: "D.Va",
    role: "Public hero | Competitive, expressive, carrying pressure behind the smile",
    initials: "DV",
    className: "hero-dva",
    description:
      "Like D.Va, you know what it means to perform confidence while carrying real responsibility. You meet pressure with style, humor, and a refusal to look away."
  },
  genji: {
    name: "Genji",
    role: "Rebuilt wanderer | Reflective, disciplined, searching for balance",
    initials: "GJ",
    className: "hero-genji",
    description:
      "Like Genji, your story is about transformation. You are drawn to the difficult work of becoming whole after change, conflict, or loss."
  }
};

const scoring = {
  calling: {
    restore: ["tracer", "mercy", "lucio"],
    protect: ["reinhardt", "dva", "mercy"],
    truth: ["sombra", "widowmaker"],
    reinvent: ["genji", "dva", "tracer"]
  },
  home: {
    city: ["lucio", "tracer", "dva"],
    lab: ["mercy", "sombra", "genji"],
    frontier: ["reinhardt", "genji", "tracer"],
    shadow: ["sombra", "widowmaker"]
  },
  communityRole: {
    guardian: ["reinhardt", "dva"],
    healer: ["mercy", "lucio"],
    messenger: ["tracer", "lucio"],
    strategist: ["sombra", "widowmaker", "genji"]
  },
  crisis: {
    courage: ["tracer", "reinhardt", "dva"],
    care: ["mercy", "lucio"],
    knowledge: ["sombra", "genji"],
    control: ["widowmaker", "reinhardt"]
  },
  struggle: {
    belonging: ["tracer", "lucio", "dva"],
    guilt: ["reinhardt", "mercy", "genji"],
    identity: ["genji", "widowmaker", "dva"],
    trust: ["sombra", "widowmaker"]
  },
  core: {
    hope: ["tracer", "mercy"],
    honor: ["reinhardt", "genji"],
    curiosity: ["sombra", "mercy"],
    freedom: ["sombra", "lucio"],
    discipline: ["widowmaker", "genji"],
    joy: ["lucio", "dva", "tracer"]
  },
  future: {
    peace: ["mercy", "genji", "tracer"],
    justice: ["reinhardt", "sombra", "lucio"],
    innovation: ["mercy", "sombra", "dva"],
    liberation: ["lucio", "sombra", "genji"]
  }
};

changeSlider.addEventListener("input", () => {
  changeValue.textContent = changeSlider.value;
});

window.addEventListener("DOMContentLoaded", () => {
  const savedResult = localStorage.getItem(RESULT_KEY);
  if (savedResult && heroes[savedResult]) {
    lastResult.textContent = `Last time, you connected with ${heroes[savedResult].name}.`;
    lastResult.classList.remove("hidden");
    document.body.className = heroes[savedResult].className;
  }
});

quizForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const answers = Object.fromEntries(new FormData(quizForm).entries());
  answers.change = changeSlider.value;

  const heroKey = getHeroResult(answers);
  const hero = heroes[heroKey];

  localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
  localStorage.setItem(RESULT_KEY, heroKey);

  showResult(hero, answers);
});

restartBtn.addEventListener("click", () => {
  quizForm.reset();
  changeSlider.value = 5;
  changeValue.textContent = "5";
  resultSection.classList.add("hidden");
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(RESULT_KEY);
  lastResult.classList.add("hidden");
  document.body.className = "";
  window.scrollTo({ top: 0, behavior: "smooth" });
});

function getHeroResult(answers) {
  const scores = {};

  Object.keys(heroes).forEach((hero) => {
    scores[hero] = 0;
  });

  Object.keys(scoring).forEach((question) => {
    const answer = answers[question];
    const matches = scoring[question][answer] || [];

    matches.forEach((hero) => {
      scores[hero] += 2;
    });
  });

  const change = Number(answers.change);
  if (change >= 8) {
    scores.tracer += 2;
    scores.genji += 3;
    scores.mercy += 1;
  } else if (change >= 5) {
    scores.lucio += 2;
    scores.dva += 2;
    scores.mercy += 1;
  } else {
    scores.widowmaker += 2;
    scores.sombra += 2;
    scores.reinhardt += 1;
  }

  return Object.keys(scores).sort((a, b) => scores[b] - scores[a])[0];
}

function showResult(hero, answers) {
  document.body.className = hero.className;
  heroBadge.textContent = hero.initials;
  resultTitle.textContent = hero.name;
  resultRole.textContent = hero.role;
  resultText.textContent = hero.description;

  answerSummary.innerHTML = `
    <strong>Your saved answers changed this page:</strong>
    <span>calling: ${answers.calling}</span>
    <span>change: ${answers.change}/10</span>
    <span>core: ${answers.core}</span>
  `;

  resultSection.classList.remove("hidden");
  resultSection.scrollIntoView({ behavior: "smooth", block: "start" });
}
