# DIMLIM

Open source code for the chat application: DIMLIM

<br />

## Setup

#### Prerequisites

-   An operating system capable of running UNIX commands, such as Linux, macOS, or WSL on Windows
-   A connection to the internet
-   Node.js v16.17.0 or higher
-   Typescript support (tsc and ts-node)

<br />

#### Installing

First we need to clone the project into the machine:

```bash
git clone https://github.com/Asterki/dimlim.git
```

Get into the folder

```bash
cd dimlim
```

Run the next command, which will automatically set up _most_ of the app:

```bash
npm run setup
```

<br />

#### Environment Variables

The environment variables should be saved in a `.env` file, and will need to contain the following keys:

| Key            | Type    | Description                                       | Default    | Required                           | Example                        |
| -------------- | ------- | ------------------------------------------------- | ---------- | ---------------------------------- | ------------------------------ |
| PORT           | Number  | The port our server will listen to                | 8080       | False                              | 80                             |
| HOST           | String  | The URL of our server, without the / at the end   | None       | True                               | <http://example.com>           |
| SESSION_SECRET | String  | The key that will be used to encrypt the sessions | An UUID v4 | False, but recommendable to change | DK2h2vBb771PL57E7PejhIwZWSY1sL |
| COOKIE_SECURE  | Boolean | If the cookie will work under SSL                 | false      | False                              | true                           |
| COOKIE_MAX_AGE | Number  | How long the session will last (in miliseconds)   | 604800000  | False                              | 2419200000                     |
| EMAIL_HOST     | string  | The host of your email service                    | None       | True                               | smtp.gmail.com                 |
| EMAIL_PORT     | number  | The port of your email service                    | None       | True                               | 465                            |
| EMAIL_SECURE   | boolean | If your email service works over SSL              | None       | True                               | true                           |
| EMAIL_USER     | string  | The email account                                 | None       | True                               | email@example.com              |
| EMAIL_PASS     | string  | The email account's password                      | None       | True                               | keyboardcat                    |

<br /><br />

## Screenshots

![Register Page](https://www.imgbly.com/ib/plKEO0l67F.png)

![Main Page](https://www.imgbly.com/ib/KG1MH3AA05.png)

![2FA Page](https://www.imgbly.com/ib/L9CLE4KMfJ.png)

<https://streamable.com/6eca20>

<br />
<br />

## Important

This app was made with the purpose of running in the same server, servers as ngnix are not yet supported

<br />
<br />

## Contact

asterki.dev@proton.me
