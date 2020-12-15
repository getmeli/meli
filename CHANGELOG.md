# [1.0.0-beta.6](https://github.com/getmeli/meli/compare/v1.0.0-beta.5...v1.0.0-beta.6) (2020-12-15)


### Bug Fixes

* **ssl:** default domains missing in acme domains ([719fef8](https://github.com/getmeli/meli/commit/719fef8c5cb9bf136f5639af21e726a856d6a621))

# [1.0.0-beta.5](https://github.com/getmeli/meli/compare/v1.0.0-beta.4...v1.0.0-beta.5) (2020-12-14)


### Bug Fixes

* improve ssl support ([8e8778e](https://github.com/getmeli/meli/commit/8e8778ea70719cc50477cd6df27aa70a03c0b325))
* migrations directory is reuqired ([#4](https://github.com/getmeli/meli/issues/4)) ([b6c0778](https://github.com/getmeli/meli/commit/b6c0778dd107bfffd7cb1c7dc788b28daf5795fc))
* password protection conflicts with route matching ([3cc960f](https://github.com/getmeli/meli/commit/3cc960f6078a2e226942addd4d11fd7cc059df5a))
* setting branch password crashes meli ([#6](https://github.com/getmeli/meli/issues/6)) ([513c7df](https://github.com/getmeli/meli/commit/513c7df36b407a4a6b3f9fd3d17404af1e09e7eb))
* site 404 not matched ([249fbd5](https://github.com/getmeli/meli/commit/249fbd505a308e873417263dc78103bb15a6530e))
* ssl support for auto domains ([12cf89f](https://github.com/getmeli/meli/commit/12cf89f5e93a638e026e511935ccceb3c403d213))
* **unified:** entrypoint not executable ([1196e5a](https://github.com/getmeli/meli/commit/1196e5ab9ae7eb0978ca7fadc525d2f81c6d8d9c))
* uniffied docker image extends outdated UI image ([0532af2](https://github.com/getmeli/meli/commit/0532af26629c3daf2e70fa15afeb218183d0df04))


### chore

* remove MELI_BCRYPT_SALTROUNDS env var ([04eaec0](https://github.com/getmeli/meli/commit/04eaec0268a4437652a08fcad3f6fbcf67f1461b))


### Features

* add var for api path ([fdb8eed](https://github.com/getmeli/meli/commit/fdb8eed843a0599954af7ce29d8d42e6b7a20e9e))
* handle static response for 404 and 523 in caddy ([abd1272](https://github.com/getmeli/meli/commit/abd12728f62907c126fb20290d72aa1396b8e6b1))
* rollback adding api path ([61aab54](https://github.com/getmeli/meli/commit/61aab54ee8455f017e834559617e3f8c272e1183))
* site wide password ([#7](https://github.com/getmeli/meli/issues/7)) ([b08fdac](https://github.com/getmeli/meli/commit/b08fdac613577eb5edb767559ca31afda3b9d0c9))
* spa mode ([#5](https://github.com/getmeli/meli/issues/5)) ([79c2cce](https://github.com/getmeli/meli/commit/79c2cce092708772d31f7723e1bd9280bffd7b04))


### Performance Improvements

* enhance dockerfile caching ([34a3fd2](https://github.com/getmeli/meli/commit/34a3fd2a4cd931823f5134d950a61a227e2126eb))


### BREAKING CHANGES

* MELI_BCRYPT_SALTROUNDS was removed

# [1.0.0-beta.4](https://github.com/getmeli/meli/compare/v1.0.0-beta.3...v1.0.0-beta.4) (2020-12-12)


### Bug Fixes

* incorrect license change date ([55ca88a](https://github.com/getmeli/meli/commit/55ca88a0dbcb45485f025a9ec8fe310a2cfab38c))
* incorrect license change date ([516bed7](https://github.com/getmeli/meli/commit/516bed74d69ef5a61a5552431781c400a85dc5cd))

# [1.0.0-beta.3](https://github.com/getmeli/meli/compare/v1.0.0-beta.2...v1.0.0-beta.3) (2020-12-12)


### Bug Fixes

* license change date is incorrect ([e7dcf82](https://github.com/getmeli/meli/commit/e7dcf82a73af06150b2bf291524bde8e4db59007))

# [1.0.0-beta.2](https://github.com/getmeli/meli/compare/v1.0.0-beta.1...v1.0.0-beta.2) (2020-12-10)


### Bug Fixes

* **auth:** catch verify token error ([01dbcc7](https://github.com/getmeli/meli/commit/01dbcc7dcfb71441b735b9c1130c621c87fe44b3))
* **caddy:** match host without port ([eeeaefe](https://github.com/getmeli/meli/commit/eeeaefe7906fb48b89fed0fd66b5f104bb1e4fa1))
* **standalone:** ui env not generated ([6224964](https://github.com/getmeli/meli/commit/622496423c7c5cbe4dc1217e7321413bc5e305c2))
* **standalone:** update entrypoint ([1ef2b4b](https://github.com/getmeli/meli/commit/1ef2b4b11ee69b94ffb37b68dd5deca70dd8a292))
* **standalone:** write ui env file in entrypoint ([e73626e](https://github.com/getmeli/meli/commit/e73626e51a0a251a078450abb189a465e569950e))
* caddy config uses site url instead of host ([7649c3b](https://github.com/getmeli/meli/commit/7649c3b5ad6df9ec9e38e7cb384903142fc465b0))
* cannot update site when no main branch selected ([eb34433](https://github.com/getmeli/meli/commit/eb3443319d86dc00c1328c318b69525a456d6e3c))
* deadlock during caddy config reload ([ac8ba64](https://github.com/getmeli/meli/commit/ac8ba64225a6964361af6ad9e15756a10255c560))
* default email template dir doesn't match docker setup ([a07c630](https://github.com/getmeli/meli/commit/a07c630a53fec2d01e4f405a221f6b3398f2a2fc))
* disable ssl for sites temporarily ([4477259](https://github.com/getmeli/meli/commit/44772595634660b315cc4d456d47b5b8556fc2a2))
* docker image overrides ui in dockerhub ([2596103](https://github.com/getmeli/meli/commit/259610386db09ca88b913d512f332c95f2f4d919))
* duplicate index key error team.member undefined ([10341f2](https://github.com/getmeli/meli/commit/10341f245c10f00214c43f2f1a797270d89cbfb5))
* email template dir incorrect ([13fd39c](https://github.com/getmeli/meli/commit/13fd39c33b814009e72a4a01f71a1454b659cd21))
* fallback host should use host, not url ([48dd216](https://github.com/getmeli/meli/commit/48dd2166dda6de8f24c49a13fde7b62d1ef797c8))
* missing default value error when sites dir not set ([82a1336](https://github.com/getmeli/meli/commit/82a1336859813661faf8a89e018346b7653c7a88))
* missing guard on current org member endpoint ([5f4945b](https://github.com/getmeli/meli/commit/5f4945b4efcdd5d8e0b054b74c9b61797e641420))
* missing migrations dir in unified docker image ([919e12c](https://github.com/getmeli/meli/commit/919e12c2178b3e7ed8594b852b2b81c952f58854))
* missing sparse index option ([1e65d14](https://github.com/getmeli/meli/commit/1e65d141fd482d1e064def5a7aaac8d2b342e017))
* mongo index error on site ([190fb00](https://github.com/getmeli/meli/commit/190fb00ab543cecfd79380a0ce1cdf428440e9cb))
* more indexes causing issues ([dc384c1](https://github.com/getmeli/meli/commit/dc384c1d35b92c8e1f8e4b02db95b5b52d8d0f6c))
* more indexes causing issues ([aade94c](https://github.com/getmeli/meli/commit/aade94caf1a832a718625ce6f87f4825ce38a6f9))
* more indexes causing issues ([2b091d6](https://github.com/getmeli/meli/commit/2b091d61f3fcc9a7c30c882abd0cc85ca5030b54))
* only use host part of sites url ([ca2f07a](https://github.com/getmeli/meli/commit/ca2f07a85f1bec89bff313bd196a5ff018282e4f))
* persist caddy config and resume it on restart ([d8f01f3](https://github.com/getmeli/meli/commit/d8f01f371ee840e80dd9373ccefbbf0bc671be9a))
* reconfigure site in caddy on release upload ([d374427](https://github.com/getmeli/meli/commit/d374427f45bce08cbe2869f8e85ad8464fc3a242))
* remove all hook indexes ([4e3dd95](https://github.com/getmeli/meli/commit/4e3dd95cb0ed329389572183ead08ea5b861a83b))
* remove index on team.hooks ([d39c93d](https://github.com/getmeli/meli/commit/d39c93da5af2c7cc97c21c3eb340fa8362378dc4))
* site main branch is required ([2420ad4](https://github.com/getmeli/meli/commit/2420ad44241d39681c550b61d383a818a46eb3fa))
* site name index should be 1, not text ([33d2948](https://github.com/getmeli/meli/commit/33d294898d1d7a1e07fc37287174bca84a98718e))
* try to fix SSL ([f8acc33](https://github.com/getmeli/meli/commit/f8acc33c9d67d4cfe56a1ff1a508093d05cd2ebc))
* typo in 523 page ([eb00f57](https://github.com/getmeli/meli/commit/eb00f57c2433566026216c7a1c4d480f998d71f1))
* ui responds only to / ([eb09f41](https://github.com/getmeli/meli/commit/eb09f411e9713fe3a53fcfff5ee18d740add0c95))
* unique options causes issues on name text index ([729bcd0](https://github.com/getmeli/meli/commit/729bcd0f6ce6828b3693ce72cb96a8fac17e2e3b))
* use sparse index for array fields ([0f037f9](https://github.com/getmeli/meli/commit/0f037f99cb27f46f9748817d23c7d27b2a7a6e51))
* wildcard fallback causes tls errors ([6a612cb](https://github.com/getmeli/meli/commit/6a612cb32ecff1f71ef30bb35b606be70b91a4bc))


### Features

* add fallback for unknown hosts ([9e0df52](https://github.com/getmeli/meli/commit/9e0df52e025f215c7258bf741c6bc28db18fe1bb))
* add hook payloads ([e209fbd](https://github.com/getmeli/meli/commit/e209fbd842ffc2a256104b53ef96025b6f4e9d58))
* add system info route ([daac2b3](https://github.com/getmeli/meli/commit/daac2b30deabedcd5a952eccb7ac45b6adf05aa7))
* allow limiting max orgs ([e9720e9](https://github.com/getmeli/meli/commit/e9720e923173a9e0e3b3c3e64151b6d9395d2180))
* basic ssl configuration ([d2ce463](https://github.com/getmeli/meli/commit/d2ce463fe600b3ee3d7c319226a0d16d59c4d693))
* configure caddy to server api and ui ([5a3566a](https://github.com/getmeli/meli/commit/5a3566a5af74db602bf06be4086245b2fd6bbc2a))
* debug log env ([58153d9](https://github.com/getmeli/meli/commit/58153d9c0eb6ad551724a0c3e1a2b1376633073a))
* default sites domain to main host ([c2ff7a2](https://github.com/getmeli/meli/commit/c2ff7a29c6696c05650479c0a97dba9f90f8012f))
* do not use promise all when creating indexes ([2c7ebed](https://github.com/getmeli/meli/commit/2c7ebed571f7eef9e06e9cb1a99c7b4e129ba874))
* enhance error logging ([a039fee](https://github.com/getmeli/meli/commit/a039fee21fa94967eed5bab188124c5e0e3a019e))
* force redirect path to start with slash ([b3f29e5](https://github.com/getmeli/meli/commit/b3f29e5ef35b69ee241b784b8b92e3e9e5d8ebbe))
* in-memory login with user and password ([36c7cd5](https://github.com/getmeli/meli/commit/36c7cd51a1388c3aeb6d7ebd4f38c0cf931c3d1f))
* make email config optional ([a5194f2](https://github.com/getmeli/meli/commit/a5194f2b392859218117e8a92696e79b234bd3de))
* make index creation non-blocking ([1ee2b7b](https://github.com/getmeli/meli/commit/1ee2b7bee40d51c0124f0c313d35f926f81ee1d5))
* option to disable caddy config for ui/api ([3629cbb](https://github.com/getmeli/meli/commit/3629cbb87d3ebde433cc6a2b6beeea4c18148921))
* redirect 404 to each site /404.html ([050268f](https://github.com/getmeli/meli/commit/050268f73866a402638ed308749b6f5b9ca08c0e))
* remove ssl env vars ([4ffceb0](https://github.com/getmeli/meli/commit/4ffceb0f44eb411bda9b345d1ea6389df4eeb71a))
* rename debug scope ([4e5848a](https://github.com/getmeli/meli/commit/4e5848ac6cf1945c42b441e87c4cc71ca81ac8f2))
* rename docker image ([8a90e48](https://github.com/getmeli/meli/commit/8a90e48b5224243b22ffc7122b927e45fe28e285))
* rename env vars that require a url ([786534a](https://github.com/getmeli/meli/commit/786534a5da0864a07ad27159db95e0f1b8fffd4e))
* simplify deployment ([c53702c](https://github.com/getmeli/meli/commit/c53702c5380c1c03ca2a194f727988006bded84b))
* simplify env configuration ([a6ff61f](https://github.com/getmeli/meli/commit/a6ff61fbfb2bba8bea1b57c887b61fba2b11c8fd))
* specify jwt token expiration as ms ([4477640](https://github.com/getmeli/meli/commit/4477640da05e589af940411cdeaebd66f702d9e9))
* split authentication methods and org access check ([8877034](https://github.com/getmeli/meli/commit/887703419a22bf9c9d680458cdb8e7d29a976957))
* split env and env spec ([7be1864](https://github.com/getmeli/meli/commit/7be18649d257f67b882fa42a7d49884f6e760831))
* unified docker image ([7e19fe5](https://github.com/getmeli/meli/commit/7e19fe547f3ea343a9930e65f15af31d7310fc25))
* update site main branch when none is defined ([9377e81](https://github.com/getmeli/meli/commit/9377e818dff4377ae0116aebf13dedc7b00a2cbd))
* update unified image ([4762554](https://github.com/getmeli/meli/commit/4762554f1eef669b389762f416799d6dcbf74d8a))

# [1.0.0-next.44](https://github.com/getmeli/meli/compare/v1.0.0-next.43...v1.0.0-next.44) (2020-12-10)


### Bug Fixes

* **standalone:** update entrypoint ([1ef2b4b](https://github.com/getmeli/meli/commit/1ef2b4b11ee69b94ffb37b68dd5deca70dd8a292))

# [1.0.0-next.43](https://github.com/getmeli/meli/compare/v1.0.0-next.42...v1.0.0-next.43) (2020-12-10)


### Bug Fixes

* **auth:** catch verify token error ([01dbcc7](https://github.com/getmeli/meli/commit/01dbcc7dcfb71441b735b9c1130c621c87fe44b3))
* **standalone:** write ui env file in entrypoint ([e73626e](https://github.com/getmeli/meli/commit/e73626e51a0a251a078450abb189a465e569950e))

# [1.0.0-next.42](https://github.com/getmeli/meli/compare/v1.0.0-next.41...v1.0.0-next.42) (2020-12-10)


### Bug Fixes

* **standalone:** ui env not generated ([6224964](https://github.com/getmeli/meli/commit/622496423c7c5cbe4dc1217e7321413bc5e305c2))

# [1.0.0-next.41](https://github.com/getmeli/meli/compare/v1.0.0-next.40...v1.0.0-next.41) (2020-12-10)


### Bug Fixes

* ui responds only to / ([eb09f41](https://github.com/getmeli/meli/commit/eb09f411e9713fe3a53fcfff5ee18d740add0c95))

# [1.0.0-next.40](https://github.com/getmeli/meli/compare/v1.0.0-next.39...v1.0.0-next.40) (2020-12-10)


### Bug Fixes

* **caddy:** match host without port ([eeeaefe](https://github.com/getmeli/meli/commit/eeeaefe7906fb48b89fed0fd66b5f104bb1e4fa1))
* typo in 523 page ([eb00f57](https://github.com/getmeli/meli/commit/eb00f57c2433566026216c7a1c4d480f998d71f1))

# [1.0.0-next.39](https://github.com/getmeli/meli/compare/v1.0.0-next.38...v1.0.0-next.39) (2020-12-10)


### Bug Fixes

* missing migrations dir in unified docker image ([919e12c](https://github.com/getmeli/meli/commit/919e12c2178b3e7ed8594b852b2b81c952f58854))

# [1.0.0-next.38](https://github.com/getmeli/meli/compare/v1.0.0-next.37...v1.0.0-next.38) (2020-12-10)


### Bug Fixes

* site name index should be 1, not text ([33d2948](https://github.com/getmeli/meli/commit/33d294898d1d7a1e07fc37287174bca84a98718e))

# [1.0.0-next.37](https://github.com/getmeli/meli/compare/v1.0.0-next.36...v1.0.0-next.37) (2020-12-10)


### Bug Fixes

* unique options causes issues on name text index ([729bcd0](https://github.com/getmeli/meli/commit/729bcd0f6ce6828b3693ce72cb96a8fac17e2e3b))


### Features

* enhance error logging ([a039fee](https://github.com/getmeli/meli/commit/a039fee21fa94967eed5bab188124c5e0e3a019e))
* make index creation non-blocking ([1ee2b7b](https://github.com/getmeli/meli/commit/1ee2b7bee40d51c0124f0c313d35f926f81ee1d5))

# [1.0.0-next.36](https://github.com/getmeli/meli/compare/v1.0.0-next.35...v1.0.0-next.36) (2020-12-10)


### Features

* do not use promise all when creating indexes ([2c7ebed](https://github.com/getmeli/meli/commit/2c7ebed571f7eef9e06e9cb1a99c7b4e129ba874))

# [1.0.0-next.35](https://github.com/getmeli/meli/compare/v1.0.0-next.34...v1.0.0-next.35) (2020-12-10)


### Bug Fixes

* missing sparse index option ([1e65d14](https://github.com/getmeli/meli/commit/1e65d141fd482d1e064def5a7aaac8d2b342e017))
* use sparse index for array fields ([0f037f9](https://github.com/getmeli/meli/commit/0f037f99cb27f46f9748817d23c7d27b2a7a6e51))

# [1.0.0-next.34](https://github.com/getmeli/meli/compare/v1.0.0-next.33...v1.0.0-next.34) (2020-12-10)


### Features

* update site main branch when none is defined ([9377e81](https://github.com/getmeli/meli/commit/9377e818dff4377ae0116aebf13dedc7b00a2cbd))

# [1.0.0-next.33](https://github.com/getmeli/meli/compare/v1.0.0-next.32...v1.0.0-next.33) (2020-12-10)


### Bug Fixes

* more indexes causing issues ([dc384c1](https://github.com/getmeli/meli/commit/dc384c1d35b92c8e1f8e4b02db95b5b52d8d0f6c))

# [1.0.0-next.32](https://github.com/getmeli/meli/compare/v1.0.0-next.31...v1.0.0-next.32) (2020-12-10)


### Bug Fixes

* more indexes causing issues ([aade94c](https://github.com/getmeli/meli/commit/aade94caf1a832a718625ce6f87f4825ce38a6f9))

# [1.0.0-next.31](https://github.com/getmeli/meli/compare/v1.0.0-next.30...v1.0.0-next.31) (2020-12-10)


### Bug Fixes

* cannot update site when no main branch selected ([eb34433](https://github.com/getmeli/meli/commit/eb3443319d86dc00c1328c318b69525a456d6e3c))
* more indexes causing issues ([2b091d6](https://github.com/getmeli/meli/commit/2b091d61f3fcc9a7c30c882abd0cc85ca5030b54))

# [1.0.0-next.30](https://github.com/getmeli/meli/compare/v1.0.0-next.29...v1.0.0-next.30) (2020-12-10)


### Bug Fixes

* mongo index error on site ([190fb00](https://github.com/getmeli/meli/commit/190fb00ab543cecfd79380a0ce1cdf428440e9cb))
* site main branch is required ([2420ad4](https://github.com/getmeli/meli/commit/2420ad44241d39681c550b61d383a818a46eb3fa))

# [1.0.0-next.29](https://github.com/getmeli/meli/compare/v1.0.0-next.28...v1.0.0-next.29) (2020-12-10)


### Bug Fixes

* duplicate index key error team.member undefined ([10341f2](https://github.com/getmeli/meli/commit/10341f245c10f00214c43f2f1a797270d89cbfb5))

# [1.0.0-next.28](https://github.com/getmeli/meli/compare/v1.0.0-next.27...v1.0.0-next.28) (2020-12-09)


### Features

* update unified image ([4762554](https://github.com/getmeli/meli/commit/4762554f1eef669b389762f416799d6dcbf74d8a))

# [1.0.0-next.27](https://github.com/getmeli/meli/compare/v1.0.0-next.26...v1.0.0-next.27) (2020-12-09)


### Features

* remove ssl env vars ([4ffceb0](https://github.com/getmeli/meli/commit/4ffceb0f44eb411bda9b345d1ea6389df4eeb71a))
* specify jwt token expiration as ms ([4477640](https://github.com/getmeli/meli/commit/4477640da05e589af940411cdeaebd66f702d9e9))
* split env and env spec ([7be1864](https://github.com/getmeli/meli/commit/7be18649d257f67b882fa42a7d49884f6e760831))

# [1.0.0-next.26](https://github.com/getmeli/meli/compare/v1.0.0-next.25...v1.0.0-next.26) (2020-12-08)


### Features

* add system info route ([daac2b3](https://github.com/getmeli/meli/commit/daac2b30deabedcd5a952eccb7ac45b6adf05aa7))

# [1.0.0-next.25](https://github.com/getmeli/meli/compare/v1.0.0-next.24...v1.0.0-next.25) (2020-12-08)


### Features

* option to disable caddy config for ui/api ([3629cbb](https://github.com/getmeli/meli/commit/3629cbb87d3ebde433cc6a2b6beeea4c18148921))

# [1.0.0-next.24](https://github.com/getmeli/meli/compare/v1.0.0-next.23...v1.0.0-next.24) (2020-12-08)


### Features

* unified docker image ([7e19fe5](https://github.com/getmeli/meli/commit/7e19fe547f3ea343a9930e65f15af31d7310fc25))

# [1.0.0-next.23](https://github.com/getmeli/meli/compare/v1.0.0-next.22...v1.0.0-next.23) (2020-12-07)


### Bug Fixes

* deadlock during caddy config reload ([ac8ba64](https://github.com/getmeli/meli/commit/ac8ba64225a6964361af6ad9e15756a10255c560))

# [1.0.0-next.22](https://github.com/getmeli/meli/compare/v1.0.0-next.21...v1.0.0-next.22) (2020-12-07)


### Features

* add fallback for unknown hosts ([9e0df52](https://github.com/getmeli/meli/commit/9e0df52e025f215c7258bf741c6bc28db18fe1bb))

# [1.0.0-next.21](https://github.com/getmeli/meli/compare/v1.0.0-next.20...v1.0.0-next.21) (2020-12-07)


### Features

* add hook payloads ([e209fbd](https://github.com/getmeli/meli/commit/e209fbd842ffc2a256104b53ef96025b6f4e9d58))

# [1.0.0-next.20](https://github.com/getmeli/meli/compare/v1.0.0-next.19...v1.0.0-next.20) (2020-12-07)


### Features

* allow limiting max orgs ([e9720e9](https://github.com/getmeli/meli/commit/e9720e923173a9e0e3b3c3e64151b6d9395d2180))

# [1.0.0-next.19](https://github.com/getmeli/meli/compare/v1.0.0-next.18...v1.0.0-next.19) (2020-12-07)


### Bug Fixes

* missing guard on current org member endpoint ([5f4945b](https://github.com/getmeli/meli/commit/5f4945b4efcdd5d8e0b054b74c9b61797e641420))


### Features

* redirect 404 to each site /404.html ([050268f](https://github.com/getmeli/meli/commit/050268f73866a402638ed308749b6f5b9ca08c0e))

# [1.0.0-next.18](https://github.com/getmeli/meli/compare/v1.0.0-next.17...v1.0.0-next.18) (2020-12-06)


### Features

* in-memory login with user and password ([36c7cd5](https://github.com/getmeli/meli/commit/36c7cd51a1388c3aeb6d7ebd4f38c0cf931c3d1f))

# [1.0.0-next.17](https://github.com/getmeli/meli/compare/v1.0.0-next.16...v1.0.0-next.17) (2020-12-05)


### Features

* rename debug scope ([4e5848a](https://github.com/getmeli/meli/commit/4e5848ac6cf1945c42b441e87c4cc71ca81ac8f2))
* rename env vars that require a url ([786534a](https://github.com/getmeli/meli/commit/786534a5da0864a07ad27159db95e0f1b8fffd4e))

# [1.0.0-next.16](https://github.com/getmeli/meli/compare/v1.0.0-next.15...v1.0.0-next.16) (2020-12-05)


### Bug Fixes

* wildcard fallback causes tls errors ([6a612cb](https://github.com/getmeli/meli/commit/6a612cb32ecff1f71ef30bb35b606be70b91a4bc))

# [1.0.0-next.15](https://github.com/getmeli/meli/compare/v1.0.0-next.14...v1.0.0-next.15) (2020-12-05)


### Features

* debug log env ([58153d9](https://github.com/getmeli/meli/commit/58153d9c0eb6ad551724a0c3e1a2b1376633073a))
* make email config optional ([a5194f2](https://github.com/getmeli/meli/commit/a5194f2b392859218117e8a92696e79b234bd3de))

# [1.0.0-next.14](https://github.com/getmeli/meli/compare/v1.0.0-next.13...v1.0.0-next.14) (2020-12-05)


### Bug Fixes

* persist caddy config and resume it on restart ([d8f01f3](https://github.com/getmeli/meli/commit/d8f01f371ee840e80dd9373ccefbbf0bc671be9a))

# [1.0.0-next.13](https://github.com/getmeli/meli/compare/v1.0.0-next.12...v1.0.0-next.13) (2020-12-04)


### Bug Fixes

* fallback host should use host, not url ([48dd216](https://github.com/getmeli/meli/commit/48dd2166dda6de8f24c49a13fde7b62d1ef797c8))

# [1.0.0-next.12](https://github.com/getmeli/meli/compare/v1.0.0-next.11...v1.0.0-next.12) (2020-12-04)


### Bug Fixes

* email template dir incorrect ([13fd39c](https://github.com/getmeli/meli/commit/13fd39c33b814009e72a4a01f71a1454b659cd21))

# [1.0.0-next.11](https://github.com/getmeli/meli/compare/v1.0.0-next.10...v1.0.0-next.11) (2020-12-04)


### Bug Fixes

* caddy config uses site url instead of host ([7649c3b](https://github.com/getmeli/meli/commit/7649c3b5ad6df9ec9e38e7cb384903142fc465b0))

# [1.0.0-next.10](https://github.com/getmeli/meli/compare/v1.0.0-next.9...v1.0.0-next.10) (2020-12-04)


### Bug Fixes

* only use host part of sites url ([ca2f07a](https://github.com/getmeli/meli/commit/ca2f07a85f1bec89bff313bd196a5ff018282e4f))
* reconfigure site in caddy on release upload ([d374427](https://github.com/getmeli/meli/commit/d374427f45bce08cbe2869f8e85ad8464fc3a242))

# [1.0.0-next.9](https://github.com/getmeli/meli/compare/v1.0.0-next.8...v1.0.0-next.9) (2020-12-04)


### Bug Fixes

* default email template dir doesn't match docker setup ([a07c630](https://github.com/getmeli/meli/commit/a07c630a53fec2d01e4f405a221f6b3398f2a2fc))

# [1.0.0-next.8](https://github.com/getmeli/meli/compare/v1.0.0-next.7...v1.0.0-next.8) (2020-12-04)


### Bug Fixes

* missing default value error when sites dir not set ([82a1336](https://github.com/getmeli/meli/commit/82a1336859813661faf8a89e018346b7653c7a88))
* remove all hook indexes ([4e3dd95](https://github.com/getmeli/meli/commit/4e3dd95cb0ed329389572183ead08ea5b861a83b))

# [1.0.0-next.7](https://github.com/getmeli/meli/compare/v1.0.0-next.6...v1.0.0-next.7) (2020-12-04)


### Bug Fixes

* remove index on team.hooks ([d39c93d](https://github.com/getmeli/meli/commit/d39c93da5af2c7cc97c21c3eb340fa8362378dc4))

# [1.0.0-next.6](https://github.com/getmeli/meli/compare/v1.0.0-next.5...v1.0.0-next.6) (2020-12-04)


### Bug Fixes

* try to fix SSL ([f8acc33](https://github.com/getmeli/meli/commit/f8acc33c9d67d4cfe56a1ff1a508093d05cd2ebc))

# [1.0.0-next.5](https://github.com/getmeli/meli/compare/v1.0.0-next.4...v1.0.0-next.5) (2020-12-04)


### Bug Fixes

* disable ssl for sites temporarily ([4477259](https://github.com/getmeli/meli/commit/44772595634660b315cc4d456d47b5b8556fc2a2))

# [1.0.0-next.4](https://github.com/getmeli/meli/compare/v1.0.0-next.3...v1.0.0-next.4) (2020-12-04)


### Features

* basic ssl configuration ([d2ce463](https://github.com/getmeli/meli/commit/d2ce463fe600b3ee3d7c319226a0d16d59c4d693))
* configure caddy to server api and ui ([5a3566a](https://github.com/getmeli/meli/commit/5a3566a5af74db602bf06be4086245b2fd6bbc2a))
* default sites domain to main host ([c2ff7a2](https://github.com/getmeli/meli/commit/c2ff7a29c6696c05650479c0a97dba9f90f8012f))
* force redirect path to start with slash ([b3f29e5](https://github.com/getmeli/meli/commit/b3f29e5ef35b69ee241b784b8b92e3e9e5d8ebbe))
* simplify deployment ([c53702c](https://github.com/getmeli/meli/commit/c53702c5380c1c03ca2a194f727988006bded84b))
* simplify env configuration ([a6ff61f](https://github.com/getmeli/meli/commit/a6ff61fbfb2bba8bea1b57c887b61fba2b11c8fd))
* split authentication methods and org access check ([8877034](https://github.com/getmeli/meli/commit/887703419a22bf9c9d680458cdb8e7d29a976957))

# [1.0.0-next.3](https://github.com/getmeli/meli/compare/v1.0.0-next.2...v1.0.0-next.3) (2020-12-02)


### Features

* rename docker image ([8a90e48](https://github.com/getmeli/meli/commit/8a90e48b5224243b22ffc7122b927e45fe28e285))

# [1.0.0-next.2](https://github.com/gomeli/meli/compare/v1.0.0-next.1...v1.0.0-next.2) (2020-12-02)


### Bug Fixes

* docker image overrides ui in dockerhub ([2596103](https://github.com/gomeli/meli/commit/259610386db09ca88b913d512f332c95f2f4d919))

# 1.0.0-beta.1 (2020-12-02)


### Features

* initial release ([391e883](https://github.com/gomeli/meli/commit/391e8839bd08ca7a99a8e4e29dd694a3c0e758c3))

# 1.0.0-next.1 (2020-12-02)


### Features

* initial release ([391e883](https://github.com/gomeli/meli/commit/391e8839bd08ca7a99a8e4e29dd694a3c0e758c3))

# [1.0.0-next.27](https://gitlab.charlie-bravo.be/meli/meli/compare/v1.0.0-next.26...v1.0.0-next.27) (2020-12-01)


### Bug Fixes

* cannot set branch release ([9f44bcb](https://gitlab.charlie-bravo.be/meli/meli/commit/9f44bcb383ba622f89e6b38bd447813bb73b7030))
* tokens not secure ([668a27e](https://gitlab.charlie-bravo.be/meli/meli/commit/668a27e218e8d36cff7b55e5ae652f82f4957dde))


### Features

* branch view ([a76fa91](https://gitlab.charlie-bravo.be/meli/meli/commit/a76fa91c0e62771ab2267ee5223bf699e007a4d3))
* redirects ([c364fad](https://gitlab.charlie-bravo.be/meli/meli/commit/c364fadabd435b6a4d6b11b27eba833a250adea1))

# [1.0.0-next.26](https://gitlab.charlie-bravo.be/meli/meli/compare/v1.0.0-next.25...v1.0.0-next.26) (2020-11-30)


### Features

* change site main branch using site update endpoint ([9c6abe9](https://gitlab.charlie-bravo.be/meli/meli/commit/9c6abe98a97afafe47edaacd7ca442c8560b19a6))

# [1.0.0-next.25](https://gitlab.charlie-bravo.be/meli/meli/compare/v1.0.0-next.24...v1.0.0-next.25) (2020-11-30)


### Features

* rename channel to branch ([bc4e0c1](https://gitlab.charlie-bravo.be/meli/meli/commit/bc4e0c120974d12244de6ea1a4635e51bc712ec4))

# [1.0.0-next.24](https://gitlab.charlie-bravo.be/meli/meli/compare/v1.0.0-next.23...v1.0.0-next.24) (2020-11-30)


### Bug Fixes

* **site:** don't require domains array ([989e86e](https://gitlab.charlie-bravo.be/meli/meli/commit/989e86e78d5133e9f735d7ee72cdd747f94cd5cc))

# [1.0.0-next.23](https://gitlab.charlie-bravo.be/meli/meli/compare/v1.0.0-next.22...v1.0.0-next.23) (2020-11-28)


### Bug Fixes

* **channels:** set release does not create symlink ([0a45f19](https://gitlab.charlie-bravo.be/meli/meli/commit/0a45f192aea2755838e7cdc862de13ddfec0bb58))

# [1.0.0-next.22](https://gitlab.charlie-bravo.be/meli/meli/compare/v1.0.0-next.21...v1.0.0-next.22) (2020-11-28)


### Features

* rename channel.envs to channel.files and fix channel url ([97ba1ab](https://gitlab.charlie-bravo.be/meli/meli/commit/97ba1ab977acedca009b78d3d7db404642d2aaaa))

# [1.0.0-next.21](https://gitlab.charlie-bravo.be/meli/meli/compare/v1.0.0-next.20...v1.0.0-next.21) (2020-11-28)


### Features

* channel files ([d19ad4e](https://gitlab.charlie-bravo.be/meli/meli/commit/d19ad4eca911203262657ab06034f280bf87628b))

# [1.0.0-next.20](https://gitlab.charlie-bravo.be/meli/meli/compare/v1.0.0-next.19...v1.0.0-next.20) (2020-11-27)


### Bug Fixes

* use channel id in caddy config ([999ac9a](https://gitlab.charlie-bravo.be/meli/meli/commit/999ac9adab61f08af910026048412eed1bca1fa0))

# [1.0.0-next.19](https://gitlab.charlie-bravo.be/meli/meli/compare/v1.0.0-next.18...v1.0.0-next.19) (2020-11-27)


### Bug Fixes

* fix caddy domains configuration ([e07886d](https://gitlab.charlie-bravo.be/meli/meli/commit/e07886d5dfb2b30f2f6048135307ce0064a701e3))

# [1.0.0-next.18](https://gitlab.charlie-bravo.be/meli/meli/compare/v1.0.0-next.17...v1.0.0-next.18) (2020-11-27)


### Features

* replace site.release with site.channel ([beb7383](https://gitlab.charlie-bravo.be/meli/meli/commit/beb7383bb0164b832a8a0d2419c8d12f13d996db))

# [1.0.0-next.17](https://gitlab.charlie-bravo.be/meli/meli/compare/v1.0.0-next.16...v1.0.0-next.17) (2020-11-27)


### Bug Fixes

* fix caddy domains configuration ([225ab12](https://gitlab.charlie-bravo.be/meli/meli/commit/225ab12ad820b35f2a50a0806128d74fc68f11bd))


### Features

* add ssl config to domains ([8d0be76](https://gitlab.charlie-bravo.be/meli/meli/commit/8d0be76d95fdf51f0f1606c992d48e2a761618b1))

# [1.0.0-next.16](https://gitlab.charlie-bravo.be/meli/meli/compare/v1.0.0-next.15...v1.0.0-next.16) (2020-11-27)


### Bug Fixes

* add channel id ([472d106](https://gitlab.charlie-bravo.be/meli/meli/commit/472d106be9e3006e03c7d29e2a2a09d4df98d000))

# [1.0.0-next.15](https://gitlab.charlie-bravo.be/meli/meli/compare/v1.0.0-next.14...v1.0.0-next.15) (2020-11-26)


### Features

* password protected pages ([5b6ddf5](https://gitlab.charlie-bravo.be/meli/meli/commit/5b6ddf5aec1cef982e9650670b50fe27155ffe01))

# [1.0.0-next.14](https://gitlab.charlie-bravo.be/meli/meli/compare/v1.0.0-next.13...v1.0.0-next.14) (2020-11-26)


### Features

* hooks ([bfdc25d](https://gitlab.charlie-bravo.be/meli/meli/commit/bfdc25da342c138c816fe4f50ffe56bbd7a422f2))

# [1.0.0-next.13](https://gitlab.charlie-bravo.be/meli/meli/compare/v1.0.0-next.12...v1.0.0-next.13) (2020-11-24)


### Bug Fixes

* update license release plugin ([2c9366c](https://gitlab.charlie-bravo.be/meli/meli/commit/2c9366c22a74264f59492ab1bd54d34c05299241))

# [1.0.0-next.12](https://gitlab.charlie-bravo.be/meli/meli/compare/v1.0.0-next.11...v1.0.0-next.12) (2020-11-24)


### Bug Fixes

* update license release plugin ([7bb0e39](https://gitlab.charlie-bravo.be/meli/meli/commit/7bb0e398e78f7d25385b1c01386185b604a7dfb0))

# [1.0.0-next.11](https://gitlab.charlie-bravo.be/meli/meli/compare/v1.0.0-next.10...v1.0.0-next.11) (2020-11-24)


### Bug Fixes

* update license release plugin ([87f97aa](https://gitlab.charlie-bravo.be/meli/meli/commit/87f97aa85ad815d44db094198b2c22e8f7495eff))

# [1.0.0-next.10](https://gitlab.charlie-bravo.be/meli/meli/compare/v1.0.0-next.9...v1.0.0-next.10) (2020-11-24)


### Bug Fixes

* update license release plugin ([4f39517](https://gitlab.charlie-bravo.be/meli/meli/commit/4f395177214a4a1bdf86a0c65b0a7c32e2212639))

# [1.0.0-next.9](https://gitlab.charlie-bravo.be/meli/meli/compare/v1.0.0-next.8...v1.0.0-next.9) (2020-11-24)


### Bug Fixes

* update license release plugin ([c5cecfe](https://gitlab.charlie-bravo.be/meli/meli/commit/c5cecfee2b1e7dece072c486707a3607e51f2a9b))
* update license release plugin ([293de10](https://gitlab.charlie-bravo.be/meli/meli/commit/293de104676b6d84fb6262a15b1c46898e8e40d2))

# [1.0.0-next.8](https://gitlab.charlie-bravo.be/meli/meli/compare/v1.0.0-next.7...v1.0.0-next.8) (2020-11-24)


### Bug Fixes

* update license release plugin ([e6f92f1](https://gitlab.charlie-bravo.be/meli/meli/commit/e6f92f1534858b8ad4aa308239ee30e8b720cafe))

# [1.0.0-next.7](https://gitlab.charlie-bravo.be/meli/meli/compare/v1.0.0-next.6...v1.0.0-next.7) (2020-11-24)


### Bug Fixes

* update readme ([fed4971](https://gitlab.charlie-bravo.be/meli/meli/commit/fed4971ae6f461dd5911db245449ccfbf8694c0d))

# [1.0.0-next.6](https://gitlab.charlie-bravo.be/meli/meli/compare/v1.0.0-next.5...v1.0.0-next.6) (2020-11-24)


### Bug Fixes

* update readme ([002b1c4](https://gitlab.charlie-bravo.be/meli/meli/commit/002b1c4b895813ef28b4c457963e35b1dd6d6c8c))

# [1.0.0-next.5](https://gitlab.charlie-bravo.be/meli/meli/compare/v1.0.0-next.4...v1.0.0-next.5) (2020-11-23)


### Features

* custom 404 pages ([cda640e](https://gitlab.charlie-bravo.be/meli/meli/commit/cda640e703d192b2951e6092e3915ac68eb00385))

# [1.0.0-next.4](https://gitlab.charlie-bravo.be/meli/meli/compare/v1.0.0-next.3...v1.0.0-next.4) (2020-11-23)


### Features

* change oauth routes [ci skip] ([2ff3fe7](https://gitlab.charlie-bravo.be/meli/meli/commit/2ff3fe7092bc9ae9dc66fff9327835fc6c01997a))
* disconnect user from all devices ([503211c](https://gitlab.charlie-bravo.be/meli/meli/commit/503211c741893409d305caaa4095058009e4d822))

# [1.0.0-next.3](https://gitlab.charlie-bravo.be/meli/meli/compare/v1.0.0-next.2...v1.0.0-next.3) (2020-11-23)


### Features

* api tokens ([8147c38](https://gitlab.charlie-bravo.be/meli/meli/commit/8147c386074ec37a171496a2282f2be9f83557f2))

# [1.0.0-next.2](https://gitlab.charlie-bravo.be/meli/meli/compare/v1.0.0-next.1...v1.0.0-next.2) (2020-11-20)


### Features

* a lot of things ([384e4bc](https://gitlab.charlie-bravo.be/meli/meli/commit/384e4bccae84e1003c5301740079a92b3d33fc87))

# 1.0.0-next.1 (2020-11-20)


### Features

* add channels and release ([bb866ca](https://gitlab.charlie-bravo.be/meli/meli/commit/bb866ca0babd55840424300e373ed690f1d13614))
* create and remove channel from release ([6967582](https://gitlab.charlie-bravo.be/meli/meli/commit/69675824effcced0a4a5fe3afb6d78f43a8c05ed))
* orgs and teams [wip] [ci skip] ([216591c](https://gitlab.charlie-bravo.be/meli/meli/commit/216591cedc7a1ca6c6f57df3f074b199d9879dc7))
* project tokens api ([e7c0502](https://gitlab.charlie-bravo.be/meli/meli/commit/e7c0502838350bf16462d76b982d6b0ecfa0a8b1))
* reconfigure Caddy ([f041399](https://gitlab.charlie-bravo.be/meli/meli/commit/f04139971e47ccbe61545fe5dcd6f1efa06fe85a))
* release publishing [wip] ([dd2f4b3](https://gitlab.charlie-bravo.be/meli/meli/commit/dd2f4b3cc4edadc5dc1a68319433d24b87bf3b84))
* set channel release ([e90b313](https://gitlab.charlie-bravo.be/meli/meli/commit/e90b313e0a6c1713f40fa9580a9fa63757cf1d47))
* start adding caddy [ci skip] ([e927d42](https://gitlab.charlie-bravo.be/meli/meli/commit/e927d42b5aa9953027647d344ed42347565084a5))
* use symlinks for publication ([80d1d59](https://gitlab.charlie-bravo.be/meli/meli/commit/80d1d59d17bbda4b355141f6a9840c5a3cec642c))
