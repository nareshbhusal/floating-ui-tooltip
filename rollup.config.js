import postcss from 'rollup-plugin-postcss'
import typescript from 'rollup-plugin-typescript2';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import { terser } from "rollup-plugin-terser";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import strip from '@rollup/plugin-strip';
import { visualizer } from 'rollup-plugin-visualizer';
import visualizeSource from 'rollup-plugin-source-map-explorer';

const mode = process.env.NODE_ENV === 'development' ? 'development' : 'production';

// const functionsToRemove = mode === 'production' ? ['console.log', 'assert.*', 'debug', 'alert'] : [];
const functionsToRemove = [];

const bundleOutputDirName = `${mode === 'development' ? 'dev' : 'dist'}`;
const configOptions = [
    {
        input: 'src/index.ts',
        outputFile: `${bundleOutputDirName}/index.js`,
        name: 'floating-ui-tooltip',
        tsconfig: 'tsconfig.json',
        packageJsonPath: 'package.json',
    },
];

function getConfig({ input, name, outputFile, tsconfig, packageJsonPath }) {

    let config = {
        input,
        external: [
            'tslib',
        ],
        output: {
            file: outputFile,
            name,
            format: 'umd',
            sourcemap: true,
            globals: {
                'tslib': 'tslib',
            },
        },
        plugins: [
            replace({
                'process.env.NODE_ENV': JSON.stringify('production'),
                __buildDate__: () => JSON.stringify(new Date()),
                __buildVersion: 15,
                preventAssignment: true,
            }),
            peerDepsExternal({
                packageJsonPath,
            }),
            commonjs(),
            nodeResolve({
                browser: true,
            }),
            typescript({
                tsconfig,
                check: true,
                tsconfigOverride: {
                    compilerOptions: {
                        sourceMap: true
                    }
                }
            }),
            postcss({
                inject: false,
                sourceMap: (mode === 'production' ? false : 'inline'),
                minimize: mode === 'production',
            }),
            strip({
                functions: functionsToRemove,
                include: ['**/*.(js|jsx|ts|tsx)'],
                exclude: ['node_modules/**'],
            }),
            ...mode === 'production' ? [
                terser(),
                /* visualizeSource({
                    filename: `.rollup-build-stats/${name.toLowerCase()}-${mode.toLowerCase()}.html`,
                    format: 'html',
                    gzip: false
                }), */
            ] : [],
            ...mode === 'development' ? [
                visualizer({
                    filename: `.rollup-build-stats/${name.toLowerCase()}-${mode.toLowerCase()}.html`,
                    title: 'Lusift Rollup Visualizer',
                    sourcemap: true,
                    gzipSize: true,
                }),
            ] : [],
        ]
    };
    return config;
}

export default configOptions.map(getConfig);
