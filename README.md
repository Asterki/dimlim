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

Run the next command, which will automatically set up *most* of the app:

```bash
$ npm run setup
```

Then we need to configure our mail client, to do this, you need to edit the file at `/server/config/mail.ts`

- **host:** Our mail host, example: `smtp.gmail.com.`
- **port:** The port of the mail host, example: `465.`
- **secure:** If the host uses SSL, example `true`.
- **user:** Our mail user, provided by our domain provider.
- **pass:** The password of our mail user, also provided by our domain provider.



#### Environment Variables

The environment variables should be saved in a `.env` file, and will need to contain the following keys:

| Key               | Type    | Description                                        | Default    | Required                                                     | Example                          |
| ----------------- | ------- | -------------------------------------------------- | ---------- | ------------------------------------------------------------ | -------------------------------- |
| PORT              | Number  | The port our server will listen to                 | 8080       | False                                                        | 80                               |
| HOST              | String  | The URL of our server, without the / at the end    | None       | True                                                         | http://example.com               |
| SESSION_SECRET    | String  | The key that will be used to encrypt the sessions  | An UUID v4 | False, but recommendable to change                           | DK2h2vBb771PL57E7PejhIwZWSY1sL   |
| COOKIE_SECURE     | Boolean | If the cookie will work under SSL                  | false      | False                                                        | true                             |
| COOKIE_MAX_AGE    | Number  | How long the session will last (in miliseconds)    | 604800000  | False                                                        | 2419200000                       |


#### Contact

asterki.dev@proton.me
