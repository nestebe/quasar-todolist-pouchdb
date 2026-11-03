// Configuration for your app
// https://v2.quasar.dev/quasar-cli-vite/quasar-config-file

import { defineConfig } from '#q-app';

export default defineConfig(() => {
  return {
    // https://v2.quasar.dev/quasar-cli-vite/boot-files
    boot: ['pouchdb'],

    // https://v2.quasar.dev/quasar-cli-vite/quasar-config-file#css
    css: ['app.scss'],

    // https://github.com/quasarframework/quasar/tree/dev/extras
    extras: ['roboto-font', 'material-icons'],

    // https://v2.quasar.dev/quasar-cli-vite/quasar-config-file#build
    build: {
      typescript: {
        strict: true,
        vueShim: true,
      },

      vueRouterMode: 'hash',

      // Only variables prefixed with QCLI_ (from .env files or process.env)
      // are exposed to the client code, e.g. QCLI_COUCHDB_URL.
      // https://v2.quasar.dev/quasar-cli-vite/handling-import-meta-env

      vitePlugins: [
        [
          'vite-plugin-checker',
          {
            vueTsc: true,
            eslint: {
              lintCommand: 'eslint -c ./eslint.config.js "./src*/**/*.{ts,js,mjs,cjs,vue}"',
              useFlatConfig: true,
            },
          },
          { server: false },
        ],
      ],
    },

    // https://v2.quasar.dev/quasar-cli-vite/quasar-config-file#devserver
    devServer: {
      // set BROWSER=none to not open a browser tab automatically
      open: process.env.BROWSER !== 'none',
    },

    // https://v2.quasar.dev/quasar-cli-vite/quasar-config-file#framework
    framework: {
      config: {
        dark: 'auto',
      },
      lang: 'fr',
      plugins: ['Dialog', 'Notify'],
    },

    animations: [],
  };
});
