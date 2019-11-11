import React from 'react';
import {
    Button,
    Table,
    Modal,
    message,
    Popconfirm
} from 'antd';

import Constants from '../lib/Constants';
import AriesWallet from '../lib/AriesWallet';
import Cryptography from '../lib/Cryptography';
import CreateForm from './create.form.modal.component';
import Database from '../database/Database';
import Network from '../lib/Network';

const validateFormHashed = (form) => {
    return new Promise((res, rej) => {
        form.validateFields((err, values) => {
            if (err) {
                rej(err);
            }
            Cryptography.hash(values.password).then((hash) => {
                values.password = hash;
                res(values);
            }, (e) => {
                rej(e);
            });
        });
    });
};

class WalletsContent extends React.Component {

    constructor(props) {

        super(props);
        this.state = {
            modalOpenCreate: false,
            modalOpenSend: false,
            wallets: [],
        };

        this.handleCreate = this.handleCreate.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleReload = this.handleReload.bind(this);
    }

    componentDidMount() {
        const db = new Database();
        db.autoLoadCallback();

        const wallets = db.all((collection) => collection.map((doc) => new AriesWallet(doc)));
        console.log('pre fe');
        wallets.forEach((w) => {
            console.log('loading wallet');
            console.log(w);
            // w.on(AriesWallet.Events.Updated, () => {
            //     // const newTotal = this.state.wallets.reduce((a, c) => a + c.coins, 0);
            //     this.setState({ total: newTotal });
            // });
            // w.update();
        });

        this.setState({ wallets: wallets });
    }

    handleCreate() {
        validateFormHashed(this.form).then((values) => {
            this.form.resetFields();
            this.setState({ modalOpenCreate: false });

            const wallet = AriesWallet.create(values.name, AriesWallet.generate());

            this.__addWallet(wallet, wallet.account.mnemonic);
        });
    }

    handleCancel() {
        this.setState({
            modalOpenCreate: false,
            modalOpenSend: false,
        });
        this.form = null;
    }

    __addWallet(wallet, mnemonic) {

        this.setState({
            wallets: this.state.wallets.concat([wallet]),
        });

        const db = new Database();
        db.autoLoadCallback();
        const result = db.insert(wallet.toObject());

        if (result.address === wallet.address) {
            message.success(Constants.Messages.Wallet.Created);
            setTimeout(() => {
                Modal.warning({
                    title: Constants.Messages.Wallet.Mnemonic,
                    content: mnemonic,
                });
            }, 1000);
        } else {
            Modal.error({
                title: Constants.Messages.Wallet.Failed,
                content: 'can/\'t save',
            });
        }
    }

    handleReload() {
        this.state.wallets.forEach(w => console.log(w));
    }

    render() {

        const columns = [
            { title: 'Name', dataIndex: 'name', key: 'name' },
            {
                title: 'Address', key: 'address', render: (r) => {
                    return (
                        <span
                          tabIndex={0}
                          role="button"
                          style={{ cursor: 'copy' }}>
                            {r.address}
                        </span>
                    );
                }
            },
        ];

        return (
            <div className="Wallets">
                <div className="Wallets">
                    <div style={{ marginBottom: '12px' }}>
                        <Button
                            type="primary"
                            icon="plus-circle-o"
                            style={{ marginLeft: '8px' }}
                            onClick={() => this.setState({ modalOpenCreate: true, })}>Create
                        </Button>
                        <Button
                            type="primary"
                            shape="circle"
                            icon="reload"
                            style={{ marginLeft: '8px' }}
                            onClick={this.handleReload}
                        />
                    </div>
                    <Modal
                        title="Create a New Wallet"
                        visible={this.state.modalOpenCreate}
                        okText="Create"
                        onCancel={this.handleCancel}
                        onOk={this.handleCreate}>
                        <CreateForm
                            ref={form => (this.form = form)}
                            handleCreate={this.handleCreate}
                        />
                    </Modal>
                    <Table
                        columns={columns}
                        dataSource={this.state.wallets}
                        pagination={false}
                        style={{ height: '250px', backgroundColor: 'white' }}
                    />
                </div>
            </div>
        );
    }
}

export default WalletsContent;
