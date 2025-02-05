# Chemins des logs et fichiers PID
LOG_DIR=logs
PID_FILE=$(LOG_DIR)/server.pids

# Commandes pour Node.js et Angular
NODE_CMD=node monserver.js
ANGULAR_CMD=ng serve --port 3206

# Cibles Makefile

.PHONY: up down clean

# Démarrer Node.js et Angular
up:
	@mkdir -p $(LOG_DIR)
	@echo "Démarrage du serveur Node.js..."
	@nohup $(NODE_CMD) > $(LOG_DIR)/node.log 2>&1 & echo $$! > $(PID_FILE)
	@sleep 2
	@echo "Démarrage d'Angular..."
	@nohup $(ANGULAR_CMD) > $(LOG_DIR)/angular.log 2>&1 & echo $$! >> $(PID_FILE)
	@echo "Serveurs démarrés !"

# Arrêter les processus en cours
down:
	@if [ -f $(PID_FILE) ]; then \
		echo "Arrêt des serveurs..."; \
		kill $$(cat $(PID_FILE)) 2>/dev/null || true; \
		rm -f $(PID_FILE); \
		echo "Serveurs arrêtés."; \
	else \
		echo "Aucun serveur en cours d'exécution."; \
	fi

# Nettoyage des logs et fichiers PID
clean:
	@rm -rf $(LOG_DIR)
	@echo "Logs et fichiers PID supprimés."
