const fs = require("fs");

async function getTheiaPlugins(theiaVersion) {
    let response = await fetch(`https://raw.githubusercontent.com/eclipse-theia/theia/v${theiaVersion}/dev-packages/application-package/src/api.ts`)
    const vscodeVersion = (await response.text()).match(/DEFAULT_SUPPORTED_API_VERSION = '(\d+\.\d+\.\d+)'/)[1];
    response = await fetch("https://open-vsx.org/api/vscode/");
    const data = await response.json();
    const theiaPlugins = {};
    for (const [k, v] of Object.entries(data.extensions)) {
        const extensionName = `vscode-builtin-${k}`;
        response = await fetch(`${v}/${vscodeVersion}`);
        if (response.ok) {
            theiaPlugins[extensionName] = `${v}/${vscodeVersion}/file/vscode.${k}-${vscodeVersion}.vsix`;
        }
        console.log((response.ok ? "✔️ " : "❌ ") + extensionName);
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    return theiaPlugins;
}

(async () => {
    const theiaVersion = process.argv[2];
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
