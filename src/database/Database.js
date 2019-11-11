import LokiJs from 'lokijs';
import Network from '../lib/Network';

const cryptedFileAdapter = require('../../node_modules/lokijs/src/loki-crypted-file-adapter');

/**
 * Basic persistent data store.
 */
class Database {

    get db() {
        return this._db;
    }

    set db(value) {
        this._db = value;
    }

    /**
     * @param dbName
     */
    constructor(dbName = 'AriesWallet.db') {
        cryptedFileAdapter.setSecret('mySecret'); // do some master password functionality

        this.db = new LokiJs(dbName, {
            env: 'BROWSER',
            // adapter: cryptedFileAdapter,
            verbose: true,
            autoload: true,
            autoloadCallback: this.autoLoadCallback.bind(this),
            autosave: true,
            autosaveCallback: this.autoSaveCallback.bind(this),
            autosaveInterval: 100,
            persistenceMethod: 'localStorage',
            destructureDelimiter: ',',
            serializationMethod: 'normal',
            throttledSaves: false
        });

        this.db.loadDatabase('AriesWallet.db');
    }

    autoLoadCallback() {
        const wallet = this.db.getCollection('wallets');
        if (wallet === null) {
            this.db.addCollection('wallets', {
                unique: ['address'],
                indices: ['network'],
                disableMeta: true,
                autoupdate: true
            });
        }
    }

    autoSaveCallback() {
        console.log('autosave called');
    }

    all(cb) {
        const collection = this.db.getCollection('wallets').find({
            network: Network.name
        });

        if (cb) {
            return cb(collection);
        }
        return collection;
    }

    /**
     *  Delete doc.
     * @param doc
     */
    delete(doc) {
        const result = this.db.getCollection('wallets').findAndRemove({
            address: doc
        });

        this.db.saveDatabase('AriesWallet.db');
        return result;
    }

    /**
     *  Check key exists
     * @param q
     * @returns {Object}
     */
    find(q) {
        return this.db.getCollection('wallets').find(q);
    }

    /**
     *  Save obj.
     * @param doc
     */
    insert(doc) {
        const result = this.db.getCollection('wallets').insert(doc);
        this.db.saveDatabase('AriesWallet.db');
        return result;
    }
}

export default Database;
