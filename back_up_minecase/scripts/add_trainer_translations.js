const fs = require('fs');

const keys = {
  cognitive: {
    trainer_title: { en: "Cognitive Trainer", zh: "认知训练器", es: "Entrenador Cognitivo" },
    session_id: { en: "SESSION ID", zh: "会话 ID", es: "ID DE SESIÓN" },
    status_resumed: { en: "Resumed", zh: "已恢复", es: "Reanudado" },
    reset: { en: "Reset", zh: "重置", es: "Reiniciar" },
    save_exit: { en: "Save & Exit", zh: "保存并退出", es: "Guardar y Salir" },
    exit: { en: "Exit", zh: "退出", es: "Salir" },
    phase_1_title: { en: "Phase 1: Observation", zh: "第一阶段：观察", es: "Fase 1: Observación" },
    phase_2_title: { en: "Phase 2: Hypothesis", zh: "第二阶段：假设", es: "Fase 2: Hipótesis" },
    phase_3_title: { en: "Phase 3: Integration", zh: "第三阶段：整合", es: "Fase 3: Integración" },
    premium_badge: { en: "Premium", zh: "高级", es: "Premium" },
    game_assumption: { en: "Assumption Excavator", zh: "假设挖掘机", es: "Excavadora de Suposiciones" }
  }
};

['en', 'zh', 'es'].forEach(lang => {
  const filePath = `locales/${lang}.json`;
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  if (!data.cognitive) data.cognitive = {};

  Object.entries(keys.cognitive).forEach(([key, val]) => {
     data.cognitive[key] = val[lang];
  });

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log(`Updated ${lang}.json`);
});
