const fs = require('fs');
const less = require('less');
const path = require('path');

module.exports = (async function () {
  const lessFilePath = './node_modules/antd/lib/style/themes/default.less';
  const source = fs.readFileSync(lessFilePath, 'utf8');

  const root = await less.parse(source, {
    javascriptEnabled: true,
    paths: [path.join(lessFilePath, '../')],
  });

  const evalEnv = new less.contexts.Eval();
  evalEnv.frames = [root];
  evalEnv.javascriptEnabled = true;

  const result = {};
  for (let [name, variable] of Object.entries(root.variables())) {
    try {
      result[name] = variable.value.eval(evalEnv).toCSS();
    } catch (e) {
      console.log(e);
    }
  }

  return result;
})();
