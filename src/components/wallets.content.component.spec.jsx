import React from 'react';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import WalletsContent from './wallets.content.component';

configure({adapter: new Adapter()});

describe('WalletContent Test', () => {
    test('snapshot renders', () => {
        const wrapper = shallow(<WalletsContent />);
        expect(wrapper).toMatchSnapshot(2);
    });
});