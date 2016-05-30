'use strict'

let fs = require('fs');
let path = require('path');
let colors = require('colors');

const DEFAULT_OPTIONS = {
    srcmap: true,
    outputfile: 'boi-map.json',
    nameWithHash: true
};

let HtmlWebpackSrcmapPlugin = function(options) {
    this.options = Object.assign({}, DEFAULT_OPTIONS, options);
};

HtmlWebpackSrcmapPlugin.prototype.apply = function(compiler) {
    let _this = this;
    compiler.plugin('done', function(compilation, callback) {
        let _srcmap = null;

        let _regJS = /\.js$/;
        let _regCSS = /\.css$/;

        let _publicPath = compilation.compilation.outputOptions.publicPath;
        let _assets = Object.keys(compilation.compilation.assets).filter(function(filename) {
            return _regJS.test(filename) || _regCSS.test(filename);
        });
        _assets.map(function(filename) {
            let _arr = filename.split('/');
            let _filename = _arr[_arr.length - 1];
            let _publicName = _publicPath + filename;
            let _key = '';
            if (_this.options.nameWithHash) {
                if (_regJS.test(filename)) {
                    _key = _filename.split(/\.[a-z0-9]+\.js$/)[0] + '.js';
                } else {
                    _key = _filename.split(/\.[a-z0-9]+\.css$/)[0] + '.css';
                }
            } else {
                if (_regJS.test(filename)) {
                    _key = _filename.split(/\.js$/)[0] + '.js';
                } else {
                    _key = _filename.split(/\.css$/)[0] + '.css';
                }
            }
            _srcmap = Object.assign({}, _srcmap, {
                [_key]: _publicName
            });
        });

        fs.writeFileSync(path.resolve(process.cwd(), _this.options.outputfile), JSON.stringify(_srcmap));
        console.log(colors.blue('Map files has been generated sucessfully'));
    });
};


module.exports = HtmlWebpackSrcmapPlugin;
