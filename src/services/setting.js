const host = window.location.host;

const isLocal = host.indexOf('localhost') >= 0;

const isTestMode = host.indexOf('jieji.paat.org') >= 0;

const isNetMode = host.indexOf('jieji.paat.net') >= 0;

export const httpHost = isLocal ? '/.' : '';

export const uploadAction = 'http://fileserver.jieshui8.'+ (isLocal || isTestMode  ? 'org' : isNetMode ? 'net' :'com') +'/file/uploadimg';

export const PaatDataContractTemple = 'http://rpt.jieshui8.'+ (isLocal || isTestMode ? 'org' : 'com') +'/common/getCode/PaatDataContractTemple';

export const jiejiType = 'http://jieji.paat.'+ (isLocal || isTestMode  ? 'org' : isNetMode ? 'net' :'com') +'';

export const pictureSouce = 'http://image.jieshui8.'+ (isLocal || isTestMode  ? 'org' : isNetMode ? 'net' :'com');

export const OrderStatusList = 'http://users.paat.'+ (isLocal || isTestMode  ? 'org' : isNetMode ? 'net' :'com')+'/users/common/getCode';
