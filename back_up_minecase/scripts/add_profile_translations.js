/**
 * Add missing profile page translation keys to all locale files
 */
const fs = require('fs');

// New keys to add for complete profile localization
const newProfileKeys = {
  // Profile panel header
  "member_since": {
    en: "Member since",
    zh: "加入时间",
    es: "Miembro desde"
  },
  "detective": {
    en: "Detective",
    zh: "侦探",
    es: "Detective"
  },
  
  // Stats
  "cases_solved": {
    en: "Cases Solved",
    zh: "已破案件",
    es: "Casos Resueltos"
  },
  "total_points": {
    en: "Total Points",
    zh: "总积分",
    es: "Puntos Totales"
  },
  
  // Analytics
  "view_advanced_analytics": {
    en: "View Advanced Analytics",
    zh: "查看高级分析",
    es: "Ver Análisis Avanzado"
  },
  "premium_feature": {
    en: "Premium Feature",
    zh: "高级功能",
    es: "Función Premium"
  },
  "premium_upgrade": {
    en: "Premium Feature - Upgrade to unlock",
    zh: "高级功能 - 升级解锁",
    es: "Función Premium - Actualiza para desbloquear"
  },
  
  // Skill Profile
  "your_skill_profile": {
    en: "Your Skill Profile",
    zh: "你的技能档案",
    es: "Tu Perfil de Habilidades"
  },
  
  // Skill descriptions
  "logical_desc": {
    en: "Your ability to construct sound arguments, analyze complex systems, and identify valid conclusions from premises.",
    zh: "你构建合理论证、分析复杂系统的能力，以及从前提中识别有效结论的能力。",
    es: "Tu capacidad para construir argumentos sólidos, analizar sistemas complejos e identificar conclusiones válidas a partir de premisas."
  },
  "decision_desc": {
    en: "Your capacity to evaluate options, weigh trade-offs, and make reasoned choices under uncertainty.",
    zh: "你评估选项、权衡利弊的能力，以及在不确定情况下做出合理选择的能力。",
    es: "Tu capacidad para evaluar opciones, sopesar compromisos y tomar decisiones razonadas bajo incertidumbre."
  },
  "adaptive_desc": {
    en: "Your ability to recognize patterns, integrate new information, and update your mental models as you learn.",
    zh: "你识别模式、整合新信息的能力，以及在学习过程中更新心智模型的能力。",
    es: "Tu capacidad para reconocer patrones, integrar nueva información y actualizar tus modelos mentales mientras aprendes."
  },
  "source_desc": {
    en: "Your proficiency in assessing the credibility, reliability, and validity of information sources and research claims.",
    zh: "你评估信息来源和研究结论的可信度、可靠性和有效性的能力。",
    es: "Tu competencia para evaluar la credibilidad, fiabilidad y validez de las fuentes de información y afirmaciones de investigación."
  },
  "bias_desc": {
    en: "Your awareness of cognitive biases, logical fallacies, and how they can distort reasoning and decision-making processes.",
    zh: "你对认知偏见、逻辑谬误的认识，以及它们如何扭曲推理和决策过程。",
    es: "Tu conciencia de los sesgos cognitivos, las falacias lógicas y cómo pueden distorsionar los procesos de razonamiento y toma de decisiones."
  },
  
  // Token Balance
  "token_balance": {
    en: "Token Balance",
    zh: "代币余额",
    es: "Saldo de Tokens"
  },
  "token_description": {
    en: "Earn tokens by completing daily minigames. Use 5 tokens to unlock a new puzzle!",
    zh: "完成每日小游戏可获得代币。使用5个代币解锁新谜题！",
    es: "Gana tokens completando minijuegos diarios. ¡Usa 5 tokens para desbloquear un nuevo puzzle!"
  },
  
  // Skills labels
  "logical": {
    en: "Logical Reasoning",
    zh: "逻辑推理",
    es: "Razonamiento Lógico"
  },
  "decision": {
    en: "Decision Making",
    zh: "决策能力",
    es: "Toma de Decisiones"
  },
  "adaptive": {
    en: "Adaptive Learning",
    zh: "适应性学习",
    es: "Aprendizaje Adaptativo"
  },
  "source": {
    en: "Source Evaluation",
    zh: "来源评估",
    es: "Evaluación de Fuentes"
  },
  "bias": {
    en: "Bias Detection",
    zh: "偏见检测",
    es: "Detección de Sesgos"
  }
};

// Settings keys
const newSettingsKeys = {
  "login_signup": {
    en: "Login / Sign Up",
    zh: "登录 / 注册",
    es: "Iniciar Sesión / Registrarse"
  },
  "logout": {
    en: "Logout",
    zh: "退出登录",
    es: "Cerrar Sesión"
  },
  "security": {
    en: "Security",
    zh: "安全",
    es: "Seguridad"
  },
  "free_plan": {
    en: "Free",
    zh: "免费",
    es: "Gratis"
  },
  "plan": {
    en: "Plan",
    zh: "计划",
    es: "Plan"
  }
};

// Load and update each locale file
['en', 'zh', 'es'].forEach(lang => {
  const filePath = `locales/${lang}.json`;
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  // Ensure profile object exists
  if (!data.profile) data.profile = {};
  if (!data.settings) data.settings = {};
  
  // Add profile keys
  let addedProfileCount = 0;
  Object.entries(newProfileKeys).forEach(([key, translations]) => {
    if (!data.profile[key]) {
      data.profile[key] = translations[lang];
      addedProfileCount++;
    }
  });
  
  // Add settings keys
  let addedSettingsCount = 0;
  Object.entries(newSettingsKeys).forEach(([key, translations]) => {
    if (!data.settings[key]) {
      data.settings[key] = translations[lang];
      addedSettingsCount++;
    }
  });
  
  // Save
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log(`${lang}.json: Added ${addedProfileCount} profile keys, ${addedSettingsCount} settings keys`);
});

console.log('Done!');
