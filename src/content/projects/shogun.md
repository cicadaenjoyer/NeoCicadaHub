---
title: Shogun
line: Self-hosted media streaming for friends and family
order: 1
thumb: ../../assets/projects/shogun/1.webp
tone: navy
platform: Web
team: Solo project
stack: [C#, ASP.NET Core, Firebase, React, TypeScript]
link: https://github.com/cicadaenjoyer/shogun
images:
  - { src: ../../assets/projects/shogun/1.webp, caption: "How the web app, hub and server connect" }
featured:
  art: shot
  shot: ../../assets/projects/shogun/1.webp
---

A self-hosted media server I'm building, still in early development. Owners run Shogun Server on their own hardware and invite friends and family to stream their movies, shows and music. I designed it in three parts: a C# and ASP.NET Core server, a Firebase hub for accounts, groups and chat, and a React web app. Media streams straight from the owner's server and never passes through the hub. Servers never see passwords, because viewers present a short-lived pass signed by the hub, and each server keeps its own copy of members and permissions so it keeps working if the hub goes down. The server's data layer, tests and CI are in place; most features are still planned.
