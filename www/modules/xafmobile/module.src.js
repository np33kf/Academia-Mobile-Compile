var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var DevExpress;
(function (DevExpress) {
    var ExpressApp;
    (function (ExpressApp) {
        var Mobile;
        (function (Mobile) {
            var DataSourcePropertyIsNullMode;
            (function (DataSourcePropertyIsNullMode) {
                DataSourcePropertyIsNullMode[DataSourcePropertyIsNullMode["SelectNothing"] = 0] = "SelectNothing";
                DataSourcePropertyIsNullMode[DataSourcePropertyIsNullMode["SelectAll"] = 1] = "SelectAll";
                DataSourcePropertyIsNullMode[DataSourcePropertyIsNullMode["CustomCriteria"] = 2] = "CustomCriteria";
            })(DataSourcePropertyIsNullMode || (DataSourcePropertyIsNullMode = {}));
            ;
            var wrapStore = function (mainStore, context, options) {
                var lookupStore = Object.create(mainStore);
                lookupStore.load = function (loadOptions) {
                    if (!options.url && options.dataSourcePropertyIsNullMode !== undefined) {
                        switch (options.dataSourcePropertyIsNullMode) {
                            case DataSourcePropertyIsNullMode.SelectNothing: return $.Deferred().resolve([]).promise();
                            case DataSourcePropertyIsNullMode.SelectAll: return mainStore.load(__assign({}, loadOptions, { filter: null }));
                            case DataSourcePropertyIsNullMode.CustomCriteria: return mainStore.load(__assign({}, loadOptions, { filter: options.dataSourcePropertyIsNullCriteria }));
                        }
                    }
                    else {
                        return mainStore.load(__assign({}, loadOptions, { urlOverride: options.url }));
                    }
                };
                lookupStore.byKey = function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    return lookupStoreByKey(args, context, options, lookupStore, mainStore);
                };
                return lookupStore;
            };
            function lookupStoreByKey(args, context, options, lookupStore, mainStore) {
                var key = args[0], model = context.$model, currentObjectKey = AppPlayer.compileGetter('model.CurrentObject.' + options.propertyName + '.' + lookupStore.key())({ model: model });
                if (currentObjectKey == key) {
                    var promise = new $.Deferred();
                    promise.resolve(AppPlayer.compileGetter('model.CurrentObject.' + options.propertyName)({ model: model }));
                    return promise.promise();
                }
                else {
                    return mainStore.byKey(args);
                }
            }
            Mobile.lookupStoreByKey = lookupStoreByKey;
            AppPlayer.Stores.StoreFactory.creators["xaf-lookup-store"] = function (options, application, context) {
                return wrapStore(application.stores[options.mainStoreId], context, options);
            };
            //test("Lookup data store", () => {
            //    var stores: { [key: string]: dxdata.Store } = {
            //        ContactStore: new dxdata.CustomStore({
            //            load: (options?: dxdata.LoadOptions) => {
            //                loadOptions = options;
            //                return $.Deferred().resolve([]).promise();
            //            }
            //        })
            //    },
            //        dataSourceConfig: AppPlayer.IDataSource = {
            //            id: "employee",
            //            store: {
            //                id: "testStore",
            //                mainStoreId: "ContactStore",
            //                type: "xaf-lookup-store",
            //                url: "$model.contact",
            //                lookupEmptyBehaviour: lookupEmptyBehaviourEnum.custom, // empty, all
            //                customCriteria: ["name", "test"]
            //            }
            //        },
            //        application = new TestApplication(),
            //        model = apm.createModel({
            //            model: [
            //                { name: "contact", defaultValue: "contactId" },
            //            ]
            //        }, application),
            //        loadOptions = null;
            //    AppPlayer.Stores.StoreFactory.creators["xaf-lookup-store"] = (options, application) => {
            //        return wrapStore(stores[options.mainStoreId], <any>options);
            //    }
            //    let dataSource = apd.createDataSource(dataSourceConfig, { $model: model }, stores, application);
            //    dataSource.load().then(() => {
            //        deepEqual(loadOptions, {
            //            "searchExpr": undefined,
            //            "searchOperation": "contains",
            //            "searchValue": null,
            //            "skip": 0,
            //            "take": 20,
            //            "userData": {}
            //        }, "normal load");
            //    });
            //    model.contact = null;
            //    dataSource.load().then(() => {
            //        deepEqual(loadOptions, {
            //            "filter": [
            //                "name",
            //                "test"
            //            ],
            //            "searchExpr": undefined,
            //            "searchOperation": "contains",
            //            "searchValue": null,
            //            "skip": 0,
            //            "take": 20,
            //            "userData": {}
            //        }, "custom filter");
            //    });
            //})
        })(Mobile = ExpressApp.Mobile || (ExpressApp.Mobile = {}));
    })(ExpressApp = DevExpress.ExpressApp || (DevExpress.ExpressApp = {}));
})(DevExpress || (DevExpress = {}));
var DevExpress;
(function (DevExpress_1) {
    var ExpressApp;
    (function (ExpressApp) {
        var Mobile;
        (function (Mobile) {
            function isWcfDataService($global) {
                return $global.ServiceUrl.indexOf('DataService.svc') !== -1;
            }
            //TODO Minakov must be changed somehow, see for example https://www.devexpress.com/Support/Center/Question/Details/T553077/add-header-to-customstore-fore-every-request
            $.ajaxSetup({
                xhrFields: {
                    withCredentials: true
                }
            });
            function ConvertToHex(colorValue) {
                var hexValue = '';
                if (typeof (colorValue) === "number") {
                    hexValue = (colorValue >>> 0).toString(16).slice(-6);
                }
                else {
                    colorValue.split(',').forEach(function (numb) {
                        var hex = Number(numb).toString(16);
                        if (hex.length < 2) {
                            hex = "0" + hex;
                        }
                        hexValue += hex;
                    });
                }
                return "#" + hexValue;
            }
            Mobile.ConvertToHex = ConvertToHex;
            ;
            function jsonStringifyWithDate(payload) {
                var dateToJSON = Date.prototype.toJSON;
                Date.prototype.toJSON = function () {
                    var self = this;
                    var localTime = new Date(self.getTime() - self.getTimezoneOffset() * 60000);
                    return localTime.toISOString();
                };
                var resultToJSON = JSON.stringify(payload);
                Date.prototype.toJSON = dateToJSON;
                return resultToJSON;
            }
            function executeAction(_a) {
                var actionId = _a.actionId, actionParameter = _a.actionParameter, $model = _a.$model, $global = _a.$global, $functions = _a.$functions;
                if (isWcfDataService($global)) {
                    var payload = {
                        ClickedActionId: actionId,
                        ClickedActionParameter: actionParameter,
                    };
                    if (!!$model) {
                        $.extend(true, payload, {
                            name: $model.name,
                            PreviousObjectsState: $model.PreviousObjectsState,
                            CurrentObject: $model.CurrentObject,
                            SelectedObjects: $model.SelectedObjects,
                            Criteria: $model.Criteria,
                            RootViewModel: $model.RootViewModel
                        });
                    }
                    var context = new DevExpress.data.ODataContext({
                        url: $global.ServiceUrl,
                        beforeSend: function (request) {
                            var resultToJSONStringifyWithDate = jsonStringifyWithDate(payload);
                            request.payload = {
                                parameter: resultToJSONStringifyWithDate
                            },
                                request.headers = {
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json'
                                };
                            $global.customizeRequestBeforeSend({ request: request, actionId: actionId, actionParameter: actionParameter, model: $model });
                        }
                    });
                    return context.invoke("ProcessRequest");
                }
                else {
                    var parameters = {};
                    if ($model) {
                        if ($model.CurrentObject) {
                            parameters['currentObject'] = $model.CurrentObject;
                        }
                        if ($model.PreviousObjectsState) {
                            parameters['objectsState'] = $model.PreviousObjectsState;
                        }
                        if ($model.SelectedObjects) {
                            parameters['selectedObjects'] = $model.SelectedObjects;
                        }
                        if ($model.Criteria) {
                            parameters['criteria'] = $model.Criteria;
                        }
                        if ($model.RootViewModel) {
                            parameters['rootViewModel'] = $model.RootViewModel;
                        }
                    }
                    if (actionId) {
                        parameters['actionId'] = actionId;
                        if (actionParameter !== undefined) {
                            parameters['actionParameter'] = actionParameter;
                        }
                    }
                    //var url;
                    var promise;
                    if (actionId) {
                        promise = getActionUrl($model, $global);
                    }
                    else {
                        promise = getModelUrl($model, $global);
                    }
                    //var deferred = $.Deferred();
                    return promise.then(function (url) {
                        //deferred.resolve();
                        return $.ajax({
                            url: url,
                            type: 'POST',
                            beforeSend: function (request) {
                                $global.customizeRequestBeforeSend({ request: request, actionId: actionId, actionParameter: actionParameter, model: $model });
                            },
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            },
                            data: jsonStringifyWithDate(parameters),
                            xhrFields: {
                                withCredentials: true
                            }
                        });
                    });
                    //return promise;
                    //return deferred.promise(); 
                }
            }
            //export function getAuthenticationModelUrl($model, $global) {
            //}
            function getViewDataUrl($model, $global, navigationActionId) {
                if (navigationActionId === void 0) { navigationActionId = undefined; }
                //var deferred = $.Deferred();
                return getModelUrl($model, $global, navigationActionId).then(function (url) {
                    //deferred.resolve(url.replace('/models', '/data'));
                    return url.replace('/models', '/data');
                });
                //return deferred.promise();
            }
            Mobile.getViewDataUrl = getViewDataUrl;
            function getActionUrl($model, $global, navigationActionId) {
                if (navigationActionId === void 0) { navigationActionId = undefined; }
                //var deferred = $.Deferred();
                return getModelUrl($model, $global, navigationActionId).then(function (url) {
                    return url.replace('/models', '/actions');
                });
                //return deferred.promise(); 
            }
            Mobile.getActionUrl = getActionUrl;
            function getModelUrl($model, $global, navigationActionId) {
                if (navigationActionId === void 0) { navigationActionId = undefined; }
                var url;
                if ($model && $model.ModelUrl) {
                    url = $model.ModelUrl;
                }
                else {
                    url = $global.ServiceUrl + '/models';
                    if ($model) {
                        url += '/' + $model.name;
                        if ($model.name.indexOf('_DetailView') !== -1) {
                            if ($model.CurrentObject && $model.CurrentObjectKeyMember) {
                                url += '/' + $model.CurrentObject[$model.CurrentObjectKeyMember];
                            }
                            else {
                                url += '/null';
                            }
                        }
                    }
                }
                if (navigationActionId) {
                    url += '/' + navigationActionId;
                }
                var deferred = $.Deferred();
                if ($model && $model.customizeModelUrl) {
                    $model.customizeModelUrl({ url: url }).then(function (result) { deferred.resolve(result); });
                }
                else {
                    deferred.resolve(url);
                }
                //return url;
                return deferred.promise();
            }
            Mobile.getModelUrl = getModelUrl;
            //export function customizeModelUrl(url) {
            //    return url;
            //}
            function processError(_a) {
                var result = _a.result, $model = _a.$model, $global = _a.$global;
                if (!!result.error) {
                    if (result.error.errorDetails) {
                        var resultInstanceAnnotation = result.error.errorDetails['error.modelState'];
                        var updateStateModel = !!resultInstanceAnnotation && resultInstanceAnnotation.startsWith('{') ? JSON.parse(resultInstanceAnnotation) : undefined;
                        if (!!updateStateModel && !!updateStateModel.ViewModel) {
                            $.extend(true, $model, updateStateModel.ViewModel);
                        }
                    }
                    else {
                        if (isWcfDataService($global)) {
                            result.error = AppPlayer.Stores.Utils.getDataError(result.error);
                        }
                        else {
                            if (result.error.status === 401 || result.error.statusText === "Unauthorized") {
                                result.error.httpStatus = 401;
                                app.instance._dataErrorHandler(result.error);
                            }
                            else {
                                var errorMessage = (result.error.responseText) ? JSON.parse(result.error.responseText).Message : result.error.statusText;
                                AppPlayer.Utils.showError(errorMessage);
                                if (result.error.responseText) {
                                    console.error(errorMessage, JSON.parse(result.error.responseText));
                                }
                            }
                        }
                    }
                }
            }
            function isNotNullableObject(objectValue) {
                return typeof (objectValue) === "object" && !!objectValue;
            }
            function isEqualValues(oldValue, newValue) {
                if (isNotNullableObject(oldValue) && isNotNullableObject(newValue)) {
                    if (Object.keys(oldValue).length !== Object.keys(newValue).length) {
                        return false;
                    }
                    return Object.keys(oldValue).every(function (key) {
                        return oldValue[key] === newValue[key];
                    });
                }
                else {
                    return oldValue === newValue;
                }
            }
            function processResult(_a) {
                var result = _a.result, onUpdated = _a.onUpdated, actionId = _a.actionId, actionParameter = _a.actionParameter, $model = _a.$model, $global = _a.$global, $functions = _a.$functions;
                if (isWcfDataService($global)) {
                    if (result.GlobalModel) {
                        $.extend(true, $global, result.GlobalModel);
                    }
                    var viewModel = result.ViewModel;
                    if (viewModel) {
                        var shouldNavigate = !$model || viewModel.name != $model.name;
                        if ($model) {
                            if (shouldNavigate && !viewModel.IsClosed && viewModel.RootViewModel) {
                                $.extend(true, $model, viewModel.RootViewModel);
                            }
                            else {
                                $.extend(true, $model, viewModel);
                            }
                            $model.PreviousObjectsState = viewModel.PreviousObjectsState;
                        }
                        if (viewModel.IsModified) {
                            $global.reloadListDataSource({ model: $model });
                        }
                        var onUpdatedResult = onUpdated ? onUpdated() : null;
                        if (!onUpdatedResult || !onUpdatedResult.then) {
                            navigateIfNeeded(viewModel, shouldNavigate, actionId, actionParameter, $model, $global, $functions);
                            return $.Deferred().resolve();
                        }
                        else {
                            return onUpdatedResult.then(function () { navigateIfNeeded(viewModel, shouldNavigate, actionId, actionParameter, $model, $global, $functions); });
                        }
                    }
                }
                else {
                    var response = result;
                    if (response.globalModel) {
                        $.extend(true, $global, response.globalModel);
                    }
                    var viewState = response.viewState;
                    if (viewState) {
                        if ($model) {
                            if ($model.CurrentObject) {
                                $.extend(true, $model.CurrentObject, viewState.currentObject);
                            }
                            else {
                                $model.CurrentObject = viewState.currentObject;
                            }
                            var viewModel = viewState.model;
                            if (viewModel) {
                                $.extend(true, $model, viewModel);
                            }
                            //if (JSON.stringify($model.Criteria) !== JSON.stringify(viewState.criteria)) {
                            if (!isEqualValues($model.Criteria, viewState.criteria)) {
                                $model.Criteria = viewState.criteria;
                            }
                            $model.PreviousObjectsState = viewState.objectsState;
                        }
                        if (viewState.isModified) {
                            $global.reloadListDataSource({ model: $model });
                        }
                    }
                    var onUpdatedResult = onUpdated ? onUpdated() : null;
                    if (!onUpdatedResult || !onUpdatedResult.then) {
                        navigateIfNeededMvc(response, actionId, actionParameter, $model, $global, $functions);
                        return $.Deferred().resolve();
                    }
                    else {
                        return onUpdatedResult.then(function () {
                            navigateIfNeededMvc(response, actionId, actionParameter, $model, $global, $functions);
                        });
                    }
                }
            }
            function navigateIfNeededMvc(response, actionId, actionParameter, $model, $global, $functions) {
                var viewState = response.viewState;
                if (viewState && viewState.isClosed) {
                    $global.refreshViewOnLoad = true;
                    if (response.overrideHistory) {
                        $functions.navigateToView(null, null);
                    }
                    else {
                        $functions.back();
                    }
                }
                var newViewState = response.newViewState;
                if (newViewState) {
                    var currentObjectNew;
                    var currentObjectEdit;
                    if (newViewState.currentObject) {
                        if (newViewState.isNewCurrentObject) {
                            currentObjectNew = newViewState.currentObject;
                        }
                        else {
                            currentObjectEdit = newViewState.currentObject;
                        }
                    }
                    DevExpress.ExpressApp.Mobile.navigateToView({ viewId: newViewState.viewId, currentObjectNew: currentObjectNew, currentObjectEdit: currentObjectEdit, actionId: actionId, actionParameter: actionParameter, $model: $model, $global: $global, $functions: $functions });
                }
            }
            function navigateIfNeeded(viewModel, shouldNavigate, actionId, actionParameter, $model, $global, $functions) {
                if (viewModel.IsClosed) {
                    $global.refreshViewOnLoad = true;
                    if (viewModel.overrideHistory) {
                        $functions.navigateToView(null, null);
                    }
                    else {
                        $functions.back();
                    }
                }
                else {
                    if (shouldNavigate) {
                        var currentObjectNew;
                        var currentObjectEdit;
                        if (viewModel.CurrentObject) {
                            if (viewModel.IsNewCurrentObject) {
                                currentObjectNew = viewModel.CurrentObject;
                            }
                            else {
                                currentObjectEdit = viewModel.CurrentObject;
                            }
                        }
                        DevExpress.ExpressApp.Mobile.navigateToView({ viewId: viewModel.name, currentObjectNew: currentObjectNew, currentObjectEdit: currentObjectEdit, actionId: actionId, actionParameter: actionParameter, $model: $model, $global: $global, $functions: $functions });
                    }
                }
            }
            function uploadImage(_a) {
                var url = _a.url, value = _a.value, propertyName = _a.propertyName, wcfDataService = _a.wcfDataService;
                var imageAsBlob;
                if (value === null) {
                    {
                        imageAsBlob = new Blob();
                    }
                }
                else {
                    var raw = window.atob(value);
                    var rawLength = raw.length;
                    var uInt8Array = new Uint8Array(rawLength);
                    for (var i = 0; i < rawLength; ++i) {
                        {
                            uInt8Array[i] = raw.charCodeAt(i);
                        }
                    }
                    imageAsBlob = new Blob([uInt8Array], { type: 'image/*' });
                }
                var ajaxSettings = {
                    url: url,
                    type: 'POST',
                    processData: false,
                    beforeSend: function (request) {
                        {
                            request.setRequestHeader('Accept', 'application/json');
                            request.setRequestHeader('X-HTTP-Method', 'PUT');
                        }
                    },
                    data: imageAsBlob,
                    contentType: undefined
                };
                if (!wcfDataService) {
                    var formData = new FormData();
                    formData.append(propertyName, imageAsBlob);
                    ajaxSettings.data = formData;
                    ajaxSettings.contentType = false;
                }
                return $.ajax(ajaxSettings);
            }
            function updateModel(_a) {
                var actionId = _a.actionId, actionParameter = _a.actionParameter, onUpdated = _a.onUpdated, $model = _a.$model, $global = _a.$global, $functions = _a.$functions;
                var deferred = $.Deferred();
                $functions.busy();
                var result = executeAction({ actionId: actionId, actionParameter: actionParameter, $model: $model, $global: $global, $functions: $functions });
                result.then(function (response) {
                    return processResult({ result: response, actionId: actionId, actionParameter: actionParameter, onUpdated: onUpdated, $model: $model, $global: $global, $functions: $functions });
                }, function (response) {
                    processError({ result: { error: response }, $model: $model, $global: $global });
                }).then(function () {
                    $functions.available();
                    deferred.resolve();
                });
                return deferred.promise();
            }
            Mobile.updateModel = updateModel;
            Mobile.updateComponentInfo = function (name, componentInfo) {
                var playerViews = AppPlayer.Views;
                if (componentInfo.rendererType === undefined) {
                    componentInfo.rendererType = playerViews.ComponentMarkupRenderBase;
                }
                playerViews.componentInfos[name] = componentInfo;
            };
            // obsolete use navigateToView instead
            Mobile.navigateToDetailView = function (detailViewId, objectId) {
                var application = AppPlayer.Application.get();
                application.functions.navigateToView(detailViewId, { CurrentObjectEdit: objectId });
            };
            Mobile.encodeHtml = function (text) {
                return AppPlayer.escapeHtml(AppPlayer.htmlEncode(text));
            };
            function openFileFromUrl(url, fileName, contentType, $global) {
                var cordova = window['cordova'];
                if (typeof cordova !== 'undefined' && !!cordova && cordova.platformId) {
                    var resolveLocalFileSystemURL = window['resolveLocalFileSystemURL'];
                    var FileTransfer = window['FileTransfer'];
                    var storageDir = cordova.platformId === 'ios' ? cordova.file.documentsDirectory : cordova.file.externalRootDirectory + 'Download/';
                    window.resolveLocalFileSystemURL(storageDir, function (dir) {
                        dir.getFile(fileName, { create: true }, function (fileEntry) {
                            var fileTransfer = new FileTransfer();
                            var fileURL = fileEntry.toURL();
                            fileTransfer.download(encodeURI(url), fileURL, function (entry) {
                                var fileFullName = storageDir + fileName;
                                cordova.plugins.fileOpener2.open(fileFullName, contentType, {
                                    error: function (e) {
                                        DevExpress.ui.notify({ closeOnClick: true, message: e.message }, 'error', 5000);
                                    },
                                    success: function () { }
                                });
                            }, function (error) { }, false, {});
                        });
                    });
                }
                else {
                    window.open(url);
                }
            }
            Mobile.openFileFromUrl = openFileFromUrl;
            function uploadImageIfChanged(_a) {
                var valueChanged = _a.valueChanged, url = _a.url, propertyName = _a.propertyName, mediaResourceObject = _a.mediaResourceObject, newValue = _a.newValue, $global = _a.$global;
                var deferred = $.Deferred();
                if (valueChanged) {
                    if (!isWcfDataService($global)) {
                        if (newValue !== undefined || newValue !== '') {
                            uploadImage({ url: url, value: newValue, propertyName: propertyName, wcfDataService: false })
                                .done(function () {
                                deferred.resolve();
                            })
                                .fail(function (s, e) {
                                if (isWcfDataService($global)) {
                                    if (s.response['odata.error']) {
                                        $global.uf_Notify({ 'value': { 'message': s.response['odata.error'].message.value, 'type': 'error' } });
                                    }
                                }
                                else {
                                    if (s.responseJSON) {
                                        $global.uf_Notify({ 'value': { 'message': s.responseJSON.Message, 'type': 'error' } });
                                    }
                                }
                                deferred.resolve();
                            });
                        }
                        else {
                            deferred.resolve();
                        }
                    }
                    else {
                        if (!!mediaResourceObject) {
                            uploadImage({ url: mediaResourceObject.edit_media, propertyName: undefined, value: newValue, wcfDataService: true })
                                .done(function () {
                                deferred.resolve();
                            })
                                .fail(function (s, e) {
                                if (s.response['odata.error']) {
                                    $global.uf_Notify({ 'value': { 'message': s.response['odata.error'].message.value, 'type': 'error' } });
                                }
                                deferred.resolve();
                            });
                        }
                        else {
                            deferred.resolve();
                        }
                    }
                }
                else {
                    deferred.resolve();
                }
                return deferred.promise();
            }
            Mobile.uploadImageIfChanged = uploadImageIfChanged;
            function reloadCurrentObject(_a) {
                var $model = _a.$model, storeId = _a.storeId;
                var promise = $.Deferred();
                var application = AppPlayer.Application.get();
                var store = application.stores[storeId];
                store.byKey($model.CurrentObject[store.key()]).done(function (result) {
                    $model.CurrentObject = result;
                    promise.resolve();
                });
                return promise.promise();
            }
            Mobile.reloadCurrentObject = reloadCurrentObject;
            ;
            function navigateToView(_a) {
                var viewId = _a.viewId, currentObjectNew = _a.currentObjectNew, currentObjectEdit = _a.currentObjectEdit, dataSourceUrl = _a.dataSourceUrl, listViewCaption = _a.listViewCaption, includeRootViewModel = _a.includeRootViewModel, actionId = _a.actionId, actionParameter = _a.actionParameter, $model = _a.$model, $global = _a.$global, $functions = _a.$functions;
                var navigateParameters = {};
                if (currentObjectNew) {
                    navigateParameters = {
                        CurrentObjectNew: currentObjectNew
                    };
                }
                if (currentObjectEdit) {
                    navigateParameters = {
                        CurrentObjectEdit: currentObjectEdit
                    };
                }
                if (dataSourceUrl) {
                    $.extend(true, navigateParameters, {
                        DataSourceUrl: dataSourceUrl
                    });
                }
                if (listViewCaption) {
                    $.extend(true, navigateParameters, {
                        ListViewCaption: listViewCaption
                    });
                }
                if ($model && (!currentObjectEdit || includeRootViewModel)) {
                    navigateParameters['RootViewModel'] = {
                        name: $model.name,
                        CurrentObject: $model.CurrentObject,
                        SelectedItems: $model.SelectedItems,
                        SelectedObjects: $model.SelectedObjects,
                        RootViewModel: $model.RootViewModel
                    };
                }
                if (actionId && (!currentObjectEdit || includeRootViewModel)) {
                    $.extend(true, navigateParameters, {
                        RootViewModel: {
                            ClickedActionId: actionId,
                            ClickedActionParameter: actionParameter,
                        }
                    });
                    if ($model) {
                        var modelUrl = getModelUrl($model, $global, actionId).then(function (modelUrl) {
                            navigateParameters['ModelUrl'] = modelUrl;
                            navigateToViewCore($functions, $global, viewId, navigateParameters);
                        });
                    }
                    else {
                        navigateToViewCore($functions, $global, viewId, navigateParameters);
                    }
                }
                else {
                    navigateToViewCore($functions, $global, viewId, navigateParameters);
                }
            }
            Mobile.navigateToView = navigateToView;
            function navigateToViewCore($functions, $global, viewId, navigateParameters) {
                try {
                    $functions.navigateToView(viewId, navigateParameters);
                }
                catch (ex) {
                    $global.uf_Notify({ 'value': { 'message': ex + ' Try to set MobileVisible=\"True\" for this view in ModelEditor.' } });
                }
            }
            function isViewReady(_a) {
                var $model = _a.$model, $global = _a.$global;
                var isReady = $model._isReady();
                if (isReady && $model.isUpdateCompleted === false) {
                    setTimeout(function () {
                        $global.updateModel({ model: $model })
                            .then(function () { $model.isUpdateCompleted = true; });
                    });
                    if ($global.refreshViewOnLoad) {
                        $global.reloadListDataSource({ model: $model });
                    }
                }
                return isReady && $model.isUpdateCompleted;
            }
            Mobile.isViewReady = isViewReady;
            function replaceRn(_a) {
                var value = _a.value;
                if (!!value && typeof value === 'string') {
                    return value.replace(/\r\n/g, '<br/>').replace(/\n/g, '<br/>');
                }
                return value;
            }
            Mobile.replaceRn = replaceRn;
            function checkPropertyByPathExists(obj, propertyPath) {
                if (!obj || !propertyPath) {
                    return false;
                }
                var args = propertyPath.split('.');
                for (var i = 0; i < args.length; i++) {
                    if (!obj || !obj.hasOwnProperty(args[i])) {
                        return false;
                    }
                    obj = obj[args[i]];
                }
                return true;
            }
            Mobile.checkPropertyByPathExists = checkPropertyByPathExists;
            function formatNumber(value, format) {
                var number = "string" !== typeof value ? value : DevExpress.localization.number.parse(value);
                return DevExpress.localization.number.format(number, format);
            }
            Mobile.formatNumber = formatNumber;
        })(Mobile = ExpressApp.Mobile || (ExpressApp.Mobile = {}));
    })(ExpressApp = DevExpress_1.ExpressApp || (DevExpress_1.ExpressApp = {}));
})(DevExpress || (DevExpress = {}));
var DevExpress;
(function (DevExpress) {
    var ExpressApp;
    (function (ExpressApp) {
        var Mobile;
        (function (Mobile) {
            var wrapStore = function (options, application, context) {
                options.type = 'rest';
                var lookupStore = Object.create(AppPlayer.Stores.StoreFactory.createStore(options, application, context));
                lookupStore.load = function (loadOptions) {
                    var mainStore = AppPlayer.Stores.StoreFactory.createStore(options, application, context);
                    if (context.$model.CurrentObject) {
                        return mainStore.load(__assign({}, loadOptions));
                    }
                    else {
                        return new $.Deferred().resolve();
                    }
                };
                lookupStore.byKey = function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    var mainStore = AppPlayer.Stores.StoreFactory.createStore(options, application, context);
                    return Mobile.lookupStoreByKey(args, context, options, lookupStore, mainStore);
                };
                return lookupStore;
            };
            AppPlayer.Stores.StoreFactory.creators["xafLookupRestStore"] = function (options, application, context) {
                return wrapStore(options, application, context);
            };
        })(Mobile = ExpressApp.Mobile || (ExpressApp.Mobile = {}));
    })(ExpressApp = DevExpress.ExpressApp || (DevExpress.ExpressApp = {}));
})(DevExpress || (DevExpress = {}));
//# sourceMappingURL=module.src.js.map