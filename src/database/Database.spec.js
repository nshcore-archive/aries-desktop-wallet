import Database from './Database';
import AriesWallet from '../lib/AriesWallet';

describe('database methods should add/remove from the db', () => {

    it('can get all', async () => {
        const db = new Database();
        db.db.addCollection('wallets', {
            unique: ['address']
        });

        const testObj1 = { name: 'test1', address: 'hash1', network: 'testnet' };
        const testObj2 = { name: 'test2', address: 'hash2', network: 'testnet' };
        db.insert([testObj1, testObj2]);

        const result = db.all();

        expect(result.length).toEqual(2);
    });

    it('can get all and map in cb', async () => {
        const db = new Database();
        db.db.addCollection('wallets', {
            unique: ['address']
        });

        const testObj1 = { name: 'test1', address: 'hash1', network: 'testnet' };
        const testObj2 = { name: 'test2', address: 'hash2', network: 'testnet' };
        db.insert([testObj1, testObj2]);

        const testCb = (collection) => collection.map((doc) => new AriesWallet(doc));

        const result = db.all(testCb);

        expect(result.length).toEqual(2);

        // gotta be a nicer way of asserting type here but js sucks
        if (result[0] instanceof AriesWallet) {
            expect(1).toEqual(1);
        } else {
            expect(1).toEqual(2);
        }
    });

    it('db can add and fetch record', async () => {

        const db = new Database();
        db.db.addCollection('wallets', {
            unique: ['address']
        });

        const testObj = { name: 'test', address: 'somerandomhash', network: 'testnet' };

        db.insert(new AriesWallet(testObj));

        const result = db.find({
            name: 'test'
        });

        expect(result[0].address).toEqual(testObj.address);
        expect(result[0].name).toEqual(testObj.name);
        expect(result[0].network).toEqual(testObj.network);

    });

    it('can find a given record', async () => {

        const db = new Database();

        db.db.addCollection('wallets', {
            unique: ['address']
        });

        const testObj = { name: 'test', address: 'somerandomhash', network: 'testnet' };

        db.insert(new AriesWallet(testObj));
        const result = db.find({
            address: 'somerandomhash'
        });

        expect(result[0].address).toEqual(testObj.address);
        expect(result[0].name).toEqual(testObj.name);
        expect(result[0].network).toEqual(testObj.network);
    });

    it('can retrieve known record by key', async () => {

        const db = new Database();
        db.db.addCollection('wallets', {
            unique: ['address']
        });

        const testObj = {
            name: 'test',
            address: 'somerandomhash',
            network: 'testnet'
        };

        db.insert(new AriesWallet(testObj));
        const result = db.find(testObj.address);

        expect(result[0].address).toEqual(testObj.address);
        expect(result[0].name).toEqual(testObj.name);
        expect(result[0].network).toEqual(testObj.network);
    });

    it('deleting should remove from collection', async () => {

        const db = new Database();
        db.db.addCollection('wallets', {
            unique: ['address']
        });

        const testObj = { name: 'test', address: 'somerandomhash', network: 'testnet' };
        db.insert(new AriesWallet(testObj));
        db.delete(testObj.address);

        expect(db.db.collections[0].data.length).toEqual(0);
    });
});
