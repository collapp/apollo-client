const fs = require("fs");
const path = require("path");
const distRoot = path.join(__dirname, "..", "dist");

const isJsFileRegexp = /(?<!cjs)\.js$/i;

const processDir = async (dir) => {
	fs.readdir(dir, (err, list) => {
		if (err) {
			throw err;
		}

		list.forEach((file) => {
			const srcPath = path.resolve(dir, file);

			fs.stat(srcPath, (err, info) => {
				if (err) {
					throw err;
				}
				if (info && info.isFile() && isJsFileRegexp.exec(file)) {
					const renamedPath = path.resolve(
						dir,
						`${file.substring(0, file.length - 2)}mjs`
					);
					fs.copyFile(srcPath, renamedPath, (error) => {
						if (error) {
							throw error;
						}
					});
					return;
				} else if (info && info.isDirectory()) {
					processDir(srcPath);
				}
			});
		});
	});
};

processDir(distRoot);
