const { aliasWebpack, aliasJest } = require("react-app-alias");

const aliasMap = {
	"@components": "src/components",
	"@services": "src/services",
	"@hooks": "src/hooks",
	"@pages": "src/pages",
	"@mocks": "src/mocks",
	"@data": "src/data",
	"@colors": "src/colors",
	"@store": "src/store",
	"@root": "src",
};

const options = {
	alias: aliasMap,
};

module.exports = aliasWebpack(options);
module.exports.jest = aliasJest(options);
