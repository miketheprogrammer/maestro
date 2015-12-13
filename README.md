# maestro
Description
----------------------
Maestro is a docker orchestration tool built on top of NodeJS. It is designed to make scaling docker containers easy.
All you need is a running consul deployment.


Features
----------------------
Easy deployments
Transparent Docker Remote API arguments
Discovery via consul
Uses docker daemon, so no hidden crazyness.
Uses labels to determine containers it is manageing
Plugin Architecture

Limitations
----------------------
Deployments are not seperate from apps. 

Unless you use an external deployment method, like git auto pull the docker image will not automatically update.

You can create a new app for deploys, and then scale down the old app as an alternative.

Also, new nodes added to the system may pull down a later version of the image then old nodes.

For this case we recommend always using tagging, and always only pushing to foreign when you are ready to do a deployment.

I plan to fix some of these issues by using a deployments object.



Plugins ( todo )
---------------------
maestro-autoscale-node ( auto scale aws and containers based on node event loop lag ) ( first to be coded )
  - how do we accomplish this
  -maybe peer process that jumps into each docker tagged with node
  and runs a pm2 describe and echo's out the evll. but that would be hard
  -maybe we force a contract, where a certain route is exposed on every container that provides evll
    -cleanest solution, but forces use of route
  -maybe we publish an npm module that can report back information to maestro
    -dirtier than route, and forces heavier rule
maestro-autoscale      ( auto scale aws and containers based on cpu and mem usage )

API
====
POST /applications
```javascript
{
  "name": "hello",
  "image": "charlesxiong/node-hello",
  "command": "",
  "scale": 4,
  "docker_options": {
    "ExposedPorts": {
      "8080/tcp": {
        "HostPort": "8081"
      }
    },
    "HostConfig": {
      "PublishAllPorts": true,
      "PortBindings-ignore": {
        "8080/tcp": [
          {
            "HostPort": "0"
          }
        ]
      }
    }
  },
  "options": {}
}
```

GET /application/:id

```javascript
{
  "name": "hello",
  "image": "charlesxiong/node-hello",
  "command": "",
  "options": {},
  "scale": 4,
  "dockerOptions": {
    "ExposedPorts": {
      "8080/tcp": {
        "HostPort": "8081"
      }
    },
    "HostConfig": {
      "PublishAllPorts": true,
      "PortBindings-ignore": {
        "8080/tcp": [
          {
            "HostPort": "0"
          }
        ]
      }
    }
  },
  "__raw": {
    "name": "hello",
    "image": "charlesxiong/node-hello",
    "command": "",
    "scale": 4,
    "dockerOptions": {
      "ExposedPorts": {
        "8080/tcp": {
          "HostPort": "8081"
        }
      },
      "HostConfig": {
        "PublishAllPorts": true,
        "PortBindings-ignore": {
          "8080/tcp": [
            {
              "HostPort": "0"
            }
          ]
        }
      }
    },
    "options": {}
  },
  "id": "hello"
}
```

GET /nodes

```javascript
[
  {
    "_docker": {
      "modem": {
        "socketPath": "/var/run/docker.sock",
        "protocol": "http"
      }
    },
    "containers": [
      {
        "Id": "7da93d1c79987c75cbf1e27c332cee21f401312abf7582aa04f9b573399d4ba3",
        "Names": [
          "/hungry_hypatia"
        ],
        "Image": "charlesxiong/node-hello",
        "Command": "node /src/index.js",
        "Created": 1449891568,
        "Ports": [
          {
            "IP": "0.0.0.0",
            "PrivatePort": 8080,
            "PublicPort": 32829,
            "Type": "tcp"
          }
        ],
        "Labels": {
          "com.application.name": "hello"
        },
        "Status": "Up 3 minutes",
        "HostConfig": {
          "NetworkMode": "default"
        }
      },
      {
        "Id": "a7e77dab62b75c761da92c4513038294a808ea3973983a9735340157b9cf4873",
        "Names": [
          "/thirsty_fermat"
        ],
        "Image": "charlesxiong/node-hello",
        "Command": "node /src/index.js",
        "Created": 1449891567,
        "Ports": [
          {
            "IP": "0.0.0.0",
            "PrivatePort": 8080,
            "PublicPort": 32828,
            "Type": "tcp"
          }
        ],
        "Labels": {
          "com.application.name": "hello"
        },
        "Status": "Up 3 minutes",
        "HostConfig": {
          "NetworkMode": "default"
        }
      },
      {
        "Id": "703d8b8a51bb5928b6526252d4c3c7086cbc6a042fccb94a55c8ee8b37d7c3f9",
        "Names": [
          "/hopeful_fermat"
        ],
        "Image": "charlesxiong/node-hello",
        "Command": "node /src/index.js",
        "Created": 1449891566,
        "Ports": [
          {
            "IP": "0.0.0.0",
            "PrivatePort": 8080,
            "PublicPort": 32827,
            "Type": "tcp"
          }
        ],
        "Labels": {
          "com.application.name": "hello"
        },
        "Status": "Up 3 minutes",
        "HostConfig": {
          "NetworkMode": "default"
        }
      },
      {
        "Id": "823464a34ea8c28647614abb9deeba8b54c6a2dbec2dde81a613f03fe81b35a6",
        "Names": [
          "/berserk_tesla"
        ],
        "Image": "charlesxiong/node-hello",
        "Command": "node /src/index.js",
        "Created": 1449891566,
        "Ports": [
          {
            "IP": "0.0.0.0",
            "PrivatePort": 8080,
            "PublicPort": 32826,
            "Type": "tcp"
          }
        ],
        "Labels": {
          "com.application.name": "hello-world"
        },
        "Status": "Up 3 minutes",
        "HostConfig": {
          "NetworkMode": "default"
        }
      },
      {
        "Id": "0ca2da3f3d007489927bc271e9dd37cd57478a69ef9f5699418da1b6097af9f7",
        "Names": [
          "/serene_mahavira"
        ],
        "Image": "charlesxiong/node-hello",
        "Command": "node /src/index.js",
        "Created": 1449891565,
        "Ports": [
          {
            "IP": "0.0.0.0",
            "PrivatePort": 8080,
            "PublicPort": 32825,
            "Type": "tcp"
          }
        ],
        "Labels": {
          "com.application.name": "hello"
        },
        "Status": "Up 3 minutes",
        "HostConfig": {
          "NetworkMode": "default"
        }
      },
      {
        "Id": "ddc1563022f77b19e1a167c297280897ce0dff87410ec4c17b0e85746b5a565b",
        "Names": [
          "/admiring_galileo"
        ],
        "Image": "charlesxiong/node-hello",
        "Command": "node /src/index.js",
        "Created": 1449891565,
        "Ports": [
          {
            "IP": "0.0.0.0",
            "PrivatePort": 8080,
            "PublicPort": 32824,
            "Type": "tcp"
          }
        ],
        "Labels": {
          "com.application.name": "hello-world"
        },
        "Status": "Up 3 minutes",
        "HostConfig": {
          "NetworkMode": "default"
        }
      },
      {
        "Id": "374ea321ad5668471333f295395dbdbfc2c5eadfe97ad90d04776a2bb509b3f5",
        "Names": [
          "/cocky_bell"
        ],
        "Image": "miketheprogrammer/maestro",
        "Command": "/bin/sh -c 'node index.js'",
        "Created": 1449890901,
        "Ports": [],
        "Labels": {},
        "Status": "Up 14 minutes",
        "HostConfig": {
          "NetworkMode": "host"
        }
      },
      {
        "Id": "4c01fc3b6ba633b3aed3997374d437a701423758684c04d3e28689bcdfc20a03",
        "Names": [
          "/stupefied_turing"
        ],
        "Image": "progrium/consul",
        "Command": "/bin/start -server -bootstrap -ui-dir /ui",
        "Created": 1449879757,
        "Ports": [
          {
            "PrivatePort": 8301,
            "Type": "udp"
          },
          {
            "IP": "0.0.0.0",
            "PrivatePort": 8500,
            "PublicPort": 8500,
            "Type": "tcp"
          },
          {
            "PrivatePort": 8302,
            "Type": "udp"
          },
          {
            "PrivatePort": 8301,
            "Type": "tcp"
          },
          {
            "PrivatePort": 8300,
            "Type": "tcp"
          },
          {
            "PrivatePort": 53,
            "Type": "tcp"
          },
          {
            "IP": "0.0.0.0",
            "PrivatePort": 8400,
            "PublicPort": 8400,
            "Type": "tcp"
          },
          {
            "IP": "0.0.0.0",
            "PrivatePort": 53,
            "PublicPort": 8600,
            "Type": "udp"
          },
          {
            "PrivatePort": 8302,
            "Type": "tcp"
          }
        ],
        "Labels": {},
        "Status": "Up 3 hours",
        "HostConfig": {
          "NetworkMode": "default"
        }
      }
    ]
  }
]
```
