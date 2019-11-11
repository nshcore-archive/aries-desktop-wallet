import LokiJs from 'lokijs';
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

    get wallets() {
        return this._wallets;
    }

    set wallets(value) {
        this._wallets = value;
    }

    /**
     * @param dbName
     */
    constructor(dbName = 'AriesWallet.db') {
        cryptedFileAdapter.setSecret('mySecret'); // do some master password functionality

        this.db = new LokiJs(dbName, {
            verbose:true,
            autoload: true,
            autoloadCallback : this.autoLoadCallback.bind(this),
            autosave: true,
            autosaveInterval: 1000,
            persistenceMethod: 'fs',
            persistenceAdapters: cryptedFileAdapter,
            serializationMethod: 'normal',
            throttledSaves: false
        });
    }

    autoLoadCallback() {
        let wallet = this.db.getCollection("wallets");
        if (wallet === null) {
            this.db.addCollection("wallets", {
                unique: ['address']
            });
        }
    }

    /**
     *  Check key exists
     * @param q
     * @returns {Object}
     */
    find(q) {
        return this.db.getCollection("wallets").find(q);
    }

    /**
     *  Get value from key.
     * @param key
     * @returns {Object|Array}
     */
    get(key) {
        return this.db.getCollection("wallets").get(key, true);
    }

    /**
     *  Save obj.
     * @param doc
     */
    set(doc) {
        return this.db.getCollection("wallets").insert(doc);
    }

    /**
     *  Delete doc.
     * @param doc
     */
    del(doc) {
        return this.db.getCollection("wallets").findAndRemove({address: doc});
    }
}

export default Database;