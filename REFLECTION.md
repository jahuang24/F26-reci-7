# Reflection

**Name / Andrew ID: Jarrett Huang / jarretth**

**Recitation group members (Task 2): Dylan Yang**

---

### 1. Valid but weak

Pick a property you wrote that passes on the correct implementation but
kills few or no mutants. Why is it still a *valid* property? Describe a
concrete bug (not one of our mutants) that it *would* catch.

Given a secret word composed of unique characters, shuffling the word and passing
it in as the guess word will result in all yellow outputs. This is because every character
in the guess word is in the secret word but not in the correct position, and each
character is unique so there isnt a possibility of greens in the output. A bug
this would catch is an implementation which only returned black or green.

### 2. A generator problem, not a property problem

Describe a mutant, from either task, that survived or was flaky because of
your **generator** rather than your property. What did the generator fail to
produce? How did you fix it? Paste the runner output from before and after.

For testing intervals, the touchingNotMerged mutant would fail for generators with long
input intervals because inputs without touching intervals wouldnt generate. I fixed this
by limiting the range and min/max possible generated values.

BEFORE:
  ~ touchingNotMerged       flaky: killed in 3/5 runs  by: merges intervals with the same start and end
      Counterexample: [[[0,0],[0,0]]]
      AssertionError: expected 2 to be less than 2

AFTER:
✔ touchingNotMerged       killed  by: merges intervals with the same start and end; gives the same output for the input in any order
      Counterexample: [[[0,0],[0,0]]]
      AssertionError: expected 2 to be less than 2

### 3. Reading a counterexample

Paste one counterexample that the mutation runner printed for a killed
mutant. In 2–3 sentences, explain using the *specification* why that input
exposes the bug.

✔ mergesIntegerNeighbors  killed  by: leaves already-disjoint intervals unchanged
      Counterexample: [[[[0,0],[1,1]],[[0,0],[1,1]]]]
      AssertionError: expected [ [ +0, 1 ] ] to deeply equal [ [ +0, +0 ], [ 1, 1 ] ]

The implementation shouldnt output intervals which cover ranges not covered by the input.
This counterexample exposes when an implementation merges intervals that shouldnt be merged,
covering points (in this case between 0-1) that shouldnt be covered.

### 4. Your project

Name one function or module in your team's project that would benefit from
property-based testing. State two properties in English, name the pattern of
each, and describe the generator you'd need, including anything about its
inputs that a naive generator would get wrong.

The CRUD operations for label service file would benefit from property based testing. Two properties
are the total label counts should be less than 1 after deleting a label with children (algebraic) and
when assigning labels as children, the order shouldnt matter (metamorphic). The generator would need to
create both parent and children labels, while a naive generator might just create parent labels.