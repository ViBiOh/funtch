workflow "Publish packages" {
  on = "push"
  resolves = ["GitHub Action for npm"]
}

action "Install" {
  uses = "actions/npm@master"
  args = "install"
}

action "Build" {
  uses = "actions/npm@master"
  needs = ["Install"]
  args = "run ci"
}

action "Publish" {
  uses = "actions/npm@master"
  needs = ["Build"]
  args = "publish"
  secrets = ["NPM_AUTH_TOKEN"]
}
