const fs = require('fs');

const keys = {
  menu: {
    case_files: { en: "Case Files", zh: "案件档案", es: "Archivos del Caso" },
    main_menu: { en: "Main Menu", zh: "主菜单", es: "Menú Principal" },
    classic_puzzles: { en: "Classic Puzzles", zh: "经典谜题", es: "Acertijos Clásicos" },
    interview_favorites: { en: "Interview Favorites", zh: "面试精选", es: "Favoritos de Entrevista" }
  },
  common: {
    solved: { en: "Solved", zh: "已解决", es: "Resuelto" }
  }
};

['en', 'zh', 'es'].forEach(lang => {
  const filePath = `locales/${lang}.json`;
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  if (!data.menu) data.menu = {};
  if (!data.common) data.common = {};

  Object.entries(keys.menu).forEach(([key, val]) => {
     data.menu[key] = val[lang];
  });
  
  Object.entries(keys.common).forEach(([key, val]) => {
     data.common[key] = val[lang];
  });

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log(`Updated ${lang}.json`);
});
