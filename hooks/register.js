// latest.md が存在するか（ボタンを出すかどうか）
let hasLatest = false

async function latestPath($) {
  const home = await $.env.get('USERPROFILE')
  return home + '\\.claude\\latest.md'
}

// 履歴ファイルのパス。~/.claude/latest/YYMMDD-HHmmss.md（ローカル時刻）
async function historyPath($) {
  const home = await $.env.get('USERPROFILE')
  const d = new Date(await $.clock.now())
  const p = n => String(n).padStart(2, '0')
  const date = p(d.getFullYear() % 100) + p(d.getMonth() + 1) + p(d.getDate())
  const time = p(d.getHours()) + p(d.getMinutes()) + p(d.getSeconds())
  return home + '\\.claude\\latest\\' + date + '-' + time + '.md'
}

export function register(on) {
  on('session.start', async ($, e, next) => {
    hasLatest = await $.fs.exists(await latestPath($))
    return next(e)
  })

  // ターン終了時に最終回答を履歴ファイルに保存し、latest.md にも上書き保存
  on('turn.complete', async ($, e, next) => {
    // サブエージェントのターン、中断されたターン、空の回答は無視
    if (e.agentId || e.isAborted || !e.answer) return next(e)
    // 履歴の保存に失敗しても latest.md（open ボタン）は生かす
    await $.fs.write(await historyPath($), e.answer).catch(err => $.ui.toast('履歴を保存できませんでした: ' + err))
    await $.fs.write(await latestPath($), e.answer)
    // コピー用。$.fs には読み込みがないので、セッションをまたいで残る $.store にも持っておく
    await $.store.set('latest', e.answer).catch(() => $.store.delete('latest'))
    hasLatest = true
    $.ui.invalidate('ui.render')
    return next(e)
  })

  // プロンプト上の帯にボタンを描く
  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    // 他の mod が帯に描いたものは残す
    const others = await next(e)
    if (!hasLatest) return others

    const { Box, Button } = $.ui.resolve(e)
    const openButton = Button({
      key: 'open-latest',
      label: 'open',
      plain: true,
      onPress: async () => {
        try {
          // 関連付けられたアプリ（ShellExecute）で開く。rundll32 は起動後すぐ終わるので待たされない
          const file = await latestPath($)
          const r = await $.process.run(['rundll32', 'url.dll,FileProtocolHandler', file])
          if (r.exitCode !== 0) $.ui.toast('エディタを開けませんでした: ' + (r.stderr || r.exitCode))
        } catch (err) {
          $.ui.toast('エディタを開けませんでした: ' + err)
        }
      },
    })
    const copyButton = Button({
      key: 'copy-latest',
      label: 'copy',
      plain: true,
      onPress: async press => {
        const text = await $.store.get('latest')
        if (typeof text !== 'string') return $.ui.toast('コピーできる回答がありません')
        const r = await $.ui.copy({ text, surface: press.surface })
        $.ui.toast(r.isCopied ? '回答をコピーしました' : 'コピーできませんでした: ' + r.reason)
      },
    })
    const buttons = Box({
      flexDirection: 'row',
      columnGap: 2,
      children: [openButton, copyButton],
    })

    return Box({
      flexDirection: 'column',
      children: others ? [buttons, others] : [buttons],
    })
  })
}
