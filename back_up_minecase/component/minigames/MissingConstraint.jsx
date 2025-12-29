import React, { useState, useEffect } from 'react';
import { CheckCircle, X, Lightbulb } from '../icon';

const MissingConstraint = ({ onComplete, difficulty = 'medium' }) => {
  const [caseBoard, setCaseBoard] = useState(null);
  const [selectedNodes, setSelectedNodes] = useState([]);
  const [selectedConstraint, setSelectedConstraint] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [result, setResult] = useState(null);

  const difficultySettings = {
    easy: { numNodes: 4, numConstraints: 3, maxAttempts: 5 },
    medium: { numNodes: 5, numConstraints: 4, maxAttempts: 4 },
    hard: { numNodes: 6, numConstraints: 5, maxAttempts: 3 }
  };

  const settings = difficultySettings[difficulty] || difficultySettings.medium;

  const characters = ['🕵️', '👨‍💼', '👩‍⚕️', '👨‍🔬', '👩‍💻', '👨‍🎨'];
  const locations = ['🏛️', '🏥', '🏢', '🏭', '🏪', '🏠'];
  const objects = ['💼', '🔑', '📱', '💊', '📄', '💻'];

  const constraintTypes = [
    { id: 'same-location', name: 'Same Location', description: 'Two entities must be at the same place' },
    { id: 'before', name: 'Time Before', description: 'One event happened before another' },
    { id: 'never-together', name: 'Never Together', description: 'Two entities cannot be together' },
    { id: 'owns', name: 'Ownership', description: 'One entity owns another' },
    { id: 'witnessed', name: 'Witnessed', description: 'One entity saw another' }
  ];

  useEffect(() => {
    generateCase();
    try {
      window.SoundService?.playSound('gameStart');
    } catch (e) {
      console.warn('Sound failed:', e);
    }
  }, []);

  const generateCase = () => {
    const numNodes = settings.numNodes;

    // Generate nodes
    const nodes = Array.from({ length: numNodes }, (_, i) => ({
      id: i,
      type: i < 2 ? 'character' : i < 4 ? 'location' : 'object',
      icon: i < 2
        ? characters[i]
        : i < 4
          ? locations[i - 2]
          : objects[i - 4],
      name: `Node ${i + 1}`
    }));

    // Generate constraints (one will be hidden/missing)
    const constraints = Array.from({ length: settings.numConstraints }, (_, i) => ({
      id: i,
      type: constraintTypes[i % constraintTypes.length],
      from: nodes[Math.floor(Math.random() * numNodes)],
      to: nodes[Math.floor(Math.random() * numNodes)],
      isHidden: i === settings.numConstraints - 1 // Last constraint is missing
    }));

    const missingConstraint = constraints[settings.numConstraints - 1];

    setCaseBoard({
      nodes,
      constraints: constraints.filter(c => !c.isHidden),
      missingConstraint,
      solution: {
        nodes: [missingConstraint.from.id, missingConstraint.to.id],
        constraintType: missingConstraint.type.id
      }
    });
  };

  const handleNodeClick = (nodeId) => {
    if (isComplete) return;

    if (selectedNodes.includes(nodeId)) {
      setSelectedNodes(selectedNodes.filter(id => id !== nodeId));
    } else if (selectedNodes.length < 2) {
      setSelectedNodes([...selectedNodes, nodeId]);
    }
  };

  const handleConstraintSelect = (constraintTypeId) => {
    if (isComplete) return;
    setSelectedConstraint(constraintTypeId);
  };

  const handleSubmit = () => {
    if (isComplete || selectedNodes.length !== 2 || !selectedConstraint) return;

    setAttempts(prev => prev + 1);

    const correctNodes =
      (selectedNodes.includes(caseBoard.solution.nodes[0]) && selectedNodes.includes(caseBoard.solution.nodes[1]));
    const correctConstraint = selectedConstraint === caseBoard.solution.constraintType;

    const isCorrect = correctNodes && correctConstraint;

    if (isCorrect) {
      // Success!
      setResult({ success: true, message: 'Perfect deduction!' });
      setIsComplete(true);

      try {
        window.SoundService?.playSound('gameSuccess');
      } catch (e) {
        console.warn('Sound failed:', e);
      }

      setTimeout(() => {
        onComplete({
          success: true,
          attempts,
          score: Math.max(50, 100 - (attempts * 10))
        });
      }, 2000);
    } else {
      // Partial feedback
      if (correctNodes) {
        setResult({ success: false, message: 'Correct nodes, wrong constraint type!' });
      } else if (correctConstraint) {
        setResult({ success: false, message: 'Correct constraint type, wrong nodes!' });
      } else {
        setResult({ success: false, message: 'Try again - check the connections!' });
      }

      try {
        window.SoundService?.playSound('gameFail');
      } catch (e) {
        console.warn('Sound failed:', e);
      }

      if (attempts + 1 >= settings.maxAttempts) {
        setIsComplete(true);
        setTimeout(() => {
          onComplete({
            success: false,
            attempts: attempts + 1,
            score: 20
          });
        }, 2000);
      }

      setTimeout(() => {
        setResult(null);
      }, 2000);
    }
  };

  if (!caseBoard) {
    return (
      <div className="bg-stone-900/60 backdrop-blur-sm border border-amber-700/30 rounded-xl p-6 text-center">
        <div className="animate-spin w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-white">Generating case...</p>
      </div>
    );
  }

  return (
    <div className="bg-stone-900/60 backdrop-blur-sm border border-amber-700/30 rounded-xl p-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-white mb-2">🔍 The Missing Constraint</h3>
        <p className="text-stone-400 text-sm">Find the hidden rule connecting the evidence</p>

        <div className="flex justify-center gap-6 mt-3">
          <div className="flex items-center gap-2">
            <span className="text-stone-400 text-xs">Attempts:</span>
            <span className="font-bold text-sm text-amber-400">{attempts} / {settings.maxAttempts}</span>
          </div>
        </div>
      </div>

      {/* Case Board */}
      <div className="bg-stone-800/60 border border-stone-700 rounded-xl p-6 mb-6">
        <div className="grid grid-cols-3 gap-4 mb-6">
          {caseBoard.nodes.map((node) => (
            <button
              key={node.id}
              onClick={() => handleNodeClick(node.id)}
              disabled={isComplete}
              className={`
                p-4 rounded-xl border-2 transition-all transform
                ${selectedNodes.includes(node.id)
                  ? 'bg-amber-500/20 border-amber-400 scale-95 shadow-lg'
                  : 'bg-stone-700/40 border-stone-600 hover:border-amber-600/50 hover:scale-105'
                }
                ${isComplete ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <div className="text-4xl mb-2">{node.icon}</div>
              <div className="text-white text-xs font-medium">{node.name}</div>
            </button>
          ))}
        </div>

        {/* Visible Constraints */}
        <div className="space-y-2">
          <h4 className="text-amber-400 text-sm font-bold mb-3">📋 Known Constraints:</h4>
          {caseBoard.constraints.map((constraint, idx) => (
            <div key={idx} className="bg-stone-900/60 border border-stone-600 rounded-lg p-3 flex items-center gap-3">
              <div className="text-2xl">{constraint.from.icon}</div>
              <div className="flex-1">
                <div className="text-xs text-stone-400">{constraint.type.name}</div>
                <div className="text-xs text-stone-300">{constraint.type.description}</div>
              </div>
              <div className="text-2xl">{constraint.to.icon}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Select Missing Constraint Type */}
      <div className="mb-6">
        <h4 className="text-white font-semibold mb-3 text-sm">🎯 Select Missing Constraint Type:</h4>
        <div className="grid grid-cols-2 gap-2">
          {constraintTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => handleConstraintSelect(type.id)}
              disabled={isComplete}
              className={`
                p-3 rounded-lg border-2 transition-all text-left
                ${selectedConstraint === type.id
                  ? 'bg-blue-500/20 border-blue-400'
                  : 'bg-stone-700/40 border-stone-600 hover:border-blue-600/50'
                }
                ${isComplete ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <div className="text-white text-xs font-bold">{type.name}</div>
              <div className="text-stone-400 text-xs">{type.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Result Feedback */}
      {result && (
        <div className={`mb-4 p-4 rounded-lg border-2 ${
          result.success
            ? 'bg-green-500/20 border-green-400'
            : 'bg-red-500/20 border-red-400'
        }`}>
          <p className={`text-center font-bold ${result.success ? 'text-green-300' : 'text-red-300'}`}>
            {result.message}
          </p>
        </div>
      )}

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={isComplete || selectedNodes.length !== 2 || !selectedConstraint}
        className={`
          w-full py-3 px-6 rounded-lg font-bold text-white transition-all
          ${!isComplete && selectedNodes.length === 2 && selectedConstraint
            ? 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 shadow-lg'
            : 'bg-stone-700 cursor-not-allowed opacity-50'
          }
        `}
      >
        {isComplete ? 'Case Closed' : 'Submit Solution'}
      </button>

      {/* Hint */}
      {!isComplete && attempts >= 2 && (
        <button
          onClick={() => setShowHint(!showHint)}
          className="w-full mt-3 bg-stone-700 hover:bg-stone-600 text-amber-300 font-medium py-2 px-4 rounded-lg transition-all text-sm"
        >
          {showHint ? 'Hide' : 'Show'} Hint
        </button>
      )}

      {showHint && !isComplete && (
        <div className="mt-3 bg-amber-900/20 border border-amber-700/30 rounded-lg p-3">
          <p className="text-amber-200 text-xs">
            💡 Look for relationships that haven't been explicitly stated. Which connection is missing from the board?
          </p>
        </div>
      )}
    </div>
  );
};

export default MissingConstraint;
