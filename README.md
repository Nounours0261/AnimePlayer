# AnimePlayer

I could not find a video player I liked, so I made one myself

## Setup

- Move your anime files to the `public` directory.
- Run `npm install` to install the dependencies.

## Running (http, localhost)

These steps get the website running faster, but it's hosted on `localhost` and you
might get security warnings in your browser.

- Run `npm run dev` to start the server
- Open http://localhost:45510 in your favorite browser !

## Running (https, custom url)

These steps require a little more configuration but allow to host the website on a
custom url `animeplayer.nours` and remove the security warnings in your browser.

### Additional setup

- `cd` to the `ssl` folder and run `setup_certs.sh`
- Add `noursDevCA.crt` to your browser's certificate store
- Create an entry in `/etc/hosts` that associates `animeplayer.nours` to the local
  address (`127.0.0.1` in IPv4, `::1` in IPv6)

### Steps

- Run `sudo npm run devs` to start the server
- Open https://animeplayer.nours in your favorite browser !

## Credit

The icon for the website was created using a teddy bear icon design by
Freepik uploaded to
[Flaticon](https://www.flaticon.com/free-icons/teddy-bear), poorly
modified by me.

I used
[this awesome guide](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Audio_and_video_delivery/cross_browser_video_player)
as a reference for this project.