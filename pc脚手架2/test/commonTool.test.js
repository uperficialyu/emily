/* eslint-disable no-undef */
import commonTool from '../app/common/commonTool';

test('补0', () => {
  expect(commonTool.fillZero('9')).toBe('09');
});

test('补0', () => {
  expect(commonTool.fillZero('1')).toBe('01');
});

test('获取(默认系统日期)日期,返回YYYYMMDD格式', () => {
  expect(commonTool.getDate('2018-12-13')).toBe('20181213');
});

test('获取(默认系统日期)日期,返回YYYYMMDD格式', () => {
  expect(commonTool.getDate('2018-02-13')).toBe('20180213');
});

test('获取(默认系统日期)日期,返回YYYYMMDD格式', () => {
  expect(commonTool.getDate('2023-02-13')).toBe('20230213');
});

test('保留小数位数', () => {
  expect(commonTool.formatNum('12.1313')).toBe('12.13');
});

test('保留小数位数', () => {
  expect(commonTool.formatNum('12')).toBe('12.00');
});

test('保留小数位数', () => {
  expect(commonTool.formatNum('0')).toBe('0.00');
});