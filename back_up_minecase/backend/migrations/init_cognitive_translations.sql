-- Cognitive Training Translation Cache
-- Stores AI-translated cognitive training scenarios

CREATE TABLE IF NOT EXISTS t_cognitive_translation_cache (
    id SERIAL PRIMARY KEY,
    scenario_type VARCHAR(50) NOT NULL,           -- 'signal_field', 'forensic_narrative', etc.
    scenario_hash VARCHAR(64) NOT NULL,           -- Hash of original content for cache key
    language VARCHAR(30) NOT NULL,                -- Target language
    title TEXT,
    briefing TEXT,
    correct_insight TEXT,
    evidence_json JSONB,                          -- For forensic narrative evidence
    variables_json JSONB,                         -- For variable manifold
    stakeholders_json JSONB,                      -- For perspective prism
    claim TEXT,                                   -- For assumption excavator
    outcome TEXT,                                 -- For counterfactual engine
    context TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(scenario_type, scenario_hash, language)
);

CREATE INDEX IF NOT EXISTS idx_cognitive_cache_lookup 
ON t_cognitive_translation_cache(scenario_type, scenario_hash, language);
