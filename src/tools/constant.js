/*
 *  Copyright 2021 Huawei Technologies Co., Ltd.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

const PROXY_PREFIX_CURRENTSERVER = window.location.pathname.slice(0, window.location.pathname.length - 1)
const PORT_CURRENTSERVER = '30094'
const DOMAIN_CURRENTSERVER = 'atp'

const PLATFORMNAME_APPSTORE = 'APPSTORE'
const PLATFORMNAME_DEVELOPER = 'DEVELOPER'
const PLATFORMNAME_MECM = 'MECM'

const PLATFORM_LIST = [
  {
    name: PLATFORMNAME_APPSTORE,
    port: '30091',
    domain: 'appstore',
    proxyPrefix: '/edgegallery/appstore'
  },
  {
    name: PLATFORMNAME_DEVELOPER,
    port: '30092',
    domain: 'developer',
    proxyPrefix: '/edgegallery/developer'
  },
  {
    name: PLATFORMNAME_MECM,
    port: '30093',
    domain: 'mecm',
    proxyPrefix: '/edgegallery/mecm'
  }
]

export {
  PROXY_PREFIX_CURRENTSERVER,
  PORT_CURRENTSERVER,
  DOMAIN_CURRENTSERVER,
  PLATFORMNAME_APPSTORE,
  PLATFORMNAME_DEVELOPER,
  PLATFORMNAME_MECM,
  PLATFORM_LIST
}
