import assert from "assert";

import { ServiceProvider, ioc, IServiceProvider } from "./anyioc";

describe('anyioc', function() {

    describe('ServiceProvider', function() {
        describe('#get()', function() {

            it('should return undefined on some not exists value', function() {
                const provider = new ServiceProvider();
                assert.strictEqual(provider.get('any'), undefined);
            })
        })

        describe('#singleton', function() {
            it('should always reference equals', function() {
                const provider = new ServiceProvider();
                provider.registerSingleton(1, () => ({}));
                const scoped_1 = provider.scope();
                const scoped_2 = provider.scope();
                const scoped_1_1 = scoped_1.scope();

                assert.notStrictEqual({}, {});

                assert.strictEqual(provider.get(1), provider.get(1));
                assert.strictEqual(provider.get(1), scoped_1.get(1));
                assert.strictEqual(provider.get(1), scoped_2.get(1));
                assert.strictEqual(provider.get(1), scoped_1_1.get(1));

                assert.strictEqual(scoped_1.get(1), provider.get(1));
                assert.strictEqual(scoped_1.get(1), scoped_1.get(1));
                assert.strictEqual(scoped_1.get(1), scoped_2.get(1));
                assert.strictEqual(scoped_1.get(1), scoped_1_1.get(1));

                assert.strictEqual(scoped_2.get(1), provider.get(1));
                assert.strictEqual(scoped_2.get(1), scoped_1.get(1));
                assert.strictEqual(scoped_2.get(1), scoped_2.get(1));
                assert.strictEqual(scoped_2.get(1), scoped_1_1.get(1));

                assert.strictEqual(scoped_1_1.get(1), provider.get(1));
                assert.strictEqual(scoped_1_1.get(1), scoped_1.get(1));
                assert.strictEqual(scoped_1_1.get(1), scoped_2.get(1));
                assert.strictEqual(scoped_1_1.get(1), scoped_1_1.get(1));
            })
        });

        describe('#scoped', function() {
            it('should always reference equals in scoped', function() {
                const provider = new ServiceProvider();
                provider.registerScoped(1, () => ({}));
                const scoped_1 = provider.scope();
                const scoped_2 = provider.scope();
                const scoped_1_1 = scoped_1.scope();

                assert.notStrictEqual({}, {});

                assert.strictEqual(provider.get(1), provider.get(1));
                assert.notStrictEqual(provider.get(1), scoped_1.get(1));
                assert.notStrictEqual(provider.get(1), scoped_2.get(1));
                assert.notStrictEqual(provider.get(1), scoped_1_1.get(1));

                assert.notStrictEqual(scoped_1.get(1), provider.get(1));
                assert.strictEqual(scoped_1.get(1), scoped_1.get(1));
                assert.notStrictEqual(scoped_1.get(1), scoped_2.get(1));
                assert.notStrictEqual(scoped_1.get(1), scoped_1_1.get(1));

                assert.notStrictEqual(scoped_2.get(1), provider.get(1));
                assert.notStrictEqual(scoped_2.get(1), scoped_1.get(1));
                assert.strictEqual(scoped_2.get(1), scoped_2.get(1));
                assert.notStrictEqual(scoped_2.get(1), scoped_1_1.get(1));

                assert.notStrictEqual(scoped_1_1.get(1), provider.get(1));
                assert.notStrictEqual(scoped_1_1.get(1), scoped_1.get(1));
                assert.notStrictEqual(scoped_1_1.get(1), scoped_2.get(1));
                assert.strictEqual(scoped_1_1.get(1), scoped_1_1.get(1));
            })
        });

        describe('#transient', function() {
            it('should always not reference equals', function() {
                const provider = new ServiceProvider();
                provider.registerTransient(1, () => ({}));
                const scoped_1 = provider.scope();
                const scoped_2 = provider.scope();
                const scoped_1_1 = scoped_1.scope();

                assert.notStrictEqual({}, {});

                assert.notStrictEqual(provider.get(1), provider.get(1));
                assert.notStrictEqual(provider.get(1), scoped_1.get(1));
                assert.notStrictEqual(provider.get(1), scoped_2.get(1));
                assert.notStrictEqual(provider.get(1), scoped_1_1.get(1));

                assert.notStrictEqual(scoped_1.get(1), provider.get(1));
                assert.notStrictEqual(scoped_1.get(1), scoped_1.get(1));
                assert.notStrictEqual(scoped_1.get(1), scoped_2.get(1));
                assert.notStrictEqual(scoped_1.get(1), scoped_1_1.get(1));

                assert.notStrictEqual(scoped_2.get(1), provider.get(1));
                assert.notStrictEqual(scoped_2.get(1), scoped_1.get(1));
                assert.notStrictEqual(scoped_2.get(1), scoped_2.get(1));
                assert.notStrictEqual(scoped_2.get(1), scoped_1_1.get(1));

                assert.notStrictEqual(scoped_1_1.get(1), provider.get(1));
                assert.notStrictEqual(scoped_1_1.get(1), scoped_1.get(1));
                assert.notStrictEqual(scoped_1_1.get(1), scoped_2.get(1));
                assert.notStrictEqual(scoped_1_1.get(1), scoped_1_1.get(1));
            })
        });

        describe('#group', function() {

            const provider = new ServiceProvider();
            provider.registerTransient('str', () => 'name');
            provider.registerTransient('int', () => 1);
            provider.registerValue('float', 1.1);
            const groupKeys = ['str', 'int'];
            provider.registerGroup('any', groupKeys)

            it('should can resolve by group', function() {
                assert.deepStrictEqual(provider.get('any'), ['name', 1]);
            });

            it('should be new instance by each call', function() {
                assert.notStrictEqual(provider.get('any'), provider.get('any'));
            });

            it('should can append key later', function() {
                groupKeys.push('float');
                assert.deepStrictEqual(provider.get('any'), ['name', 1, 1.1]);
            });
        });

        describe('#value', function() {

            it('should can resolve by value', function() {
                const provider = new ServiceProvider();
                provider.registerValue(1, 2);
                assert.strictEqual(provider.get(1), 2);
            })
        });
    });

    describe('ioc', function() {

        it('should be instance of IServiceProvider', function() {
            assert.strictEqual(ioc instanceof ServiceProvider, true);
        })
    });
})
