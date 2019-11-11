import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";
export { shallow, render, mount } from "enzyme";
export { shallowToJson } from "enzyme-to-json";

Enzyme.configure({ adapter: new Adapter() });
console.log('Enzyme Setup');
export default Enzyme;