import Enzyme from 'enzyme';
// const Enzyme = require('enzyme');
// const Adapter = require('enzyme-adapter-react-16');
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });
