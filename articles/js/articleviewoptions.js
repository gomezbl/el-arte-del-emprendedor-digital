$(document).ready( function() {
    MantraAPI.OnArticleView = function(size) {
        let contentFontSizes = [18,22,32];
        let subtitleFontSizes = [16,20,26];
        let contentLineHeights = [32,42,58];
        let subtitleLineHeights = [28,36,46];
        let writtenBySizes = [11, 14, 18];
        let authorBySizes = [13, 17, 22];

        $("#articlecontent").css("font-size", contentFontSizes[size]+"px");
        $(".articlesubtitle").css("font-size", subtitleFontSizes[size]+"px");
        $(".articlesubtitle").css("line-height", subtitleLineHeights[size]+"px");
        $(".writtenby").css("font-size", writtenBySizes[size]+"px");
        $(".articleauthor").css("font-size", authorBySizes[size]+"px");
        $("#articlecontent").css("line-height", contentLineHeights[size]+"px");
    }
});