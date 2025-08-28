import { JMonConverter } from '../io/jmon/conversion.js';

describe('JMON glissando/pitchbend validation', () => {
  it('warns if glissando and pitchbend are both present', () => {
    const seq = {
      label: 'Test',
      notes: [
        {
          note: 60,
          duration: 1,
          time: '0:0:0',
          articulation: 'glissando',
          glissTarget: 72,
          modulations: [
            { type: 'pitchBend', value: 0, time: '0:0:0' },
            { type: 'pitchBend', value: 8192, time: '1:0:0' }
          ]
        }
      ]
    };
    const comp = {
      format: 'jmonTone',
      version: '1.0',
      sequences: [seq],
      audioGraph: [],
      connections: []
    };
    const result = JMonConverter.validateComposition(comp as any);
    expect(result.warnings.some(w => w.includes('both glissando and pitchBend'))).toBe(true);
  });

  it('warns if glissando is present without pitchbend', () => {
    const seq = {
      label: 'Test',
      notes: [
        {
          note: 60,
          duration: 1,
          time: '0:0:0',
          articulation: 'glissando',
          glissTarget: 72
        }
      ]
    };
    const comp = {
      format: 'jmonTone',
      version: '1.0',
      sequences: [seq],
      audioGraph: [],
      connections: []
    };
    const result = JMonConverter.validateComposition(comp as any);
    expect(result.warnings.some(w => w.includes('glissando present but no pitchBend'))).toBe(true);
  });

  it('warns if pitchbend is present without glissando', () => {
    const seq = {
      label: 'Test',
      notes: [
        {
          note: 60,
          duration: 1,
          time: '0:0:0',
          modulations: [
            { type: 'pitchBend', value: 0, time: '0:0:0' },
            { type: 'pitchBend', value: 8192, time: '1:0:0' }
          ]
        }
      ]
    };
    const comp = {
      format: 'jmonTone',
      version: '1.0',
      sequences: [seq],
      audioGraph: [],
      connections: []
    };
    const result = JMonConverter.validateComposition(comp as any);
    expect(result.warnings.some(w => w.includes('pitchBend modulation present but no glissando'))).toBe(true);
  });
});
