---
title: C Database System
line: A SQL database written from scratch in C
order: 4
thumb: ../../assets/projects/cdb/1.webp
tone: dark
platform: Command line
team: Group project
stack: [C, GDB]
images:
  - src: ../../assets/projects/cdb/poster.webp
    caption: "Demo: creating a table, inserting rows and running queries"
    video: { mp4: /media/cdb/demo.mp4, webm: /media/cdb/demo.webm }
  - { src: ../../assets/projects/cdb/1.webp, caption: "Creating a table and inserting rows" }
  - { src: ../../assets/projects/cdb/2.webp, caption: "Updating a row and selecting the results" }
featured:
  art: shot
  shot: ../../assets/projects/cdb/2.webp
---

A custom database system built from scratch in C as a group project. It supports INSERT, DELETE and SELECT with subqueries. I designed the page splitting and buffer system for memory-to-disk operations, handled low-level binary I/O for persistence, wrote B+ tree insertion for faster queries, and worked on both the DDL and DML parsers, debugging memory issues with GDB.
