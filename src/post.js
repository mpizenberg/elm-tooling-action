const core = require("@actions/core");
const cache = require("@actions/cache");

(async () => {
  try {
    const matchedKey = core.getState("MATCHED_KEY");
    const primaryKey = core.getInput("cache-key");
    if (matchedKey === primaryKey) {
      core.info("Primary cache hit was restored, no need to save cache");
    } else {
      await cache.saveCache([process.env.ELM_HOME], primaryKey);
    }
  } catch (error) {
    core.setFailed(error.message);
  }
})();
