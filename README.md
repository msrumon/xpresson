# xpresson

This is a simple blogging app built with [ExpressJS](https://expressjs.com). Users can register/login, create posts and like/comment to other posts. I have built it as a future reference for myself, but you are free to use it as long as **you obey the licensing terms**. I have used [SQLite](https://www.sqlite.org) database for this project, which requires no additional setup on any machine running this app. You need to install [Node.js](https://nodejs.org) though, since ExpressJS is a Node.js framework.

## Running

Running this app is very simple. You download/clone the repository, open a terminal and run these 2 commands:

```bash
docker build --tag xpresson .
```

```bash
docker run --publish 4321:4321 --detach xpresson
```

Now, open a browser and go to [`http://localhost:4321`](http://localhost:4321). You should see the homepage with no posts. You can now register for an account and add posts.

> When you're done, you can remove the container by running `docker rm --force $(docker ps --filter "ancestor=xpresson" --quiet)` command. Also remove the image by running `docker rmi --force xpresson` command.

## Bug Report

If you find any bug, open an issue here in this repository. Any private contacts regarding this project will be disregarded.
