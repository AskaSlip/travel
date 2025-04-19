import { RoleEnum } from '../../common/enums/role.enum';
import { PermissionEnum } from './enums/permission.enum';

export const RolePermissions = {
  [RoleEnum.USER] : [
    PermissionEnum.TRIP_VIEW
  ]
}