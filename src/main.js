const core = require("@actions/core");
const cache = require("@actions/cache");
const path = require("path");
const elmToolingCli = require("elm-tooling");

// Main
main();

// Helper functions ----------------------------------------

async function main() {
  try {
    // Read inputs
    const cacheKey = core.getInput("cache-key");
    const cacheRestoreKey = core.getInput("cache-restore-key");
    const elmToolingDir = core.getInput("elm-tooling-dir");

    // Set the ELM_HOME env variable
    const elmHome = getElmHome();
    core.exportVariable("ELM_HOME", elmHome);

    // Restore ELM_HOME cache
    const matchedKey = await cache.restoreCache([elmHome], cacheKey, [
      cacheRestoreKey,
    ]);
    if (matchedKey) {
      core.info(`Cache hit for key "${matchedKey}".`);
      core.saveState("MATCHED_KEY", matchedKey);
    }

    // Change directory to the one containing elm-tooling.json
    const currentDir = path.resolve(elmToolingDir ? elmToolingDir : ".");

    // Install Elm tools and add them to PATH
    const exitCode = await elmToolingCli(["install"], { cwd: currentDir });
    if (exitCode == 0) {
      core.addPath(path.join(currentDir, "node_modules", ".bin"));
    } else {
      core.setFailed("Failed to install tools");
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

function getElmHome() {
  if (process.env.ELM_HOME) {
    return process.env.ELM_HOME;
  } else if (process.platform === "win32") {
    return path.join(process.env.APPDATA, "elm");
  } else {
    return path.join(process.env.HOME, ".elm");
  }
}
