# claude code の各セッションのログにアクセスするマクロ
`%USERPROFILE%\.claude\latest` に保存された markdown ログを「前へ」「次へ」で開ける。

ツールバーに置いておくと便利。

## 動機
- claude code はふだん vscode terminal から使っているが、回答をよく見たいときに読みづらい
- markdown として、使い慣れた秀丸エディタで見れるといい
    - → 最近 claude code が MOD をサポートし、UI 差し込むようなフックを仕込めるようになったので、「回答全部保存して」「直近の回答を開く」MOD をつくった(open-latest)。さらに秀丸エディタで読むために、前へ次へができると良さそう。それがこのマクロ
