# EMDR Clicker

**Site:** [emdr-clicker.web.app](https://emdr-clicker.web.app/)

Simple web tool that provides
[bilateral stimulation](https://en.wikipedia.org/wiki/Bilateral_sound) for
[EMDR Therapy](https://en.wikipedia.org/wiki/Eye_movement_desensitization_and_reprocessing).

Hosted on Firebase, but this generates static HTML / JS / CSS so it can be
hosted anywhere, even locally.

## Contributing

Feel free to send pull requests, bugs, feature requests, etc.

In general, try to write accessible, performant, readable frontend code. Follow
the
[Google TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html)
where possible, or match style with existing code otherwise.

## Local Development

Build:
```shell
npm run build
```

Clean up generated files from build:
```shell
npm run clean
```

Watch for changes and rebuild dynamically:
```shell
npm run watch
```

Run local webserver that serves builds:
```shell
npm run serve
```
