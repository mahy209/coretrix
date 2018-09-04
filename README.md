# Coretrix

## Installing Packages

### NodeJS

Download NodeJS from [here] [nodejs]
Make sure that you download `Current` and not `LTS`

```sh
$ tar -xvf node-v...-linux-x64.tar.xz
$ sudo cp -r node-v...-linux-x64/* /usr/local/
```

Now you must add an environment variable in your `.bashrc`

```sh
$ nano ~/.bashrc
```

Then add these two lines

```sh
NODE_PATH=/usr/local/lib/node_modules
export NODE_PATH
```

### MongoDB

Just follow these commands

```sh
$ sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv EA312927
$ echo "deb http://repo.mongodb.org/apt/ubuntu "$(lsb_release -sc)"/mongodb-org/3.2 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.2.list
$ sudo apt-get update
$ sudo apt-get install -y mongodb-org
```

## Cloning repository and setting things up

* Go to [BitBucket Repository] [bitbucket]
* Click on the link on the upper-left corner
* Clone the repository
```sh
$ git clone [the link you got from bitbucket]
```
> You will be asked for your password... Enter bitbucket's password

Now open your terminal and type in this commands to copy some scripts to your `/usr/bin`

```sh
$ cd coretrix
$ ./setup
```

You can always remove them by simply

```sh
$ ./clearsetup
```

## Running the server

To run the MongoDB database instance

```sh
$ cd coretrix/
$ rundb
```

To run the NodeJS server instance

```sh
$ cd coretrix/
$ runserver
```

## Dependencies

Coretrix is currently using the following packages.

| Package | Usage |
| ------ | ------ |
| Express | Routing and organizing the website |
| MCrypt | Used for encryption |
| Cors | Supporting Cors for angular $http module |
| MongoDB | MongoDB Driver |
| performance-now | High Resolution Time logger for optimization purposes |
| object.values | Just a handy tool |
| body-parser | Express body parser |

## Development

Always pull new changes before making any
```sh
$ git pull
```

Never forget to test your code before pushing it to the repository
```sh
$ push '[commit message]'
```

## Javascript SDK

Visit [SDK] [sdk] for detailed info and here you have the [Constants] [constants]...

[bitbucket]: <https://bitbucket.org/themadprogrammer/coretrix>
[sdk]: <mds/sdk.md>
[constants]: <mds/constants.md>
[nodejs]: <https://nodejs.org/en/download/current/>


<!-- TODO -->
- explaining page  
