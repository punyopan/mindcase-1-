const fs = require('fs');

const minigameNames = {
  "Color Sequence": { en: "Color Sequence", zh: "颜色记忆", es: "Secuencia de Colores" },
  "Memory Constellation": { en: "Memory Constellation", zh: "星座连线", es: "Constelación de Memoria" },
  "Rhythm Reef": { en: "Rhythm Reef", zh: "节奏珊瑚", es: "Arrecife de Ritmo" },
  "Logic Grid": { en: "Logic Grid", zh: "逻辑网格", es: "Cuadrícula Lógica" },
  "Word Cipher": { en: "Word Cipher", zh: "单词解密", es: "Cifrado de Palabras" },
  "Evidence Weight": { en: "Evidence Weight", zh: "证据权重", es: "Peso de la Evidencia" },
  "Missing Constraint": { en: "Missing Constraint", zh: "寻找缺失", es: "Restricción Faltante" },
  "Color Chaos Kitchen": { en: "Color Chaos Kitchen", zh: "色彩厨房", es: "Cocina de Colores" },
  "Number Ghost": { en: "Number Ghost", zh: "数字幽灵", es: "Fantasma Numérico" },
  "Tap Unless": { en: "Tap Unless", zh: "条件反应", es: "Tocar Si No" },
  "Rule Flip": { en: "Rule Flip", zh: "规则反转", es: "Regla Inversa" },
  "Face Fusion": { en: "Face Fusion", zh: "面孔融合", es: "Fusión de Rostros" },
  "Math Puzzle": { en: "Math Puzzle", zh: "速算谜题", es: "Rompecabezas Matemático" },
  "Visual Matching": { en: "Visual Matching", zh: "视觉匹配", es: "Coincidencia Visual" },
  "Mirror Match": { en: "Mirror Match", zh: "镜像镜像", es: "Coincidencia de Espejo" }
};

const evidenceWeight = {
  title: { en: "Evidence Weight", zh: "证据权重", es: "Peso de la Evidencia" },
  instruction: { en: "Rank the evidence from weakest to strongest", zh: "将证据从最弱到最强排序", es: "Clasifica la evidencia de la más débil a la más fuerte" },
  claim: { en: "Claim:", zh: "主张：", es: "Afirmación:" },
  available: { en: "Available Evidence (click to add to ranking):", zh: "可用证据（点击添加到排序）：", es: "Evidencia disponible (haz clic para agregar):" },
  your_ranking: { en: "Your Ranking (Weakest → Strongest):", zh: "你的排序（最弱 → 最强）：", es: "Tu clasificación (Más débil → Más fuerte):" },
  submit: { en: "Submit Ranking", zh: "提交排序", es: "Enviar clasificación" },
  select_instruction: { en: "Select all 3 pieces ({n}/3)", zh: "选择所有 3条证据 ({n}/3)", es: "Selecciona las 3 piezas ({n}/3)" },
  success: { en: "✓ Perfect ranking!", zh: "✓ 完美排序！", es: "✓ ¡Clasificación perfecta!" },
  fail: { en: "✗ Not quite right. Here's the correct ranking:", zh: "✗ 不太对。正确排序如下：", es: "✗ No es correcto. Aquí está la clasificación correcta:" },
  weakest: { en: "WEAKEST", zh: "最弱", es: "MÁS DÉBIL" },
  moderate: { en: "MODERATE", zh: "中等", es: "MODERADA" },
  strongest: { en: "STRONGEST", zh: "最强", es: "MÁS FUERTE" },
  why: { en: "Why:", zh: "原因：", es: "Por qué:" },
  try_another: { en: "Try Another Scenario", zh: "尝试另一个场景", es: "Prueba otro escenario" },
  tip: { en: "Tip: Strong evidence is verifiable, objective, controlled, and from larger samples. Anecdotes and opinions are weakest.", zh: "提示：强有力的证据是可验证的、客观的、受控的，且来自较大的样本。轶事和意见是最弱的。", es: "Consejo: La evidencia sólida es verificable, objetiva, controlada y de muestras más grandes. Las anécdotas y opiniones son las más débiles." }
};

['en', 'zh', 'es'].forEach(lang => {
  const filePath = `locales/${lang}.json`;
  let data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  if (!data.minigames) data.minigames = {};
  
  // Add minigame names
  Object.keys(minigameNames).forEach(name => {
    // Convert generic key: "Color Sequence" -> "color_sequence"
    const key = name.toLowerCase().replace(/ /g, '_');
    data.minigames[key] = minigameNames[name][lang];
  });

  // Add Evidence Weight UI
  if (!data.minigames.evidence_weight) data.minigames.evidence_weight = {};
  Object.keys(evidenceWeight).forEach(key => {
    data.minigames.evidence_weight[key] = evidenceWeight[key][lang];
  });

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log(`Updated ${lang}.json with minigame translations`);
});
