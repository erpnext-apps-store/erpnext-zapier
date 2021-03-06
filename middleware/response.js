/*
Runs after each response is received, allowing us to make tweaks to the
response in a centralized spot.

Zapier App to automate ERPNext.
Copyright (C) 2018  Raffael Meyer

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/
'use strict';

const mustBeJson = response => {
  if (!response.json) {
    throw new Error(
      `Expected a JSON response. Got ${response.headers['Content-Type']}.`
    );
  }
  return response;
};

const mustBe200 = (response, z, bundle) => {
  if (response.status === 417) {
    z.console.log(`${response.json._server_messages}`);
  }
  if (response.status === 409) {
    z.console.log(
      `409: This document seems to exist already: 
       ${z.JSON.stringify(bundle.inputData)}`
    );
  }
  if (response.status === 404) {
    z.console.log(
      `404: The requested resource was not found: ${response.request.url}`
    );
  }
  if (response.status === 401 || response.status === 403) {
    throw new z.errors.RefreshAuthError();
  }
  if (response.status >= 300) {
    z.console.log(`${response.request.method} ${response.request.url}
      returned HTTP ${response.status}:
      Headers: ${JSON.stringify(response.request.headers, null, 2)}
      Params:  ${JSON.stringify(response.request.params, null, 2)}
      Body: ${JSON.stringify(response.request.body, null, 2)}`);

    throw new Error(
      `Response: ${
        response.json
          ? JSON.stringify(response.json, null, 2)
          : response.content
      }`
    );
  }
  return response;
};

module.exports = [mustBeJson, mustBe200];
