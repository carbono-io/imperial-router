# Imperial Router Module

Description
===========
Serves as a proxy for the Imperial Modules

Installation and Running
============
## Basic Install
```npm install```

```node .```

## With Service Discovery
You can easily use these mocks with a real module if etcd (a service discovery)
is running in your local machine:

1. [Start etcd service](https://github.com/coreos/etcd/releases/)
2. Set ETCD_SERVER as an environment variable, with the url where etcd is
responding:
    * `export ETCD_SERVER=localhost:2379`
3. Clean all possible old service registries:
    * `curl http://localhost:2379/v2/keys/backends/mc?recursive=true -XDELETE`
    * `curl http://localhost:2379/v2/keys/backends/dcm?recursive=true -XDELETE`
4. Run `node .`. It will listen at the port defined in `config` folder.

Tests and Dev
=============
```gulp test```
*Hint:* To run tests, you must have a etcd server running and also the mocks project
