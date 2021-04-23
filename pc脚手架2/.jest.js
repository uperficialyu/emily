module.exports = {
  setupFiles: [
    './test/setup.js',
  ],
  moduleFileExtensions: [
    'js',
    'jsx',
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
  ],
  testURL: 'https://test.com?empty=&num=0&str=str&cstr=中文&encode=%e4%b8%ad%e6%96%87',
  testMatch: [ // 匹配的测试文件
    '<rootDir>/test/**/?(*.)(spec|test).{js,jsx,mjs}',
  ],
  // testRegex: '.*\\.test\\.js$',
  collectCoverage: false,
  collectCoverageFrom: [
    // 'src/components/**/*.{js}',
    'app/lib/**/*.{js}',
  ],
  // moduleNameMapper: {
  //   "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/__mocks__/fileMock.js",
  //   "\\.(css|less|scss)$": "<rootDir>/__mocks__/styleMock.js"
  // },
  transform: {
    "^.+\\.js$": "babel-jest"
  },
};