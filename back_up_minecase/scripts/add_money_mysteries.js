const fs = require('fs');

const keys = {
  topics: {
    "5": {
      name: { en: "Money Mysteries", zh: "金钱谜案", es: "Misterios de Dinero" },
      description: { en: "Financial literacy puzzles about investments, scams, and money decisions.", zh: "关于投资、诈骗和金钱决策的金融素养谜题。", es: "Rompecabezas de educación financiera sobre inversiones, estafas y decisiones monetarias." }
    }
  },
  puzzles: {
    "21": { title: { en: "The Hot Stock Tip", zh: "热门股票内幕", es: "El Consejo Bursátil" } },
    "22": { title: { en: "The Course Dilemma", zh: "课程困境", es: "El Dilema del Curso" } },
    "23": { title: { en: "The Car Deal", zh: "汽车交易", es: "El Trato del Coche" } },
    "24": { title: { en: "The Tech Portfolio", zh: "科技投资组合", es: "La Cartera Tecnológica" } },
    "25": { title: { en: "The Raise Decision", zh: "加薪决策", es: "La Decisión del Aumento" } }
  },
  card: {
    unlock_tokens: { en: "Unlock ({count} tokens)", zh: "解锁 ({count} 代币)", es: "Desbloquear ({count} fichas)" },
    review: { en: "Review", zh: "回顾", es: "Revisar" },
    solve_riddle: { en: "Solve Riddle", zh: "解开谜题", es: "Resolver Acertijo" },
    analyze: { en: "Analyze", zh: "分析", es: "Analizar" },
    locked: { en: "Locked", zh: "已锁定", es: "Bloqueado" },
    evidence: { en: "Evidence", zh: "证据", es: "Evidencia" },
    alert_minigames: { en: "🔒 Complete all 3 minigames first to unlock the Analyze button!\n\nClick \"🎮 Evidence\" to collect evidence through minigames.", zh: "🔒 请先完成所有 3 个迷你游戏以解锁分析按钮！\n\n点击“🎮 证据”通过迷你游戏收集证据。", es: "🔒 ¡Completa los 3 minijuegos primero para desbloquear el botón Analizar!\n\nHaz clic en \"🎮 Evidencia\" para recolectar evidencia a través de minijuegos." },
    evidence_board: { en: "Evidence Board", zh: "证据板", es: "Tablero de Pruebas" },
    click_instruction: { en: "Click a case to write your analysis", zh: "点击案件以撰写分析", es: "Haz clic en un caso para escribir tu análisis" }
  }
};

['en', 'zh', 'es'].forEach(lang => {
  const filePath = `locales/${lang}.json`;
  let data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  // Update topic 5
  if (!data.topics) data.topics = {};
  if (!data.topics["5"]) data.topics["5"] = {};
  data.topics["5"].name = keys.topics["5"].name[lang];
  data.topics["5"].description = keys.topics["5"].description[lang];

  // Update puzzles
  if (!data.puzzles) data.puzzles = {};
  Object.keys(keys.puzzles).forEach(id => {
      if (!data.puzzles[id]) data.puzzles[id] = {};
      data.puzzles[id].title = keys.puzzles[id].title[lang];
  });

  // Update card common strings
  if (!data.card) data.card = {};
  Object.keys(keys.card).forEach(k => {
      data.card[k] = keys.card[k][lang];
  });

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log(`Updated ${lang}.json`);
});
