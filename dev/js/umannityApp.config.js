(function () {
    angular
        .module('umannityApp')
        .config(configBlock);

    configBlock.$inject = ['$translateProvider'];

    function configBlock($translateProvider) {
        /*$translateProvider.useSanitizeValueStrategy('sanitize');*/
        $translateProvider.useSanitizeValueStrategy(null);
        $translateProvider.preferredLanguage('fr_FR');
        $translateProvider.useStaticFilesLoader({
            prefix: 'l10n/',
            suffix: '.json'
        });
    }
})();