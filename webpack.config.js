const path = require('path')

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'build'),
    },
    module: {
        rules: [
            {
                test: /\.js$/, // 匹配 .js 和 .jsx 文件,
                use: {
                    loader: 'babel-loader',
                }
            }
        ]
    },
    mode: 'development',
    watch: true, // 加上监听，不需要手动刷新
}
