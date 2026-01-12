import TranslationService from '../services/TranslationService';

const SkillRadarChart = ({ skills }) => {
    const centerX = 150;
  const centerY = 150;
  const maxRadius = 100;
  const levels = 5;
  
  const skillData = [
    { name: TranslationService.t('profile.skill_logical'), value: skills.logical, angle: -90 },
    { name: TranslationService.t('profile.skill_decision'), value: skills.decision, angle: -18 },
    { name: TranslationService.t('profile.skill_adaptive'), value: skills.adaptive, angle: 54 },
    { name: TranslationService.t('profile.skill_source'), value: skills.source, angle: 126 },
    { name: TranslationService.t('profile.skill_bias'), value: skills.bias, angle: 198 },
  ];

  const getPoint = (angle, radius) => {
    const radian = (angle * Math.PI) / 180;
    return {
      x: centerX + radius * Math.cos(radian),
      y: centerY + radius * Math.sin(radian),
    };
  };

  // Generate web lines
  const webLines = [];
  for (let i = 0; i < levels; i++) {
    const radius = (maxRadius / levels) * (i + 1);
    const points = skillData.map(s => getPoint(s.angle, radius));
    const pathData = points.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';
    webLines.push(
      <path key={`web-${i}`} d={pathData} fill="none" stroke="rgba(180, 140, 100, 0.3)" strokeWidth="1" />
    );
  }

  // Generate spoke lines
  const spokeLines = skillData.map((s, idx) => {
    const end = getPoint(s.angle, maxRadius);
    return (
      <line key={`spoke-${idx}`} x1={centerX} y1={centerY} x2={end.x} y2={end.y} stroke="rgba(180, 140, 100, 0.4)" strokeWidth="1" />
    );
  });

  // Generate skill polygon
  const skillPoints = skillData.map(s => getPoint(s.angle, (s.value / 100) * maxRadius));
  const skillPath = skillPoints.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';

  // Generate labels
  const labels = skillData.map((s, idx) => {
    const labelPoint = getPoint(s.angle, maxRadius + 30);
    const lines = s.name.split('\n');
    return (
      <text
        key={`label-${idx}`}
        x={labelPoint.x}
        y={labelPoint.y}
        textAnchor="middle"
        className="fill-amber-200 text-xs font-medium"
      >
        {lines.map((line, i) => (
          <tspan key={i} x={labelPoint.x} dy={i === 0 ? 0 : 12}>{line}</tspan>
        ))}
      </text>
    );
  });

  // Generate value dots
  const valueDots = skillPoints.map((p, idx) => (
    <circle key={`dot-${idx}`} cx={p.x} cy={p.y} r="5" fill="#ef4444" stroke="#fff" strokeWidth="2" />
  ));

  return (
    <svg viewBox="0 0 300 300" className="w-full h-full">
      {/* Background glow */}
      <defs>
        <radialGradient id="webGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(239, 68, 68, 0.1)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      <circle cx={centerX} cy={centerY} r={maxRadius + 10} fill="url(#webGlow)" />
      
      {/* Web structure */}
      {webLines}
      {spokeLines}
      
      {/* Skill area */}
      <path d={skillPath} fill="rgba(239, 68, 68, 0.3)" stroke="#ef4444" strokeWidth="2" />
      
      {/* Value dots */}
      {valueDots}
      
      {/* Labels */}
      {labels}
      
      {/* Center dot */}
      <circle cx={centerX} cy={centerY} r="4" fill="rgba(180, 140, 100, 0.6)" />
    </svg>
  );// ... Paste the SkillRadarChart logic here
};

export default SkillRadarChart;