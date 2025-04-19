import { AwsConfig } from '../../configs/config-type';

export const keyFromUrl = (url : string, awsConfig: AwsConfig): string => {
  const bucketUrl = `${awsConfig.endpoint}/${awsConfig.bucketName}/`;
  return url.replace(bucketUrl, '');
}