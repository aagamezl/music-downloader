import { describe, it } from 'node:test';
import { strictEqual } from 'node:assert';

import { sanitizeString } from "../src/utils/sanitizeString.js";

describe('utils', () => {
  describe('sanitizeString', () => {
    it('should remove special characters', () => {
      strictEqual(sanitizeString('test'), 'test');
      strictEqual(sanitizeString('test with spaces'), 'test with spaces');
      strictEqual(sanitizeString('test with / and \\'), 'test with and');
      strictEqual(sanitizeString('test with : and *'), 'test with and');
      strictEqual(sanitizeString('test with ? and "'), 'test with and');
      strictEqual(sanitizeString('test with < and >'), 'test with and');
      strictEqual(sanitizeString('test with |'), 'test with');
      strictEqual(sanitizeString('test with \' and `'), 'test with and');
      strictEqual(sanitizeString('test with " and "'), 'test with and');
      strictEqual(sanitizeString('test with \' and \''), 'test with and');
      strictEqual(sanitizeString('test with ` and `'), 'test with and');
    });

    it('should preserve Spanish characters', () => {
      strictEqual(sanitizeString('Ánimo y pa\'lante - Música y palabras: José Luis Perales- ¡añorados! ¿Pregunta?'), 'Ánimo y palante - Música y palabras José Luis Perales- ¡añorados! ¿Pregunta');
    });
  });
});
