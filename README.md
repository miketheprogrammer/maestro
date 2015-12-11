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

