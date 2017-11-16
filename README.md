# Assess web servers
Command-line utility to assess web servers. A web server 'consents' to be assessed by returning its domain when it is sent a request for the `/assess_me` URL.
## Installation
```
  $ npm install -g assess-webserver
```
in which case the utility is globally installed, or
```
  $ cd some-directory
  $ npm install assess-webserver
  $ npm link
```
if you want to confine its use to `some-directory`.
# Usage
The utility is self-documenting:
```
  $ assess-server -h
```
Note the difference between the name of the module and the command.

Invoking `assess-server` with the `-h` or `--help` flag results in a list and brief description of the subcommands. In the current version, the only supported subcommands are `legit`, `https-only` and `all-checks`. The former tests whether the host is accepting HTTPS requests and consents in being assessed, e.g.
```
$ assess-server legit www.softwarewolves.net
    www.softwarewolves.net is alive
    www.softwarewolves.net to be assessed
$
```
`https-only` tests whether the web app is also available over plain HTTP.
`all-checks` combines all checks.
