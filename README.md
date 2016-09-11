### LivePaint

LivePaintは、ペイントアプリとライブ配信を合わせたサービスです。
ブラウザの中のキャンバスに描きこむだけで、簡単に制作風景を配信できます。  
また、視聴者はライブ配信を見ながら絵を描き、その絵をコメントとして送信することもできます。

9/10に開催された、[NTTコミュニケーションズ1day開発ワークショップ](http://nttcommunications-workshop2016.strikingly.com)で開発しました。

## 使い方

1. 視聴者は[index.html](https://ammohg.github.io/live-paint/index.html)にアクセス
1. 視聴者が揃ったら、放送者は[host.html](https://ammohg.github.io/live-paint/host.html)にアクセス

[放送者](https://ammohg.github.io/live-paint/host.html)よりも先に[視聴者](https://ammohg.github.io/live-paint/index.html)がアクセスすること。
現在、後からのアクセスでは視聴できません。

また、通信にWebRTCを使用しています。WebRTC対応ブラウザを使用してください。

## TODO
- 1dayワークショップの時にできなかったバグ取り
- ライブ機能の強化
- ペイントアプリ部分の機能追加
