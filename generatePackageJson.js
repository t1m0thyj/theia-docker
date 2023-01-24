const fs = require("fs");
const outputPath = process.env.GITHUB_OUTPUT || process.stdout.fd;

async function getTheiaVersion() {
    let theiaVersion = process.argv[2];
    if (theiaVersion == null || theiaVersion === "latest") {
        const response = await fetch("https://raw.githubusercontent.com/eclipse-theia/theia/master/lerna.json");
        theiaVersion = (await response.json()).version;
    }
    fs.appendFileSync(outputPath, `THEIA_VERSION=${theiaVersion}\n`);
    return theiaVersion;
}

async function getTheiaPlugins(theiaVersion) {
    const theiaGitRef = theiaVersion !== "next" ? `v${theiaVersion}` : "master";
    const response = await fetch(`https://raw.githubusercontent.com/eclipse-theia/theia/${theiaGitRef}/package.json`);
    const theiaPlugins = (await response.json()).theiaPlugins;
    const builtinExtensionPack = "eclipse-theia.builtin-extension-pack";
    return { [builtinExtensionPack]: theiaPlugins[builtinExtensionPack] };
}

(async () => {
    const theiaVersion = await getTheiaVersion();
    const packageJson = JSON.parse(fs.readFileSync("package.json.template", "utf-8"));
    for (const k of Object.keys(packageJson.dependencies)) {
        packageJson.dependencies[k] = theiaVersion;
    }
    for (const k of Object.keys(packageJson.devDependencies)) {
        packageJson.devDependencies[k] = theiaVersion;
    }
    packageJson.theiaPlugins = await getTheiaPlugins(theiaVersion);
    fs.writeFileSync("theia.package.json", JSON.stringify(packageJson, null, 4) + "\n");
})();
