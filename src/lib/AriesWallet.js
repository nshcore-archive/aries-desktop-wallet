import Network from './Network';
import EventEmitter from 'events';
import Database from '../database/Database';
const { LibraWallet, Mnemonic } = require('kulap-libra');

class AriesWallet extends EventEmitter {

    static generate() {
        return new Mnemonic().toString();
    }

    static get store() {
        if (!AriesWallet.__store) {
            AriesWallet.__store = new Database();
            AriesWallet.__store.autoLoadCallback();
        }
        return AriesWallet.__store;
    }

    static set store(value) {
        AriesWallet.__store = value;
    }

    static all() {
        let collection =  AriesWallet.store.find({ network: Network.name });
        return collection.map(doc => new AriesWallet(doc));
    }

    static create(name, mnemonic) {

        const libraWallet = new LibraWallet({
            mnemonic: mnemonic
        });

        const account = libraWallet.newAccount();

        return new AriesWallet({
            name: name,
            address: account.getAddress().toHex(),
            network: Network.name,
            account: account
        });
    }

    constructor(info) {
        super();
        this.__store =  new Database();
        this.__name = info.name;
        this.__address = info.address;
        this.__network = info.network;
        this.__account = info.account;
        this.__password = info.password || undefined;
    }

    get name() {
        return this.__name;
    }

    get address() {
        return this.__address;
    }

    get network() {
        return this.__network;
    }

    get account() {
        return this.__account;
    }

    get key() {
        return this.address;
    }

    save() {
        return AriesWallet.store.set(this.toObject());
    }

    erase() {
        this.store.del({
            address: this.address
        });

        this.emit(AriesWallet.Events.Updated);
    }

    toObject() {

        const obj = {
            name: this.name,
            address: this.address,
            network: this.network,
        };

        if (this.__password) {
            obj.password = this.__password;
        }

        return obj;
    }
}

AriesWallet.Defaults = {
    Encryption: 'aes-256-cbc'
};

AriesWallet.Events = {
    Updated: 'updated'
};

export default AriesWallet;