# Self-Hosting

While we offer a ready-to-use service, you can also self-deploy Gread using Docker.

Taking Docker Compose as an example. Create a `docker-compose.yml` file:

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

Then start the service:

```bash
docker-compose up -d
```

For a complete list of environment variables, please refer to [.env.example](https://github.com/NitroRCr/gread/blob/main/.env.example)