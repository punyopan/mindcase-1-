const fs = require('fs');

const puzzles = {
  // Topic 1: School Mysteries
  "1": { en: "The Missing Money", zh: "失踪的钱款", es: "El Dinero Desaparecido" },
  "2": { en: "The Identical Essays", zh: "雷同的论文", es: "Los Ensayos Idénticos" },
  "3": { en: "The Back Row Pattern", zh: "后排的规律", es: "El Patrón de la Fila Trasera" },
  "4": { en: "The Budget Crisis", zh: "预算危机", es: "La Crisis Presupuestaria" },
  "5": { en: "The Wonder Method", zh: "神奇教学法", es: "El Método Maravilla" },
  
  // Topic 2: Digital Deception
  "6": { en: "The Viral Statistic", zh: "病毒式传播的数据", es: "La Estadística Viral" },
  "7": { en: "The Principal Video", zh: "校长的视频", es: "El Video del Director" },
  "8": { en: "The Expert Influencer", zh: "专家网红", es: "El Influencer Experto" },
  "9": { en: "The Comment Consensus", zh: "评论共识", es: "El Consenso de los Comentarios" },
  "10": { en: "The Algorithm Echo", zh: "算法回声", es: "El Eco del Algoritmo" },

  // Topic 3: Workplace Politics
  "11": { en: "The Remote Work Blame", zh: "远程办公的指责", es: "La Culpa del Trabajo Remoto" },
  "12": { en: "The Promotion Puzzle", zh: "晋升难题", es: "El Rompecabezas de la Promoción" },
  "13": { en: "The Meeting Paradox", zh: "会议悖论", es: "La Paradoja de la Reunión" },
  "14": { en: "The AI Vendor Pitch", zh: "AI供应商的推销", es: "El Discurso del Proveedor de IA" },
  "15": { en: "The Survey Trap", zh: "调查陷阱", es: "La Trampa de la Encuesta" },

  // Topic 4: Health Hype
  "16": { en: "The Miracle Supplement", zh: "奇迹补剂", es: "El Suplemento Milagroso" },
  "17": { en: "The Diet Debate", zh: "饮食辩论", es: "El Debate de la Dieta" },
  "18": { en: "The Breakfast Study", zh: "早餐研究", es: "El Estudio del Desayuno" },
  "19": { en: "The Success Stories", zh: "成功故事", es: "Las Historias de Éxito" },
  "20": { en: "The Natural Label", zh: "天然标签", es: "La Etiqueta Natural" },

  // Topic 5: Money Mysteries (Already done, but adding for completeness/consistency)
  "21": { en: "The Hot Stock Tip", zh: "热门股票内幕", es: "El Consejo Bursátil" },
  // ... others in Topic 5 were added earlier

  // Topic 6: Public Health
  "26": { en: "The Screening Test Paradox", zh: "筛查测试悖论", es: "La Paradoja de la Prueba de Detección" },
  "27": { en: "The Vaccination Correlation", zh: "疫苗相关性", es: "La Correlación de la Vacunación" },
  "28": { en: "The Celebrity Cure", zh: "名人疗法", es: "La Cura de la Celebridad" },
  "29": { en: "The Painkiller Study", zh: "止痛药研究", es: "El Estudio de los Analgésicos" },
  "30": { en: "The Fitness Tracker Fallacy", zh: "健身追踪器谬误", es: "La Falacia del Rastreador de Fitness" },

  // Topic 7: Eco Dilemmas
  "31": { en: "The Cold Winter Argument", zh: "严冬论点", es: "El Argumento del Invierno Frío" },
  "32": { en: "The Recycling Contradiction", zh: "回收矛盾", es: "La Contradicción del Reciclaje" },
  "33": { en: "The Corporate Pledge", zh: "企业承诺", es: "La Promesa Corporativa" },
  "34": { en: "The Plastic Straw Ban", zh: "塑料吸管禁令", es: "La Prohibición de las Pajitas de Plástico" },
  "35": { en: "The Local Food Movement", zh: "本地食物运动", es: "El Movimiento de Comida Local" },

  // Topic 8: Justice & Law
  "36": { en: "The Eyewitness Confidence", zh: "目击者自信", es: "La Confianza del Testigo Ocular" },
  "37": { en: "The Recidivism Algorithm", zh: "累犯算法", es: "El Algoritmo de Reincidencia" },
  "38": { en: "The Plea Bargain Pressure", zh: "认罪协议压力", es: "La Presión del Acuerdo de Culpabilidad" },
  "39": { en: "The Tough-on-Crime Law", zh: "严打法律", es: "La Ley de Mano Dura" },
  "40": { en: "The Torture Ticking Bomb", zh: "酷刑定时炸弹", es: "La Bomba de Tiempo de la Tortura" },

  // Topic 9: Tech & Privacy
  "41": { en: "The Free App Deal", zh: "免费应用交易", es: "El Trato de la App Gratuita" },
  "42": { en: "The Smart Home Hack", zh: "智能家居黑客", es: "El Hackeo de la Casa Inteligente" },
  "43": { en: "The Encrypted Message Debate", zh: "加密信息辩论", es: "El Debate del Mensaje Cifrado" },
  "44": { en: "The Personalized Feed", zh: "个性化推送", es: "El Feed Personalizado" },
  "45": { en: "The Deepfake Evidence", zh: "深伪证据", es: "La Evidencia Deepfake" }
};

['en', 'zh', 'es'].forEach(lang => {
  const filePath = `locales/${lang}.json`;
  let data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  if (!data.puzzles) data.puzzles = {};

  Object.keys(puzzles).forEach(id => {
    // If puzzle key doesn't exist, create it
    if (!data.puzzles[id]) data.puzzles[id] = {};
    
    // Set title
    data.puzzles[id].title = puzzles[id][lang];
  });

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log(`Updated ${lang}.json with all puzzle titles`);
});
