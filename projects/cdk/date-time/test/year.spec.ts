import {TuiYear} from '@taiga-ui/cdk';

describe('TuiYear', () => {
    // Testes para métodos estáticos da classe TuiYear
    describe('static method', () => {
        // Validação de ano válido/inválido
        describe('isValidYear returns', () => {
            describe('false if passed year is invalid', () => {
                it('NaN', () => {
                    expect(TuiYear.isValidYear(NaN)).toBe(false);
                });

                it('-200', () => {
                    expect(TuiYear.isValidYear(-200)).toBe(false);
                });

                it('2000.1', () => {
                    expect(TuiYear.isValidYear(2000.1)).toBe(false);
                });

                it('100000', () => {
                    expect(TuiYear.isValidYear(100000)).toBe(false);
                });
            });

            describe('true if passed year is valid', () => {
                it('0', () => {
                    expect(TuiYear.isValidYear(0)).toBe(true);
                });

                it('1', () => {
                    expect(TuiYear.isValidYear(1)).toBe(true);
                });

                it('1990', () => {
                    expect(TuiYear.isValidYear(1990)).toBe(true);
                });

                it('2000', () => {
                    expect(TuiYear.isValidYear(2000)).toBe(true);
                });

                it('9999', () => {
                    expect(TuiYear.isValidYear(9999)).toBe(true);
                });
            });
        });

        // Verifica se um ano é bissexto
        describe('isLeapYear returns', () => {
            // Anos que não são bissextos
            describe('false if passed year is not a leap year', () => {
                const nonLeapYears = [1, 2, 3, 5, 2001, 2018, 2100, 1995, 1334, 3421];

                nonLeapYears.forEach((year) => {
                    it(`${year}`, () => {
                        expect(TuiYear.isLeapYear(year)).toBe(false);
                    });
                });
            });

            // Anos que são bissextos
            describe('true if passed year is a leap year', () => {
                const leapYears = [0, 4, 20, 1200, 2000, 2020, 2104];

                leapYears.forEach((year) => {
                    it(`${year}`, () => {
                        expect(TuiYear.isLeapYear(year)).toBe(true);
                    });
                });
            });
        });

        // Retorna o número absoluto de anos bissextos até o ano especificado
        describe('getAbsoluteLeapYears returns', () => {
            // Casos básicos (0-10)
            describe('basic cases (0-10)', () => {
                const testCases = [
                    [0, 0],
                    [1, 1],
                    [2, 1],
                    [3, 1],
                    [4, 1],
                    [5, 2],
                    [6, 2],
                    [7, 2],
                    [8, 2],
                    [9, 3],
                    [10, 3],
                ] as const;

                testCases.forEach(([year, expected]) => {
                    it(`${expected} if passed value was ${year}`, () => {
                        expect(TuiYear.getAbsoluteLeapYears(year)).toBe(expected);
                    });
                });
            });

            // Casos com valores grandes
            describe('large values', () => {
                it('485 if passed value was 2000', () => {
                    expect(TuiYear.getAbsoluteLeapYears(2000)).toBe(485);
                });

                it('2425 if passed value was 9999', () => {
                    expect(TuiYear.getAbsoluteLeapYears(9999)).toBe(2425);
                });
            });
        });
    });

    // Testes para métodos e propriedades de instância
    describe('prototype', () => {
        describe('getter', () => {
            // Formatação do ano como string com padding
            describe('formattedYear returns', () => {
                it("'0000' if year is 0", () => {
                    expect(new TuiYear(0).formattedYear).toBe('0000');
                });

                it("'0001' if year is 1", () => {
                    expect(new TuiYear(1).formattedYear).toBe('0001');
                });

                it("'0020' if year is 20", () => {
                    expect(new TuiYear(20).formattedYear).toBe('0020');
                });

                it("'2000' if year is 2000", () => {
                    expect(new TuiYear(2000).formattedYear).toBe('2000');
                });

                it("'9999' if year is 9999", () => {
                    expect(new TuiYear(9999).formattedYear).toBe('9999');
                });
            });

            // Retorna o número absoluto de anos bissextos até o ano atual (getter da instância)
            describe('absoluteLeapYears returns', () => {
                // Casos básicos (0-10)
                describe('basic cases (0-10)', () => {
                    const testCases = [
                        [0, 0],
                        [1, 1],
                        [2, 1],
                        [3, 1],
                        [4, 1],
                        [5, 2],
                        [6, 2],
                        [7, 2],
                        [8, 2],
                        [9, 3],
                        [10, 3],
                    ] as const;

                    testCases.forEach(([year, expected]) => {
                        it(`${expected} if year is ${year}`, () => {
                            expect(new TuiYear(year).absoluteLeapYears).toBe(expected);
                        });
                    });
                });

                // Casos com valores grandes
                describe('large values', () => {
                    it('485 if year is 2000', () => {
                        expect(new TuiYear(2000).absoluteLeapYears).toBe(485);
                    });

                    it('2425 if year is 9999', () => {
                        expect(new TuiYear(9999).absoluteLeapYears).toBe(2425);
                    });
                });
            });

            // Verifica se o ano atual é bissexto (getter da instância)
            describe('isLeapYear returns', () => {
                // Anos que não são bissextos
                describe('false if it is not a leap year', () => {
                    const nonLeapYears = [1, 2, 3, 5, 2001, 2018, 2100, 1995, 1334, 3421];

                    nonLeapYears.forEach((year) => {
                        it(`${year}`, () => {
                            expect(new TuiYear(year).isLeapYear).toBe(false);
                        });
                    });
                });

                // Anos que são bissextos
                describe('true if it is a leap year', () => {
                    const leapYears = [0, 4, 20, 1200, 2000, 2020, 2104];

                    leapYears.forEach((year) => {
                        it(`${year}`, () => {
                            expect(new TuiYear(year).isLeapYear).toBe(true);
                        });
                    });
                });
            });
        });

        // Testes para métodos de comparação e manipulação de instâncias
        describe('method', () => {
            // Variáveis de teste compartilhadas para diferentes cenários
            let y2000: TuiYear;
            let y1900: TuiYear;
            let y2000v2: TuiYear;
            let y2100: TuiYear;

            beforeEach(() => {
                y2000 = new TuiYear(2000);
                y1900 = new TuiYear(1900);
                y2000v2 = new TuiYear(2000);
                y2100 = new TuiYear(2100);
            });

            describe('yearBefore returns', () => {
                describe('true if passed year', () => {
                    it('is bigger', () => {
                        expect(y2000.yearBefore(y2100)).toBe(true);
                    });
                });

                describe('false if passed year', () => {
                    it('is smaller', () => {
                        expect(y2000.yearBefore(y1900)).toBe(false);
                    });

                    it('is the same', () => {
                        expect(y2000.yearBefore(y2000v2)).toBe(false);
                    });
                });
            });

            describe('yearSameOrBefore returns', () => {
                describe('true if passed year', () => {
                    it('is the same', () => {
                        expect(y2000.yearSameOrBefore(y2000v2)).toBe(true);
                    });

                    it('is bigger', () => {
                        expect(y2000.yearSameOrBefore(y2100)).toBe(true);
                    });
                });

                describe('false if passed year', () => {
                    it('is smaller', () => {
                        expect(y2000.yearSameOrBefore(y1900)).toBe(false);
                    });
                });
            });

            describe('yearSame returns', () => {
                describe('true if passed year', () => {
                    it('is the same', () => {
                        expect(y2000.yearSame(y2000v2)).toBe(true);
                    });
                });

                describe('false if passed year', () => {
                    it('is smaller', () => {
                        expect(y2000.yearSame(y1900)).toBe(false);
                    });

                    it('is bigger', () => {
                        expect(y2000.yearSame(y2100)).toBe(false);
                    });
                });
            });

            describe('yearSameOrAfter returns', () => {
                describe('true if passed year', () => {
                    it('is smaller', () => {
                        expect(y2000.yearSameOrAfter(y1900)).toBe(true);
                    });

                    it('is the same', () => {
                        expect(y2000.yearSameOrAfter(y2000v2)).toBe(true);
                    });
                });

                describe('false if passed year', () => {
                    it('is bigger', () => {
                        expect(y2000.yearSameOrAfter(y2100)).toBe(false);
                    });
                });
            });

            describe('yearAfter returns', () => {
                describe('true if passed year', () => {
                    it('is smaller', () => {
                        expect(y2000.yearAfter(y1900)).toBe(true);
                    });
                });

                describe('false if passed year', () => {
                    it('is the same', () => {
                        expect(y2000.yearAfter(y2000v2)).toBe(false);
                    });

                    it('is bigger', () => {
                        expect(y2000.yearAfter(y2100)).toBe(false);
                    });
                });
            });

            // Adiciona anos ao ano atual e retorna novo TuiYear
            describe('append returns', () => {
                // Valores vazios ou zero não alteram o ano
                describe('unchanged when zero values are passed', () => {
                    it('if {} was passed', () => {
                        expect(y2000.append({}).year).toBe(2000);
                    });

                    it('if {year: 0} was passed', () => {
                        expect(y2000.append({year: 0}).year).toBe(2000);
                    });
                });

                // Ajustes simples de ano
                describe('year adjustments', () => {
                    it('adds years when positive value is passed', () => {
                        expect(y2000.append({year: 1}).year).toBe(2001);
                    });

                    it('subtracts years when negative value is passed', () => {
                        expect(y2000.append({year: -1}).year).toBe(1999);
                    });
                });

                // Ajustes grandes de ano
                describe('large year adjustments', () => {
                    it('adds large number of years', () => {
                        expect(y2000.append({year: 100}).year).toBe(2100);
                    });

                    it('subtracts large number of years', () => {
                        expect(y2000.append({year: -100}).year).toBe(1900);
                    });
                });
            });

            // Conversão para valor primitivo numérico
            describe('valueOf returns', () => {
                it('the primitive value of a TuiYear object', () => {
                    const year = new TuiYear(2000);

                    expect(typeof Number(year)).toBe('number');
                    expect(typeof year.valueOf()).toBe('number');
                    expect(year > new TuiYear(1999)).toBeTruthy();
                    expect(year < new TuiYear(2001)).toBeTruthy();
                });
            });

            // Conversão primitiva com Symbol.toPrimitive (controle explícito do tipo)
            describe('Symbol.toPrimitive returns', () => {
                it('a number if the hint is number', () => {
                    const year = new TuiYear(1701);

                    expect(typeof Number(year)).toBe('number');
                    expect(typeof year.valueOf()).toBe('number');
                    expect(typeof year[Symbol.toPrimitive]('number')).toBe('number');
                });

                it('a string if the hint is string', () => {
                    const year = new TuiYear(2201);

                    expect(typeof String(year)).toBe('string');
                    expect(typeof year.toString()).toBe('string');
                    expect(typeof year[Symbol.toPrimitive]('string')).toBe('string');
                });

                it('a string if the hint is default', () => {
                    const year = new TuiYear(2002);

                    expect(typeof `${year}`).toBe('string');
                    expect(typeof year[Symbol.toPrimitive]('default')).toBe('string');
                });
            });
        });
    });

    // Verifica se toString() retorna o mesmo que formattedYear
    it('stringified value equals formatted', () => {
        const month = new TuiYear(2000);

        expect(month.toString()).toBe(month.formattedYear);
    });
});
