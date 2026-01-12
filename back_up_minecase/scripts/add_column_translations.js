const fs = require('fs');

const colKeys = {
  // Education
  "col_testScore": { en: "Test Score", zh: "考试分数", es: "Puntaje de Prueba" },
  "col_seatPosition": { en: "Seat Position", zh: "座位位置", es: "Posición del Asiento" },
  "col_classTime": { en: "Class Time", zh: "上课时间", es: "Hora de Clase" },
  "col_attendance": { en: "Attendance", zh: "出勤率", es: "Asistencia" },
  "col_reportedStudyHours": { en: "Study Hours", zh: "学习时长", es: "Horas de Estudio" },
  "col_priorGradeLevel": { en: "Prior Grade", zh: "之前成绩", es: "Calificación Anterior" },
  "col_extraCurricular": { en: "Extra Curricular", zh: "课外活动", es: "Extracurriculares" },
  "col_partTimeJob": { en: "Part Time Job", zh: "兼职工作", es: "Trabajo Parcial" },
  "col_parentsEducation": { en: "Parents Education", zh: "父母学历", es: "Educación de Padres" },
  
  // Boolean
  "yes": { en: "Yes", zh: "是", es: "Sí" },
  "no": { en: "No", zh: "否", es: "No" },
  
  // Health
  "col_recoveryScore": { en: "Recovery Score", zh: "康复评分", es: "Puntaje de Recuperación" },
  "col_age": { en: "Age", zh: "年龄", es: "Edad" },
  "col_treatmentType": { en: "Treatment Type", zh: "治疗类型", es: "Tipo de Tratamiento" },
  "col_hoursToTreatment": { en: "Hours to Treatment", zh: "治疗等待时间", es: "Horas para Tratamiento" },
  "col_hospitalSize": { en: "Hospital Size", zh: "医院规模", es: "Tamaño del Hospital" },
  "col_hasInsurance": { en: "Insurance", zh: "保险", es: "Seguro" },
  "col_comorbidities": { en: "Comorbidities", zh: "并发症", es: "Comorbilidades" },
  "col_doctorExperience": { en: "Doctor Exp", zh: "医生经验", es: "Exp. del Doctor" },

  // Business
  "col_productivityScore": { en: "Productivity", zh: "生产力", es: "Productividad" },
  "col_workLocation": { en: "Location", zh: "工作地点", es: "Ubicación" },
  "col_yearsAtCompany": { en: "Tenure", zh: "任期", es: "Antigüedad" },
  "col_teamSize": { en: "Team Size", zh: "团队规模", es: "Tamaño del Equipo" },
  "col_meetingsPerWeek": { en: "Meetings/Week", zh: "每周会议", es: "Reuniones/Semana" },
  "col_performanceReviews": { en: "Perf. Reviews", zh: "绩效评估", es: "Revisiones de Desempeño" },
  "col_department": { en: "Department", zh: "部门", es: "Departamento" },
  "col_managerId": { en: "Manager ID", zh: "经理ID", es: "ID de Gerente" },
  "col_trainingHours": { en: "Training Hours", zh: "培训时长", es: "Horas de Capacitación" }
};

['en', 'zh', 'es'].forEach(lang => {
  const filePath = `locales/${lang}.json`;
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  if (!data.cognitive) data.cognitive = {};
  if (!data.cognitive.cols) data.cognitive.cols = {};
  if (!data.common) data.common = {};

  Object.entries(colKeys).forEach(([key, translations]) => {
     if (key === 'yes' || key === 'no') {
        data.common[key] = translations[lang];
     } else {
        data.cognitive.cols[key.replace('col_', '')] = translations[lang];
     }
  });
  
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log(`Updated ${lang}.json`);
});
