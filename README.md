# DIMLIM

Open source code for the chat application: DIMLIM



## Setup

#### Prerequisites

- An operating system capable of running UNIX commands, such as Linux, macOS, or WSL on Windows
- A connection to the internet
- Node.js v16.17.0 or higher
- Typescript support (tsc and ts-node)



#### Installing

First we need to clone the project into the machine:

```bash
$ git clone https://github.com/Asterki/dimlim.git
```

 Get into the folder 

```bash
$ cd dimlim
```

Run the next command, which will automatically set up the app:

```bash
$ npm run setup
```



#### Environment Variables

The environment variables should be saved in a .env file, and will need to contain the next keys:

| Key            | Type   | Description                                       | Default | Required | Example                        |
| -------------- | ------ | ------------------------------------------------- | ------- | -------- | ------------------------------ |
| PORT           | Number | The port our server will listen to                | 8080    | False    | 80                             |
| HOST           | String | The URL of our server, without the / at the end   | None    | True     | http://example.com             |
| SESSION_SECRET | String | The key that will be used to encrypt the sessions | None    | True     | DK2h2vBb771PL57E7PejhIwZWSY1sL |

 

#### Contact

asterki.dev@proton.me
