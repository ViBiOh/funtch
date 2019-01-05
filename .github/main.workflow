workflow "Publish packages" {
  on = "push"
  resolves = ["Build"]
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
