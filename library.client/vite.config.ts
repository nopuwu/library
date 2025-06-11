import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import plugin from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import fs from 'fs';
import path from 'path';
import child_process from 'child_process';
import { env } from 'process';

const isDev = process.env.NODE_ENV !== 'production';

let httpsConfig = undefined;

if (isDev) {
	const baseFolder =
		env.APPDATA !== undefined && env.APPDATA !== ''
			? `${env.APPDATA}/ASP.NET/https`
			: `${env.HOME}/.aspnet/https`;

	const certificateName = 'library.client';
	const certFilePath = path.join(baseFolder, `${certificateName}.pem`);
	const keyFilePath = path.join(baseFolder, `${certificateName}.key`);

	if (!fs.existsSync(baseFolder)) {
		fs.mkdirSync(baseFolder, { recursive: true });
	}

	if (!fs.existsSync(certFilePath) || !fs.existsSync(keyFilePath)) {
		if (
			0 !==
			child_process.spawnSync(
				'dotnet',
				[
					'dev-certs',
					'https',
					'--export-path',
					certFilePath,
					'--format',
					'Pem',
					'--no-password',
				],
				{ stdio: 'inherit' }
			).status
		) {
			throw new Error('Could not create certificate.');
		}
	}

	httpsConfig = {
		key: fs.readFileSync(keyFilePath),
		cert: fs.readFileSync(certFilePath),
	};
}

export default defineConfig({
	plugins: [plugin(), tailwindcss()],
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url)),
		},
	},
	base: '/',
	build: {
		outDir: 'dist',
		emptyOutDir: true,
	},
	server: isDev
		? {
			proxy: {
				'/api': 'http://localhost:5237',
			},
			port: parseInt(env.DEV_SERVER_PORT || '61064'),
			https: httpsConfig,
		}
		: undefined,
});
