import { ListUserQueryDto } from '../req/list-user-query.dto';
import { UserBaseResDto } from './user-base.res.dto';

export class ListUserResDto extends ListUserQueryDto {
  data: UserBaseResDto[];
  total: number;
}