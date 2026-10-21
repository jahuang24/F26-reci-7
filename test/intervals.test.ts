import { describe, expect, it } from 'vitest';
import fc from 'fast-check';
import { mergeIntervals, type Interval } from '../src/intervals';

// Recitation Part 2 (groups) and problem set Task 2.
// Read the spec in src/intervals/mergeIntervals.ts, then check your progress
// with `npm run mutants:intervals`.
//
// Label every property with its pattern, on the line above its `it(`:
//   // Pattern: invariant. The output is sorted.
// (invariant, algebraic, metamorphic, differential, or conditional)

// Valid by construction: pick a start and a non-negative length, so end is
// never less than start. Small ranges make shared endpoints common.
const interval: fc.Arbitrary<Interval> = fc
  .tuple(fc.integer({ min: -20, max: 20 }), fc.nat(10))
  .map(([start, len]): Interval => [start, start + len]);
const intervalList = fc.array(interval);

describe('mergeIntervals', () => {

  // invariant
  it('every input interval lies inside some output interval', () => {
    fc.assert(
      fc.property(intervalList, xs => {
        const out = mergeIntervals(xs);
        const uncovered = xs.filter(([s, e]) => !out.some(([a, b]) => a <= s && e <= b));
        expect(uncovered).toEqual([]);
      }),
    );
  });

  // Add your properties here. Aim for at least one of each pattern:
  // invariant, algebraic, metamorphic, differential, conditional.

  const withDuplicate = fc
    .array(interval, { minLength: 1 })
    .chain(xs =>
      fc.nat(xs.length - 1).map((i): Interval[] => [...xs, [xs[i][0], xs[i][1]]]),
    );

  // algebraic; If two input intervals have the same start and end, the output has fewer intervals than the input.
  it('merges intervals with the same start and end', () => {
    fc.assert(
      fc.property(withDuplicate, xs => {
        expect(mergeIntervals(xs).length).toBeLessThan(xs.length);
      }),
    );
  });

  // metamorphic (order doesnt matter)
  it('gives the same output for the input in any order', () => {
    fc.assert(
      fc.property(
        intervalList.chain(xs =>
          fc.tuple(fc.constant(xs), fc.shuffledSubarray(xs, { minLength: xs.length, maxLength: xs.length })),
        ),
        ([xs, shuffled]) => {
          expect(mergeIntervals(shuffled)).toEqual(mergeIntervals(xs));
        },
      ),
    );
  });

  const disjointSorted = fc
    .tuple(
      fc.integer({ min: -20, max: 20 }),
      fc.array(fc.tuple(fc.integer({ min: 1, max: 3 }), fc.nat(5))),
    )
    .map(([first, steps]) => {
      const out: Interval[] = [];
      let prevEnd = first - 1;
      for (const [gap, len] of steps) {
        const start = prevEnd + gap;
        out.push([start, start + len]);
        prevEnd = start + len;
      }
      return out;
    });

  // conditional; no overlap means unchanged intervals
  it('leaves already-disjoint intervals unchanged', () => {
    fc.assert(
      fc.property(
        disjointSorted.chain(sorted =>
          fc.tuple(fc.constant(sorted), fc.shuffledSubarray(sorted, { minLength: sorted.length, maxLength: sorted.length })),
        ),
        ([sorted, shuffled]) => {
          expect(mergeIntervals(shuffled)).toEqual(sorted);
        },
      ),
    );
  });

  // invariant
  it('does not modify its input', () => {
    fc.assert(
      fc.property(intervalList, xs => {
        const before = xs.map(([s, e]): Interval => [s, e]);
        mergeIntervals(xs);
        expect(xs).toEqual(before);
      }),
    );
  });

});
