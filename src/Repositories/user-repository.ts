import { EntityRepository, Repository } from "typeorm";
import {User} from "../Enitites/user";

@EntityRepository(User)
export class UserRepository extends Repository<User> {

}