# sonarcloud prractice

## jest導入

TypeScirptで[Jest](https://jestjs.io/docs/getting-started)を実行するため[ts-jest](https://github.com/kulshekhar/ts-jest)を利用する。

```shell
npm install --save-dev jest ts-jest @types/jest ts-node
```

`@types/jest` のバージョンはjestに合わせる。
`jest` のバージョンが `28.1.0` なら `@types/jest` は `28.1.x` 。

設定ファイルの対話的な生成（ts-jestのセットアップスクリプト（ `npx ts-jest config:init` ）はjsで生成されるので利用しない）。

```shell
npx jest --init
```

`jest.config.ts` にpresetを指定

```js
  preset: ["ts-jest"],
```

