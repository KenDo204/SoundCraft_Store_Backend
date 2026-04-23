'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">soundcraft-backend documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                                <li class="link">
                                    <a href="overview.html" data-type="chapter-link">
                                        <span class="icon ion-ios-keypad"></span>Overview
                                    </a>
                                </li>

                            <li class="link">
                                <a href="index.html" data-type="chapter-link">
                                    <span class="icon ion-ios-paper"></span>
                                        README
                                </a>
                            </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>

                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-bs-toggle="collapse" ${ isNormalMode ?
                                'data-bs-target="#modules-links"' : 'data-bs-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AddressesModule.html" data-type="entity-link" >AddressesModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-AddressesModule-18db71073068b3e3079a064b16903e6820831d2c30a43575287105cddcf8e3eeddc9cc55aa950b3ab5fd9e494e0b35cd50808e1f925d64e6794d9513a92c28f0"' : 'data-bs-target="#xs-controllers-links-module-AddressesModule-18db71073068b3e3079a064b16903e6820831d2c30a43575287105cddcf8e3eeddc9cc55aa950b3ab5fd9e494e0b35cd50808e1f925d64e6794d9513a92c28f0"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AddressesModule-18db71073068b3e3079a064b16903e6820831d2c30a43575287105cddcf8e3eeddc9cc55aa950b3ab5fd9e494e0b35cd50808e1f925d64e6794d9513a92c28f0"' :
                                            'id="xs-controllers-links-module-AddressesModule-18db71073068b3e3079a064b16903e6820831d2c30a43575287105cddcf8e3eeddc9cc55aa950b3ab5fd9e494e0b35cd50808e1f925d64e6794d9513a92c28f0"' }>
                                            <li class="link">
                                                <a href="controllers/AddressController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AddressController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AddressesModule-18db71073068b3e3079a064b16903e6820831d2c30a43575287105cddcf8e3eeddc9cc55aa950b3ab5fd9e494e0b35cd50808e1f925d64e6794d9513a92c28f0"' : 'data-bs-target="#xs-injectables-links-module-AddressesModule-18db71073068b3e3079a064b16903e6820831d2c30a43575287105cddcf8e3eeddc9cc55aa950b3ab5fd9e494e0b35cd50808e1f925d64e6794d9513a92c28f0"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AddressesModule-18db71073068b3e3079a064b16903e6820831d2c30a43575287105cddcf8e3eeddc9cc55aa950b3ab5fd9e494e0b35cd50808e1f925d64e6794d9513a92c28f0"' :
                                        'id="xs-injectables-links-module-AddressesModule-18db71073068b3e3079a064b16903e6820831d2c30a43575287105cddcf8e3eeddc9cc55aa950b3ab5fd9e494e0b35cd50808e1f925d64e6794d9513a92c28f0"' }>
                                        <li class="link">
                                            <a href="injectables/AddressService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AddressService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AdminModule.html" data-type="entity-link" >AdminModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-AdminModule-4f21af5206c54b7b312af0d8143ad5d225876dada779cd654a8164786f1e08e3e41a045c0253ea5f40cd24fed4c64d2ccbd9262e4468822a5ca1ffe02a651abf"' : 'data-bs-target="#xs-controllers-links-module-AdminModule-4f21af5206c54b7b312af0d8143ad5d225876dada779cd654a8164786f1e08e3e41a045c0253ea5f40cd24fed4c64d2ccbd9262e4468822a5ca1ffe02a651abf"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AdminModule-4f21af5206c54b7b312af0d8143ad5d225876dada779cd654a8164786f1e08e3e41a045c0253ea5f40cd24fed4c64d2ccbd9262e4468822a5ca1ffe02a651abf"' :
                                            'id="xs-controllers-links-module-AdminModule-4f21af5206c54b7b312af0d8143ad5d225876dada779cd654a8164786f1e08e3e41a045c0253ea5f40cd24fed4c64d2ccbd9262e4468822a5ca1ffe02a651abf"' }>
                                            <li class="link">
                                                <a href="controllers/AdminController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AdminController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AdminModule-4f21af5206c54b7b312af0d8143ad5d225876dada779cd654a8164786f1e08e3e41a045c0253ea5f40cd24fed4c64d2ccbd9262e4468822a5ca1ffe02a651abf"' : 'data-bs-target="#xs-injectables-links-module-AdminModule-4f21af5206c54b7b312af0d8143ad5d225876dada779cd654a8164786f1e08e3e41a045c0253ea5f40cd24fed4c64d2ccbd9262e4468822a5ca1ffe02a651abf"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AdminModule-4f21af5206c54b7b312af0d8143ad5d225876dada779cd654a8164786f1e08e3e41a045c0253ea5f40cd24fed4c64d2ccbd9262e4468822a5ca1ffe02a651abf"' :
                                        'id="xs-injectables-links-module-AdminModule-4f21af5206c54b7b312af0d8143ad5d225876dada779cd654a8164786f1e08e3e41a045c0253ea5f40cd24fed4c64d2ccbd9262e4468822a5ca1ffe02a651abf"' }>
                                        <li class="link">
                                            <a href="injectables/AdminService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AdminService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-AppModule-4dcf2947353c0234706d6f47d00244ec976a8219fe286c1ce8c2c75b6db2c5a004a2308eb5187ce67f3e2d024e284bd4a9364bbbb3ad2bed46d81393a5acd2f5"' : 'data-bs-target="#xs-controllers-links-module-AppModule-4dcf2947353c0234706d6f47d00244ec976a8219fe286c1ce8c2c75b6db2c5a004a2308eb5187ce67f3e2d024e284bd4a9364bbbb3ad2bed46d81393a5acd2f5"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AppModule-4dcf2947353c0234706d6f47d00244ec976a8219fe286c1ce8c2c75b6db2c5a004a2308eb5187ce67f3e2d024e284bd4a9364bbbb3ad2bed46d81393a5acd2f5"' :
                                            'id="xs-controllers-links-module-AppModule-4dcf2947353c0234706d6f47d00244ec976a8219fe286c1ce8c2c75b6db2c5a004a2308eb5187ce67f3e2d024e284bd4a9364bbbb3ad2bed46d81393a5acd2f5"' }>
                                            <li class="link">
                                                <a href="controllers/AppController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AppModule-4dcf2947353c0234706d6f47d00244ec976a8219fe286c1ce8c2c75b6db2c5a004a2308eb5187ce67f3e2d024e284bd4a9364bbbb3ad2bed46d81393a5acd2f5"' : 'data-bs-target="#xs-injectables-links-module-AppModule-4dcf2947353c0234706d6f47d00244ec976a8219fe286c1ce8c2c75b6db2c5a004a2308eb5187ce67f3e2d024e284bd4a9364bbbb3ad2bed46d81393a5acd2f5"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppModule-4dcf2947353c0234706d6f47d00244ec976a8219fe286c1ce8c2c75b6db2c5a004a2308eb5187ce67f3e2d024e284bd4a9364bbbb3ad2bed46d81393a5acd2f5"' :
                                        'id="xs-injectables-links-module-AppModule-4dcf2947353c0234706d6f47d00244ec976a8219fe286c1ce8c2c75b6db2c5a004a2308eb5187ce67f3e2d024e284bd4a9364bbbb3ad2bed46d81393a5acd2f5"' }>
                                        <li class="link">
                                            <a href="injectables/AppService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AuthModule.html" data-type="entity-link" >AuthModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-AuthModule-e883ae3721eafbef53854becca67ec501c5bf9d22f192982b58a9b9bddc25df592b9e857a9aad32d21e531ef49b909806fe4d923226a2fde67377d07db947c8b"' : 'data-bs-target="#xs-controllers-links-module-AuthModule-e883ae3721eafbef53854becca67ec501c5bf9d22f192982b58a9b9bddc25df592b9e857a9aad32d21e531ef49b909806fe4d923226a2fde67377d07db947c8b"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AuthModule-e883ae3721eafbef53854becca67ec501c5bf9d22f192982b58a9b9bddc25df592b9e857a9aad32d21e531ef49b909806fe4d923226a2fde67377d07db947c8b"' :
                                            'id="xs-controllers-links-module-AuthModule-e883ae3721eafbef53854becca67ec501c5bf9d22f192982b58a9b9bddc25df592b9e857a9aad32d21e531ef49b909806fe4d923226a2fde67377d07db947c8b"' }>
                                            <li class="link">
                                                <a href="controllers/AuthController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AuthModule-e883ae3721eafbef53854becca67ec501c5bf9d22f192982b58a9b9bddc25df592b9e857a9aad32d21e531ef49b909806fe4d923226a2fde67377d07db947c8b"' : 'data-bs-target="#xs-injectables-links-module-AuthModule-e883ae3721eafbef53854becca67ec501c5bf9d22f192982b58a9b9bddc25df592b9e857a9aad32d21e531ef49b909806fe4d923226a2fde67377d07db947c8b"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AuthModule-e883ae3721eafbef53854becca67ec501c5bf9d22f192982b58a9b9bddc25df592b9e857a9aad32d21e531ef49b909806fe4d923226a2fde67377d07db947c8b"' :
                                        'id="xs-injectables-links-module-AuthModule-e883ae3721eafbef53854becca67ec501c5bf9d22f192982b58a9b9bddc25df592b9e857a9aad32d21e531ef49b909806fe4d923226a2fde67377d07db947c8b"' }>
                                        <li class="link">
                                            <a href="injectables/AuthService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/JwtStrategy.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >JwtStrategy</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/SocialAccountsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SocialAccountsService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/TokenService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TokenService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/BlogsModule.html" data-type="entity-link" >BlogsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-BlogsModule-6b93f077c3a45f3aff8b0d45b7455b93f8acd64f38a8c80fedb8c84139c1ebb48bebad2c937a364e6318127e59339ef3042b0e963ca3924875a555d39d8924d7"' : 'data-bs-target="#xs-controllers-links-module-BlogsModule-6b93f077c3a45f3aff8b0d45b7455b93f8acd64f38a8c80fedb8c84139c1ebb48bebad2c937a364e6318127e59339ef3042b0e963ca3924875a555d39d8924d7"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-BlogsModule-6b93f077c3a45f3aff8b0d45b7455b93f8acd64f38a8c80fedb8c84139c1ebb48bebad2c937a364e6318127e59339ef3042b0e963ca3924875a555d39d8924d7"' :
                                            'id="xs-controllers-links-module-BlogsModule-6b93f077c3a45f3aff8b0d45b7455b93f8acd64f38a8c80fedb8c84139c1ebb48bebad2c937a364e6318127e59339ef3042b0e963ca3924875a555d39d8924d7"' }>
                                            <li class="link">
                                                <a href="controllers/BlogsController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >BlogsController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-BlogsModule-6b93f077c3a45f3aff8b0d45b7455b93f8acd64f38a8c80fedb8c84139c1ebb48bebad2c937a364e6318127e59339ef3042b0e963ca3924875a555d39d8924d7"' : 'data-bs-target="#xs-injectables-links-module-BlogsModule-6b93f077c3a45f3aff8b0d45b7455b93f8acd64f38a8c80fedb8c84139c1ebb48bebad2c937a364e6318127e59339ef3042b0e963ca3924875a555d39d8924d7"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-BlogsModule-6b93f077c3a45f3aff8b0d45b7455b93f8acd64f38a8c80fedb8c84139c1ebb48bebad2c937a364e6318127e59339ef3042b0e963ca3924875a555d39d8924d7"' :
                                        'id="xs-injectables-links-module-BlogsModule-6b93f077c3a45f3aff8b0d45b7455b93f8acd64f38a8c80fedb8c84139c1ebb48bebad2c937a364e6318127e59339ef3042b0e963ca3924875a555d39d8924d7"' }>
                                        <li class="link">
                                            <a href="injectables/BlogsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >BlogsService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/BrandsModule.html" data-type="entity-link" >BrandsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-BrandsModule-e476eb7e517c6c812b880ddaf374dc78a73d2f5ae493fe787258585d64c1c97a1dfeb50148bc622bab95d904c912462daa605bd3e79e494bf763308750196da5"' : 'data-bs-target="#xs-controllers-links-module-BrandsModule-e476eb7e517c6c812b880ddaf374dc78a73d2f5ae493fe787258585d64c1c97a1dfeb50148bc622bab95d904c912462daa605bd3e79e494bf763308750196da5"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-BrandsModule-e476eb7e517c6c812b880ddaf374dc78a73d2f5ae493fe787258585d64c1c97a1dfeb50148bc622bab95d904c912462daa605bd3e79e494bf763308750196da5"' :
                                            'id="xs-controllers-links-module-BrandsModule-e476eb7e517c6c812b880ddaf374dc78a73d2f5ae493fe787258585d64c1c97a1dfeb50148bc622bab95d904c912462daa605bd3e79e494bf763308750196da5"' }>
                                            <li class="link">
                                                <a href="controllers/BrandsController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >BrandsController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-BrandsModule-e476eb7e517c6c812b880ddaf374dc78a73d2f5ae493fe787258585d64c1c97a1dfeb50148bc622bab95d904c912462daa605bd3e79e494bf763308750196da5"' : 'data-bs-target="#xs-injectables-links-module-BrandsModule-e476eb7e517c6c812b880ddaf374dc78a73d2f5ae493fe787258585d64c1c97a1dfeb50148bc622bab95d904c912462daa605bd3e79e494bf763308750196da5"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-BrandsModule-e476eb7e517c6c812b880ddaf374dc78a73d2f5ae493fe787258585d64c1c97a1dfeb50148bc622bab95d904c912462daa605bd3e79e494bf763308750196da5"' :
                                        'id="xs-injectables-links-module-BrandsModule-e476eb7e517c6c812b880ddaf374dc78a73d2f5ae493fe787258585d64c1c97a1dfeb50148bc622bab95d904c912462daa605bd3e79e494bf763308750196da5"' }>
                                        <li class="link">
                                            <a href="injectables/BrandsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >BrandsService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/CartsModule.html" data-type="entity-link" >CartsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-CartsModule-917fb41e043e0ab59e6b44fed495c35f924ce4164ff49cd4f888e9673b9d5d12fd42fa8e7f482362e67a469c2b59aff3df30fe0e6ed6a9ef7d89e973ece85480"' : 'data-bs-target="#xs-controllers-links-module-CartsModule-917fb41e043e0ab59e6b44fed495c35f924ce4164ff49cd4f888e9673b9d5d12fd42fa8e7f482362e67a469c2b59aff3df30fe0e6ed6a9ef7d89e973ece85480"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-CartsModule-917fb41e043e0ab59e6b44fed495c35f924ce4164ff49cd4f888e9673b9d5d12fd42fa8e7f482362e67a469c2b59aff3df30fe0e6ed6a9ef7d89e973ece85480"' :
                                            'id="xs-controllers-links-module-CartsModule-917fb41e043e0ab59e6b44fed495c35f924ce4164ff49cd4f888e9673b9d5d12fd42fa8e7f482362e67a469c2b59aff3df30fe0e6ed6a9ef7d89e973ece85480"' }>
                                            <li class="link">
                                                <a href="controllers/CartsController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CartsController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-CartsModule-917fb41e043e0ab59e6b44fed495c35f924ce4164ff49cd4f888e9673b9d5d12fd42fa8e7f482362e67a469c2b59aff3df30fe0e6ed6a9ef7d89e973ece85480"' : 'data-bs-target="#xs-injectables-links-module-CartsModule-917fb41e043e0ab59e6b44fed495c35f924ce4164ff49cd4f888e9673b9d5d12fd42fa8e7f482362e67a469c2b59aff3df30fe0e6ed6a9ef7d89e973ece85480"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-CartsModule-917fb41e043e0ab59e6b44fed495c35f924ce4164ff49cd4f888e9673b9d5d12fd42fa8e7f482362e67a469c2b59aff3df30fe0e6ed6a9ef7d89e973ece85480"' :
                                        'id="xs-injectables-links-module-CartsModule-917fb41e043e0ab59e6b44fed495c35f924ce4164ff49cd4f888e9673b9d5d12fd42fa8e7f482362e67a469c2b59aff3df30fe0e6ed6a9ef7d89e973ece85480"' }>
                                        <li class="link">
                                            <a href="injectables/CartService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CartService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/CategoriesModule.html" data-type="entity-link" >CategoriesModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-CategoriesModule-71cd98d717fe39d18e135178322bb6229a92c219934b78ab7cde10a3a13853168d56b1f1bd0ce1072a9b85d2d01356e1bf9cf323df90dca00ab077ceee325cb3"' : 'data-bs-target="#xs-controllers-links-module-CategoriesModule-71cd98d717fe39d18e135178322bb6229a92c219934b78ab7cde10a3a13853168d56b1f1bd0ce1072a9b85d2d01356e1bf9cf323df90dca00ab077ceee325cb3"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-CategoriesModule-71cd98d717fe39d18e135178322bb6229a92c219934b78ab7cde10a3a13853168d56b1f1bd0ce1072a9b85d2d01356e1bf9cf323df90dca00ab077ceee325cb3"' :
                                            'id="xs-controllers-links-module-CategoriesModule-71cd98d717fe39d18e135178322bb6229a92c219934b78ab7cde10a3a13853168d56b1f1bd0ce1072a9b85d2d01356e1bf9cf323df90dca00ab077ceee325cb3"' }>
                                            <li class="link">
                                                <a href="controllers/CategoriesController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CategoriesController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-CategoriesModule-71cd98d717fe39d18e135178322bb6229a92c219934b78ab7cde10a3a13853168d56b1f1bd0ce1072a9b85d2d01356e1bf9cf323df90dca00ab077ceee325cb3"' : 'data-bs-target="#xs-injectables-links-module-CategoriesModule-71cd98d717fe39d18e135178322bb6229a92c219934b78ab7cde10a3a13853168d56b1f1bd0ce1072a9b85d2d01356e1bf9cf323df90dca00ab077ceee325cb3"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-CategoriesModule-71cd98d717fe39d18e135178322bb6229a92c219934b78ab7cde10a3a13853168d56b1f1bd0ce1072a9b85d2d01356e1bf9cf323df90dca00ab077ceee325cb3"' :
                                        'id="xs-injectables-links-module-CategoriesModule-71cd98d717fe39d18e135178322bb6229a92c219934b78ab7cde10a3a13853168d56b1f1bd0ce1072a9b85d2d01356e1bf9cf323df90dca00ab077ceee325cb3"' }>
                                        <li class="link">
                                            <a href="injectables/CategoriesService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CategoriesService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/CloudinaryModule.html" data-type="entity-link" >CloudinaryModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-CloudinaryModule-3f0c7201608349deca195ceb94d24aebfbdaa546eb0012da8d7d506120224e24600bbb40c3645bb71046a6f9cb4ed482f664bc2778040b440138a04929479445"' : 'data-bs-target="#xs-injectables-links-module-CloudinaryModule-3f0c7201608349deca195ceb94d24aebfbdaa546eb0012da8d7d506120224e24600bbb40c3645bb71046a6f9cb4ed482f664bc2778040b440138a04929479445"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-CloudinaryModule-3f0c7201608349deca195ceb94d24aebfbdaa546eb0012da8d7d506120224e24600bbb40c3645bb71046a6f9cb4ed482f664bc2778040b440138a04929479445"' :
                                        'id="xs-injectables-links-module-CloudinaryModule-3f0c7201608349deca195ceb94d24aebfbdaa546eb0012da8d7d506120224e24600bbb40c3645bb71046a6f9cb4ed482f664bc2778040b440138a04929479445"' }>
                                        <li class="link">
                                            <a href="injectables/CloudinaryService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CloudinaryService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/CouponsModule.html" data-type="entity-link" >CouponsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-CouponsModule-b2384a7b17a8d20f308a9c5d4f2fa841dfe45fb30fedf61d8affdffce2557ce3c12c4f6b1570cdc7c75987dd5a80e4c2b06d1f1ca128a72a52fbc0b1396b5332"' : 'data-bs-target="#xs-controllers-links-module-CouponsModule-b2384a7b17a8d20f308a9c5d4f2fa841dfe45fb30fedf61d8affdffce2557ce3c12c4f6b1570cdc7c75987dd5a80e4c2b06d1f1ca128a72a52fbc0b1396b5332"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-CouponsModule-b2384a7b17a8d20f308a9c5d4f2fa841dfe45fb30fedf61d8affdffce2557ce3c12c4f6b1570cdc7c75987dd5a80e4c2b06d1f1ca128a72a52fbc0b1396b5332"' :
                                            'id="xs-controllers-links-module-CouponsModule-b2384a7b17a8d20f308a9c5d4f2fa841dfe45fb30fedf61d8affdffce2557ce3c12c4f6b1570cdc7c75987dd5a80e4c2b06d1f1ca128a72a52fbc0b1396b5332"' }>
                                            <li class="link">
                                                <a href="controllers/CouponsController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CouponsController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-CouponsModule-b2384a7b17a8d20f308a9c5d4f2fa841dfe45fb30fedf61d8affdffce2557ce3c12c4f6b1570cdc7c75987dd5a80e4c2b06d1f1ca128a72a52fbc0b1396b5332"' : 'data-bs-target="#xs-injectables-links-module-CouponsModule-b2384a7b17a8d20f308a9c5d4f2fa841dfe45fb30fedf61d8affdffce2557ce3c12c4f6b1570cdc7c75987dd5a80e4c2b06d1f1ca128a72a52fbc0b1396b5332"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-CouponsModule-b2384a7b17a8d20f308a9c5d4f2fa841dfe45fb30fedf61d8affdffce2557ce3c12c4f6b1570cdc7c75987dd5a80e4c2b06d1f1ca128a72a52fbc0b1396b5332"' :
                                        'id="xs-injectables-links-module-CouponsModule-b2384a7b17a8d20f308a9c5d4f2fa841dfe45fb30fedf61d8affdffce2557ce3c12c4f6b1570cdc7c75987dd5a80e4c2b06d1f1ca128a72a52fbc0b1396b5332"' }>
                                        <li class="link">
                                            <a href="injectables/CouponsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CouponsService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/GhnModule.html" data-type="entity-link" >GhnModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-GhnModule-beadaca9fdd23cf56755d3b0f9d385701845d34f41857198e12cec14174d92798f901bbdda5fd118e689ba98ca737dd5ed3049f0e237ceedc32081d2ea2f142a"' : 'data-bs-target="#xs-controllers-links-module-GhnModule-beadaca9fdd23cf56755d3b0f9d385701845d34f41857198e12cec14174d92798f901bbdda5fd118e689ba98ca737dd5ed3049f0e237ceedc32081d2ea2f142a"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-GhnModule-beadaca9fdd23cf56755d3b0f9d385701845d34f41857198e12cec14174d92798f901bbdda5fd118e689ba98ca737dd5ed3049f0e237ceedc32081d2ea2f142a"' :
                                            'id="xs-controllers-links-module-GhnModule-beadaca9fdd23cf56755d3b0f9d385701845d34f41857198e12cec14174d92798f901bbdda5fd118e689ba98ca737dd5ed3049f0e237ceedc32081d2ea2f142a"' }>
                                            <li class="link">
                                                <a href="controllers/GhnController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GhnController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-GhnModule-beadaca9fdd23cf56755d3b0f9d385701845d34f41857198e12cec14174d92798f901bbdda5fd118e689ba98ca737dd5ed3049f0e237ceedc32081d2ea2f142a"' : 'data-bs-target="#xs-injectables-links-module-GhnModule-beadaca9fdd23cf56755d3b0f9d385701845d34f41857198e12cec14174d92798f901bbdda5fd118e689ba98ca737dd5ed3049f0e237ceedc32081d2ea2f142a"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-GhnModule-beadaca9fdd23cf56755d3b0f9d385701845d34f41857198e12cec14174d92798f901bbdda5fd118e689ba98ca737dd5ed3049f0e237ceedc32081d2ea2f142a"' :
                                        'id="xs-injectables-links-module-GhnModule-beadaca9fdd23cf56755d3b0f9d385701845d34f41857198e12cec14174d92798f901bbdda5fd118e689ba98ca737dd5ed3049f0e237ceedc32081d2ea2f142a"' }>
                                        <li class="link">
                                            <a href="injectables/GhnService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GhnService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/HomePageModule.html" data-type="entity-link" >HomePageModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-HomePageModule-8f3959ce73891eb100b569e6329596eb70ebbf8edb367bd9331d9e1c92e49b0cee6c7d17c49996caf787ed9c223bb7527d7330148ff0b39cdcc3e074ad34d514"' : 'data-bs-target="#xs-controllers-links-module-HomePageModule-8f3959ce73891eb100b569e6329596eb70ebbf8edb367bd9331d9e1c92e49b0cee6c7d17c49996caf787ed9c223bb7527d7330148ff0b39cdcc3e074ad34d514"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-HomePageModule-8f3959ce73891eb100b569e6329596eb70ebbf8edb367bd9331d9e1c92e49b0cee6c7d17c49996caf787ed9c223bb7527d7330148ff0b39cdcc3e074ad34d514"' :
                                            'id="xs-controllers-links-module-HomePageModule-8f3959ce73891eb100b569e6329596eb70ebbf8edb367bd9331d9e1c92e49b0cee6c7d17c49996caf787ed9c223bb7527d7330148ff0b39cdcc3e074ad34d514"' }>
                                            <li class="link">
                                                <a href="controllers/HomePageController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >HomePageController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-HomePageModule-8f3959ce73891eb100b569e6329596eb70ebbf8edb367bd9331d9e1c92e49b0cee6c7d17c49996caf787ed9c223bb7527d7330148ff0b39cdcc3e074ad34d514"' : 'data-bs-target="#xs-injectables-links-module-HomePageModule-8f3959ce73891eb100b569e6329596eb70ebbf8edb367bd9331d9e1c92e49b0cee6c7d17c49996caf787ed9c223bb7527d7330148ff0b39cdcc3e074ad34d514"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-HomePageModule-8f3959ce73891eb100b569e6329596eb70ebbf8edb367bd9331d9e1c92e49b0cee6c7d17c49996caf787ed9c223bb7527d7330148ff0b39cdcc3e074ad34d514"' :
                                        'id="xs-injectables-links-module-HomePageModule-8f3959ce73891eb100b569e6329596eb70ebbf8edb367bd9331d9e1c92e49b0cee6c7d17c49996caf787ed9c223bb7527d7330148ff0b39cdcc3e074ad34d514"' }>
                                        <li class="link">
                                            <a href="injectables/HomePageService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >HomePageService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/InventoryModule.html" data-type="entity-link" >InventoryModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-InventoryModule-a7897c638311990e8b71185334fc3cfa2ab32504fd74762314f5e90ee8cb45b50ead9a23015be4e29e6b0f326492f324a588705ce12f82587847d22cf7b1b24e"' : 'data-bs-target="#xs-injectables-links-module-InventoryModule-a7897c638311990e8b71185334fc3cfa2ab32504fd74762314f5e90ee8cb45b50ead9a23015be4e29e6b0f326492f324a588705ce12f82587847d22cf7b1b24e"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-InventoryModule-a7897c638311990e8b71185334fc3cfa2ab32504fd74762314f5e90ee8cb45b50ead9a23015be4e29e6b0f326492f324a588705ce12f82587847d22cf7b1b24e"' :
                                        'id="xs-injectables-links-module-InventoryModule-a7897c638311990e8b71185334fc3cfa2ab32504fd74762314f5e90ee8cb45b50ead9a23015be4e29e6b0f326492f324a588705ce12f82587847d22cf7b1b24e"' }>
                                        <li class="link">
                                            <a href="injectables/InventoryService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >InventoryService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/NotificationsModule.html" data-type="entity-link" >NotificationsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-NotificationsModule-6e7530e4faf3f550e0e3459e0a393adb2a4aae2e6165956e7c2a9d2c1f6542c555e8940b0842953b4903ab1a82f2f065a24e88ff8741506e1b27675f142ebff5"' : 'data-bs-target="#xs-controllers-links-module-NotificationsModule-6e7530e4faf3f550e0e3459e0a393adb2a4aae2e6165956e7c2a9d2c1f6542c555e8940b0842953b4903ab1a82f2f065a24e88ff8741506e1b27675f142ebff5"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-NotificationsModule-6e7530e4faf3f550e0e3459e0a393adb2a4aae2e6165956e7c2a9d2c1f6542c555e8940b0842953b4903ab1a82f2f065a24e88ff8741506e1b27675f142ebff5"' :
                                            'id="xs-controllers-links-module-NotificationsModule-6e7530e4faf3f550e0e3459e0a393adb2a4aae2e6165956e7c2a9d2c1f6542c555e8940b0842953b4903ab1a82f2f065a24e88ff8741506e1b27675f142ebff5"' }>
                                            <li class="link">
                                                <a href="controllers/NotificationsController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >NotificationsController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-NotificationsModule-6e7530e4faf3f550e0e3459e0a393adb2a4aae2e6165956e7c2a9d2c1f6542c555e8940b0842953b4903ab1a82f2f065a24e88ff8741506e1b27675f142ebff5"' : 'data-bs-target="#xs-injectables-links-module-NotificationsModule-6e7530e4faf3f550e0e3459e0a393adb2a4aae2e6165956e7c2a9d2c1f6542c555e8940b0842953b4903ab1a82f2f065a24e88ff8741506e1b27675f142ebff5"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-NotificationsModule-6e7530e4faf3f550e0e3459e0a393adb2a4aae2e6165956e7c2a9d2c1f6542c555e8940b0842953b4903ab1a82f2f065a24e88ff8741506e1b27675f142ebff5"' :
                                        'id="xs-injectables-links-module-NotificationsModule-6e7530e4faf3f550e0e3459e0a393adb2a4aae2e6165956e7c2a9d2c1f6542c555e8940b0842953b4903ab1a82f2f065a24e88ff8741506e1b27675f142ebff5"' }>
                                        <li class="link">
                                            <a href="injectables/NotificationsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >NotificationsService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/OrdersModule.html" data-type="entity-link" >OrdersModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-OrdersModule-2d0b684ebeddcffbf6b9f6b439932c13a06535617e6d6474615dc1c10f6766febd3efd0cbde20a57db673c9e8d725e18104b0f89f0220a080b9e7c74e086d84f"' : 'data-bs-target="#xs-controllers-links-module-OrdersModule-2d0b684ebeddcffbf6b9f6b439932c13a06535617e6d6474615dc1c10f6766febd3efd0cbde20a57db673c9e8d725e18104b0f89f0220a080b9e7c74e086d84f"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-OrdersModule-2d0b684ebeddcffbf6b9f6b439932c13a06535617e6d6474615dc1c10f6766febd3efd0cbde20a57db673c9e8d725e18104b0f89f0220a080b9e7c74e086d84f"' :
                                            'id="xs-controllers-links-module-OrdersModule-2d0b684ebeddcffbf6b9f6b439932c13a06535617e6d6474615dc1c10f6766febd3efd0cbde20a57db673c9e8d725e18104b0f89f0220a080b9e7c74e086d84f"' }>
                                            <li class="link">
                                                <a href="controllers/OrdersController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >OrdersController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-OrdersModule-2d0b684ebeddcffbf6b9f6b439932c13a06535617e6d6474615dc1c10f6766febd3efd0cbde20a57db673c9e8d725e18104b0f89f0220a080b9e7c74e086d84f"' : 'data-bs-target="#xs-injectables-links-module-OrdersModule-2d0b684ebeddcffbf6b9f6b439932c13a06535617e6d6474615dc1c10f6766febd3efd0cbde20a57db673c9e8d725e18104b0f89f0220a080b9e7c74e086d84f"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-OrdersModule-2d0b684ebeddcffbf6b9f6b439932c13a06535617e6d6474615dc1c10f6766febd3efd0cbde20a57db673c9e8d725e18104b0f89f0220a080b9e7c74e086d84f"' :
                                        'id="xs-injectables-links-module-OrdersModule-2d0b684ebeddcffbf6b9f6b439932c13a06535617e6d6474615dc1c10f6766febd3efd0cbde20a57db673c9e8d725e18104b0f89f0220a080b9e7c74e086d84f"' }>
                                        <li class="link">
                                            <a href="injectables/OrdersService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >OrdersService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/PreOrdersModule.html" data-type="entity-link" >PreOrdersModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-PreOrdersModule-faeff9bcceae3bda0c55724749265f1fdfcdff847c04fa7801de708368d8c7300c2b278f9d300fec9fc026ba5770d3bba40d1dfe1db9f2495eb7303558e3fa2f"' : 'data-bs-target="#xs-controllers-links-module-PreOrdersModule-faeff9bcceae3bda0c55724749265f1fdfcdff847c04fa7801de708368d8c7300c2b278f9d300fec9fc026ba5770d3bba40d1dfe1db9f2495eb7303558e3fa2f"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-PreOrdersModule-faeff9bcceae3bda0c55724749265f1fdfcdff847c04fa7801de708368d8c7300c2b278f9d300fec9fc026ba5770d3bba40d1dfe1db9f2495eb7303558e3fa2f"' :
                                            'id="xs-controllers-links-module-PreOrdersModule-faeff9bcceae3bda0c55724749265f1fdfcdff847c04fa7801de708368d8c7300c2b278f9d300fec9fc026ba5770d3bba40d1dfe1db9f2495eb7303558e3fa2f"' }>
                                            <li class="link">
                                                <a href="controllers/PreOrdersController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PreOrdersController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-PreOrdersModule-faeff9bcceae3bda0c55724749265f1fdfcdff847c04fa7801de708368d8c7300c2b278f9d300fec9fc026ba5770d3bba40d1dfe1db9f2495eb7303558e3fa2f"' : 'data-bs-target="#xs-injectables-links-module-PreOrdersModule-faeff9bcceae3bda0c55724749265f1fdfcdff847c04fa7801de708368d8c7300c2b278f9d300fec9fc026ba5770d3bba40d1dfe1db9f2495eb7303558e3fa2f"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-PreOrdersModule-faeff9bcceae3bda0c55724749265f1fdfcdff847c04fa7801de708368d8c7300c2b278f9d300fec9fc026ba5770d3bba40d1dfe1db9f2495eb7303558e3fa2f"' :
                                        'id="xs-injectables-links-module-PreOrdersModule-faeff9bcceae3bda0c55724749265f1fdfcdff847c04fa7801de708368d8c7300c2b278f9d300fec9fc026ba5770d3bba40d1dfe1db9f2495eb7303558e3fa2f"' }>
                                        <li class="link">
                                            <a href="injectables/PreOrdersService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PreOrdersService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ProductsModule.html" data-type="entity-link" >ProductsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-ProductsModule-3587fe5af48496512e6797201f80028209d92ff4e70b66feb230fb63125e1c2d90105784e5127049f3ce9bd834d6f7a1f4facd2f7334e1bcb69f8e47ecf9bfe3"' : 'data-bs-target="#xs-controllers-links-module-ProductsModule-3587fe5af48496512e6797201f80028209d92ff4e70b66feb230fb63125e1c2d90105784e5127049f3ce9bd834d6f7a1f4facd2f7334e1bcb69f8e47ecf9bfe3"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-ProductsModule-3587fe5af48496512e6797201f80028209d92ff4e70b66feb230fb63125e1c2d90105784e5127049f3ce9bd834d6f7a1f4facd2f7334e1bcb69f8e47ecf9bfe3"' :
                                            'id="xs-controllers-links-module-ProductsModule-3587fe5af48496512e6797201f80028209d92ff4e70b66feb230fb63125e1c2d90105784e5127049f3ce9bd834d6f7a1f4facd2f7334e1bcb69f8e47ecf9bfe3"' }>
                                            <li class="link">
                                                <a href="controllers/ProductsController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ProductsController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-ProductsModule-3587fe5af48496512e6797201f80028209d92ff4e70b66feb230fb63125e1c2d90105784e5127049f3ce9bd834d6f7a1f4facd2f7334e1bcb69f8e47ecf9bfe3"' : 'data-bs-target="#xs-injectables-links-module-ProductsModule-3587fe5af48496512e6797201f80028209d92ff4e70b66feb230fb63125e1c2d90105784e5127049f3ce9bd834d6f7a1f4facd2f7334e1bcb69f8e47ecf9bfe3"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ProductsModule-3587fe5af48496512e6797201f80028209d92ff4e70b66feb230fb63125e1c2d90105784e5127049f3ce9bd834d6f7a1f4facd2f7334e1bcb69f8e47ecf9bfe3"' :
                                        'id="xs-injectables-links-module-ProductsModule-3587fe5af48496512e6797201f80028209d92ff4e70b66feb230fb63125e1c2d90105784e5127049f3ce9bd834d6f7a1f4facd2f7334e1bcb69f8e47ecf9bfe3"' }>
                                        <li class="link">
                                            <a href="injectables/ProductsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ProductsService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/RecommendationModule.html" data-type="entity-link" >RecommendationModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-RecommendationModule-24697520b64311bfbafec3dd1cd60e9a34bcfef84fb6b98db13fce2e16a14ef3b9bd8e016b85ac4952fd8e6f92891daaf4d162978fbe6d22383e45389241bdd6"' : 'data-bs-target="#xs-controllers-links-module-RecommendationModule-24697520b64311bfbafec3dd1cd60e9a34bcfef84fb6b98db13fce2e16a14ef3b9bd8e016b85ac4952fd8e6f92891daaf4d162978fbe6d22383e45389241bdd6"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-RecommendationModule-24697520b64311bfbafec3dd1cd60e9a34bcfef84fb6b98db13fce2e16a14ef3b9bd8e016b85ac4952fd8e6f92891daaf4d162978fbe6d22383e45389241bdd6"' :
                                            'id="xs-controllers-links-module-RecommendationModule-24697520b64311bfbafec3dd1cd60e9a34bcfef84fb6b98db13fce2e16a14ef3b9bd8e016b85ac4952fd8e6f92891daaf4d162978fbe6d22383e45389241bdd6"' }>
                                            <li class="link">
                                                <a href="controllers/RecommendationController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RecommendationController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-RecommendationModule-24697520b64311bfbafec3dd1cd60e9a34bcfef84fb6b98db13fce2e16a14ef3b9bd8e016b85ac4952fd8e6f92891daaf4d162978fbe6d22383e45389241bdd6"' : 'data-bs-target="#xs-injectables-links-module-RecommendationModule-24697520b64311bfbafec3dd1cd60e9a34bcfef84fb6b98db13fce2e16a14ef3b9bd8e016b85ac4952fd8e6f92891daaf4d162978fbe6d22383e45389241bdd6"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-RecommendationModule-24697520b64311bfbafec3dd1cd60e9a34bcfef84fb6b98db13fce2e16a14ef3b9bd8e016b85ac4952fd8e6f92891daaf4d162978fbe6d22383e45389241bdd6"' :
                                        'id="xs-injectables-links-module-RecommendationModule-24697520b64311bfbafec3dd1cd60e9a34bcfef84fb6b98db13fce2e16a14ef3b9bd8e016b85ac4952fd8e6f92891daaf4d162978fbe6d22383e45389241bdd6"' }>
                                        <li class="link">
                                            <a href="injectables/RecommendationService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RecommendationService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/RevenuesModule.html" data-type="entity-link" >RevenuesModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-RevenuesModule-b45ed308efdf13a58fc7cfa1cbfb818094e02cb10afcd2c26ebd1ce0775fb1ef3513607cc46c9f92ec9003b6b73cc2c9c4946aa7a001d6684292f4b58b8db3d1"' : 'data-bs-target="#xs-controllers-links-module-RevenuesModule-b45ed308efdf13a58fc7cfa1cbfb818094e02cb10afcd2c26ebd1ce0775fb1ef3513607cc46c9f92ec9003b6b73cc2c9c4946aa7a001d6684292f4b58b8db3d1"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-RevenuesModule-b45ed308efdf13a58fc7cfa1cbfb818094e02cb10afcd2c26ebd1ce0775fb1ef3513607cc46c9f92ec9003b6b73cc2c9c4946aa7a001d6684292f4b58b8db3d1"' :
                                            'id="xs-controllers-links-module-RevenuesModule-b45ed308efdf13a58fc7cfa1cbfb818094e02cb10afcd2c26ebd1ce0775fb1ef3513607cc46c9f92ec9003b6b73cc2c9c4946aa7a001d6684292f4b58b8db3d1"' }>
                                            <li class="link">
                                                <a href="controllers/RevenuesController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RevenuesController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-RevenuesModule-b45ed308efdf13a58fc7cfa1cbfb818094e02cb10afcd2c26ebd1ce0775fb1ef3513607cc46c9f92ec9003b6b73cc2c9c4946aa7a001d6684292f4b58b8db3d1"' : 'data-bs-target="#xs-injectables-links-module-RevenuesModule-b45ed308efdf13a58fc7cfa1cbfb818094e02cb10afcd2c26ebd1ce0775fb1ef3513607cc46c9f92ec9003b6b73cc2c9c4946aa7a001d6684292f4b58b8db3d1"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-RevenuesModule-b45ed308efdf13a58fc7cfa1cbfb818094e02cb10afcd2c26ebd1ce0775fb1ef3513607cc46c9f92ec9003b6b73cc2c9c4946aa7a001d6684292f4b58b8db3d1"' :
                                        'id="xs-injectables-links-module-RevenuesModule-b45ed308efdf13a58fc7cfa1cbfb818094e02cb10afcd2c26ebd1ce0775fb1ef3513607cc46c9f92ec9003b6b73cc2c9c4946aa7a001d6684292f4b58b8db3d1"' }>
                                        <li class="link">
                                            <a href="injectables/RevenuesService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RevenuesService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ReviewsModule.html" data-type="entity-link" >ReviewsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-ReviewsModule-9ce6cbd19ee842524e88ffd724aff7827624e00ef4c3e0ba036f39a209b6daaef91cf4d15fd3e17859ffa3349c65047bf5c8b03698b9434990d03dae609d5daa"' : 'data-bs-target="#xs-controllers-links-module-ReviewsModule-9ce6cbd19ee842524e88ffd724aff7827624e00ef4c3e0ba036f39a209b6daaef91cf4d15fd3e17859ffa3349c65047bf5c8b03698b9434990d03dae609d5daa"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-ReviewsModule-9ce6cbd19ee842524e88ffd724aff7827624e00ef4c3e0ba036f39a209b6daaef91cf4d15fd3e17859ffa3349c65047bf5c8b03698b9434990d03dae609d5daa"' :
                                            'id="xs-controllers-links-module-ReviewsModule-9ce6cbd19ee842524e88ffd724aff7827624e00ef4c3e0ba036f39a209b6daaef91cf4d15fd3e17859ffa3349c65047bf5c8b03698b9434990d03dae609d5daa"' }>
                                            <li class="link">
                                                <a href="controllers/ReviewsController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ReviewsController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-ReviewsModule-9ce6cbd19ee842524e88ffd724aff7827624e00ef4c3e0ba036f39a209b6daaef91cf4d15fd3e17859ffa3349c65047bf5c8b03698b9434990d03dae609d5daa"' : 'data-bs-target="#xs-injectables-links-module-ReviewsModule-9ce6cbd19ee842524e88ffd724aff7827624e00ef4c3e0ba036f39a209b6daaef91cf4d15fd3e17859ffa3349c65047bf5c8b03698b9434990d03dae609d5daa"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ReviewsModule-9ce6cbd19ee842524e88ffd724aff7827624e00ef4c3e0ba036f39a209b6daaef91cf4d15fd3e17859ffa3349c65047bf5c8b03698b9434990d03dae609d5daa"' :
                                        'id="xs-injectables-links-module-ReviewsModule-9ce6cbd19ee842524e88ffd724aff7827624e00ef4c3e0ba036f39a209b6daaef91cf4d15fd3e17859ffa3349c65047bf5c8b03698b9434990d03dae609d5daa"' }>
                                        <li class="link">
                                            <a href="injectables/ReviewsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ReviewsService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/SearchModule.html" data-type="entity-link" >SearchModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-SearchModule-07abb7f78227fea657c2f8e84a61d240a28500055cb95cb59a5c2447853832e8908d209ed27e9e6a09b8191732bbfbce02e4e36c2304a5ed9efe0bf2a9587284"' : 'data-bs-target="#xs-controllers-links-module-SearchModule-07abb7f78227fea657c2f8e84a61d240a28500055cb95cb59a5c2447853832e8908d209ed27e9e6a09b8191732bbfbce02e4e36c2304a5ed9efe0bf2a9587284"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-SearchModule-07abb7f78227fea657c2f8e84a61d240a28500055cb95cb59a5c2447853832e8908d209ed27e9e6a09b8191732bbfbce02e4e36c2304a5ed9efe0bf2a9587284"' :
                                            'id="xs-controllers-links-module-SearchModule-07abb7f78227fea657c2f8e84a61d240a28500055cb95cb59a5c2447853832e8908d209ed27e9e6a09b8191732bbfbce02e4e36c2304a5ed9efe0bf2a9587284"' }>
                                            <li class="link">
                                                <a href="controllers/SearchController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SearchController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-SearchModule-07abb7f78227fea657c2f8e84a61d240a28500055cb95cb59a5c2447853832e8908d209ed27e9e6a09b8191732bbfbce02e4e36c2304a5ed9efe0bf2a9587284"' : 'data-bs-target="#xs-injectables-links-module-SearchModule-07abb7f78227fea657c2f8e84a61d240a28500055cb95cb59a5c2447853832e8908d209ed27e9e6a09b8191732bbfbce02e4e36c2304a5ed9efe0bf2a9587284"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-SearchModule-07abb7f78227fea657c2f8e84a61d240a28500055cb95cb59a5c2447853832e8908d209ed27e9e6a09b8191732bbfbce02e4e36c2304a5ed9efe0bf2a9587284"' :
                                        'id="xs-injectables-links-module-SearchModule-07abb7f78227fea657c2f8e84a61d240a28500055cb95cb59a5c2447853832e8908d209ed27e9e6a09b8191732bbfbce02e4e36c2304a5ed9efe0bf2a9587284"' }>
                                        <li class="link">
                                            <a href="injectables/SearchService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SearchService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/SlidersModule.html" data-type="entity-link" >SlidersModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-SlidersModule-072e577203f0643b7a22d6e2796ff09096b797eadf2904dd61c12ed1a82cbbb5ab2044ee03c7bde5c148e1aa7c4f44c8ed9b7253738da2c534b0eb3b0891da41"' : 'data-bs-target="#xs-controllers-links-module-SlidersModule-072e577203f0643b7a22d6e2796ff09096b797eadf2904dd61c12ed1a82cbbb5ab2044ee03c7bde5c148e1aa7c4f44c8ed9b7253738da2c534b0eb3b0891da41"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-SlidersModule-072e577203f0643b7a22d6e2796ff09096b797eadf2904dd61c12ed1a82cbbb5ab2044ee03c7bde5c148e1aa7c4f44c8ed9b7253738da2c534b0eb3b0891da41"' :
                                            'id="xs-controllers-links-module-SlidersModule-072e577203f0643b7a22d6e2796ff09096b797eadf2904dd61c12ed1a82cbbb5ab2044ee03c7bde5c148e1aa7c4f44c8ed9b7253738da2c534b0eb3b0891da41"' }>
                                            <li class="link">
                                                <a href="controllers/SlidersController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SlidersController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-SlidersModule-072e577203f0643b7a22d6e2796ff09096b797eadf2904dd61c12ed1a82cbbb5ab2044ee03c7bde5c148e1aa7c4f44c8ed9b7253738da2c534b0eb3b0891da41"' : 'data-bs-target="#xs-injectables-links-module-SlidersModule-072e577203f0643b7a22d6e2796ff09096b797eadf2904dd61c12ed1a82cbbb5ab2044ee03c7bde5c148e1aa7c4f44c8ed9b7253738da2c534b0eb3b0891da41"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-SlidersModule-072e577203f0643b7a22d6e2796ff09096b797eadf2904dd61c12ed1a82cbbb5ab2044ee03c7bde5c148e1aa7c4f44c8ed9b7253738da2c534b0eb3b0891da41"' :
                                        'id="xs-injectables-links-module-SlidersModule-072e577203f0643b7a22d6e2796ff09096b797eadf2904dd61c12ed1a82cbbb5ab2044ee03c7bde5c148e1aa7c4f44c8ed9b7253738da2c534b0eb3b0891da41"' }>
                                        <li class="link">
                                            <a href="injectables/SlidersService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SlidersService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/TemplatePlaygroundModule.html" data-type="entity-link" >TemplatePlaygroundModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#components-links-module-TemplatePlaygroundModule-a48e698b66bad8be9ff3b78b5db8e15ee6bb54bd2575fdb1bb61a34e76437cc54b2e161854c3d6c97b4c751d05ff3a43b70b87ceffd46d3c5bf53f6f161e3044"' : 'data-bs-target="#xs-components-links-module-TemplatePlaygroundModule-a48e698b66bad8be9ff3b78b5db8e15ee6bb54bd2575fdb1bb61a34e76437cc54b2e161854c3d6c97b4c751d05ff3a43b70b87ceffd46d3c5bf53f6f161e3044"' }>
                                            <span class="icon ion-md-cog"></span>
                                            <span>Components</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="components-links-module-TemplatePlaygroundModule-a48e698b66bad8be9ff3b78b5db8e15ee6bb54bd2575fdb1bb61a34e76437cc54b2e161854c3d6c97b4c751d05ff3a43b70b87ceffd46d3c5bf53f6f161e3044"' :
                                            'id="xs-components-links-module-TemplatePlaygroundModule-a48e698b66bad8be9ff3b78b5db8e15ee6bb54bd2575fdb1bb61a34e76437cc54b2e161854c3d6c97b4c751d05ff3a43b70b87ceffd46d3c5bf53f6f161e3044"' }>
                                            <li class="link">
                                                <a href="components/TemplatePlaygroundComponent.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TemplatePlaygroundComponent</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-TemplatePlaygroundModule-a48e698b66bad8be9ff3b78b5db8e15ee6bb54bd2575fdb1bb61a34e76437cc54b2e161854c3d6c97b4c751d05ff3a43b70b87ceffd46d3c5bf53f6f161e3044"' : 'data-bs-target="#xs-injectables-links-module-TemplatePlaygroundModule-a48e698b66bad8be9ff3b78b5db8e15ee6bb54bd2575fdb1bb61a34e76437cc54b2e161854c3d6c97b4c751d05ff3a43b70b87ceffd46d3c5bf53f6f161e3044"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-TemplatePlaygroundModule-a48e698b66bad8be9ff3b78b5db8e15ee6bb54bd2575fdb1bb61a34e76437cc54b2e161854c3d6c97b4c751d05ff3a43b70b87ceffd46d3c5bf53f6f161e3044"' :
                                        'id="xs-injectables-links-module-TemplatePlaygroundModule-a48e698b66bad8be9ff3b78b5db8e15ee6bb54bd2575fdb1bb61a34e76437cc54b2e161854c3d6c97b4c751d05ff3a43b70b87ceffd46d3c5bf53f6f161e3044"' }>
                                        <li class="link">
                                            <a href="injectables/HbsRenderService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >HbsRenderService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/TemplateEditorService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TemplateEditorService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/ZipExportService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ZipExportService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/TrackingModule.html" data-type="entity-link" >TrackingModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-TrackingModule-b913771666866895d1bd36ccccd4073bb047e66c7170a9681d60e14c1830109b67cd339f3a5b9e95384c5adc15b88997158783cb94ef12291ddad154caea540d"' : 'data-bs-target="#xs-controllers-links-module-TrackingModule-b913771666866895d1bd36ccccd4073bb047e66c7170a9681d60e14c1830109b67cd339f3a5b9e95384c5adc15b88997158783cb94ef12291ddad154caea540d"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-TrackingModule-b913771666866895d1bd36ccccd4073bb047e66c7170a9681d60e14c1830109b67cd339f3a5b9e95384c5adc15b88997158783cb94ef12291ddad154caea540d"' :
                                            'id="xs-controllers-links-module-TrackingModule-b913771666866895d1bd36ccccd4073bb047e66c7170a9681d60e14c1830109b67cd339f3a5b9e95384c5adc15b88997158783cb94ef12291ddad154caea540d"' }>
                                            <li class="link">
                                                <a href="controllers/TrackingController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TrackingController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-TrackingModule-b913771666866895d1bd36ccccd4073bb047e66c7170a9681d60e14c1830109b67cd339f3a5b9e95384c5adc15b88997158783cb94ef12291ddad154caea540d"' : 'data-bs-target="#xs-injectables-links-module-TrackingModule-b913771666866895d1bd36ccccd4073bb047e66c7170a9681d60e14c1830109b67cd339f3a5b9e95384c5adc15b88997158783cb94ef12291ddad154caea540d"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-TrackingModule-b913771666866895d1bd36ccccd4073bb047e66c7170a9681d60e14c1830109b67cd339f3a5b9e95384c5adc15b88997158783cb94ef12291ddad154caea540d"' :
                                        'id="xs-injectables-links-module-TrackingModule-b913771666866895d1bd36ccccd4073bb047e66c7170a9681d60e14c1830109b67cd339f3a5b9e95384c5adc15b88997158783cb94ef12291ddad154caea540d"' }>
                                        <li class="link">
                                            <a href="injectables/TrackingService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TrackingService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/UsersModule.html" data-type="entity-link" >UsersModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-UsersModule-4b3a74db42f41b88942531db605bed44bc101614bf8516b57a3105292f3325bc9c8561b0c2e185633d450ab48900b238114eecc50fe0004f9951d5fc278323b0"' : 'data-bs-target="#xs-controllers-links-module-UsersModule-4b3a74db42f41b88942531db605bed44bc101614bf8516b57a3105292f3325bc9c8561b0c2e185633d450ab48900b238114eecc50fe0004f9951d5fc278323b0"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-UsersModule-4b3a74db42f41b88942531db605bed44bc101614bf8516b57a3105292f3325bc9c8561b0c2e185633d450ab48900b238114eecc50fe0004f9951d5fc278323b0"' :
                                            'id="xs-controllers-links-module-UsersModule-4b3a74db42f41b88942531db605bed44bc101614bf8516b57a3105292f3325bc9c8561b0c2e185633d450ab48900b238114eecc50fe0004f9951d5fc278323b0"' }>
                                            <li class="link">
                                                <a href="controllers/UsersController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UsersController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-UsersModule-4b3a74db42f41b88942531db605bed44bc101614bf8516b57a3105292f3325bc9c8561b0c2e185633d450ab48900b238114eecc50fe0004f9951d5fc278323b0"' : 'data-bs-target="#xs-injectables-links-module-UsersModule-4b3a74db42f41b88942531db605bed44bc101614bf8516b57a3105292f3325bc9c8561b0c2e185633d450ab48900b238114eecc50fe0004f9951d5fc278323b0"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-UsersModule-4b3a74db42f41b88942531db605bed44bc101614bf8516b57a3105292f3325bc9c8561b0c2e185633d450ab48900b238114eecc50fe0004f9951d5fc278323b0"' :
                                        'id="xs-injectables-links-module-UsersModule-4b3a74db42f41b88942531db605bed44bc101614bf8516b57a3105292f3325bc9c8561b0c2e185633d450ab48900b238114eecc50fe0004f9951d5fc278323b0"' }>
                                        <li class="link">
                                            <a href="injectables/DataInitializer.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DataInitializer</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/UsersService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UsersService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/VnpayModule.html" data-type="entity-link" >VnpayModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-VnpayModule-9afc410cd167edf1c07d9c347c0c5029268c0711742e9397d972a31930362595b208d4e9501db831dd3fa494511eef012f4fe465e3dbfa8643977a4e6ce6772d"' : 'data-bs-target="#xs-injectables-links-module-VnpayModule-9afc410cd167edf1c07d9c347c0c5029268c0711742e9397d972a31930362595b208d4e9501db831dd3fa494511eef012f4fe465e3dbfa8643977a4e6ce6772d"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-VnpayModule-9afc410cd167edf1c07d9c347c0c5029268c0711742e9397d972a31930362595b208d4e9501db831dd3fa494511eef012f4fe465e3dbfa8643977a4e6ce6772d"' :
                                        'id="xs-injectables-links-module-VnpayModule-9afc410cd167edf1c07d9c347c0c5029268c0711742e9397d972a31930362595b208d4e9501db831dd3fa494511eef012f4fe465e3dbfa8643977a4e6ce6772d"' }>
                                        <li class="link">
                                            <a href="injectables/VnpayService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >VnpayService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/WishlistsModule.html" data-type="entity-link" >WishlistsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-WishlistsModule-0e5fddc69902669161bce68e4e1e9bcab41bca0cd75505b8f5f1476279c14cf7fdb3894b4da49befd6735d6c38b4a677578345c0247ac5ed208cae23b2f64c5c"' : 'data-bs-target="#xs-controllers-links-module-WishlistsModule-0e5fddc69902669161bce68e4e1e9bcab41bca0cd75505b8f5f1476279c14cf7fdb3894b4da49befd6735d6c38b4a677578345c0247ac5ed208cae23b2f64c5c"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-WishlistsModule-0e5fddc69902669161bce68e4e1e9bcab41bca0cd75505b8f5f1476279c14cf7fdb3894b4da49befd6735d6c38b4a677578345c0247ac5ed208cae23b2f64c5c"' :
                                            'id="xs-controllers-links-module-WishlistsModule-0e5fddc69902669161bce68e4e1e9bcab41bca0cd75505b8f5f1476279c14cf7fdb3894b4da49befd6735d6c38b4a677578345c0247ac5ed208cae23b2f64c5c"' }>
                                            <li class="link">
                                                <a href="controllers/WishlistsController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >WishlistsController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-WishlistsModule-0e5fddc69902669161bce68e4e1e9bcab41bca0cd75505b8f5f1476279c14cf7fdb3894b4da49befd6735d6c38b4a677578345c0247ac5ed208cae23b2f64c5c"' : 'data-bs-target="#xs-injectables-links-module-WishlistsModule-0e5fddc69902669161bce68e4e1e9bcab41bca0cd75505b8f5f1476279c14cf7fdb3894b4da49befd6735d6c38b4a677578345c0247ac5ed208cae23b2f64c5c"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-WishlistsModule-0e5fddc69902669161bce68e4e1e9bcab41bca0cd75505b8f5f1476279c14cf7fdb3894b4da49befd6735d6c38b4a677578345c0247ac5ed208cae23b2f64c5c"' :
                                        'id="xs-injectables-links-module-WishlistsModule-0e5fddc69902669161bce68e4e1e9bcab41bca0cd75505b8f5f1476279c14cf7fdb3894b4da49befd6735d6c38b4a677578345c0247ac5ed208cae23b2f64c5c"' }>
                                        <li class="link">
                                            <a href="injectables/WishlistsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >WishlistsService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                </ul>
                </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#controllers-links"' :
                                'data-bs-target="#xs-controllers-links"' }>
                                <span class="icon ion-md-swap"></span>
                                <span>Controllers</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="controllers-links"' : 'id="xs-controllers-links"' }>
                                <li class="link">
                                    <a href="controllers/AddressController.html" data-type="entity-link" >AddressController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/AdminController.html" data-type="entity-link" >AdminController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/AppController.html" data-type="entity-link" >AppController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/AuthController.html" data-type="entity-link" >AuthController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/BlogsController.html" data-type="entity-link" >BlogsController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/BrandsController.html" data-type="entity-link" >BrandsController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/CartsController.html" data-type="entity-link" >CartsController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/CategoriesController.html" data-type="entity-link" >CategoriesController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/CouponsController.html" data-type="entity-link" >CouponsController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/GhnController.html" data-type="entity-link" >GhnController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/HomePageController.html" data-type="entity-link" >HomePageController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/NotificationsController.html" data-type="entity-link" >NotificationsController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/OrdersController.html" data-type="entity-link" >OrdersController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/PreOrdersController.html" data-type="entity-link" >PreOrdersController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/ProductsController.html" data-type="entity-link" >ProductsController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/RecommendationController.html" data-type="entity-link" >RecommendationController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/RevenuesController.html" data-type="entity-link" >RevenuesController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/ReviewsController.html" data-type="entity-link" >ReviewsController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/SearchController.html" data-type="entity-link" >SearchController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/SlidersController.html" data-type="entity-link" >SlidersController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/TrackingController.html" data-type="entity-link" >TrackingController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/UsersController.html" data-type="entity-link" >UsersController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/WishlistsController.html" data-type="entity-link" >WishlistsController</a>
                                </li>
                            </ul>
                        </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#entities-links"' :
                                'data-bs-target="#xs-entities-links"' }>
                                <span class="icon ion-ios-apps"></span>
                                <span>Entities</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="entities-links"' : 'id="xs-entities-links"' }>
                                <li class="link">
                                    <a href="entities/Address.html" data-type="entity-link" >Address</a>
                                </li>
                                <li class="link">
                                    <a href="entities/AdminAuditLog.html" data-type="entity-link" >AdminAuditLog</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Blog.html" data-type="entity-link" >Blog</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Brand.html" data-type="entity-link" >Brand</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Cart.html" data-type="entity-link" >Cart</a>
                                </li>
                                <li class="link">
                                    <a href="entities/CartItem.html" data-type="entity-link" >CartItem</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Category.html" data-type="entity-link" >Category</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Coupon.html" data-type="entity-link" >Coupon</a>
                                </li>
                                <li class="link">
                                    <a href="entities/CouponUsage.html" data-type="entity-link" >CouponUsage</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Notification.html" data-type="entity-link" >Notification</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Order.html" data-type="entity-link" >Order</a>
                                </li>
                                <li class="link">
                                    <a href="entities/OrderItem.html" data-type="entity-link" >OrderItem</a>
                                </li>
                                <li class="link">
                                    <a href="entities/PreOrder.html" data-type="entity-link" >PreOrder</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Product.html" data-type="entity-link" >Product</a>
                                </li>
                                <li class="link">
                                    <a href="entities/ProductAssociation.html" data-type="entity-link" >ProductAssociation</a>
                                </li>
                                <li class="link">
                                    <a href="entities/ProductImage.html" data-type="entity-link" >ProductImage</a>
                                </li>
                                <li class="link">
                                    <a href="entities/ProductSimilarity.html" data-type="entity-link" >ProductSimilarity</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Revenue.html" data-type="entity-link" >Revenue</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Review.html" data-type="entity-link" >Review</a>
                                </li>
                                <li class="link">
                                    <a href="entities/ReviewImage.html" data-type="entity-link" >ReviewImage</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Slider.html" data-type="entity-link" >Slider</a>
                                </li>
                                <li class="link">
                                    <a href="entities/SocialAccount.html" data-type="entity-link" >SocialAccount</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Token.html" data-type="entity-link" >Token</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Transaction.html" data-type="entity-link" >Transaction</a>
                                </li>
                                <li class="link">
                                    <a href="entities/User.html" data-type="entity-link" >User</a>
                                </li>
                                <li class="link">
                                    <a href="entities/UserBehavior.html" data-type="entity-link" >UserBehavior</a>
                                </li>
                                <li class="link">
                                    <a href="entities/UserRecommendation.html" data-type="entity-link" >UserRecommendation</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Wishlist.html" data-type="entity-link" >Wishlist</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#classes-links"' :
                            'data-bs-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/Address.html" data-type="entity-link" >Address</a>
                            </li>
                            <li class="link">
                                <a href="classes/AddressRequestDto.html" data-type="entity-link" >AddressRequestDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/AddressResponse.html" data-type="entity-link" >AddressResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/AddressResponseDto.html" data-type="entity-link" >AddressResponseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/AdminAuditLog.html" data-type="entity-link" >AdminAuditLog</a>
                            </li>
                            <li class="link">
                                <a href="classes/ApplyCouponPreviewDto.html" data-type="entity-link" >ApplyCouponPreviewDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/AvailableServiceDto.html" data-type="entity-link" >AvailableServiceDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/BlogAuthorResponseDto.html" data-type="entity-link" >BlogAuthorResponseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/BlogResponseAdminDto.html" data-type="entity-link" >BlogResponseAdminDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/BlogResponseUserDto.html" data-type="entity-link" >BlogResponseUserDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/BrandResponseDto.html" data-type="entity-link" >BrandResponseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/BulkDeleteCartItemsDto.html" data-type="entity-link" >BulkDeleteCartItemsDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CancelOrderDto.html" data-type="entity-link" >CancelOrderDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CartItemResponseDto.html" data-type="entity-link" >CartItemResponseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CartResponseDto.html" data-type="entity-link" >CartResponseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CategoryAdminResponse.html" data-type="entity-link" >CategoryAdminResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/CategoryResponse.html" data-type="entity-link" >CategoryResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/ChangePasswordDto.html" data-type="entity-link" >ChangePasswordDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CheckoutRequestDto.html" data-type="entity-link" >CheckoutRequestDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CheckoutResponseDto.html" data-type="entity-link" >CheckoutResponseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CommitCouponUsageDto.html" data-type="entity-link" >CommitCouponUsageDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CouponUsage.html" data-type="entity-link" >CouponUsage</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateAddressDto.html" data-type="entity-link" >CreateAddressDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateAdminDto.html" data-type="entity-link" >CreateAdminDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateBlogDto.html" data-type="entity-link" >CreateBlogDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateBrandDto.html" data-type="entity-link" >CreateBrandDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateCartDto.html" data-type="entity-link" >CreateCartDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateCategoryDto.html" data-type="entity-link" >CreateCategoryDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateCouponDto.html" data-type="entity-link" >CreateCouponDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateCouponDto-1.html" data-type="entity-link" >CreateCouponDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateGhnDto.html" data-type="entity-link" >CreateGhnDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateNotificationDto.html" data-type="entity-link" >CreateNotificationDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateOrderDto.html" data-type="entity-link" >CreateOrderDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreatePreOrderDto.html" data-type="entity-link" >CreatePreOrderDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateProductDto.html" data-type="entity-link" >CreateProductDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateProductImageDto.html" data-type="entity-link" >CreateProductImageDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateRecommendationDto.html" data-type="entity-link" >CreateRecommendationDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateRevenueDto.html" data-type="entity-link" >CreateRevenueDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateReviewDto.html" data-type="entity-link" >CreateReviewDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateSearchDto.html" data-type="entity-link" >CreateSearchDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateSliderDto.html" data-type="entity-link" >CreateSliderDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateUserDto.html" data-type="entity-link" >CreateUserDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateWishlistDto.html" data-type="entity-link" >CreateWishlistDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/DashboardStatsResponseDto.html" data-type="entity-link" >DashboardStatsResponseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/ForgotPasswordDto.html" data-type="entity-link" >ForgotPasswordDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetUsersQueryDto.html" data-type="entity-link" >GetUsersQueryDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/Ghn.html" data-type="entity-link" >Ghn</a>
                            </li>
                            <li class="link">
                                <a href="classes/GhnDistrictDto.html" data-type="entity-link" >GhnDistrictDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/GhnProvinceDto.html" data-type="entity-link" >GhnProvinceDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/GhnWardDto.html" data-type="entity-link" >GhnWardDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/InsufficientStockException.html" data-type="entity-link" >InsufficientStockException</a>
                            </li>
                            <li class="link">
                                <a href="classes/LoginDto.html" data-type="entity-link" >LoginDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/LoginResponseDto.html" data-type="entity-link" >LoginResponseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/LoginWithGoogleDto.html" data-type="entity-link" >LoginWithGoogleDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/MaxOrderQuantityExceededException.html" data-type="entity-link" >MaxOrderQuantityExceededException</a>
                            </li>
                            <li class="link">
                                <a href="classes/MonthlyRevenueResponseDto.html" data-type="entity-link" >MonthlyRevenueResponseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/Notification.html" data-type="entity-link" >Notification</a>
                            </li>
                            <li class="link">
                                <a href="classes/NotificationResponseDto.html" data-type="entity-link" >NotificationResponseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/OrderDetailResponse.html" data-type="entity-link" >OrderDetailResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/OrderItemInputDto.html" data-type="entity-link" >OrderItemInputDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/OrderResponse.html" data-type="entity-link" >OrderResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/OrdersByStatusDto.html" data-type="entity-link" >OrdersByStatusDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/PaginatedNotificationResponseDto.html" data-type="entity-link" >PaginatedNotificationResponseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/PaginationQueryDto.html" data-type="entity-link" >PaginationQueryDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/PreOrder.html" data-type="entity-link" >PreOrder</a>
                            </li>
                            <li class="link">
                                <a href="classes/ProductBannedException.html" data-type="entity-link" >ProductBannedException</a>
                            </li>
                            <li class="link">
                                <a href="classes/ProductImageResponseDto.html" data-type="entity-link" >ProductImageResponseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/ProductResponseDto.html" data-type="entity-link" >ProductResponseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/ProductSearchDto.html" data-type="entity-link" >ProductSearchDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/RecommendationResponseDto.html" data-type="entity-link" >RecommendationResponseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/RegisterDto.html" data-type="entity-link" >RegisterDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/ResetPasswordDto.html" data-type="entity-link" >ResetPasswordDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/Review.html" data-type="entity-link" >Review</a>
                            </li>
                            <li class="link">
                                <a href="classes/Search.html" data-type="entity-link" >Search</a>
                            </li>
                            <li class="link">
                                <a href="classes/SelectedItemDto.html" data-type="entity-link" >SelectedItemDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/ShippingFeeRequestDto.html" data-type="entity-link" >ShippingFeeRequestDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/ShippingFeeResponseDto.html" data-type="entity-link" >ShippingFeeResponseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/SliderAdminResponse.html" data-type="entity-link" >SliderAdminResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/SliderPublicResponse.html" data-type="entity-link" >SliderPublicResponse</a>
                            </li>
                            <li class="link">
                                <a href="classes/SocialAccount.html" data-type="entity-link" >SocialAccount</a>
                            </li>
                            <li class="link">
                                <a href="classes/SuggestionQueryDto.html" data-type="entity-link" >SuggestionQueryDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/ToggleWishlistDto.html" data-type="entity-link" >ToggleWishlistDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/TrackingBehaviorBatchDto.html" data-type="entity-link" >TrackingBehaviorBatchDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/TrackingBehaviorItemDto.html" data-type="entity-link" >TrackingBehaviorItemDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateAddressDto.html" data-type="entity-link" >UpdateAddressDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateAdminDto.html" data-type="entity-link" >UpdateAdminDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateBlogDto.html" data-type="entity-link" >UpdateBlogDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateBrandDto.html" data-type="entity-link" >UpdateBrandDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateCartDto.html" data-type="entity-link" >UpdateCartDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateCartItemNoteDto.html" data-type="entity-link" >UpdateCartItemNoteDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateCartItemQuantityDto.html" data-type="entity-link" >UpdateCartItemQuantityDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateCategoryDto.html" data-type="entity-link" >UpdateCategoryDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateCouponDto.html" data-type="entity-link" >UpdateCouponDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateGhnDto.html" data-type="entity-link" >UpdateGhnDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateNotificationDto.html" data-type="entity-link" >UpdateNotificationDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateOrderDto.html" data-type="entity-link" >UpdateOrderDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateOrderItemsDto.html" data-type="entity-link" >UpdateOrderItemsDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateOrderStatusDto.html" data-type="entity-link" >UpdateOrderStatusDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdatePreOrderDto.html" data-type="entity-link" >UpdatePreOrderDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateProductDto.html" data-type="entity-link" >UpdateProductDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateRecommendationDto.html" data-type="entity-link" >UpdateRecommendationDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateRevenueDto.html" data-type="entity-link" >UpdateRevenueDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateReviewDto.html" data-type="entity-link" >UpdateReviewDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateSearchDto.html" data-type="entity-link" >UpdateSearchDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateSliderDto.html" data-type="entity-link" >UpdateSliderDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateUserDto.html" data-type="entity-link" >UpdateUserDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateWishlistDto.html" data-type="entity-link" >UpdateWishlistDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpsertCartItemDto.html" data-type="entity-link" >UpsertCartItemDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserBehavior.html" data-type="entity-link" >UserBehavior</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserInfo.html" data-type="entity-link" >UserInfo</a>
                            </li>
                            <li class="link">
                                <a href="classes/Wishlist.html" data-type="entity-link" >Wishlist</a>
                            </li>
                            <li class="link">
                                <a href="classes/WishlistStatusResponseDto.html" data-type="entity-link" >WishlistStatusResponseDto</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#injectables-links"' :
                                'data-bs-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/AddressService.html" data-type="entity-link" >AddressService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AdminService.html" data-type="entity-link" >AdminService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AppService.html" data-type="entity-link" >AppService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AuthService.html" data-type="entity-link" >AuthService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/BlogsService.html" data-type="entity-link" >BlogsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/BrandsService.html" data-type="entity-link" >BrandsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CartService.html" data-type="entity-link" >CartService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CategoriesService.html" data-type="entity-link" >CategoriesService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CloudinaryService.html" data-type="entity-link" >CloudinaryService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CouponsService.html" data-type="entity-link" >CouponsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/DatabaseOptimizerService.html" data-type="entity-link" >DatabaseOptimizerService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/DataInitializer.html" data-type="entity-link" >DataInitializer</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/GhnService.html" data-type="entity-link" >GhnService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/GoogleService.html" data-type="entity-link" >GoogleService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/HbsRenderService.html" data-type="entity-link" >HbsRenderService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/HomePageService.html" data-type="entity-link" >HomePageService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/InventoryService.html" data-type="entity-link" >InventoryService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/JwtAuthGuard.html" data-type="entity-link" >JwtAuthGuard</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/JwtStrategy.html" data-type="entity-link" >JwtStrategy</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/NotificationsService.html" data-type="entity-link" >NotificationsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/OrdersService.html" data-type="entity-link" >OrdersService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PreOrdersService.html" data-type="entity-link" >PreOrdersService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ProductsService.html" data-type="entity-link" >ProductsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/RecommendationService.html" data-type="entity-link" >RecommendationService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/RevenuesService.html" data-type="entity-link" >RevenuesService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ReviewsService.html" data-type="entity-link" >ReviewsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SearchService.html" data-type="entity-link" >SearchService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SlidersService.html" data-type="entity-link" >SlidersService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SocialAccountsService.html" data-type="entity-link" >SocialAccountsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TemplateEditorService.html" data-type="entity-link" >TemplateEditorService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TokenService.html" data-type="entity-link" >TokenService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TrackingService.html" data-type="entity-link" >TrackingService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UsersService.html" data-type="entity-link" >UsersService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/VnpayService.html" data-type="entity-link" >VnpayService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/WishlistsService.html" data-type="entity-link" >WishlistsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ZipExportService.html" data-type="entity-link" >ZipExportService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#guards-links"' :
                            'data-bs-target="#xs-guards-links"' }>
                            <span class="icon ion-ios-lock"></span>
                            <span>Guards</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="guards-links"' : 'id="xs-guards-links"' }>
                            <li class="link">
                                <a href="guards/RolesGuard.html" data-type="entity-link" >RolesGuard</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#interfaces-links"' :
                            'data-bs-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/CompoDocConfig.html" data-type="entity-link" >CompoDocConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/GhnBaseResponse.html" data-type="entity-link" >GhnBaseResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/JwtPayload.html" data-type="entity-link" >JwtPayload</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Session.html" data-type="entity-link" >Session</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Template.html" data-type="entity-link" >Template</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <a data-type="chapter-link" href="routes.html"><span class="icon ion-ios-git-branch"></span>Routes</a>
                        </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank" rel="noopener noreferrer">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});