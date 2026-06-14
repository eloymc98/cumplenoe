# Makefile — Cumple de Noe 🎂
# Atajos para desarrollo local. Usa pnpm por debajo.

# Puerto del servidor de desarrollo.
PORT ?= 3000

.DEFAULT_GOAL := help

.PHONY: help install dev build start lint typecheck check clean reset env

help: ## Muestra esta ayuda
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) \
		| awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-12s\033[0m %s\n", $$1, $$2}'

install: ## Instala dependencias con pnpm
	pnpm install

env: ## Crea .env.local a partir de .env.example (si no existe)
	@if [ ! -f .env.local ]; then \
		cp .env.example .env.local; \
		echo "✅ Creado .env.local — edítalo con tus valores"; \
	else \
		echo "ℹ️  .env.local ya existe, no se toca"; \
	fi

dev: ## Arranca el servidor de desarrollo (PORT=3000 por defecto)
	pnpm dev --port $(PORT)

build: ## Compila la build de producción
	pnpm build

start: build ## Compila y arranca la build de producción
	pnpm start --port $(PORT)

lint: ## Pasa el linter
	pnpm lint

test: ## Pasa los unit tests
	pnpm test

typecheck: ## Comprueba los tipos sin emitir
	pnpm exec tsc --noEmit

check: lint typecheck build ## Lint + tipos + build (lo que conviene antes de subir)

clean: ## Borra artefactos de build y caché
	rm -rf .next

reset: clean ## clean + reinstala dependencias desde cero
	rm -rf node_modules
	pnpm install
