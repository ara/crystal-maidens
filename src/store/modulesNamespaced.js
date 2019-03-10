const requireModule = require.context('./modules/', false, /\.js$/);
const modules = {};

const camelCase = (str) => {
  let word, name;
  const regex = new RegExp(/\w+/g);
  while( (word = regex.exec(str)) !== null) {
    if( !name ) {
      name = word[0];
    } else {
      name += word[0][0].toUpperCase() + word[0].slice(1).toLowerCase();
    }
  }
  return name;
};

requireModule.keys().forEach(fileName => {
  if(fileName === './index.js') return;
  const moduleName = camelCase(
    fileName.replace(/(\.\/|\.js)/g, '')
  );
  modules[moduleName] = requireModule(fileName).default;
})

export default modules;
