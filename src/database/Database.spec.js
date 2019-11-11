import Database from "./Database";
import AriesWallet from "../lib/AriesWallet";

describe('database methods should add/remove from the db', () => {
    it('db can add and fetch record', async () => {

        let db = new Database();
        db.db.addCollection("wallets", {
            unique: ['address']
        });

        let testObj = { name: 'test', address: 'somerandomhash', network: 'testnet'};

        db.set(new AriesWallet(testObj));

        let result =  db.find({name: 'test'});

        expect(result[0].address).toEqual(testObj.address);
        expect(result[0].name).toEqual(testObj.name);
        expect(result[0].network).toEqual(testObj.network);

    });

    it('can find a given record', async () => {

        let db = new Database();

        db.db.addCollection("wallets", {
            unique: ['address']
        });

        let testObj = { name: 'test', address: 'somerandomhash', network: 'testnet'};

        db.set(new AriesWallet(testObj));
        let result = db.find({address: 'somerandomhash'});

        expect(result[0].address).toEqual(testObj.address);
        expect(result[0].name).toEqual(testObj.name);
        expect(result[0].network).toEqual(testObj.network);
    });

    it('can retrieve known record by key', async () => {

        let db = new Database();
        db.db.addCollection("wallets", {
            unique: ['address']
        });

        let testObj = { name: 'test', address: 'somerandomhash', network: 'testnet'};
        db.set(new AriesWallet(testObj));
        let result = db.get(1);
        expect(result[0].address).toEqual(testObj.address);
        expect(result[0].name).toEqual(testObj.name);
        expect(result[0].network).toEqual(testObj.network);
    });

    it('deleting should remove from collection', async () => {

        let db = new Database();
        db.db.addCollection("wallets", {
            unique: ['address']
        });

        let testObj = { name: 'test', address: 'somerandomhash', network: 'testnet'};
        db.set(new AriesWallet(testObj));
        db.del(testObj.address);

        expect(db.db.collections[0].data.length).toEqual(0);
    })
});