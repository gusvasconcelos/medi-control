# Docker Configuration Files

Este diretório contém os arquivos de configuração para o ambiente Docker do MediControl.

## Arquivos

### `entrypoint.sh`
Script de inicialização da aplicação Laravel. Executado quando o container `app` ou `horizon` inicia.

**Funções:**
- Aguarda o PostgreSQL estar pronto
- Executa migrations (se `RUN_MIGRATIONS=true`)
- Cache de configurações do Laravel
- Cria link de storage
- Define permissões corretas

### `Caddyfile`
Configuração do servidor web FrankenPHP (Caddy + PHP).

**Recursos:**
- Servidor PHP integrado
- Compressão gzip/zstd
- Headers de segurança
- Logs em JSON
- Servir arquivos estáticos

### `init-db.sql`
Script de inicialização do PostgreSQL. Executado automaticamente na primeira criação do banco.

**Extensões instaladas:**
- `unaccent` - Buscas sem acentuação
- `uuid-ossp` - Geração de UUIDs
- `pg_trgm` - Busca fuzzy/similaridade

**Nota:** Este script só é executado quando o volume do PostgreSQL é criado pela primeira vez. Se você precisar executá-lo novamente, remova o volume:
```bash
make clean  # Remove todos os volumes
make init   # Reinicia do zero
```

### `nginx.conf.example`
Exemplo de configuração Nginx para usar como reverse proxy.

**Recursos:**
- Redirect HTTP → HTTPS
- Configuração SSL/TLS
- Headers de segurança
- Proxy para FrankenPHP
- Cache de arquivos estáticos

## Uso

Esses arquivos são automaticamente utilizados pelo `docker-compose.yml`. Não é necessário executá-los manualmente.

Para customizar:

1. **Adicionar extensões PostgreSQL**: Edite `init-db.sql`
2. **Mudar configuração web**: Edite `Caddyfile`
3. **Customizar inicialização**: Edite `entrypoint.sh`
4. **Configurar Nginx**: Use `nginx.conf.example` como base

## Observações

- Todos os scripts devem ter permissão de execução (chmod +x)
- O `init-db.sql` só roda na primeira inicialização do banco
- Mudanças no `Caddyfile` requerem rebuild: `make deploy`
- Mudanças no `entrypoint.sh` requerem rebuild: `make deploy`
