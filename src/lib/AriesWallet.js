import EventEmitter from 'events';
import Network from './Network';
import Database from '../database/Database';

const { LibraWallet, Mnemonic } = require('kulap-libra');

class AriesWallet extends EventEmitter {

    static generate() {
        return new Mnemonic().toString();
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
        const db = new Database();
        return db.insert(this.toObject());
    }

    erase() {
        const db = new Database();
        db.remove({
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
