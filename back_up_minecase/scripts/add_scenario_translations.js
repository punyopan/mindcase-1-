const fs = require('fs');

const scenarioKeys = {
  // SIGNAL FIELD - EDUCATION
  "education_title": { en: "Student Performance Analysis", zh: "学生成绩分析", es: "Análisis del Rendimiento Estudiantil" },
  "education_briefing": { 
    en: "You've been given performance data from a class. School administrators believe they've identified what's causing score differences and want to implement policy changes. Examine the data before they act.",
    zh: "你收到了一份班级的成绩数据。学校管理者认为他们已经找出导致分数差异的原因，并希望实施政策改革。在他们行动之前，请先检查数据。",
    es: "Has recibido datos de rendimiento de una clase. Los administradores creen haber identificado la causa de las diferencias en las calificaciones y quieren implementar cambios. Examina los datos antes de que actúen."
  },
  "education_insight": { en: "The apparent pattern is confounded by pre-existing differences", zh: "明显的模式因预先存在的差异而混淆", es: "El patrón aparente se confunde con diferencias preexistentes" },
  
  // SIGNAL FIELD - HEALTH
  "health_title": { en: "Treatment Outcome Analysis", zh: "治疗结果分析", es: "Análisis de Resultados de Tratamiento" },
  "health_briefing": { 
    en: "A hospital board is about to mandate Treatment C based on their analysis showing it has the best outcomes. You have access to the full dataset. What's actually going on?",
    zh: "医院董事会打算根据显示治疗C效果最好的分析结果强制推广该疗法。你有权访问完整数据集。这背后究竟发生了什么？",
    es: "La junta del hospital está a punto de exigir el Tratamiento C basándose en su análisis de que tiene los mejores resultados. Tienes acceso al conjunto de datos completo. ¿Qué está pasando realmente?"
  },
  "health_insight": { en: "Treatment selection is confounded by patient severity", zh: "治疗选择因患者病情的严重程度而混淆", es: "La selección del tratamiento se confunde con la gravedad del paciente" },

  // SIGNAL FIELD - BUSINESS
  "business_title": { en: "Remote Work Productivity Study", zh: "远程工作效率研究", es: "Estudio de Productividad en Trabajo Remoto" },
  "business_briefing": { 
    en: "The CEO wants to end remote work because office workers appear more productive. HR has provided this dataset. Analyze it before the policy announcement.",
    zh: "CEO想结束远程办公，因为办公室员工看起来效率更高。HR提供了这份数据集。在政策宣布前请进行分析。",
    es: "El CEO quiere terminar con el trabajo remoto porque los empleados de oficina parecen más productivos. RRHH ha proporcionado este conjunto de datos. Analízalo antes del anuncio de la política."
  },
  "business_insight": { en: "Work location differences are explained by management quality", zh: "工作地点的差异可以通过管理质量来解释", es: "Las diferencias en la ubicación del trabajo se explican por la calidad de la gestión" },

  // VALUES
  "val_front": { en: "Front", zh: "前排", es: "Frente" },
  "val_front_mid": { en: "Front-Mid", zh: "中前排", es: "Frente-Medio" },
  "val_middle": { en: "Middle", zh: "中间", es: "Medio" },
  "val_back_mid": { en: "Back-Mid", zh: "中后排", es: "Atrás-Medio" },
  "val_back": { en: "Back", zh: "后排", es: "Atrás" },
  "val_morning": { en: "morning", zh: "早上", es: "Mañana" },
  "val_midday": { en: "midday", zh: "中午", es: "Mediodía" },
  "val_afternoon": { en: "afternoon", zh: "下午", es: "Tarde" },
  "val_high_school": { en: "high_school", zh: "高中", es: "Secundaria" },
  "val_college": { en: "college", zh: "大学", es: "Universidad" },
  "val_graduate": { en: "graduate", zh: "研究生", es: "Posgrado" },
  
  // VARIABLE MANIFOLD
  "city_title": { en: "Urban Policy Simulator", zh: "城市政策模拟器", es: "Simulador de Política Urbana" },
  "city_briefing": { en: "You are managing a complex city system. Interventions in one area will cascade to others. Find a stable configuration.", zh: "你正在管理一个复杂的城市系统。一个领域的干预会级联影响其他领域。寻找一个稳定的配置。", es: "Estás gestionando un sistema urbano complejo. Las intervenciones en un área afectarán a otras. Encuentra una configuración estable." },
  
  "ecosystem_title": { en: "Ecosystem Balance", zh: "生态系统平衡", es: "Equilibrio del Ecosistema" },
  "ecosystem_briefing": { en: "You are managing a complex ecosystem system. Interventions in one area will cascade to others. Find a stable configuration.", zh: "你正在管理一个复杂的生态系统。一个领域的干预会级联影响其他领域。寻找一个稳定的配置。", es: "Estás gestionando un sistema de ecosistema complejo. Las intervenciones en un área afectarán a otras. Encuentra una configuración estable." },

  "corp_title": { en: "Corporate Strategy", zh: "企业战略", es: "Estrategia Corporativa" },
  "corp_briefing": { en: "You are managing a complex corp system. Interventions in one area will cascade to others. Find a stable configuration.", zh: "你正在管理一个复杂的企业系统。一个领域的干预会级联影响其他领域。寻找一个稳定的配置。", es: "Estás gestionando un sistema corporativo complejo. Las intervenciones en un área afectarán a otras. Encuentra una configuración estable." },

  // GENERIC BRIEFING TEMPLATE for Variable Manifold (if keys missing)
  "manifold_briefing_template": {
      en: "You are managing a complex [SYSTEM] system. Interventions in one area will cascade to others. Find a stable configuration.",
      zh: "你正在管理一个复杂的[SYSTEM]系统。一个领域的干预会级联影响其他领域。寻找一个稳定的配置。",
      es: "Estás gestionando un sistema [SYSTEM] complejo. Las intervenciones en un área afectarán a otras. Encuentra una configuración estable."
  }
};

['en', 'zh', 'es'].forEach(lang => {
  const filePath = `locales/${lang}.json`;
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  if (!data.cognitive) data.cognitive = {};
  if (!data.cognitive.scenarios) data.cognitive.scenarios = {};

  Object.entries(scenarioKeys).forEach(([key, translations]) => {
     data.cognitive.scenarios[key] = translations[lang];
  });
  
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log(`Updated ${lang}.json`);
});
