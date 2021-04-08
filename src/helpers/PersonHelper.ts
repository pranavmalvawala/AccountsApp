import { PersonHelper as BasePersonHelper } from '../appBase/helpers'
import { PersonInterface } from '.'
import { EnvironmentHelper } from './EnvironmentHelper'

export class PersonHelper extends BasePersonHelper {
    static getPhotoUrl(person: PersonInterface) {
        return person?.photo ? EnvironmentHelper.ContentRoot + person?.photo : '/images/sample-profile.png';
    }
}