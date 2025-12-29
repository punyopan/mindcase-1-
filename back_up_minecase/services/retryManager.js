// Retry Manager for Puzzle Attempts
// Tracks free retries and ad-based retries per puzzle

class RetryManager {
  constructor(userId) {
    this.userId = userId;
    this.storageKey = `puzzle_retries_${userId}`;
    this.freeRetriesPerPuzzle = 2; // Free users get 2 free retries per puzzle
  }

  load() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : {};
    } catch (e) {
      console.warn('Failed to load retry data:', e);
      return {};
    }
  }

  save(data) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save retry data:', e);
    }
  }

  getPuzzleRetries(puzzleId) {
    const data = this.load();
    if (!data[puzzleId]) {
      data[puzzleId] = {
        freeRetries: this.freeRetriesPerPuzzle,
        adRetries: 0,
        attempts: 0,
        completed: false
      };
      this.save(data);
    }
    return data[puzzleId];
  }

  useRetry(puzzleId) {
    const data = this.load();
    const puzzleData = this.getPuzzleRetries(puzzleId);

    // Increment attempts
    puzzleData.attempts++;

    // Use free retries first
    if (puzzleData.freeRetries > 0) {
      puzzleData.freeRetries--;
      data[puzzleId] = puzzleData;
      this.save(data);
      return {
        success: true,
        type: 'free',
        remaining: puzzleData.freeRetries + puzzleData.adRetries
      };
    }

    // Then use ad retries
    if (puzzleData.adRetries > 0) {
      puzzleData.adRetries--;
      data[puzzleId] = puzzleData;
      this.save(data);
      return {
        success: true,
        type: 'ad',
        remaining: puzzleData.freeRetries + puzzleData.adRetries
      };
    }

    // No retries left
    return {
      success: false,
      reason: 'no_retries',
      remaining: 0
    };
  }

  addAdRetry(puzzleId) {
    const data = this.load();
    const puzzleData = this.getPuzzleRetries(puzzleId);
    puzzleData.adRetries++;
    data[puzzleId] = puzzleData;
    this.save(data);
    return puzzleData.adRetries;
  }

  markCompleted(puzzleId) {
    const data = this.load();
    const puzzleData = this.getPuzzleRetries(puzzleId);
    puzzleData.completed = true;
    data[puzzleId] = puzzleData;
    this.save(data);
  }

  getRemainingRetries(puzzleId) {
    const puzzleData = this.getPuzzleRetries(puzzleId);
    return {
      free: puzzleData.freeRetries,
      ad: puzzleData.adRetries,
      total: puzzleData.freeRetries + puzzleData.adRetries
    };
  }

  canRetry(puzzleId) {
    const remaining = this.getRemainingRetries(puzzleId);
    return remaining.total > 0;
  }

  resetPuzzle(puzzleId) {
    const data = this.load();
    data[puzzleId] = {
      freeRetries: this.freeRetriesPerPuzzle,
      adRetries: 0,
      attempts: 0,
      completed: false
    };
    this.save(data);
  }

  // Get stats for display
  getStats(puzzleId) {
    const puzzleData = this.getPuzzleRetries(puzzleId);
    return {
      freeRetries: puzzleData.freeRetries,
      adRetries: puzzleData.adRetries,
      totalRetries: puzzleData.freeRetries + puzzleData.adRetries,
      attempts: puzzleData.attempts,
      completed: puzzleData.completed
    };
  }
}

// Export for use in the app
window.RetryManager = RetryManager;

export default RetryManager;
