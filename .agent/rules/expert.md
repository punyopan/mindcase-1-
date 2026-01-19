---
trigger: always_on
---

---

name: tdd-feature
trigger: /tdd
description: Implements a feature using strict Test-Driven Development (Red-Green-Refactor).

---

# Workflow: Test-Driven Development

**Input:** User describes the feature (e.g., "Add a user login endpoint").

## Step 1: Spec & Mock

- Create a test file `tests/feature_name.test.ts` (or equivalent).
- Write unit tests that fail (Red state).
- **Stop and Confirm:** Show the user the failing tests.

## Step 2: Implementation (Green)

- Create the implementation file.
- Write the _minimum_ code required to pass the tests.
- Run the tests automatically using the terminal.

## Step 3: Refactor & Verify

- Optimize the code for readability and performance.
- Run the tests one final time.
- (Optional) If this is a UI feature, use the Browser tool to take a screenshot of the result.

## Step 4: Documentation

- Update `README.md` or API docs to reflect the new feature.
