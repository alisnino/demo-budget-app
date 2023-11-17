# Getting started

## Requirements

- Docker

### Docker を使わずにローカルで yarn workspaces を動かしたい場合

- Node (v20.2.0)
- Yarn (v4.0.2 - corepack でインストール)

Yarn Workspaces を使ったクリーンアーキテクチャ（の勉強のため）の構成になっています。
開発環境ではルートフォルダをマウントしているので、下記コマンドのどれかを実行すれば全部の`node_modules`がインストールされます。

```
docker compose run frontend yarn workspace @services/frontend install
docker compose run backend yarn workspace @services/backend install
```

# Migration

## Migration ファイル作成

```
docker compose run prisma yarn workspace @packages/prisma prisma migrate dev --name <migration-name>
```

※日付は自動で追加されるので、変更の概要だけ<migration-name>に入力してください。

## マイグレーション実行

```

docker compose run prisma yarn workspace @packages/prisma prisma migrate dev --skip-seed
```
