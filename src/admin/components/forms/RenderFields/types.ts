import { FieldPermissions } from '../../../../auth/types';
import { FieldWithPath, Field } from '../../../../fields/config/types';
import { FieldTypes } from '../field-types';
import { Fields } from '../Form/types';

export type Props = {
  className?: string
  readOnly?: boolean
  forceRender?: boolean
  state?: Fields
  permissions?: {
    [field: string]: FieldPermissions
  }
  filter?: (field: Field) => boolean
  fieldSchema: FieldWithPath[]
  fieldTypes: FieldTypes
}
