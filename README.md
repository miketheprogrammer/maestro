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
    "address": "10.0.2.55",
    "_docker": {
      "modem": {
        "host": "http://10.0.2.55",
        "port": 4243,
        "protocol": "http"
      }
    },
    "containers": [
      {
        "Id": "6b3897b981534b178e6f9b2bf0cff650f5609d391a09277454dc069f48ef1e7e",
        "Names": [
          "/evil_austin"
        ],
        "Image": "minerapp/docker-zygote-generator",
        "ImageID": "2d229360e11aa3a6faeec6287bb64bce684350b822147f07d78ead465f834eba",
        "Command": "/bin/sh -c ./run.sh",
        "Created": 1449760164,
        "Ports": [
          {
            "IP": "0.0.0.0",
            "PrivatePort": 4100,
            "PublicPort": 3001,
            "Type": "tcp"
          }
        ],
        "Labels": {
          "com.application.name": "docker-zygote-generator"
        },
        "Status": "Up 36 hours",
        "HostConfig": {
          "NetworkMode": "default"
        }
      },
      {
        "Id": "55da80f09854aa07403016458df937365203398406dda74ff716760a0b31f41c",
        "Names": [
          "/adoring_torvalds"
        ],
        "Image": "1bff21c70bb4cb4029d3db318e895679ca043b4d876848f98bae24e13bc77341",
        "ImageID": "1bff21c70bb4cb4029d3db318e895679ca043b4d876848f98bae24e13bc77341",
        "Command": "/bin/sh run_env.sh",
        "Created": 1449420802,
        "Ports": [
          {
            "IP": "0.0.0.0",
            "PrivatePort": 5000,
            "PublicPort": 32768,
            "Type": "tcp"
          }
        ],
        "Labels": {
          "com.registry.name": "dev-search"
        },
        "Status": "Up 5 days",
        "HostConfig": {
          "NetworkMode": "default"
        }
      },
      {
        "Id": "c18bd544a62d3c210eb73ead77f3b60f126769f8a7bed365efa53a76df26302c",
        "Names": [
          "/determined_torvalds"
        ],
        "Image": "minerapp/registration-service",
        "ImageID": "439300b4d7e3844ebd265d8439b7443c8a213ddb3095ae9aac52ed9a871d7cca",
        "Command": "/bin/sh -c ./run.sh",
        "Created": 1449420723,
        "Ports": [],
        "Labels": {},
        "Status": "Up 5 days",
        "HostConfig": {
          "NetworkMode": "host"
        }
      },
      {
        "Id": "2d3edb4c8a62d27ea0d51a21a3cd2d4ada5624049cd84f5d285baca1884d8c15",
        "Names": [
          "/sharp_hamilton"
        ],
        "Image": "minerapp/ip-service",
        "ImageID": "a67cfd8bcdcefca4891054dc791ca7cb1a5d1f8ff32e9684c0978d625700411d",
        "Command": "/bin/sh -c ./run.sh",
        "Created": 1449351424,
        "Ports": [],
        "Labels": {},
        "Status": "Up 5 days",
        "HostConfig": {
          "NetworkMode": "host"
        }
      }
    ]
  },
  {
    "address": "10.0.2.56",
    "_docker": {
      "modem": {
        "host": "http://10.0.2.56",
        "port": 4243,
        "protocol": "http"
      }
    },
    "containers": [
      {
        "Id": "af0fd3e89fddf50e08e4ce69e53c50158cf587a5d1b1da10d5610571de3ae42f",
        "Names": [
          "/elated_einstein"
        ],
        "Image": "charlesxiong/node-hello",
        "ImageID": "c15d78c7639e42167f5747e7769d840d3b45d174c5a69d6aa17fbac845fd0a62",
        "Command": "node /src/index.js",
        "Created": 1449614068,
        "Ports": [
          {
            "IP": "0.0.0.0",
            "PrivatePort": 8080,
            "PublicPort": 33001,
            "Type": "tcp"
          }
        ],
        "Labels": {
          "com.application.name": "hello"
        },
        "Status": "Up 3 days",
        "HostConfig": {
          "NetworkMode": "default"
        }
      },
      {
        "Id": "b3d18504b1eafb53e7c45f7b52c73a2a9aa5fc3927ca3b7f5c30bc0efc127f67",
        "Names": [
          "/desperate_bhaskara"
        ],
        "Image": "charlesxiong/node-hello",
        "ImageID": "c15d78c7639e42167f5747e7769d840d3b45d174c5a69d6aa17fbac845fd0a62",
        "Command": "node /src/index.js",
        "Created": 1449614067,
        "Ports": [
          {
            "IP": "0.0.0.0",
            "PrivatePort": 8080,
            "PublicPort": 33000,
            "Type": "tcp"
          }
        ],
        "Labels": {
          "com.application.name": "hello"
        },
        "Status": "Up 3 days",
        "HostConfig": {
          "NetworkMode": "default"
        }
      },
      {
        "Id": "f0dfd5e79ead59394b50216cacc3272111bdcccdb71dc549d2afaef6e84ce52e",
        "Names": [
          "/determined_swirles"
        ],
        "Image": "charlesxiong/node-hello",
        "ImageID": "c15d78c7639e42167f5747e7769d840d3b45d174c5a69d6aa17fbac845fd0a62",
        "Command": "node /src/index.js",
        "Created": 1449613252,
        "Ports": [
          {
            "IP": "0.0.0.0",
            "PrivatePort": 8080,
            "PublicPort": 32999,
            "Type": "tcp"
          }
        ],
        "Labels": {
          "com.application.name": "hello"
        },
        "Status": "Up 3 days",
        "HostConfig": {
          "NetworkMode": "default"
        }
      },
      {
        "Id": "b478eb923f1b0b54e0f26e2e610b74378f8b79d7cf264a46c139c6bfa16f1935",
        "Names": [
          "/agitated_tesla"
        ],
        "Image": "charlesxiong/node-hello",
        "ImageID": "c15d78c7639e42167f5747e7769d840d3b45d174c5a69d6aa17fbac845fd0a62",
        "Command": "node /src/index.js",
        "Created": 1449613251,
        "Ports": [
          {
            "IP": "0.0.0.0",
            "PrivatePort": 8080,
            "PublicPort": 32998,
            "Type": "tcp"
          }
        ],
        "Labels": {
          "com.application.name": "hello"
        },
        "Status": "Up 3 days",
        "HostConfig": {
          "NetworkMode": "default"
        }
      }
    ]
  }
]
```
```
