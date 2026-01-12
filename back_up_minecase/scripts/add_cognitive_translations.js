/**
 * Add missing cognitive training translation keys to all locale files
 */
const fs = require('fs');

// New keys to add for complete localization
const newCognitiveKeys = {
  // SignalField.jsx
  "uncertainty_prompt": {
    en: "What are you uncertain about and why?",
    zh: "你对什么感到不确定，为什么？",
    es: "¿De qué estás inseguro y por qué?"
  },
  "uncertainty_placeholder": {
    en: "I'm uncertain about... because the data doesn't clearly show...",
    zh: "我不确定……因为数据没有清楚地显示……",
    es: "No estoy seguro de... porque los datos no muestran claramente..."
  },
  "submit_synthesis": {
    en: "Submit Synthesis",
    zh: "提交综合分析",
    es: "Enviar Síntesis"
  },
  "challenge_reasoning": {
    en: "Challenge Your Reasoning",
    zh: "挑战你的推理",
    es: "Desafía Tu Razonamiento"
  },
  "challenge_response_placeholder": {
    en: "Respond to this challenge...",
    zh: "回应这个挑战...",
    es: "Responde a este desafío..."
  },
  "complete_session": {
    en: "Complete Session",
    zh: "完成训练",
    es: "Completar Sesión"
  },
  
  // ForensicNarrative.jsx
  "source": {
    en: "Source",
    zh: "来源",
    es: "Fuente"
  },
  "reliability_question": {
    en: "How reliable is this evidence?",
    zh: "这个证据有多可靠？",
    es: "¿Qué tan confiable es esta evidencia?"
  },
  "add_note_placeholder": {
    en: "Add a note about this evidence...",
    zh: "添加关于此证据的笔记...",
    es: "Añade una nota sobre esta evidencia..."
  },
  "may_contradict": {
    en: "May contradict other evidence",
    zh: "可能与其他证据相矛盾",
    es: "Puede contradecir otras evidencias"
  },
  "contains_gap": {
    en: "Contains gap or missing information",
    zh: "包含空白或缺失信息",
    es: "Contiene vacíos o información faltante"
  },
  "how_step_1": {
    en: "Evidence will unlock progressively - don't rush",
    zh: "证据将逐步解锁 - 不要急躁",
    es: "Las evidencias se desbloquearán progresivamente - no te apresures"
  },
  "how_step_2": {
    en: "Rate each evidence's reliability and take notes",
    zh: "评估每个证据的可靠性并做笔记",
    es: "Califica la confiabilidad de cada evidencia y toma notas"
  },
  "how_step_3": {
    en: "Build a narrative that explains the evidence",
    zh: "构建一个解释证据的叙述",
    es: "Construye una narrativa que explique la evidencia"
  },
  "how_step_4": {
    en: "I will challenge your narrative - defend or revise it",
    zh: "我会挑战你的叙述 - 捍卫或修改它",
    es: "Desafiaré tu narrativa - defiéndela o revísala"
  },
  "how_step_5": {
    en: "There is no single 'correct' answer",
    zh: '没有单一的"正确"答案',
    es: "No hay una única respuesta 'correcta'"
  },
  "forensic_instructions": {
    en: "Examine each piece of evidence carefully. Rate its reliability (1-5), note any observations, and watch for contradictions.",
    zh: "仔细检查每一条证据。评估其可靠性(1-5)，记录观察结果，注意矛盾之处。",
    es: "Examina cada pieza de evidencia cuidadosamente. Califica su confiabilidad (1-5), anota observaciones y busca contradicciones."
  },
  "build_narrative": {
    en: "Build Narrative",
    zh: "构建叙述",
    es: "Construir Narrativa"
  },
  "rate_minimum": {
    en: "Rate at least 3 pieces of evidence before proceeding",
    zh: "继续前请至少评估3条证据",
    es: "Califica al menos 3 evidencias antes de continuar"
  },
  "build_your_narrative": {
    en: "Build Your Narrative",
    zh: "构建你的叙述",
    es: "Construye Tu Narrativa"
  },
  "narrative_instruction": {
    en: "Based on the evidence, construct an interpretation of what happened. Link evidence pieces together to support your narrative.",
    zh: "根据证据，构建对事件的解释。将证据联系起来支持你的叙述。",
    es: "Basándote en la evidencia, construye una interpretación de lo que sucedió. Conecta las evidencias para apoyar tu narrativa."
  },
  "possible_interpretations": {
    en: "Possible Interpretations",
    zh: "可能的解释",
    es: "Posibles Interpretaciones"
  },
  "your_interpretation": {
    en: "Your Interpretation",
    zh: "你的解释",
    es: "Tu Interpretación"
  },
  "interpretation_placeholder_forensic": {
    en: "Based on the evidence, I believe... The key evidence supporting this is... However, I acknowledge that...",
    zh: "根据证据，我认为……支持这一观点的关键证据是……但是，我承认……",
    es: "Basándome en la evidencia, creo que... La evidencia clave que apoya esto es... Sin embargo, reconozco que..."
  },
  "reference_evidence": {
    en: "Reference specific evidence. Acknowledge contradictions and gaps.",
    zh: "引用具体证据。承认矛盾和空白。",
    es: "Haz referencia a evidencias específicas. Reconoce contradicciones y vacíos."
  },
  "confidence_question": {
    en: "How confident are you in this interpretation?",
    zh: "你对这个解释有多自信？",
    es: "¿Qué tan seguro estás de esta interpretación?"
  },
  "submit_for_challenge": {
    en: "Submit for Challenge",
    zh: "提交挑战",
    es: "Enviar para Desafío"
  },
  "defend_narrative": {
    en: "Defend Your Narrative",
    zh: "捍卫你的叙述",
    es: "Defiende Tu Narrativa"
  },
  "challenge": {
    en: "Challenge",
    zh: "挑战",
    es: "Desafío"
  },
  "challenge_interpretation": {
    en: "I Challenge Your Interpretation:",
    zh: "我挑战你的解释：",
    es: "Desafío Tu Interpretación:"
  },
  "your_response": {
    en: "Your Response",
    zh: "你的回应",
    es: "Tu Respuesta"
  },
  "defense_placeholder": {
    en: "I defend my position because... OR I acknowledge this weakness because...",
    zh: "我捍卫我的立场因为……或者我承认这个弱点因为……",
    es: "Defiendo mi posición porque... O reconozco esta debilidad porque..."
  },
  "defense_hint": {
    en: "You may defend, revise, or acknowledge weaknesses. Intellectual honesty is valued.",
    zh: "你可以捍卫、修改或承认弱点。重视知识诚实。",
    es: "Puedes defender, revisar o reconocer debilidades. Se valora la honestidad intelectual."
  },
  "confidence_affected": {
    en: "Has this challenge affected your confidence?",
    zh: "这个挑战影响了你的信心吗？",
    es: "¿Este desafío ha afectado tu confianza?"
  },
  "submit_response": {
    en: "Submit Response",
    zh: "提交回应",
    es: "Enviar Respuesta"
  },
  "final_response": {
    en: "Final Response",
    zh: "最终回应",
    es: "Respuesta Final"
  },
  "final_reflection": {
    en: "Final Reflection",
    zh: "最终反思",
    es: "Reflexión Final"
  },
  "name_uncertainties": {
    en: "Name Your Uncertainties",
    zh: "列出你的不确定因素",
    es: "Nombra Tus Incertidumbres"
  },
  "uncertainty_explanation": {
    en: "Good reasoning includes knowing what you DON'T know. List the things you remain uncertain about.",
    zh: "好的推理包括知道你不知道什么。列出你仍然不确定的事项。",
    es: "El buen razonamiento incluye saber lo que NO sabes. Lista las cosas de las que sigues inseguro."
  },
  "uncertain_placeholder": {
    en: "I'm uncertain about...",
    zh: "我不确定……",
    es: "No estoy seguro de..."
  },
  "challenge_summary": {
    en: "Challenge Summary",
    zh: "挑战总结",
    es: "Resumen de Desafíos"
  },
  "uncertainties_minimum": {
    en: "Name at least 2 uncertainties before completing",
    zh: "完成前请至少列出2个不确定因素",
    es: "Nombra al menos 2 incertidumbres antes de completar"
  },
  
  // VariableManifold.jsx
  "outcome": {
    en: "Outcome",
    zh: "结果",
    es: "Resultado"
  },
  "current": {
    en: "Current",
    zh: "当前",
    es: "Actual"
  },
  "variable_step_1": {
    en: "Explore the system to understand how variables connect",
    zh: "探索系统以理解变量如何关联",
    es: "Explora el sistema para entender cómo se conectan las variables"
  },
  "variable_step_2": {
    en: "Make interventions (you have limited changes)",
    zh: "进行干预（你的更改次数有限）",
    es: "Realiza intervenciones (tienes cambios limitados)"
  },
  "variable_step_3": {
    en: "Watch how changes ripple through the system",
    zh: "观察变化如何在系统中传播",
    es: "Observa cómo los cambios se propagan por el sistema"
  },
  "variable_step_4": {
    en: "Identify the fundamental tensions you cannot resolve",
    zh: "识别你无法解决的根本矛盾",
    es: "Identifica las tensiones fundamentales que no puedes resolver"
  },
  "variable_step_5": {
    en: "Defend your configuration as a reasonable trade-off",
    zh: "将你的配置作为合理的权衡来捍卫",
    es: "Defiende tu configuración como un compromiso razonable"
  },
  "exploration_instructions": {
    en: "Study how the variables connect. Click on variables to see their relationships. Take time to understand the system before making changes.",
    zh: "研究变量如何关联。点击变量查看它们的关系。在做出更改之前花时间理解系统。",
    es: "Estudia cómo se conectan las variables. Haz clic en las variables para ver sus relaciones. Tómate tiempo para entender el sistema antes de hacer cambios."
  },
  "more_tensions": {
    en: "...more tensions to discover",
    zh: "……还有更多矛盾待发现",
    es: "...más tensiones por descubrir"
  },
  "begin_interventions": {
    en: "Begin Interventions",
    zh: "开始干预",
    es: "Comenzar Intervenciones"
  },
  "explore_minimum": {
    en: "Continue exploring for at least 30 seconds",
    zh: "请继续探索至少30秒",
    es: "Continúa explorando por al menos 30 segundos"
  },
  "make_interventions": {
    en: "Make Interventions",
    zh: "进行干预",
    es: "Realizar Intervenciones"
  },
  "interventions_label": {
    en: "Interventions",
    zh: "干预次数",
    es: "Intervenciones"
  },
  "ripple_effects": {
    en: "Ripple Effects",
    zh: "连锁反应",
    es: "Efectos en Cadena"
  },
  "constraint_violations": {
    en: "Constraint Violations",
    zh: "约束违规",
    es: "Violaciones de Restricciones"
  },
  "adjusting": {
    en: "Adjusting",
    zh: "调整中",
    es: "Ajustando"
  },
  "new_value": {
    en: "New Value",
    zh: "新值",
    es: "Nuevo Valor"
  },
  "change_reason": {
    en: "Why are you making this change?",
    zh: "你为什么要进行这个更改？",
    es: "¿Por qué estás haciendo este cambio?"
  },
  "change_placeholder": {
    en: "I'm increasing this because...",
    zh: "我增加这个是因为……",
    es: "Estoy aumentando esto porque..."
  },
  "predict_consequences": {
    en: "Predict the consequences (optional but valuable)",
    zh: "预测后果（可选但有价值）",
    es: "Predice las consecuencias (opcional pero valioso)"
  },
  "increase": {
    en: "Increase",
    zh: "增加",
    es: "Aumentar"
  },
  "decrease": {
    en: "Decrease",
    zh: "减少",
    es: "Disminuir"
  },
  "no_change": {
    en: "No change",
    zh: "无变化",
    es: "Sin cambio"
  },
  "apply_intervention": {
    en: "Apply Intervention",
    zh: "应用干预",
    es: "Aplicar Intervención"
  },
  "articulate_tensions": {
    en: "Articulate Tensions",
    zh: "阐述矛盾",
    es: "Articular Tensiones"
  },
  "irreducible_tensions": {
    en: "Articulate Irreducible Tensions",
    zh: "阐述不可解决的矛盾",
    es: "Articula las Tensiones Irreducibles"
  },
  "tensions_explanation": {
    en: "This system has fundamental tensions that cannot be resolved. Name them explicitly. What trade-offs are unavoidable?",
    zh: "这个系统有无法解决的根本矛盾。明确指出它们。哪些权衡是不可避免的？",
    es: "Este sistema tiene tensiones fundamentales que no se pueden resolver. Nómbralas explícitamente. ¿Qué compromisos son inevitables?"
  },
  "tensions_discovered": {
    en: "What tensions did you discover?",
    zh: "你发现了哪些矛盾？",
    es: "¿Qué tensiones descubriste?"
  },
  "tension_placeholder": {
    en: "Tension: Increasing X requires sacrificing Y because...",
    zh: "矛盾：增加X需要牺牲Y，因为……",
    es: "Tensión: Aumentar X requiere sacrificar Y porque..."
  },
  "hint_tensions": {
    en: "Hint: Core System Tensions",
    zh: "提示：核心系统矛盾",
    es: "Pista: Tensiones del Sistema Central"
  },
  "analyze_tradeoffs": {
    en: "Analyze your trade-offs",
    zh: "分析你的权衡",
    es: "Analiza tus compromisos"
  },
  "tradeoff_placeholder": {
    en: "In my configuration, I chose to prioritize X over Y because... This means that Z will suffer, which I accept because... There is no way to have both X and Y at high levels without...",
    zh: "在我的配置中，我选择优先考虑X而不是Y，因为……这意味着Z会受损，我接受这一点是因为……没有办法让X和Y都保持高水平而不……",
    es: "En mi configuración, elegí priorizar X sobre Y porque... Esto significa que Z sufrirá, lo cual acepto porque... No hay forma de tener X e Y en niveles altos sin..."
  },
  "final_reflection_prompt": {
    en: "Final Reflection: Why is your configuration defensible?",
    zh: "最终反思：为什么你的配置是合理的？",
    es: "Reflexión Final: ¿Por qué tu configuración es defendible?"
  },
  "defensible_placeholder": {
    en: "My configuration is defensible because... I acknowledge that someone could disagree and prioritize differently by... But I chose this approach because...",
    zh: "我的配置是合理的，因为……我承认有人可能不同意，并以不同的方式确定优先级……但我选择这种方法是因为……",
    es: "Mi configuración es defendible porque... Reconozco que alguien podría estar en desacuerdo y priorizar diferente... Pero elegí este enfoque porque..."
  },
  "tensions_minimum": {
    en: "Identify at least 2 tensions and provide trade-off analysis",
    zh: "请至少识别2个矛盾并提供权衡分析",
    es: "Identifica al menos 2 tensiones y proporciona análisis de compromisos"
  },
  
  // Common additions
  "add": {
    en: "Add",
    zh: "添加",
    es: "Añadir"
  },
  "dismiss": {
    en: "Dismiss",
    zh: "关闭",
    es: "Descartar"
  },
  "instructions": {
    en: "Instructions",
    zh: "说明",
    es: "Instrucciones"
  },
  
  // Evidence types
  "log": {
    en: "LOG",
    zh: "日志",
    es: "REGISTRO"
  },
  "statement": {
    en: "STATEMENT",
    zh: "声明",
    es: "DECLARACIÓN"
  },
  "witness": {
    en: "WITNESS",
    zh: "证人",
    es: "TESTIGO"
  },
  "document": {
    en: "DOCUMENT",
    zh: "文件",
    es: "DOCUMENTO"
  },
  "digital_trace": {
    en: "DIGITAL TRACE",
    zh: "数字痕迹",
    es: "RASTRO DIGITAL"
  },
  "physical": {
    en: "PHYSICAL",
    zh: "物证",
    es: "FÍSICO"
  }
};

// Load and update each locale file
['en', 'zh', 'es'].forEach(lang => {
  const filePath = `locales/${lang}.json`;
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  // Ensure cognitive object exists
  if (!data.cognitive) data.cognitive = {};
  
  // Add new keys
  let addedCount = 0;
  Object.entries(newCognitiveKeys).forEach(([key, translations]) => {
    if (!data.cognitive[key]) {
      data.cognitive[key] = translations[lang];
      addedCount++;
    }
  });
  
  // Save
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log(`${lang}.json: Added ${addedCount} new cognitive keys`);
});

console.log('Done!');
