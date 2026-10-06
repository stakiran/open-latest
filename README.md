# open-latest

Claude Code の最新の回答を `~/.claude/latest.md` に書き出し、プロンプトの上に出る「エディタで開く」ボタンからエディタで開けるようにするプラグインです。

長い回答をターミナルで読むのがつらいとき、使い慣れたエディタ（秀丸エディタなど）でじっくり読めます。

## 動作

- ターンが終わるたびに、Claude の最終回答を `%USERPROFILE%\.claude\latest.md` に上書き保存します
  - サブエージェントの回答、中断されたターン、空の回答は保存しません
  - UTF-8（BOM 付き）で保存します
- `latest.md` があるとき、プロンプトの上に「エディタで開く」ボタンが出ます
- ボタンを押すと、`.md` に関連付けられたアプリで `latest.md` を開きます

## 動作環境

- Windows（`rundll32` で関連付けられたアプリを起動するため）
- Claude Code（ターミナル版）
- `.md` ファイルが好きなエディタに関連付けられていること

## 導入方法

### A. ユーザー環境にインストールする

Claude Code のプロンプトで次を実行します。

```
/plugin install open-latest --marketplace stakiran/open-latest
```

1. `Add marketplace?` と聞かれたら `y` を押します
2. スコープを選ぶ画面では、先頭の user スコープのまま Enter を押します
3. `Installed open-latest. Plugin is now active.` と出れば完了です

そのセッションですぐに有効になり、以降に起動するすべてのセッションでも有効です。

アンインストールするときは `/plugin` のメニューから open-latest を削除してください。

### B. いったん試すだけ

インストールせずに、そのセッションだけ読み込んで試せます。Claude Code を閉じれば元に戻ります。

```
git clone https://github.com/stakiran/open-latest.git
claude --plugin-dir ./open-latest
```

起動したら何か質問して回答を待ち、プロンプトの上に「エディタで開く」ボタンが出ることを確かめてください。

## 使い方

- ボタンはマウスでクリックするか、`ctrl+x` → `tab` でプロンプト上の帯にフォーカスを移して Enter で押せます
- `latest.md` は毎ターン上書きされます。残したい回答は別名で保存してください
