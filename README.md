# Coretrix

The coretrix is an application for private tutors in Egypt to help them organize their workflow.

## Installing Packages

```sh
yarn install
```

## Requirements

* MongoDB version 3.2

## Initializing the database

You have to restore the MongoDB snapshot for the application to work.
Run the MongoDB server, then run the following command:

```sh
mongorestore snapshot
```