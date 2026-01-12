const fs = require('fs');

const extraKeys = {
  profile: {
    "skill_logical": { en: "Logical\nReasoning", zh: "逻辑\n推理", es: "Razonamiento\nLógico" },
    "skill_decision": { en: "Decision\nMaking", zh: "决策\n能力", es: "Toma de\nDecisiones" },
    "skill_adaptive": { en: "Adaptive\nLearning", zh: "适应性\n学习", es: "Aprendizaje\nAdaptativo" },
    "skill_source": { en: "Source\nEvaluation", zh: "来源\n评估", es: "Evaluación\nde Fuentes" },
    "skill_bias": { en: "Bias\nDetection", zh: "偏见\n检测", es: "Detección\nde Sesgos" }
  },
  settings: {
    "sessions_history": { en: "Sessions & History", zh: "会话与历史", es: "Sesiones e Historial" },
    "sound_music": { en: "Sound & Music", zh: "声音与音乐", es: "Sonido y Música" },
    "data_management": { en: "Data Management", zh: "数据管理", es: "Gestión de Datos" },
    "daily_reminders": { en: "Daily Reminders", zh: "每日提醒", es: "Recordatorios Diarios" },
    "reminders_desc": { en: "Get notified to practice critical thinking", zh: "接收提醒以练习批判性思维", es: "Recibe notificaciones para practicar el pensamiento crítico" },
    "language": { en: "Language", zh: "语言", es: "Idioma" },
    "legal": { en: "Legal", zh: "法律", es: "Legal" },
    "privacy_policy": { en: "Privacy Policy", zh: "隐私政策", es: "Política de Privacidad" },
    "terms_service": { en: "Terms of Service", zh: "服务条款", es: "Términos de Servicio" },
    "back": { en: "Back", zh: "返回", es: "Atrás" },
    "email": { en: "Email", zh: "邮箱", es: "Correo Electrónico" },
    "password": { en: "Password", zh: "密码", es: "Contraseña" },
    "login_action": { en: "Login", zh: "登录", es: "Iniciar Sesión" },
    "demo_text": { en: "Demo: Use any email and password to login", zh: "演示：使用任意邮箱和密码登录", es: "Demo: Usa cualquier correo y contraseña para entrar" }
  }
};

['en', 'zh', 'es'].forEach(lang => {
  const filePath = `locales/${lang}.json`;
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  if (!data.profile) data.profile = {};
  if (!data.settings) data.settings = {};

  Object.entries(extraKeys.profile).forEach(([key, val]) => {
     // Overwrite or add
     data.profile[key] = val[lang];
  });
  
  Object.entries(extraKeys.settings).forEach(([key, val]) => {
     // Overwrite or add
     data.settings[key] = val[lang];
  });

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log(`Updated ${lang}.json`);
});
