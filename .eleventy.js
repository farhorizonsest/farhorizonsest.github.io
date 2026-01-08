module.exports = function(eleventyConfig) {
    // 1. Passthrough Copy: Take "src/assets" and output it to "_site/assets"
    eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
    
    // 2. Watch Targets: Tell 11ty to rebuild if you change CSS/JS inside src
    eleventyConfig.addWatchTarget("./src/assets/css/");
    eleventyConfig.addWatchTarget("./src/assets/js/");

    return {
        dir: {
            input: "src",      // Your html files are here
            output: "docs",   // Build destination
            includes: "_includes" // Layouts
        },
        templateFormats: ["html", "njk", "md"],
        htmlTemplateEngine: "njk",
        markdownTemplateEngine: "njk"
    };
};