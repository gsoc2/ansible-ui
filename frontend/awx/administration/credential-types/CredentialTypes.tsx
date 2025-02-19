import { useTranslation } from 'react-i18next';
import { PageHeader, PageLayout, PageTable, usePageNavigate } from '../../../../framework';
import getDocsBaseUrl from '../../common/util/getDocsBaseUrl';
import { useAwxConfig } from '../../common/useAwxConfig';
import { useAwxView } from '../../useAwxView';
import { CredentialType } from '../../interfaces/CredentialType';
import { useCredentialTypesColumns } from './hooks/useCredentialTypesColumns';
import { useCredentialTypesFilters } from './hooks/useCredentialTypesFilters';
import {
  useCredentialTypeRowActions,
  useCredentialTypeToolbarActions,
} from './hooks/useCredentialTypeActions';
import { CubesIcon } from '@patternfly/react-icons';
import { AwxRoute } from '../../AwxRoutes';
import { useOptions } from '../../../common/crud/useOptions';
import { ActionsResponse, OptionsResponse } from '../../interfaces/OptionsResponse';
import { awxAPI } from '../../api/awx-utils';

export function CredentialTypes() {
  const { t } = useTranslation();
  const config = useAwxConfig();
  const toolbarFilters = useCredentialTypesFilters();
  const tableColumns = useCredentialTypesColumns();
  const pageNavigate = usePageNavigate();

  const view = useAwxView<CredentialType>({
    url: awxAPI`/credential_types/`,
    toolbarFilters,
    tableColumns,
  });

  const toolbarActions = useCredentialTypeToolbarActions(view);
  const rowActions = useCredentialTypeRowActions(view);

  const { data } = useOptions<OptionsResponse<ActionsResponse>>(awxAPI`/credential_types/`);
  const canCreateCredentialType = Boolean(data && data.actions && data.actions['POST']);

  return (
    <PageLayout>
      <PageHeader
        title={t('Credential Types')}
        description={t(
          'Define custom credential types to support authentication with other systems during automation.'
        )}
        titleHelpTitle={t('Credential Types')}
        titleHelp={t(
          'Define custom credential types to support authentication with other systems during automation.'
        )}
        titleDocLink={`${getDocsBaseUrl(config)}/html/userguide/credential_types.html`}
      />
      <PageTable<CredentialType>
        id="awx-credential-types"
        toolbarFilters={toolbarFilters}
        toolbarActions={toolbarActions}
        tableColumns={tableColumns}
        rowActions={rowActions}
        errorStateTitle={t('Error loading credential types')}
        emptyStateTitle={
          canCreateCredentialType
            ? t('There are currently no credential types added.')
            : t('You do not have permission to create a credential type.')
        }
        emptyStateDescription={
          canCreateCredentialType
            ? t('Please create a credential type by using the button below.')
            : t(
                'Please contact your organization administrator if there is an issue with your access.'
              )
        }
        emptyStateIcon={canCreateCredentialType ? undefined : CubesIcon}
        emptyStateButtonText={canCreateCredentialType ? t('Create credential type') : undefined}
        emptyStateButtonClick={
          canCreateCredentialType ? () => pageNavigate(AwxRoute.CreateCredentialType) : undefined
        }
        {...view}
      />
    </PageLayout>
  );
}
