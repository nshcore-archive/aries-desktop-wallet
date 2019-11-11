import React from 'react';
import { Tabs, Icon, Layout } from 'antd';
import WalletsContent from './components/wallets.content.component';
const { Header, Footer, Content } = Layout;

class App extends React.Component {

    render() {
        return (
            <Layout>
                <Header className="Header">
                    <h3>Aries Wallet</h3>
                </Header>
                <Content>
                    <div className="App">
                        <Tabs defaultActiveKey="1" style={{ padding: '16px' }}>
                            <Tabs.TabPane tab={<span><Icon type="wallet" />Wallet</span>} key="1">
                                <WalletsContent />
                            </Tabs.TabPane>
                            <Tabs.TabPane tab={<span><Icon type="credit-card" />Payments</span>} key="2">
                                Payment Tab
                            </Tabs.TabPane>
                        </Tabs>
                    </div>
                </Content>
                <Footer>
                    AriesWallet.io
                </Footer>
            </Layout>
        );
    }
}

export default App;