import { EntityRepository, Repository } from "typeorm";
import {Role} from '../Enitites/role'
@EntityRepository(Role)
export class RoleRepository extends Repository<Role> {
  
}