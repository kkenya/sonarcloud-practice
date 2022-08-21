# sonarcloud prractice

## 背景

publicなリポジトリならSonarCloudによる静的解析を無料で利用できるので試した。

## 環境

- GitHub
- TypeScript(JavaScript)
- Visual Studio Code

## SonarCloudとSonarQube

Sonar
SonarQube
SonarCloud

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

脆弱性やバグを特定するときよりも基準は厳格でないが、問題を引き起こす可能性のあるコードを警告する。

## SonarCloudセットアップ

1. SonarCloudのアカウント作成
2. 連携先の指定（今回はGitHub）
3. SonarCloudへリポジトリのインポート
    - Organizationか個人アカウントを一括でインポートできる
    - 今回は設定するリポジトリのみを指定した
4. リポジトリ設定を追加

## SonarLint

[Visual Studio Codeの拡張機能](https://marketplace.visualstudio.com/items?itemName=SonarSource.sonarlint-vscode)

アカウントのsecurityから生成
https://sonarcloud.io/account/security/

Explorerからtoken organizationを設定

## Quality Gate

Quality Gateの定義
Sonar Way: Built-in
Example QG: custom-defined
コード全体に適用される条件と新しいコードに適用される条件を区別し、新しいコードの解析結果解析結果から現在のコードがリリースに値するかの指標を提供する。

プロジェクトへのQuality Gateの選択は管理者権限が必要

Your Organization > Your Project > Administration > Quality Gates
デフォルトでSonary Wayが適用されている


Quality GateがNot Compeleted

[New Code](https://docs.sonarcloud.io/improving/new-code-definition/)を定義する

Previous version
前回のバージョンからの変更。Maven・Gradle以外のバージョンは自動で読み取ることはできず、 `sonar.projectVersion` を指定して明示的に指定する必要がある。

Number of days
指定日数の間の変更

Specific date
指定した年月日以降の変更

## CI-based Analysis

CI-based AnalysisはPull Requestごとに変更のあったコードのみを対象とした静的解析を実施できる。

GitHubのリポジトリをセットアップ後は[Automatic Analysis](https://docs.sonarcloud.io/advanced-setup/automatic-analysis/)が自動で有効となる。Automatic Analysisは自動でコードの静的解析を行うが、CI-based Analysisと併用できないため、無効にする（管理者権限が必要）。

SonarCloudでAdministration → Analysis Method → GitHub Actionsを選択
手順に従い、GitHubでSettings → Secretsで `SONAR_TOKEN` を登録する。
SonarCloudで設定ファイルの生成を進める。

ソースコードにGitHub Actionsの設定ファイル `.github/workflows/build.yml` を追加する。

```yaml
name: Build
on:
  push:
    branches:
      - main # PRマージ先のブランチを設定する
  pull_request:
    types: [opened, synchronize, reopened]
jobs:
  sonarcloud:
    name: SonarCloud
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
        with:
          fetch-depth: 0 # Shallow clones should be disabled for a better relevancy of analysis
      - name: SonarCloud Scan
        uses: SonarSource/sonarcloud-github-action@master
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }} # Needed to get PR information, if any
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
```

ソースコードにSonarCloudの設定ファイル `sonar-project.properties` を追加する。

```toml
sonar.projectKey=kkenya_sonarcloud-practice
sonar.organization=kkenya

sonar.sources=src
sonar.tests=__tests__
```

|key|value|
|:--|:--|
|sonar.sources | コード全体のパスを指定|
|sonar.tests|テストコードのパスを指定|
|sonar.typescript.tsconfigPath|tsconfig.jsonのパスを指定|

言語ごとのkeyはGeneral Settingsから確認できる

## テストカバレッジの計測

カバレッジの計測は自動計測でサポートされていない。CI-based Analysisを設定する。

CIの実行時にレポートファイルをLCOV形式で出力し、SonarCloudのスキャナーが取得できること

sonar-project.propertiesにパスを指定
jestは `./coverage/lcov.info` にカバレッジ計測結果を出力する。

```toml
sonar.javascript.lcov.reportPaths=./coverage/lcov.info
```

## Badges

READMEにSonarCloudのバッジを追加する。SonarCloudのInformationから取得。

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=kkenya_sonarcloud-practice&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=kkenya_sonarcloud-practice)

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
