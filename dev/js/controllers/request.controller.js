(function () {
    'use strict';

    angular
        .module('umannityApp.controllers')
        .controller('requestController', requestController);

    requestController.$inject = ['$scope', 'UserService', '$routeParams', 'RequestService', '$window', '$location'];

    function requestController($scope, UserService, $routeParams, RequestService, $window, $location) {
        /* jshint validthis: true */
        var vm = this;

        vm.name = "requestController";
        vm.candidatesListPicture = [];
        vm.skills = [];

        vm.setUserStatut = setUserStatut;

        vm.loadRequest = loadRequest;
        vm.mergeVolunteersData = mergeVolunteersData;
        vm.loadChosenVolunteerData = loadChosenVolunteerData;
        vm.loadVolunteersPicture = loadVolunteersPicture;

        vm.acceptRequest = acceptRequest;
        vm.preSelectUser = preSelectUser;
        vm.unSelectUser = unSelectUser;
        vm.isPreSelected = isPreSelected;
        vm.isCandidate = isCandidate;
        vm.isChosen = isChosen;
        vm.authorChose = authorChose;
        vm.SelectUser = SelectUser;
        vm.isCandidate2 = isCandidate2;

        vm.reportRequest = reportRequest;
        vm.deleteRequest = deleteRequest;
        vm.addAlert = addAlert;
        vm.closeAlert = closeAlert;

        vm.editRequest = editRequest;
        vm.getPicture = getPicture;
        vm.changeView = changeView;

        $scope.$on('$viewContentLoaded', onViewContentLoaded);
        ////

        function onViewContentLoaded () {
            vm.requestId = $routeParams.requestId;
            vm.user = UserService.getUser();
            vm.group = vm.user.group;
            loadRequest();
        }

        // Définie si l'utilisateur courant est Auteur / Bénévole choisi / ...
        function setUserStatut () {
            vm.status = "normal";
            if (vm.user.id === vm.author.id) { // AUTEUR
                vm.status = "author";
            } else if (vm.request.accepted_user !== null) { // Bénévole choisi
                if (vm.user.id === vm.volunteer.id) {
                    vm.status = "chosen_volunteer";
                }
            } else {
                vm.status = "normal";
            }
            console.log("Je suis un utilisateur => ",vm.status);
        }

        // Récupère les données liées à la demande d'aide
        function loadRequest () {
            var _loadRequest = {
                id: vm.requestId
            };
            RequestService.loadRequest(_loadRequest).then(function (Request) {
                vm.request = Request;
                vm.author = Request.author;
                //vm.authorId = vm.request.user_id;
                UserService.loadPicture(vm.author.id).then(function (picture) {
                    vm.authorPicture = picture;
                });
                setUserStatut();
                mergeVolunteersData();
                loadVolunteersPicture();
            }).catch(function(error) {
                //$location.path('/requestsList');
            });
        }

        function mergeVolunteersData () {
            angular.forEach(vm.request.pre_selected, function(pre_selected, key) {
                vm.request.candidates.push(pre_selected);
            });
        }

        // Récupère les images des bénévoles s'étant proposés pour aider
        function loadVolunteersPicture () {
            angular.forEach(vm.request.candidates, function(candidate, key) {
                var _loadVolunteersData = {
                    id: candidate.id
                };
                RequestService.loadUserPicture(_loadVolunteersData).then(function (dataPicture) {
                    var _candidatePicture = {
                        id: candidate.id,
                        picture: dataPicture.picture
                    };
                    console.log(_candidatePicture);
                    vm.candidatesListPicture.push(_candidatePicture);
                });
            });

            var _loadAcceptedUserData = {
                id: vm.request.accepted_user.id
            };
            RequestService.loadUserPicture(_loadAcceptedUserData).then(function (dataPicture) {
                var _acceptedUserPicture = {
                    id: vm.request.accepted_user.id,
                    picture: dataPicture.picture
                };
                vm.candidatesListPicture.push(_acceptedUserPicture);
            });

        }

        // Récupère les informations du bénévole choisi
        function loadChosenVolunteerData () {
            var _loadChosenVolunteerData = {
                id: vm.request.accepted_user
            };
            RequestService.loadUserData(_loadChosenVolunteerData).then(function (volunteer) {
                vm.volunteer = (volunteer);
                setUserStatut();
                console.log("Le bénévole choisi est : ", vm.volunteer);
            });
        }

        // Le bénévole propose son aide
        function acceptRequest () {
            RequestService.acceptRequest(vm.requestId).then(function (data) {
                loadRequest ();
            });
        }

        // Renvoi "true" si l'utilisateur est un candidat
        function isCandidate () {
            var showAcceptButton = false;
            angular.forEach(vm.request.candidates, function(candidate) {
                if (candidate.id === vm.user.id) {
                    showAcceptButton = true;
                    return showAcceptButton;
                }
            });
            return showAcceptButton;
        }

        // Renvoi "true" si l'utilisateur est un candidat
        function isCandidate2 (candidate_id) {
            var showAcceptButton = false;
            angular.forEach(vm.request.candidates, function(candidate) {
                if (candidate.id === candidate_id) {
                    showAcceptButton = true;
                    return showAcceptButton;
                }
            });
            return showAcceptButton;
        }

        // Renvoi "true" si l'utilisateur est l'utilisateur sélectionné / accepté / choisi
        function isChosen () {
            return (vm.user.id === vm.request.accepted_user.id);
        }

        // Renvoi "true" si l'utilisateur actuel est l'auteur et qu'il a choisi un bénévole pour l'aider
        function authorChose () {
            return (vm.user.id === vm.author.id && vm.request.accepted_user !== null);
        }

        // L'auteur présélectionne un bénévole et peut le contacter
        function preSelectUser (userId) {
            RequestService.preSelectUser(vm.requestId, userId)
                .then(function (data) {
                    loadRequest ();
                })
                .catch(function (returnError) {
                    vm.error = returnError.data.error;
                });
        }

        // L'auteur dé-sélectionne un bénévole
        function unSelectUser (userId) {
            RequestService.unSelectUser(vm.requestId, userId).then(function (data) {
                loadRequest ();
            });
        }

        // Renvoi "true" si l'utilisateur a déjà été pré-sélectionné
        function isPreSelected (userId) {
            var show = false;
            if (userId === undefined) {
                userId = vm.user.id;
            }
            angular.forEach(vm.request.pre_selected, function(preSelectedUser) {
                if (preSelectedUser.id === userId) {
                    show = true;
                }
            });
            return show;
        }

        // L'auteur sélectionne le bénévole qui l'aidera
        function SelectUser (userId) {
            RequestService.selectUser(vm.requestId, userId)
                .then(function (data) {
                    loadRequest();
                })
                .catch(function (returnError) {
                    vm.error = returnError.data.error;
                });
        }

        // Signaler la demande d'aide
        function reportRequest () {
            var _reportRequestData = {
                item_id: vm.requestId,
                message: "A user reported this post",
                type: "request"
            };
            RequestService.reportRequest(_reportRequestData)
                .then(function (data) {

                })
                .catch(function (returnError) {
                    vm.error = returnError.data.error;
                });
        }

        // Supprime la demande d'aide
        function deleteRequest () {
            RequestService.deleteRequest(vm.requestId)
                .then(function (data) {
                    $location.path('/requestsList');
                })
                .catch(function (returnError) {
                    vm.error = returnError.data.error;
                });
        }

        // Modifie les données de la demande d'aide
        function editRequest () {
            var formatedString = '';
            if (vm.requestDescription !== undefined) {
                formatedString = vm.requestDescription.replace(/\n/g,"<br/>");
            }

            var _editRequestData = {};
            if (vm.requestLocation === undefined) {
                _editRequestData = {
                    name: vm.requestName,
                    skills: vm.skills,
                    description: formatedString
                };
            } else {
                _editRequestData = {
                    name: vm.requestName,
                    description: formatedString,
                    skills: vm.skills,
                    location: vm.requestLocation.formatted_address
                };
            }
            RequestService.editRequest(vm.requestId,_editRequestData)
                .then(function (data) {
                    loadRequest();
                })
                .catch(function (returnError) {
                    vm.error = returnError.data.error;
                });
        }

        // Renvoie l'image des candidats
        function getPicture (candidateId) {
            var picture;
            angular.forEach(vm.candidatesListPicture, function(dataPicture) {
                if (dataPicture.id === candidateId) {
                    picture = dataPicture.picture;
                    return picture;
                }
            });
            return picture;
        }

        function changeView(viewName, requestId) {
            $location.path(viewName + requestId);
        }

        function addAlert(error) {
            if (vm.errors.indexOf(error) === -1) {
                if (vm.errors.length >= 4) {
                    vm.errors.splice(0, 1);
                }
                vm.errors.push(error);
            }
        }

        function closeAlert() {
            vm.error = undefined;
        }

    }
})();