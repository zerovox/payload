import React, { useCallback, useEffect, useState } from 'react';
import { Modal, useModal } from '@faceless-ui/modal';
import { useConfig } from '../../../../utilities/Config';
import { useAuth } from '../../../../utilities/Auth';
import MinimalTemplate from '../../../../templates/Minimal';
import Form from '../../../Form';
import Button from '../../../../elements/Button';
import RenderFields from '../../../RenderFields';
import FormSubmit from '../../../Submit';
import Upload from '../../../../views/collections/Edit/Upload';
import ViewDescription from '../../../../elements/ViewDescription';
import { Props } from './types';
import { iterateFields } from '../../../Form/buildStateFromSchema/iterateFields';
import { useLocale } from '../../../../utilities/Locale';
import { Fields } from '../../../Form/types';

import './index.scss';

const baseClass = 'add-upload-modal';

const AddUploadModal: React.FC<Props> = (props) => {
  const {
    collection,
    collection: {
      admin: {
        description,
      } = {},
    } = {},
    slug,
    fieldTypes,
    setValue,
  } = props;

  const { user, permissions } = useAuth();
  const locale = useLocale();
  const { serverURL, routes: { api } } = useConfig();
  const { closeAll } = useModal();
  const [state, setState] = useState<Fields>({});

  const onSuccess = useCallback((json) => {
    closeAll();
    setValue(json.doc);
  }, [closeAll, setValue]);

  useCallback(() => {
    const fieldPromises = [];
    const newState = {};
    iterateFields({
      state,
      fields: collection.fields,
      path: '',
      fullData: {},
      user,
      data: {},
      id: undefined,
      operation: 'create',
      parentPassesCondition: false,
      locale,
      fieldPromises,
    });
    setTimeout(() => {
      // TODO: this way of creating a new state to pass to RenderFields is not working
      setState(newState);
    }, 100);
  }, [collection.fields, locale, setState, state, user]);

  const classes = [
    baseClass,
  ].filter(Boolean).join(' ');

  const collectionPermissions = permissions?.collections?.[collection.slug]?.fields;

  return (
    <Modal
      className={classes}
      slug={slug}
    >
      <MinimalTemplate width="wide">
        <Form
          method="post"
          action={`${serverURL}${api}/${collection.slug}`}
          onSuccess={onSuccess}
          disableSuccessStatus
          validationOperation="create"
        >
          <header className={`${baseClass}__header`}>
            <div>
              <h1>
                New
                {' '}
                {collection.labels.singular}
              </h1>
              <FormSubmit>Save</FormSubmit>
              <Button
                icon="x"
                round
                buttonStyle="icon-label"
                iconStyle="with-border"
                onClick={closeAll}
              />
            </div>
            {description && (
              <div className={`${baseClass}__sub-header`}>
                <ViewDescription description={description} />
              </div>
            )}
          </header>
          <Upload
            collection={collection}
          />
          <RenderFields
            permissions={collectionPermissions}
            readOnly={false}
            fieldTypes={fieldTypes}
            fieldSchema={collection.fields}
            state={state}
          />
        </Form>
      </MinimalTemplate>
    </Modal>
  );
};

export default AddUploadModal;
