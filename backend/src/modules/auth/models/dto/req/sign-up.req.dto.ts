import {PickType} from "@nestjs/swagger";
import {BaseAuthReqDto} from "./base-auth.req.dto";


export class SignUpReqDto extends PickType(BaseAuthReqDto, [
    'username',
    'email',
    'password',
    'birthdate',
]){


}
