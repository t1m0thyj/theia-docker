# Theia Docker

Based on https://github.com/theia-ide/theia-apps

## How to Use

```shell
docker run -it --init --name theia -p 3000:3000 --cap-add=IPC_LOCK t1m0thyj/theia-alpine:keytar
docker cp <path-to-vsix> theia:/home/theia/plugins
```

To use Theia, navigate to `http://localhost:3000` in your browser.

To install the VSIX, navigate to the Extensions panel in Theia and select "Install from VSIX", then browse to the file you copied into the container.

## TODO

* [ ] Fix live reload of extensions not working
* [ ] Test unlocking keyring and using Keytar
