# sonarcloud prractice

## 背景

publicなリポジトリならSonarCloudによる静的解析を無料で利用できるので試した。

## 環境

- GitHub
- TypeScript

## SonarCloud

静的コード解析サービス。20以上の言語に対応している。
オープンソースのプロジェクトなら無料で利用できる（設定時にFree Planを選択できる）。Pull Request作成時にCIと連携することやメインブランチなどの自動解析が可能。Visual Studio CodeやIntelliJ IDEAといったエディタのプラグインとして[SonarLint](https://www.sonarlint.org/)を提供する。

### SonarCloudが検出するもの

**Issues** と **Security Hotspots** に分類される。IssuesはさらにCode Smells、Bugs、Vulnerabilitiesに分類される。

#### Code Smells

保守性(maintainability)に影響を及ぼす可能性のあるコードの特徴を検出する。

例: 上位のスコープで定義された変数を下位のスコープで再定義する

```js
const foo = 'value'
arr.map(foo => {
  // ...
})
```

#### Bugs

信頼性(reliability)に影響を及ぼす可能性のあるコードを検出する。

例: 引数の上書き

```js
const func => (foo, bar) => {
  // bug!
  foo = 'overwrite'
}
```

#### Vulnerabilities

セキュリティ(security)に影響を及ぼす可能性のある脆弱性を検出する。

例: 脆弱性の報告されている暗号化方式を利用している

### Security Hotspots

(security review)

脆弱性やバグを特定するときよりも基準が厳格でないが、問題を引き起こす可能性のあるコードを警告する。

## SonarCloudセットアップ

1. SonarCloudのアカウント作成
2. 連携先の指定（今回はGitHub）
3. SonarCloudへリポジトリのインポート
    - Organizationか個人アカウントを一括でインポートできる
    - 今回は設定するリポジトリのみを指定した
4. 言語ごとの設定を追加

## 導入時メモ

### jest導入

TypeScirptで[Jest](https://jestjs.io/docs/getting-started)を実行するため[ts-jest](https://kulshekhar.github.io/ts-jest/)を利用する。

```shell
npm install --save-dev jest ts-jest @types/jest
```

`@types/jest` のバージョンはjestに合わせる。
`jest` のバージョンが `28.1.0` なら `@types/jest` は `28.1.x` 。

設定ファイルの対話的な生成（ts-jestのセットアップスクリプト（ `npx ts-jest config:init` ）はjsで生成されるので利用しない）。

```shell
npx jest --init
```

`ts-jest` でTypeScriptの設定ファイルを利用する場合は `ts-node` のインストールが必要。

```shell
npm install --save-dev ts-node
```

`jest.config.ts` にpresetを指定

```js
  preset: "ts-jest",
```

カバレッジの集計対象からトランスパイルしたコードを除外する

`jest.config.ts`

```js
  coveragePathIgnorePatterns: ["/node_modules/", "dist"],
```

### ghコマンドでリポジトリを作成する

[`create`](https://cli.github.com/manual/gh_repo_create) のオプションに `--source` を指定することでローカルのディレクト名とコミット履歴で作成できる。

```shell
gh repo create --public --source=.
```

## Security Hotspotの修正について

httpのURLを許可したい場合など意図的にSecurity Hotspotの報告を修正しない場合はステータスを変更する（参考: [Security Hotspot Workflow](https://docs.sonarcloud.io/digging-deeper/security-hotspots/)）

スタータスの変更には `Administer Security Hotspots` の権限が必要になる。権限がないユーザーにはタブ自体が表示されない。

>Security hotspots have a dedicated lifecycle. To make status changes, the user needs the Administer Security Hotspots permission. This permission is enabled by default. Users with the Browse permission can comment on or change the user assigned to a security hotspot.

## 参考

- [SonarCloud](https://docs.sonarcloud.io/)
