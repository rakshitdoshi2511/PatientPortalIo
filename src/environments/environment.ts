// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
/**DEV */
export const environment = {
  production: false,
  url: 'https://achdevemr01.ach.jo:5200/sap/opu/odata/sap/ZNPATPORTAL_SRV/',
  //url: 'http://ishmed.soltiusme.com:3000/',
  app_prefix: 'amc_dev_',
  client: 110,
  ver: '1.0.0',
  default_languag: 'en',
  appPath: '',
};
/**QAS */
/* export const environment = {
  production: false,
  url: 'https://amcqaemr01.ach.jo:5200/sap/opu/odata/sap/ZNPATPORTAL_SRV/',
  app_prefix: 'amc_qas_',
  client: 210,
  ver: '1.0.0',
  default_languag: 'en',
  appPath: '',
}; */
/**PRD */
/* export const environment = {
  production: true,
  //url: 'https://94.249.82.110:5200/sap/opu/odata/sap/ZNPATPORTAL_SRV/',
  url: 'http://patientportal.abdalihospital.com:8000/sap/opu/odata/sap/ZNPATPORTAL_SRV/',
  ver: '1.0.0',
  client: 300,
  app_prefix: 'amc_prd_',
  default_languag: 'en',
  appPath: '',
}; */
//open -n -a /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --args --user-data-dir="/tmp/chrome_dev_test" --disable-web-security
//ionic build --prod;
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
