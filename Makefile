SHELL = /bin/bash

ifneq ("$(wildcard .env)","")
	include .env
	export
endif

## help: Display list of commands
.PHONY: help
help: Makefile
	@sed -n 's|^##||p' $< | column -t -s ':' | sort

.PHONY: init
init:
	@curl -q -sSL --max-time 10 "https://raw.githubusercontent.com/ViBiOh/scripts/master/bootstrap" | bash -s "git_hooks"
