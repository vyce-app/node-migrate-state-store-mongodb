import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

// https://vitejs.dev/guide/build.html#library-mode
export default defineConfig({
	build: {
		lib: {
			entry: resolve(__dirname, 'src/index.ts'),
			name: '@vyce/migrate-state-store-mongodb',
			fileName: 'index',
		},
		rollupOptions: {
			external: [
				'mongodb',
			],
		},
	},
	plugins: [dts()],
});
