# Chemins des fichiers PID et logs
NODE_LOG=node.log
ANGULAR_LOG=angular.log
PID_FILE=server.pids

# Commandes pour Node.js et Angular
NODE_CMD=node monserver.js
ANGULAR_DIR=CERISoNetApp
ANGULAR_CMD=ng serve --host pedago.univ-avignon.fr --port 3206
ANGULAR_BUILD_CMD=ng build

# Cibles Makefile

.PHONY: up down clean build

# Démarrer Node.js et Angular
up:
	@echo "Démarrage du serveur Node.js..."
	@nohup $(NODE_CMD) > logs/$(NODE_LOG) 2>&1 & echo $$! > logs/$(PID_FILE)
	@sleep 2
	@echo "Démarrage d'Angular..."
	@cd $(ANGULAR_DIR) && nohup $(ANGULAR_CMD) > ../logs/$(ANGULAR_LOG) 2>&1 & echo $$! >> logs/$(PID_FILE)
	@echo "Serveurs démarrés !"

# Arrêter les processus en cours
down:
	@if [ -f logs/$(PID_FILE) ]; then \
        echo "Arrêt des serveurs..."; \
        kill $$(cat logs/$(PID_FILE)) 2>/dev/null || true; \
        rm -f logs/$(PID_FILE); \
        echo "Serveurs arrêtés."; \
    else \
        echo "Aucun serveur en cours d'exécution."; \
    fi

# Nettoyage des logs et fichiers PID
clean:
	@rm -f logs/$(NODE_LOG) logs/$(ANGULAR_LOG) logs/$(PID_FILE)
	@echo "Logs et fichiers PID supprimés."

# Construire Angular et démarrer Node.js
build:
	@echo "Construction de l'application Angular..."
	@cd $(ANGULAR_DIR) && $(ANGULAR_BUILD_CMD)
	@echo "Démarrage du serveur Node.js..."
	@nohup $(NODE_CMD) > logs/$(NODE_LOG) 2>&1 & echo $$! > logs/$(PID_FILE)
	@echo "Application Angular construite et serveur Node.js démarré."