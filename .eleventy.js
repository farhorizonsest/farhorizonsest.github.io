module.exports = function(eleventyConfig) {
    // FORCE 11ty to copy the assets folder into the docs folder
    eleventyConfig.addPassthroughCopy("src/assets");
    
    // Watch targets for development
    eleventyConfig.addWatchTarget("./src/assets/css/");
    eleventyConfig.addWatchTarget("./src/assets/js/");
    eleventyConfig.addWatchTarget("./src/assets/json/");

    return {
        dir: {
            input: "src",
            output: "docs",
            includes: "_includes"
        },
        templateFormats: ["html", "njk", "md"],
        htmlTemplateEngine: "njk",
        markdownTemplateEngine: "njk"
    };
};