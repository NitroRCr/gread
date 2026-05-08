# 自部署指南

你可以使用 Docker 自部署 Gread。

以 Docker Compose 为例。创建一个 `docker-compose.yml` 文件：

```yaml
services:
  gread:
    image: krytro/gread:latest
    container_name: gread
    restart: unless-stopped
    ports:
      - "3000:3000"
    volumes:
      - gread-data:/data
    environment:
      - GITHUB_TOKEN=your_github_token
      - OPENAI_API_KEY=your_api_key
      - OPENAI_BASE_URL=base_url_of_your_provider
      - OPENAI_MODEL=model_name

volumes:
  gread-data:
```

然后启动服务：

```bash
docker-compose up -d
```

完整的环境变量列表可参考 [.env.example](https://github.com/NitroRCr/gread/blob/main/.env.example)
