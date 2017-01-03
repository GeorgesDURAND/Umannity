(function () {
    angular
        .module('umannityApp')
        .config(configBlock);

    configBlock.$inject = ['$translateProvider'];

    function configBlock($translateProvider) {
        /*$translateProvider.useSanitizeValueStrategy('sanitize');*/
        $translateProvider.useSanitizeValueStrategy(null);
        $translateProvider.preferredLanguage('en_EN');
        $translateProvider.useStaticFilesLoader({
            prefix: 'l10n/',
            suffix: '.json'
        });
    }
})();