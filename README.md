# open-latest
Claude Code の最新の回答を `~/.claude/latest.md` に書き出し、プロンプトの上に出る「エディタで開く」ボタンからエディタで開けるようにするプラグインです。

長い回答をターミナルで読むのがつらいとき、使い慣れたエディタでじっくり読めます。

## 動作
- ターンが終わるたびに、Claude の最終回答を `%USERPROFILE%\.claude\latest.md` に上書き保存します
  - サブエージェントの回答、中断されたターン、空の回答は保存しません
  - UTF-8 で保存します
- `latest.md` があるとき、プロンプトの上に「エディタで開く」ボタンが出ます
- ボタンを押すと、`.md` に関連付けられたアプリで `latest.md` を開きます

## 動作環境
- Windows（`rundll32` で関連付けられたアプリを起動するため）
- Claude Code（ターミナル版）
- `.md` ファイルが好きなエディタに関連付けられていること

## 導入方法

### ステップ 1: マーケットプレイスを追加する

```
claude plugin marketplace add stakiran/open-latest
```

このリポジトリを「プラグインの入手元」として登録します。これだけではまだプラグインは動きません。最初の 1 回だけ必要です。

### ステップ 2: プラグインをインストールする
3 通りあります。

`~/.claude/settings.json`:

```
claude plugin install open-latest@open-latest --scope user
```

そのディレクトリの `.claude/settings.json`:

```
claude plugin install open-latest@open-latest --scope project
```

そのディレクトリの `.claude/settings.local.json`:

```
claude plugin install open-latest@open-latest --scope local
```

アンインストールするときは `/plugin` のメニューから open-latest を削除してください。

## 導入はしないが試したい
インストールせずに、そのセッションだけ読み込んで試せます。Claude Code を閉じれば元に戻ります。

```
git clone https://github.com/stakiran/open-latest.git
claude --plugin-dir ./open-latest
```

起動したら何か質問して回答を待ち、プロンプトの上に「エディタで開く」ボタンが出ることを確かめてください。
